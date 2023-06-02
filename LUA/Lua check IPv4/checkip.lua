-- LuaFormatter off

-- ######################### PARSE NUMBER #########################
-- ################################################################

--- Parses any given `string` to a valid `number` and returns it.
--- If no valid number can be found, defaults to 0.
--- @param str string | number Number in `string` form
--- @param bb integer | string | nil Sets a conversion base, defaults to 10.
--- @return number # Correct number parsed or 0
local function parseNumber(str, bb)
  if type(str) == "number" then return str end
  return tonumber(str:match("%d+"), math.tointeger(bb) or 10) or 0;
end

-- ######################### PARSE BINARY #########################
-- ################################################################

--- Parses any valid `number` to a `BIN` table format, which contains a
--- `bin` with a *binary representation string* [BRS] (ex. `"0110101"`);
--- and a `num` with the original number parsed (ex. `53`)
--- @param num number|string `DEC` number to parse into its binary form
local function parseBinary(num)
  num = parseNumber(num);

  local ss = "";
  local index = 0;
  local res = num;

  -- search foward
  while ((2 ^ index) < num and index < 63) do index = index + 1; end

  -- search back
  while (index >= 0) do
    if (2 ^ index <= res) then
      res = res - (2 ^ index);
      ss = ss .. 1;
    else
      ss = ss .. 0;
    end
    index = index - 1;
  end

  return (ss:gsub("^0+", "")), num;
end

-- ######################### IS BRS #########################
-- ##########################################################

--- Checks whether or not any given `string` or `number` can be
--- interpreted as a valid `BRS`, and returns it
--- @param brs string | number Number to check
local function isBRS(brs)
  brs = tostring(brs);
  return brs:match("[01]+") == brs;
end

-- ######################### FORMAT BIN #########################
-- ##############################################################

--- Format any *binary representation string* [BRS] to a more readable type
--- `string`, divided by blocks of certain size and length.
--- @param BRS string BRS to work with
--- @param blocks number | nil whether or not to restrict the BRS to a certain
--- bits division, defaults to 0 which indicates no restriction at all.
--- @param blsize number | nil Each block size, defaults to 4 bits.
--- @return string # Correctly formated BRS (ex. `"0010-0110-1010-0110"`).
local function formatBin(BRS, blocks, blsize)
  blocks = blocks or 0;
  blsize = (blsize and blsize > 0 and blsize) or 4;

  local maxsize = (blsize * blocks) + (blocks - 1);
  local filler = "";
  repeat filler = filler .. "0"; until (#filler >= blsize);

  -- mark each block
  for i = #BRS - blsize, 0, -blsize do
    local x = string.sub(BRS, 1, i);
    x = string.sub(filler, 0, -#x - 1) .. x;
    BRS = x .. "-" .. string.sub(BRS, i + 1, #BRS);
    i = (i or 0) + 1;
  end

  -- complete until bl blocks
  while (#BRS < maxsize) do BRS = filler .. "-" .. BRS; end

  return string.sub(BRS, -maxsize);
end

-- ######################### FILL IN STRING #########################
-- ##################################################################

--- Limits an `string` to an specified block-size, giving a formated new string
--- @param str string | number Original string to format
--- @param size string | number The block size, if less than 0 is given, returns the same `string`
--- @param crop boolean | nil Whether or not to crop the `string` if it overflows, defaults to `false`
--- @param align string | number | nil Which direction to align in the contents following the next system:
--- **LEFT** (default) x < 0; **CENTER** x = 0; **RIGHT** x > 0;
--- @param char string | number | nil Character to fill in the needed spaces, defaults to `" "`
local function fillInString(str, size, crop, align, char)
  str = tostring(str);
  size = math.tointeger(size) or 0;
  char = char and tostring(char):sub(1, 1) or " ";
  if size <= 0 or char == "" then return str end
  crop = crop or false;
  align = align and parseNumber(align) or -1;

  local filler = "";
  local final = "";
  for i = 1, size do filler = filler .. char; end

  if align < 0 then -- ALIGN LEFT
    final = str .. filler:sub(1, -#str - 1);
  elseif align == 0 then -- ALIGN CENTER
    final = filler:sub(1, -#str - 1);
    final = final:sub(1, math.floor(#final / 2)) .. str .. final:sub(1, math.ceil(#final / 2));
  else -- ALIGN RIGHT
    final = filler:sub(1, -#str - 1) .. str;
  end

  if crop and #final > size then final = final:sub(1, size - 1) .. "\177"; end

  return final;
end

-- ######################### SHOW TABLE #########################
-- ##############################################################

--- Shows the contents of a table in a simple manner
--- @param tt table From which data to show
local function showTable(tt)
  for key, value in pairs(tt) do print(key, value); end
end

-- ######################### TO IPV4 #########################
-- ###########################################################

--- DEC to "123.123.123.123" format
--- @param num number | string
local function toIPv4(num)
  if type(num) == "number" then
    return table.concat({
    (num & 0xff000000) >> 0x18,
    (num & 0xff0000) >> 0x10,
    (num & 0xff00) >> 0x8,
    (num & 0xff) >> 0x0}, ".");
  end

  local a, b, c, d, m = num:match("^(%d+)%.(%d+)%.(%d+)%.(%d+)(/?%d*)$");

  if not d then
    return "INVALID IPv4"
  end

  a = (tonumber(a) or 0) << 0x18;
  b = (tonumber(b) or 0) << 0x10;
  c = (tonumber(c) or 0) << 0x8;
  d = (tonumber(d) or 0) << 0x0;
  local x = (a + b + c + d);

  if x < 0 or x > 0xffffffff then
    return "INVALID IPv4"
  end

  return x;
end

-- ######################### PARSE IPv4 #########################
-- ##############################################################

--- Checks whether or not any given `string`, `number` or `BRS` can be
--- interpreted as a valid `IPv4` object; and returns a table containing the
--- next properties: `[1]`, `[2]`, `[3]`, `[4]` to store each 8-bit block number,
--- the `str`, `num`, `bin` properties with each type of IP representation
--- and a `valid` property to check if it was created sucessfully
--- @param ipstr number | string IPv4 string (preferred), number or BRS.
--- For example, `"192.168.1.1"` its the same as parsing each block to
--- binary `"11000000 10101000 00000001 00000001"` as a BRS, which converted
--- back to `DEC` gets `3 232 235 777`.
--- @param isMask boolean | nil Whether or not to treat the IP as a subnet mask.
--- In this way, if `24` is given it will be interpreted as `"255.255.255.0"` because
--- of the short hand `x.x.x.x/24`. Any other number above `31` will be treated as `BIN`.
--- Activating this parameter also means that if an invalid subnet mask is given, it will
--- return `"INVALID IPv4"`. DEFAULT: `false`.
local function parseIPv4(ipstr, isMask)
  local num = -1;
  local rep = nil;
  isMask = isMask or false;
  local ip = {
    str = "INVALID IPv4",
    num = -1,
    bin = "",
    valid = false,
    isMask = isMask,
  }

  if #(ipstr .. "") > 2 and isBRS(ipstr) then -- ######################### BRS - "110110101011"
    ipstr = fillInString(ipstr, 32, false, 1, "0");
    num = tonumber(ipstr, 2) or num;
  elseif type(ipstr) == "number" or math.tointeger(ipstr) then -- ######################### DEC | NUM - 3232235777
    num = math.tointeger(ipstr) or num;

    if isMask and num >= 8 and num <= 31 then
      ipstr = fillInString(fillInString("1", num, false, -1, "1"), 32, false, -1, "0");
      num = tonumber(ipstr, 2);
    else
      ipstr = parseBinary(num);
    end
  else -- ######################### IP STRING - "123.123.123.123/??"
    local pattern = "^(%d+)%.(%d+)%.(%d+)%.(%d+)(/?%d*)$";
    local a, b, c, d, m = ipstr:match(pattern);

    if not d then
      ip.str = ipstr;
      return ip
    end

    rep = table.concat({a, b, c, d}, ".");
    a = (tonumber(a) or 0) << 0x18;
    b = (tonumber(b) or 0) << 0x10;
    c = (tonumber(c) or 0) << 0x8;
    d = (tonumber(d) or 0) << 0x0;
    m = tonumber(m:sub(2));

    if isMask and m then
      ipstr = fillInString(fillInString("1", m, false, -1, "1"), 32, false, -1, "0");
      num = tonumber(ipstr, 2);

      if m < 8 or m > 31 then
        ip.str = ipstr;
        return ip;
      end
    else
      ipstr, num = parseBinary(a + b + c + d);
    end
  end

  ip.bin = ipstr;
  ip.num = num;
  ip.str = not isMask and rep or toIPv4(num);
  if num >= 0 and num <= 0xffffffff and (not isMask or (not ipstr:find("01") and num < 0xffffffff)) then
    ip.valid = true;
  end;
  return ip;
end

-- ######################### IP SOLVER #########################
-- #############################################################

--- Checks all posible information from an specified IPv4. This function
--- calls `parseIPv4()` beforehand, so it admits any type of data
--- representation.
--- @param strip string | number IPv4 representation to work with
local function IPSolver(strip)
  local realIP = parseIPv4(strip);

  local ip = {
    ip = realIP,
    mask = "N/A",
    netaddress = "N/A",
    broadcast = "N/A",
    class = "INVALID",
    short = "N/A",
  };

  if not realIP.valid then return ip; end

  -- ######################### GET IP.CLASS, IP.MASK
  if realIP[1] >= 0xf0 then
    ip.class, ip.mask = "E", "N/A";
  elseif realIP[1] >= 0xe0 then
    ip.class, ip.mask = "D", "N/A";
  elseif realIP[1] >= 0xc0 then
    ip.class, ip.mask = "C", parseIPv4("255.255.255.0");
  elseif realIP[1] >= 0x80 then
    ip.class, ip.mask = "B", parseIPv4("255.255.0.0");
  else
    ip.class, ip.mask = "A", parseIPv4("255.0.0.0");
  end

  -- ######################### FILTER IPv4 CLASS D & E
  if ip.mask == "N/A" then return ip end

  -- ######################### GET NETADDRESS & BROADCAST
  ip.netaddress = parseIPv4(ip.ip.num & ip.mask.num);
  ip.broadcast = parseIPv4(ip.ip.num | (ip.mask.num ~ 0xffffffff));

  -- ######################### SHOW SHORT IPv4 FORMAT
  local _, _, mm = ip.mask.bin:find("^(1+)0+$");
  ip.short = (mm and ip.ip.str .. "/" .. #mm) or ip.ip.str .. "/?";

  return ip;
end

-- ######################### CHECK HOSTS #########################
-- ###############################################################

--- Checks the aviable number of hosts an IP can have with a given
--- subnet mask (or generates one that fulfills the requirements)
--- @param ip string | number | table IPv4 `table` type created from `IPSolver()`
--- @param mask string | table | number | nil
--- @param hosts string | number | nil
--- @param subnets string | number | nil
--- @param find table | nil
--- @param off boolean | nil
local function calculate(ip, mask, hosts, subnets, find, off)
  -- ######################### START UP
  if type(ip) == "table" then return "IP NEEDS TO BE EITHER A STRING OR NUMBER" end -- ******* ERROR *******
  if type(mask) == "table" then return "MASK NEEDS TO BE EITHER A STRING OR NUMBER" end -- ******* ERROR *******

  mask = mask and parseIPv4(mask, true) or parseIPv4(ip, true);
  ip = parseIPv4(ip); -- `ip` is now correctly "ip table"

  if not ip.valid then return string.format("INVALID IP: < %s >", ip.str) end -- ******* ERROR *******
  if not mask.valid then mask = nil end

  local defaultMask = parseIPv4(0xff000000, true);
  local class = "A";
  local status = "";
  local temp = nil;

  -- ######################### DETERMINE IP CLASS AND DEFAULT MASK
  if ip.num >= 4026531840 then
    class = "E";
    defaultMask = nil;
  elseif ip.num >= 3758096384 then
    class = "D";
    defaultMask = nil;
  elseif ip.num >= 3221225472 then
    class = "C";
    defaultMask = parseIPv4(0xffffff00, true);
  elseif ip.num >= 2147483648 then
    class = "B";
    defaultMask = parseIPv4(0xffff0000, true);
  end

  -- ######################### EXCLUDE CLASS D AND CLASS E
  if not defaultMask then return string.format("CLASS < %s > IP's NOT SUPPORTED", class) end -- ******* ERROR *******

  -- ######################### NEW MASK IS LESS THAN ORIGINAL MASK
  if mask and defaultMask.num > mask.num then
    return string.format(
      "MASK '%s' IS TOO SHORT FOR CLASS < %s > DEFAULT MASK ('%s')", mask.str, class, defaultMask.str);
  end -- ******* ERROR *******

  if subnets then -- REQUIRED SUBNETS INSERTED: FINDING MINIMUM SUBNET MASK...
    subnets = parseNumber(subnets);
    local i = 1;
    while (2 ^ i) < subnets do i = i + 1 end
    temp = parseIPv4(#(defaultMask.bin:match("1+") or "") + i, true);
    -- ######################### VERIFY IF THE GIVEN MASK CAN FULFILL THE NEEDS
    if mask then
      if mask.num == temp.num then
        status = status .. string.format("*** THE MASK '%s' SUCCESSFULLY ALLOWS %s SUBNETS ***\n", mask.str, subnets);
      else
        status = status .. string.format("*** THE MASK '%s' DOES [NOT] ALLOW %s SUBNETS ***\n", mask.str, subnets);
      end
    end
    mask = temp; -- USE THE MASK THAT DOES ALLOWS SUBNETS
  elseif hosts then  -- REQUIRED HOSTS INSERTED: FINDING MINIMUM SUBNET MASK...
    hosts = parseNumber(hosts);
    local i = 1;
    while (2 ^ i) - 2 < hosts do i = i + 1 end
    temp = parseIPv4(32 - i, true);
    -- ######################### VERIFY IF THE GIVEN MASK CAN FULFILL THE NEEDS
    if mask then
      if mask.num == temp.num then
        status = status .. string.format("*** THE MASK '%s' SUCCESSFULLY ALLOWS %s HOSTS ***\n", mask.str, hosts);
      else
        status = status .. string.format("*** THE MASK '%s' DOES [NOT] ALLOW %s HOSTS ***\n", mask.str, hosts);
      end
    end
    mask = temp; -- USE THE MASK THAT DOES ALLOWS SUBNETS
  elseif not mask then -- SUBNET MASK INSERTED: FINDING SUBNETS & HOSTS QUANTITY...
    mask = defaultMask;
  end

  -- ######################### NEW MASK IS GREATER THAN MAX MASK
  if mask and not mask.valid then
    return string.format(
      "MASK '%s' IS TOO LONG FOR CLASS < %s > DEFAULT MASK ('%s')\nCANNOT HAVE THAT MANY HOSTS (%s) OR SUBNETS (%s)",
      mask.str, class, defaultMask.str, hosts, subnets
    );
  end -- ******* ERROR *******


  local zeros_new = #(mask.bin:match("0+") or "");
  local zeros_org = #(defaultMask.bin:match("0+") or "");

  hosts = (2 ^ zeros_new) - 2;
  subnets = 2 ^ (zeros_org - zeros_new);

  -- find = type(find) == "table" and table or math.tointeger(find);
  find = find or {};

  -- ######################### START PRINTING #########################

  local a, b = fillInString("=", 20, true, 1, "="), fillInString("=", 35, true, 1, "=");
  local line = string.format("+=%s=+=%s=+=%s=+=%s=+\n", a, a, b, a);
  local function info()
    return table.concat({
      "\n#########################################################\n",
      "\nIP ADDRESS:       ", ip.str , "/", #(mask.bin:match("1+") or ""),
      "\nIP CLASS:         ", class,
      "\nDEFAULT MASK:     ", defaultMask.str,
      "\nNEW MASK:         ", mask.str,
      "\nDEFAULT MASK BIN: ", formatBin(defaultMask.bin, 4, 8),
      "\nNEW MASK BIN:     ", formatBin(mask.bin, 4, 8),
      "\nTOTAL HOSTS:      ", math.tointeger(hosts),
      "\nTOTAL SUBNETS:    ", math.tointeger(subnets),
      "\n", status, "\n",
    })
  end

  local function row(aa, bb, cc, dd)
    return string.format(
      "| %s | %s | %s | %s |\n",
      fillInString(aa, 20, true, -1),
      fillInString(bb, 20, true, -1),
      fillInString(cc, 35, true, -1),
      fillInString(dd, 20, true, -1)
    );
  end

  local file = io.open("./lua_output.txt", "a+");
  if file then
    if not off then
      file:write(
        info() ..
        line ..
        row("SUBNET ID #", "NETWORK", "ADDRESS - RANGE", "BROADCAST") ..
        line
      );
    else
      --- file:write(line);
    end

    local counter = ip.num & defaultMask.num;
    local na, a1, a2, ba, pp;

    for i = 1, subnets do
      na = parseIPv4(counter); -- 192.168.0.0
      counter = counter + 1;
      a1 = parseIPv4(counter); -- 192.168.0.1
      counter = counter + hosts - 1;
      a2 = parseIPv4(counter); -- 192.168.0.254
      counter = counter + 1;
      ba = parseIPv4(counter); -- 192.168.0.255
      counter = counter + 1;

      pp = ip.num >= na.num and ip.num <= ba.num;

      -- ESCRIBIR ALGO
      if off then
        if pp then
          file:write(table.concat({
            fillInString(ip.str.."/"..#(mask.bin:match("1+") or ""), 20),
            fillInString(i..".-", 5),
            fillInString(na.str, 16),
            fillInString(a1.str, 16),
            fillInString(a2.str, 16),
            fillInString(ba.str, 16),
            fillInString(math.tointeger(subnets).."", 9),
            math.tointeger(hosts)}, " | "));
        end
      else
        if find[i .. ""] or pp then
          file:write(row("===> " .. i .. ".-", na.str, a1.str .. " - " .. a2.str, ba.str));

          if i >= 6 and i <= (subnets - 5) then
            file:write(row("...", "...", "...", "..."));
          end
        elseif i <= 6 or i > (subnets - 5) then
          if i == 6 and i <= (subnets - 5) then
            file:write(row("...", "...", "...", "..."));
          else
            file:write(row(i .. ".-", na.str, a1.str .. " - " .. a2.str, ba.str));
          end
        end
      end
    end

    if not off then
      file:write(line .. "\n");
    else
      file:write("\n");
    end

    file:close();
  else
    print(
      info() ..
      line ..
      row("SUBNET ID #", "NETWORK", "ADDRESS - RANGE", "BROADCAST") ..
      line
    );

    local counter = ip.num & defaultMask.num;
    local na, a1, a2, ba, pp;

    for i = 1, subnets do
      na = parseIPv4(counter); -- 192.168.0.0
      counter = counter + 1;
      a1 = parseIPv4(counter); -- 192.168.0.1
      counter = counter + hosts - 1;
      a2 = parseIPv4(counter); -- 192.168.0.254
      counter = counter + 1;
      ba = parseIPv4(counter); -- 192.168.0.255
      counter = counter + 1;

      pp = ip.num >= na.num and ip.num <= ba.num;

      -- ESCRIBIR ALGO
      if find[i .. ""] or pp then
        print(row("===> " .. i .. ".-", na.str, a1.str .. " - " .. a2.str, ba.str));

        if i >= 6 and i <= (subnets - 5) then
          print(row("...", "...", "...", "..."));
        end
      elseif i <= 6 or i > (subnets - 5) then
        if i == 6 and i <= (subnets - 5) then
          print(row("...", "...", "...", "..."));
        else
          print(row(i .. ".-", na.str, a1.str .. " - " .. a2.str, ba.str));
        end
      end
    end

    print(line .. "\n");
  end

  return "";
end

-- ######################### STRUCTURE #########################
-- #############################################################

if false then
  os.exit();
end

--- ###### CLEAR OUTPUT FILE ######
io.write("SEARCHING FOR `lua_output.txt`... ");
local file, err = io.open("./lua_output.txt", "w+");
print(err or "SUCCESS");
if file then
  io.write("CLEANING `lua_output.txt`... ");
  local _, e = file:write("");
  print(e or "SUCCESS");
  file:close();
end

--- ###### READ IP FROM EXTERNAL TXT FILE ######  45
io.write("SEARCHING FOR `lua_ip_list.txt`... ");
file, err = io.open("./lua_ip_list.txt", "r");
print(err or "SUCCESS");
if file then
  io.write("READING `lua_ip_list.txt`... \n\n");
  local ln = file:read("l");
  local error = "";
  local temp = {};
  while ln do
    ln = tostring(ln);
    if ln:sub(1, 1) == "@" then
      temp = {
        _ip = nil,
        _mask = nil,
        _host = nil,
        _sub = nil,
        _off = nil,
      };
      local find = {};

      for k, v in ln:gmatch("(%w+)%s*=%s*([%w%.%/]+)") do
        if k == "find" then
          for n in v:gmatch("%d+") do find[n] = true end
        else temp["_" .. k:lower()] = v; end
      end
      error = calculate(temp._ip, temp._mask, temp._host, temp._sub, find, temp._off);
      if error ~= "" then
        local outfile, err2 = io.open("./lua_output.txt", "a+");
        if outfile then
          outfile:write(
            string.format(
              "\n#########################################################\nERROR: %s\n#########################################################\n", error));
        else
          print("\tERROR: " .. error);
        end
      end
    end
    ln = file:read("l");
  end
  file:close();
  print("DONE");
end

-- LuaFormatter on
