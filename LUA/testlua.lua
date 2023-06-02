--Lua Tutorial

-- Comment
--[[
  Multiline comment
]]
print("test")
-- Does not need ;

--variable
name = "LUA"

io.write("Size of string ", #name, "\n")
io.write("\b \t \\ \" \' ")

name = 4

io.write("Size of string ", name, "\n")

io.write(type(name))

logString = [[
  I am a very very log
  String
]]

name = "new string";

logString = logString .. name;

io.write(logString, "\n")

isAbleToDrive = true;

io.write(type(isAbleToDrive), "\n")
io.write(type(newvariable), "\n")

-- Math functions

io.write("5 + 3 = ", 5 + 3, "\n");
io.write("5 - 3 = ", 5 - 3, "\n");
io.write("5 * 3 = ", 5 * 3, "\n");
io.write("5 / 3 = ", 5 / 3, "\n");
io.write("5.2 % 3 = ", 5 % 3, "\n");

number = 3;
-- cant do variable++
number = number + 1
-- cant do number += 2
number = number + 2

io.write("floor(2.35)", math.floor(2.35), "\n");
io.write("ceil(2.35)", math.ceil(2.35), "\n");
io.write("min(2.35)", math.min(2, 3), "\n");
io.write("max(2.35)", math.max(2, 3), "\n");

-- otherwise
os.time()

if true and true then
  io.write("this is true")
end

if (true ~= false) then
  io.write("still true")
end

if false then
  io.write("never");
elseif true then
  io.write("win");
end

age = 13;
newvar = age == 13 and true or false;
-- equivalent to newvar = age == 13 ? true : false;
