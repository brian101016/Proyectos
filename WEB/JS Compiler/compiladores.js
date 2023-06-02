let wholeText = "";
let obj_error = null;
let obj_textarea = null;

const COM = {
  VAR: [],
  ERR: [],
  TOK: {
    void: 0,
    bool: 0,
    int: 0,
    float: 0,
    string: 0,
    array: 0,
    if: 0,
    else: 0,
    while: 0,
    do: 0,
    for: 0,
    break: 0,
    continue: 0,
    return: 0,
    class: 0,
    new: 0,
    constructor: 0,
    const: 0,
    null: 0,
    object: 0,
    struct: 0,
    queue: 0,
    foreach: 0,
    iterator: 0,
    switch: 0,
    case: 0,
    default: 0,
    goto: 0,
    import: 0,
    export: 0,
    find: 0,
    exit: 0,
  },
};

let textLines = wholeText.split(/\n/g); // Dividir el archivo en lineas de texto
let regex = /([A-Za-z_][\w]*)|([\d]+(?:\.[\d]+)?)|([^\w\s])/g; // General regex
let finalCoords = {
  ln: textLines.length,
  col: textLines[textLines.length - 1].length,
};

// int[\ \t]+([\w]+)[\ \t]*(?:=[\ \t]*([\w]+)[\ \t]*)?;

// [A-Za-z_][\w]*|[\d]+|[^\w\s]
//###############################################################################################################
//###############################################################################################################

function errorMsg() {
  if (obj_error === null) return;
  obj_error.textContent = "";

  COM.ERR.forEach((e) => {
    obj_error.textContent += e + "\n";
  });
}

//###############################################################################################################
//###############################################################################################################

function declareVariable(inputObj, variables) {
  var name = null;
  var error = "";
  var state = "WAITING";
  var closedOn = null;
  var temp = null;

  for (
    temp = getNextInput();
    temp !== null && temp.input !== ";";
    temp = closedOn || getNextInput()
  ) {
    closedOn = null;

    if (state === "WAITING") {
      if (temp.isNumber || temp.isSpecial)
        error = parseError("Se esperaba un nombre valido", temp);
      else if (COM.TOK[temp.input])
        error = parseError("Se esta utilizando una palabra reservada", temp);
      else if (
        COM.VAR.find((val) => val?.name === temp.input) ||
        variables.find((val) => val?.name === temp.input)
      )
        error = parseError("Ya existe una variable", temp);
      else state = "SEMIDONE";
      name = temp.input;
    } else if (state === "SEMIDONE") {
      if (temp.input === "=" || temp.input === ",") {
        var a =
          temp.input === "="
            ? (a = getExpression(null, ","))
            : { mem: null, end: null };

        closedOn = a.end;

        variables.push({
          name,
          value: a.mem || 0,
          type: inputObj.input,
        });

        if (a.err) error = parseError("Se esperaba un valor valido", temp);

        state = temp.input === "=" ? "DONE" : "WAITING";
      } else error = parseError("Se esperaba una asignacion de variable", temp);
    } else if (state === "DONE") {
      if (temp.input === ",") state = "WAITING";
      else error = parseError("Expresion no valida", temp);
    } else error = parseError("Unexpected error -" + state, temp);

    if (error) return { mem: variables, err: error, end: temp };
  }

  // Ya termino de declarar variables
  if (state === "WAITING") {
    parseError("Se esperaba un nombre de variable", temp);
  }

  if (state === "SEMIDONE") {
    variables.push({
      name,
      value: 0,
      type: inputObj.input,
    });
  }

  return { mem: variables, err: error, end: temp };
}

// (5 - c) + (3 * (a - 2));
/** mem?, err?, end */
function getExpression(inputObj, breakon) {
  var memory = null;
  var error = "";
  var closedOn = null;
  var temp = null;
  breakon = breakon ?? ";";

  for (
    temp = inputObj || getNextInput();
    temp !== null && ![";", ")", breakon].includes(temp.input);
    temp = closedOn || getNextInput()
  ) {
    closedOn = null;

    if (memory === null) {
      if (temp.isNumber) {
        memory = parseInt(temp.input);
      } else if (temp.input === "(") {
        var a = getExpression(null, breakon);
        memory = a?.mem ?? null;
        if (a?.end?.input !== ")") {
          error = parseError("Hace falta un ')'", a?.end);
          closedOn = a?.end;
        }
      } else if (temp.isSpecial) {
        error = parseError("Se esperaba una expresion valida", temp);
      } else {
        var a = COM.VAR.find((v) => v.name === temp.input);
        if (a) memory = a;
        else error = parseError("No existe la variable", temp);
      }
    } else if (temp.isSpecial) {
      var op = temp.input;
      var a = getNextInput();

      while (a !== null && a.isSpecial && a.input !== "(") {
        op += a.input;
        if (["++", "--"].includes(op)) break;
        a = getNextInput();
      }

      if (a === null) {
        error = parseError("Se esperaba un valor", a);
        break;
      }

      var value = 1;
      var willAssign = true;

      if (!["++", "--"].includes(op)) {
        value = getExpression(a, breakon);
        closedOn = [";", ")", breakon].includes(value?.end?.input)
          ? value.end
          : closedOn;
        value = value.mem;
        willAssign = op[op.length - 1] === "=";
      }

      var currValue = memory?.value !== undefined ? memory.value : memory;
      var newValue = value;

      if (willAssign) op = op.slice(0, op.length - 1);

      if (op === "+" || op === "++") newValue = currValue + value;
      else if (op === "-" || op === "--") newValue = currValue - value;
      else if (op === "*") newValue = currValue * value;
      else if (op === "/") newValue = value !== 0 ? currValue / value : 0;
      else if (op === "%") newValue = currValue % value;
      else if (op === "^") newValue = Math.pow(currValue, value);
      else if (op === ">") newValue = currValue > value;
      else if (op === "<") newValue = currValue < value;
      else if (op === ">=") newValue = currValue >= value;
      else if (op === "<=") newValue = currValue <= value;
      else if (op === "==") newValue = currValue === value;
      else if (op === "!=") newValue = currValue !== value;
      else if (op === "&") newValue = currValue & value;
      else if (op === "|") newValue = currValue | value;
      else if (op === "~") newValue = currValue ^ value;
      else if (op === "&&") newValue = currValue && value;
      else if (op === "||") newValue = currValue || value;
      else if (op === "~~")
        newValue = (currValue && !value) || (!currValue && value);
      else if (!willAssign) {
        error = parseError(`'${op}' no es un operador valido`, temp);
        break;
      }

      // console.log(currValue, op, value, newValue, willAssign, memory); // DEBUG

      if (willAssign) {
        if (memory?.name === undefined) {
          error = parseError("Mal uso de la asignacion del lado izquierdo", a);
          break;
        }

        COM.VAR = COM.VAR.map((v) => ({
          ...v,
          value: v.name === memory.name ? newValue : v.value,
        }));
      }

      memory = newValue;
    } else {
      break;
    }

    if (error) break;
  }

  return {
    mem: memory?.value !== undefined ? memory.value : memory,
    err: error,
    end: temp,
  };
}

//###############################################################################################################
//###############################################################################################################

function parseError(msg, obj) {
  var a = `${msg}, en '${obj?.input ?? ""}' ln ${
    obj?.ln + 1 || finalCoords.ln
  }, col ${obj?.col + 1 || finalCoords.col}`;
  COM.ERR.push(a);
  return a;
}

//###############################################################################################################
//###############################################################################################################

function getNextInput() {
  if (textLines.length === 0) return null;

  var match = regex.exec(textLines[0]);

  while (textLines.length > 0 && match === null) {
    textLines.splice(0, 1); // SE ACABO LA LINEA, PASAMOS A LA SIGUIENTE
    match = textLines[0] ? regex.exec(textLines[0]) : null; // LEEMOS LA SIGUIENTE LINEA
  }

  if (match === null) return null;

  return {
    input: match[0],
    isNumber: match[2] ? true : false,
    isSpecial: match[3] ? true : false,
    col: match.index,
    ln: finalCoords.ln - textLines.length,
  };
}

//###############################################################################################################
//###############################################################################################################

function compile() {
  // LIMPIAR EL COMPILADOR
  COM.ERR = [];
  COM.VAR = [];
  for (const token in COM.TOK) {
    COM.TOK[token] = 0;
  }

  // REINICIAR LAS VARIABLES GLOBALES
  textLines = wholeText.split(/\n/g); // Dividir el archivo en lineas de texto
  regex = /([A-Za-z_][\w]*)|([\d]+(?:\.[\d]+)?)|([^\w\s])/g; // General regex
  finalCoords = {
    ln: textLines.length,
    col: textLines[textLines.length - 1].length,
  };

  // #########################################################################
  var input = getNextInput();
  while (input !== null) {
    var a = null;

    if (input.input === "find") {
      var par = 0;
      var br = 0;
      var sq = 0;
      a = getNextInput();
      while (a !== null) {
        if (a.input === "exit") break;

        if (COM.TOK[a.input] !== undefined) COM.TOK[a.input]++;
        else if (a.input === "(") par++;
        else if (a.input === ")") par--;
        else if (a.input === "{") br++;
        else if (a.input === "}") br--;
        else if (a.input === "[") sq++;
        else if (a.input === "]") sq--;

        if (par < 0) {
          parseError(`Error, no hay parentesis abiertos`, a);
          par = 0;
        }
        if (br < 0) {
          parseError(`Error, no hay llaves abiertas`, a);
          br = 0;
        }
        if (sq < 0) {
          parseError(`Error, no hay corchetes abiertos`, a);
          sq = 0;
        }

        a = getNextInput();
      }

      console.log(a);

      for (const token in COM.TOK) {
        const element = COM.TOK[token];
        if (element > 0) parseError(`Hay ${element} tokens de: <${token}>`);
      }

      parseError("### ### ###");
      if (par > 0) parseError(`Faltan ${par} ')' de cierre`);
      if (br > 0) parseError(`Faltan ${br} '}' de cierre`);
      if (sq > 0) parseError(`Faltan ${sq} ']' de cierre`);
      parseError("### ### ###");
    } else if (input.input === "int") {
      a = declareVariable(input, COM.VAR);
      COM.VAR = a.mem;
    } else {
      a = getExpression(input);
      if (a.mem !== null || a.mem !== null) {
        parseError(
          `Valor de la expresion: <${
            a.mem.value !== undefined ? `${a.mem.name}: ${a.mem.value}` : a.mem
          }>`,
          input
        );
      }
    }

    // if (![";", "exit", "}"].includes(a?.end?.input)) {
    //   parseError(`Se esperaba un ';' al final de cada instruccion`, a?.end);
    // }

    input = getNextInput();
  }
  // #########################################################################

  COM.VAR.forEach((val) =>
    COM.ERR.push(`NAME: ${val?.name}, TYPE: ${val?.type}, VALUE: ${val?.value}`)
  );

  errorMsg();
}

//###############################################################################################################
//###############################################################################################################

document.addEventListener("DOMContentLoaded", () => {
  obj_textarea = document.querySelector("#textarea");
  obj_error = document.querySelector("#error");

  obj_error.textContent = "Compilado correctamente";

  function handleChange(e) {
    var text = e.target.value;
    if (text !== wholeText) {
      wholeText = text;
      compile();
    }
  }

  obj_textarea.onkeyup = handleChange;
  obj_textarea.onblur = handleChange;

  console.clear();

  console.log("TOKENS DISPONIBLES PARA LA FUNCION FIND: ");
  for (const token in COM.TOK) {
    console.log(token);
  }
  console.log("PARA SALIR DE LA FUNCION FIND, UTILICE EXIT");
});

/*
  int a = 3, b, c, d = 4;
  b = a + (2 * d) - 4;
  c = b - 1;
  string text = "new text for the win";
  a = c - b;
  b ++;
  d += (c - 2) - (3 * (5 + a));

int a = 3, b, c, d = 4;
  a + (2 * d) - 4;
  b - 1;
  c - b;
  b + 1;
  d + ((c - 2) - (3 * (5 + a)));
  4 + 3 * a + d / 8;


  (5*6/4-25)^2;

4*2+3;
*/
