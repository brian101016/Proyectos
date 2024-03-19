// #region ##################################################################################### (85) SECCIÓN PRINCIPAL
// ---------------------------------------------------------------------- (70) SECCIÓN SECUNDARIA
// -------------------------------------------------- (50) SECCIÓN TERCIARIA
// ============================== (30) MINI-SECCIÓN
// #endregion

// #region ##################################################################################### VARIABLES
// ---------------------------------------------------------------------- PRIMITIVES
let playing = false;
let auto = false;
let generating = false;
/** @type {number | null} Guarda el valor del intervalo de espera del consecutive */
let consecutive_num = null;
let url = "";
let delay = 150;

// ---------------------------------------------------------------------- STRUCTURES
/** @typedef {{x: number, y: number}} Coords */
/** @typedef { (HTMLDivElement | null)[] } Pieces */
/** @typedef {"up" | "left" | "down" | "right"} Dir */

/** @type {Coords} */
const chartSize = { x: 4, y: 4 };
/** @type {Coords} */
const emptyCoords = { x: 0, y: 0 };
/** @type {Coords} */
const exterior = { x: 0, y: 0 };
/** @type { Pieces } */
const pieces = [];
/** @type {Coords[]} */
const coords = [];
/**
 * Guarda el index según la posición en el chart, de los elementos de coords y pieces.
 * También guarda la pieza que está en la posición del exterior al final del arreglo.
 * Regresa -1 en caso de que haya un lugar vacío.
 * @type { number[] }
 * @example pieces[positions[0]]; // Regresa la pieza que está en la posición 0 del chart
 * pieces[positions[pieces.length]]; // Regresa la pieza que está en el exterior
 * coords[positions[4]] === parseCoords(4);
 * pieces[positions[parseIndex({x: 0, y: 0})]]; // Buscar por coordenadas
 * positions[parseIndex(emptyCoords)] === -1; // Siempre
 */
const positions = [];
/** @type {Coords} */
const touchCoords = { x: 0, y: 0 };
/** @type {Coords[]} */
let prevlog = [];

// ---------------------------------------------------------------------- CONSTANTS
const cont = document.getElementById("chart");
const gen = document.getElementById("gen");
const inp = document.getElementById("size");
const stat = document.getElementById("status");
const photo = document.getElementById("photo");
const preview = document.getElementById("preview");
const previewStyle = document.getElementById("preview-style");
const previewBtn = document.getElementById("preview-btn");
const invert = document.getElementById("invert");
const auto_el = document.getElementById("auto");
const consecutive_el = document.getElementById("consecutive");
// #endregion

// #region ##################################################################################### OBJECT LISTENERS
// ---------------------------------------------------------------------- STATUS RELATED
gen.onclick = genStart; // START BUTTON

// ---------------------------------------------------------------------- MOVEMENT RELATED
document.onkeydown = handleKeyDown; // WATCH KEY DOWN IN ENTIRE DOCUMENT
cont.addEventListener("touchstart", handleTouchStart, false);
cont.addEventListener("touchmove", handleTouchMove, false);

// ---------------------------------------------------------------------- PREVIEW RELATED
previewStyle.onchange = handlePreviewChange;
previewBtn.onclick = handlePreviewToggle;

// ---------------------------------------------------------------------- ADITIONAL MODES
auto_el.onchange = (e) => setAuto(e.target.checked);
consecutive_el.onchange = (e) => setConsecutive(e.target.checked);
// #endregion

// #region ##################################################################################### FUNCTIONS HANDLERS
// ---------------------------------------------------------------------- PREVIEW RELATED
// -------------------------------------------------- HANDLE PREVIEW CHANGE
/**
 * Cambia la visibilidad de la imagen del preview, según el valor del select
 */
function handlePreviewChange() {
  preview.className = previewStyle.value;
  if (previewStyle.value === "hover") {
    previewBtn.classList.remove("hidden");
    preview.classList.add("hover-hide");
  } else previewBtn.classList.add("hidden");
}

// -------------------------------------------------- HANDLE PREVIEW TOGGLE
/**
 * Funcionalidad del botón preview para mostrar y ocultar la imagen cuando sea hover.
 */
function handlePreviewToggle() {
  if (previewStyle.value === "hover") preview.classList.toggle("hover-hide");
}

// ---------------------------------------------------------------------- MOVEMENT RELATED
// -------------------------------------------------- HANDLE KEY DOWN
/**
 * Escucha todos los inputs de teclado para mover las piezas según lo que pulsemos.
 * @param {*} e El evento del teclado
 */
function handleKeyDown(e) {
  let direction = "up";
  let dirx = ["left", "right"];
  let diry = ["up", "down"];

  if (invert.checked) {
    dirx = ["right", "left"];
    diry = ["down", "up"];
  }

  if (e.code === "ArrowUp" || e.code === "KeyW") direction = diry[1];
  else if (e.code === "ArrowDown" || e.code === "KeyS") direction = diry[0];
  else if (e.code === "ArrowLeft" || e.code === "KeyA") direction = dirx[1];
  else if (e.code === "ArrowRight" || e.code === "KeyD") direction = dirx[0];
  else return;

  if (auto) console.log("CANT MOVE IN AUTO");
  else movePiece(direction);
}

// -------------------------------------------------- HANDLE TOUCH START
/**
 * Para saber desde dónde comienza el swipe para saber a dónde desplazar las piezas.
 * @param {*} evt Evento de touchStart
 */
function handleTouchStart(evt) {
  evt.preventDefault();
  const firstTouch = evt.touches[0];
  touchCoords.x = firstTouch.clientX;
  touchCoords.y = firstTouch.clientY;
}

// -------------------------------------------------- HANDLE TOUCH MOVE
/**
 * Para moverse con los swipes de móvil, comparando el start con el end
 * @param {*} evt El evento touchMove
 * @deprecated
 */
function handleTouchMove(evt) {
  evt.preventDefault();
  if (touchCoords.x === null || touchCoords.y === null) return;

  const xUp = evt.touches[0].clientX;
  const yUp = evt.touches[0].clientY;

  const xDiff = touchCoords.x - xUp;
  const yDiff = touchCoords.y - yUp;

  let direction = "up";
  let dirx = ["left", "right"];
  let diry = ["up", "down"];

  if (invert.checked) {
    dirx = ["right", "left"];
    diry = ["down", "up"];
  }

  if (Math.abs(xDiff) > Math.abs(yDiff)) direction = dirx[xDiff > 0 ? 0 : 1];
  else direction = diry[yDiff > 0 ? 0 : 1];

  if (auto) console.log("CANT MOVE IN AUTO");
  else movePiece(direction);
  touchCoords.y = touchCoords.x = null;
}
// #endregion

// #region ##################################################################################### CONSECUTIVE MODE
function setConsecutive(value) {
  consecutive_el.checked = !!value;

  clearTimeout(consecutive_num);
  consecutive_num = null;

  if (playing) return;
  if (!value) return (stat.textContent = "WIN!");

  stat.textContent = "WIN! New one will start soon...";
  consecutive_num = setTimeout(genStart, 3000);
}
// #endregion

// #region ##################################################################################### AUTO MODE
// ---------------------------------------------------------------------- SET AUTO MAIN FUNCTION
/**
 * Función para activar o desactivar el automático
 * @param {boolean} activate Si lo activas o desactivas
 */
function setAuto(activate) {
  auto = auto_el.checked = activate;

  if (auto) {
    console.log("START AUTO");
    (async function () {
      let no_error = true;
      // INTENTAMOS RESOLVER HASTA QUE FUNCIONE,
      while (playing && auto) {
        no_error = await autoSolve();
        console.log("Finished, no_error? ", no_error);
      }
    })();
  } else console.log("END AUTO");
}

// ---------------------------------------------------------------------- GOTO
/**
 * Mueve las piezas hasta que el emptyCoords sea igual al goal.
 * Sin restricciones de piezas bloqueadas ni nada.
 * Con un delay de 150 ms
 * @param {Coords} goal Coordenadas destino
 * @returns {boolean} indicando si llegó al destino o no
 * @deprecated
 */
async function goto(goal) {
  if (!checkValidity(goal) || !auto) {
    console.log("INVALID GOAL AND/OR IS NOT AUTO");
    return false;
  }

  let cantMoveY = false;
  let cantMoveX = false;
  let movingOnX = goal.x !== emptyCoords.x;
  let prevCoords = { ...emptyCoords };

  while (!equalCoords(goal, emptyCoords)) {
    // MOVERSE
    if (movingOnX) {
      if (goal.x > emptyCoords.x) movePiece("left");
      else movePiece("right");
    } else {
      if (goal.y > emptyCoords.y) movePiece("up");
      else movePiece("down");
    }

    // NO SE MOVIÓ
    if (equalCoords(prevCoords, emptyCoords)) {
      if (movingOnX) cantMoveX = true;
      else cantMoveY = true;
      movingOnX = !movingOnX;

      // ESTÁ ATASCADO
      if (cantMoveX && cantMoveY) {
        console.log("STUCK MOVEMENT", cantMoveX, cantMoveY, movingOnX);
        return false;
      } else continue;
    } else {
      // SI SE MUEVE
      cantMoveX = false;
      cantMoveY = false;

      // CAMBIAR DIRECCIÓN
      if (emptyCoords.x === goal.x) movingOnX = false;
      if (emptyCoords.y === goal.y) movingOnX = true;
    }

    // CONTINUAR
    prevCoords = { ...emptyCoords };
    await stall(delay); // DELAY
    if (!auto) {
      console.log("UNEXPECTED AUTO END");
      return false;
    }
  }

  console.log("GOAL REACHED");
  return true;
}

// ---------------------------------------------------------------------- STEPS TO
/**
 * Regresa los pasos a seguir desde un punto para llegar a otro punto.
 * @param {Coords} from Punto de origen
 * @param {Coords} to Punto de destino
 * @param {number[] | undefined} blocked Puntos en la tabla a omitir, en index
 * @return {Promise<string | null>} string con los indexes para moverse.
 */
async function stepsTo(from, to, blocked) {
  if (
    !auto ||
    !checkValidity(from) ||
    !checkValidity(to) ||
    blocked?.includes(parseIndex(to))
  ) {
    console.log("INVALID GOAL AND/OR IS NOT AUTO");
    return null;
  }

  /** @type {{ cor: Coords, path: string }[]} */
  const next = [{ cor: from, path: "" }];
  blocked = blocked ? [...blocked] : [];
  blocked.push(parseIndex(from));

  do {
    const { cor, path } = next.shift();
    if (!cor) return console.log("Err!", next) || null;

    if (equalCoords(cor, to)) return path;

    const { x, y } = cor;
    const closeCoords = [
      [{ x: x + 1, y }, "right"],
      [{ x: x - 1, y }, "left"],
      [{ x, y: y + 1 }, "down"],
      [{ x, y: y - 1 }, "up"],
    ];

    for (const c of closeCoords) {
      if (checkValidity(c[0]) && !blocked.includes(parseIndex(c[0]))) {
        blocked.push(parseIndex(c[0]));
        next.push({ cor: c[0], path: path + "," + c[1] });
      }
    }

    if (!auto) return console.log("UNEXPECTED AUTO END") || null;
  } while (next.length);

  console.log("COULDNT REACH DESTINATION");
  return null;
}

// ---------------------------------------------------------------------- GOTOv2
/**
 * Mueve las piezas hasta que el emptyCoords sea igual al goal.
 * Teniendo restricciones de piezas bloqueadas, rodeando otras piezas
 * Con un delay de 150 ms
 * @param {Coords} goal Coordenadas destino
 * @param {number[] | undefined} blocked Puntos en la tabla a omitir, en index
 * @returns {Promise<boolean>} indicando si llegó al destino o no
 */
async function gotov2(goal, blocked) {
  const str = await stepsTo(emptyCoords, goal, blocked);
  if (str === "") return true;
  if (!str) return false;

  const steps = str.substring(1).split(",");

  for (const step of steps) {
    movePiece(step);
    await stall(delay); // DELAY
    if (!auto) return console.log("UNEXPECTED AUTO END") || false;
  }

  return true;
}

// ---------------------------------------------------------------------- PIECE PATH
/**
 * Muestra las coordenadas a las que moverse para mover una pieza de lugar
 * @param {Coords} from Origen
 * @param {Coords} to Destino
 * @param {number[]} blocked Piezas bloqueadas
 */
async function piecePath(from, to, blocked) {
  const str = await stepsTo(from, to, blocked);
  if (str === "") return true;
  if (!str) return false;

  blocked = blocked ? [...blocked] : [];
  const steps = str.substring(1).split(",");
  let prevCoords = from;

  console.log(
    "FROM",
    parseIndex(from),
    "TO",
    parseIndex(to),
    "WITHOUT",
    ...blocked
  );
  for (const step of steps) {
    // BUSCAMOS LA COORDENADA QUE ESTE AL LADO SEGUN EL PROXIMITY
    const cor = proximity(prevCoords, undefined, step);
    if (!cor) return console.log("Error!", prevCoords, step, cor) || false;

    // NOS MOVEMOS A ESA COORDENADA DE AL LADO SIN TOCAR LA ORIGINAL
    const res = await gotov2(cor, [...blocked, parseIndex(prevCoords)]);
    if (!res) return console.log("Error! couldnt reach dest") || false;

    // NOS MOVEMOS A LA DIRECCION OPUESTA QUE NOS RECOMENDO steps
    movePiece(invertDir(step));

    // ACTUALIZAMOS LAS COORDENADAS PARA SEGUIRLE
    prevCoords = cor;

    // REPETIMOS
    await stall(delay); // DELAY
    if (!auto) return console.log("UNEXPECTED AUTO END") || false;
  }

  console.log("...DONE!");
  return true;
}

// ---------------------------------------------------------------------- AUTO SOLVE
/**
 * Auto-completa el puzzle
 */
async function autoSolve() {
  /** @type {number[]} */
  const blocked = [];
  prevlog = structuredClone(coords);

  for (let curri = 0; findNextWrong() !== -1 && auto; curri++) {
    // GUARDAR VARIABLES RAPIDAS
    const currentCoords = parseCoords(curri);
    const penul_x = chartSize.x - 2 === currentCoords.x; // PENULTIMA EN X
    const penul_y = chartSize.y - 2 === currentCoords.y; // PENULTIMA EN Y

    // ESTAMOS EN LA RECTA FINAL
    if (penul_x && penul_y) {
      // MOVERSE HACIA LA ULTIMA COORDENADA
      const res = await gotov2(parseCoords(coords.length - 1), blocked);
      if (!res) return console.log("NO SE PUDO :(", curri, blocked) || false;

      // GIRAR HASTA QUE FUNCIONE
      while (!findNextWrong(curri) && auto) await spin("top-l", true, 4);

      movePiece("right"); // FIN DEL JUEGO
      return true; // :D
    } else if (penul_x || penul_y) {
      // SI ESTOY EN LA PENULTIMA COORD, de algun lado
      const res = await solveCorner(curri, penul_y, blocked);
      if (!res) return console.log("NO SE PUDO :(", curri, blocked) || false;
      blocked.push(res); // GUARDAMOS LA CURRI_1
    } else if (!findNextWrong(curri)) {
      // SI SOY UNA PIEZA NORMAL, PERO ESTOY MAL
      // MOVER DE curri, hacia donde deberia de estar
      const res = await piecePath(coords[curri], currentCoords, blocked);
      if (!res) return console.log("NO SE PUDO :(", curri, blocked) || false;
    }

    // SE SUPONE QUE AHORA LA CURRI ESTA BIEN PUESTA, ENTONCES LA BLOQUEAMOS
    blocked.push(curri); // NO IMPORTA SI SE REPITE LA CURRI
  }

  return true;
}

// ---------------------------------------------------------------------- SOLVE CORNER
/**
 * Resuelve el problema de las esquinas
 * @param {number} curri Index que queremos resolver
 * @param {boolean | undefined} is_x Indica si es en horizontal
 * @param {number[] | undefined} blocked Bloqueados
 * @returns {Promise<false | number>} Regresa el curri_1 para bloquearlo, o false si falla
 */
async function solveCorner(curri, is_x, blocked) {
  blocked = [...blocked] || [];

  // CREAR VARIABLES MÁS FÁCILES
  let curri_1 = curri + 1;
  let curri_a = curri + chartSize.x;
  let curri_2a = curri + chartSize.x * 2;

  if (is_x) {
    curri_1 = curri + chartSize.x;
    curri_a = curri + 1;
    curri_2a = curri + 2;
  }

  console.log("CORNER", curri, curri_1, curri_a, curri_2a);
  // SI CASUALMENTE AMBOS CURRI-S ESTAN BIEN COLOCADOS, SALIMOS
  if (findNextWrong(curri) && findNextWrong(curri_1)) return curri_1;

  /*
    ANTIGUO v1:
    1. MOVER LA ULTIMA PIEZA EN DIAGONAL
    2. MOVER LA CURRI AL LADO, SIN DIAGONAL
    3. MOVER LA ULTIMA DEBAJO DE DONDE DEBERIA, SIN ARRIBA
    4. MOVER LA CURRI AHORA SI BIEN, SIN ABAJO
    5. MOVER ABAJO

    ALGORITMO v2: 
    1. MOVER LA CURRI EN DIAGONAL
    2. MOVER LA ULTIMA EN DIAGONAL + 1, SIN RESTRINGIR
    3. MOVER LA CURRI EN DIAGONAL POR SI ACASO, SIN LA DIAGON + 1
    4. ALGORITMO CHEVERE:
      A. GOTOV2 HACIA ABAJO DE CURRI, SIN DIAGON & DIAGON +1
      B. SPIN BOTTOM RIGHT HORARIO
      C. SPIN TOP RIGHT HORARIO
      D. SPIN BOTTOM RIGHT ANTI-HORARIO
      E. SPIN TOP RIGHT HORARIO
    
    ALGORITMO v3: 100%
    1. MOVER CURRI + 1 A DIAGONAL
    2. MOVER CURRI A CURRI + 1
    3. GOTOV2 A CURRI + ABAJO
    4. MOVER CURRI + 1 A CURRI, SIN RESTRINGIR
    5. SPIN TOP R ANTI 4
     o SPIN BOT L HOR 4

    curri = curri
    curri + 1 = curri + 1
    curri + abajo = curri + chartSize.x
    diagonal = curri + (chartSize.x * 2)
  */

  // prettier-ignore
  let res = await piecePath(
        coords[curri_1], // MOVEMOS LA CURRI + 1
        parseCoords(curri_2a), // EN DIAGONAL PARA QUE NO ESTORBE
        blocked
      );
  if (!res) return console.log("NO SE PUDO :(", curri, blocked) || false;

  // prettier-ignore
  res = await piecePath(
        coords[curri], // MOVEMOS LA CURRI
        parseCoords(curri_1), // A CURRI + 1
        blocked
      );
  if (!res) return console.log("NO SE PUDO :(", curri, blocked) || false;

  // prettier-ignore
  res = await gotov2(
    parseCoords(curri_a), // GOTO HACIA ABAJO DE CURRI
    blocked
  );
  if (!res) return console.log("NO SE PUDO :(", curri, blocked) || false;

  // prettier-ignore
  res = await piecePath(
        coords[curri_1], // MOVEMOS CURRI + 1
        parseCoords(curri), // A CURRI
        blocked
      );
  if (!res) return console.log("NO SE PUDO :(", curri, blocked) || false;

  // AJUSTAR LAS PIEZAS
  if (is_x) await spin("bot-l", true, 4);
  else await spin("top-r", false, 4);

  return curri_1; // 100% DE PROBABILIDAD
}
// #endregion

// #region ##################################################################################### STATUS FUNCTIONS
// ---------------------------------------------------------------------- RESET
/**
 * Reinicia todas las variables a su valor por defecto, se usa dentro de `block`.
 */
function reset() {
  chartSize.x = parseInt(inp.value) || 4;
  chartSize.y = parseInt(inp.value) || 4;
  cont.style.width = chartSize.x * 100 + "px";
  cont.style.height = chartSize.y * 100 + "px";
  emptyCoords.x = exterior.x = chartSize.x;
  emptyCoords.y = exterior.y = chartSize.y - 1;
  playing = auto = false;
  consecutive_num = null;
  prevlog = [];
}

// ---------------------------------------------------------------------- BLOCK
/**
 * Bloquea todos los elementos para que no se puedan modificar.
 * Si los bloquea también reinicia otros parámetros.
 * @param {boolean} disabled Indica si los desactiva o los activa
 */
function block(disabled) {
  if (disabled === undefined) disabled = generating;
  gen.disabled = disabled;
  inp.disabled = disabled;
  photo.disabled = disabled;
  previewStyle.disabled = disabled;
  invert.disabled = disabled;
  auto_el.disabled = disabled;
  consecutive_el.disabled = disabled;
  previewBtn.disabled = disabled;
  stat.textContent = generating ? "Loading..." : "Playing...";
  if (disabled) return reset();
  playing = true;
  setAuto(auto_el.checked);
  setConsecutive(consecutive_el.checked);
  prevlog = structuredClone(coords);
}

// ---------------------------------------------------------------------- GEN START
/**
 *
 * @param {number} size
 */
async function genStart() {
  if (generating) return;
  block((generating = true));

  url = "";
  const xx = chartSize.x * 100;
  const yy = chartSize.y * 100;

  if (photo.files.length) {
    url = URL.createObjectURL(photo.files[0]);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } else {
    const res = await fetch(`https://picsum.photos/${xx}/${yy}`).catch(
      (e) => null
    );
    if (!res) {
      block((generating = false));
      playing = false;
      stat.textContent = "Failed to load!";
      return;
    }
    url = res.url;
  }

  preview.style.backgroundImage = `url(${url})`;
  preview.style.width = xx + "px";
  preview.style.height = yy + "px";
  preview.style.backgroundSize = `${xx}px ${yy}px`;
  cont.replaceChildren();
  const max = chartSize.x * chartSize.y;
  pieces.length = coords.length = positions.length = 0;
  pieces.length = coords.length = max;
  positions.length = max + 1;

  // ESTE CICLO ES ESTÉTICO PARA QUE SE VEAN LAS PIEZAS ANTES DE REVOLVERLAS
  for (let i = 0; i < max; i++) updatePiece(i);
  await stall(delay * 5); // PARA VER EL PUZZLE COMPLETO

  for (let i = 0; i < max - 1; i++) {
    shufflePieces(i, max - 2);
    await stall(delay);
  }

  // updatePiece(i); // ESTE NO ES NECESARIO SI SE ACTIVA EL CICLO ESTÉTICO

  positions[max - 1] = max - 1; // Agregar la última pieza bien colocada
  positions[max] = -1; // Agregar el espacio vacío exterior

  block((generating = false));
}

// ---------------------------------------------------------------------- WON
/**
 * Shortcut para indicar que ya ganamos y para comenzar otra ronda si le ponemos consecutivo.
 */
function won() {
  playing = false;
  setConsecutive(consecutive_el.checked);
}
// #endregion

// #region ##################################################################################### PIECE RELATED
// ---------------------------------------------------------------------- SHUFFLE PIECES
/**
 * @param {number} curri Current Index
 * @param {number} max Max Index Aviable (inclusive)
 * @returns {[number, number]} Two numbers who also have been shuffled
 */
function shufflePieces(curri, max) {
  let n1 = random_range(0, max);
  let n2 = random_range(0, max);

  if (n1 === curri) n1 += curri === 0 ? 1 : -1;
  while (n2 === curri || n2 === n1) n2 = boundaries(0, n2 + 1, max, true);

  const currentCoords = coords[curri] || parseCoords(curri);
  const otherCoords1 = coords[n1] || parseCoords(n1);
  const otherCoords2 = coords[n2] || parseCoords(n2);

  coords[curri] = otherCoords2;
  coords[n1] = currentCoords;
  coords[n2] = otherCoords1;

  positions[parseIndex(otherCoords2)] = curri;
  positions[parseIndex(currentCoords)] = n1;
  positions[parseIndex(otherCoords1)] = n2;

  updatePiece(curri);
  updatePiece(n1);
  updatePiece(n2);

  return [n1, n2];
}

// ---------------------------------------------------------------------- UPDATE PIECE
/**
 * Actualiza una pieza para ponerla donde debe de estar. Si no existe la genera
 * @param {number} index
 */
function updatePiece(index) {
  const piece = pieces[index] || document.createElement("div");
  const chartCoords = parseCoords(index);
  const coord = coords[index] || chartCoords;

  piece.src = url;
  piece.className = "piece";
  piece.style.top = coord.y * 100 + "px";
  piece.style.left = coord.x * 100 + "px";
  piece.style.backgroundImage = `url(${url})`;
  piece.style.backgroundPositionX = `-${chartCoords.x * 100}px`;
  piece.style.backgroundPositionY = `-${chartCoords.y * 100}px`;
  piece.style.backgroundSize = `${chartSize.x * 100}px ${chartSize.y * 100}px`;

  if (!pieces[index]) {
    pieces[index] = piece;
    coords[index] = coord;
    cont.appendChild(piece);
  }
}

// ---------------------------------------------------------------------- MOVE PIECE
/**
 * Mover una pieza con respecto al espacio vacío
 * @param {"up" | "down" | "left" | "right"} direction Dirección a la que moverse
 */
function movePiece(direction) {
  if (!playing) return console.log("CANT MOVE IN AUTO");

  const nCor = { ...emptyCoords };

  if (direction === "down") nCor.y += 1;
  else if (direction === "up") nCor.y -= 1;
  else if (direction === "left") nCor.x -= 1;
  else if (direction === "right") nCor.x += 1;
  else return;

  let check = false;
  if (!checkValidity(nCor)) return;
  if (equalCoords(nCor, exterior)) check = true;

  const magicIndex = positions[parseIndex(nCor)];
  const piece = pieces[magicIndex];
  if (!piece) return;

  // MOVER PIEZA FÍSICAMENTE
  piece.style.left = emptyCoords.x * 100 + "px";
  piece.style.top = emptyCoords.y * 100 + "px";

  // ACTUALIZAR LAS COORDS
  coords[magicIndex].x = emptyCoords.x;
  coords[magicIndex].y = emptyCoords.y;

  // ACTUALIZAR LAS POSICIONES
  positions[parseIndex(emptyCoords)] = magicIndex;
  positions[parseIndex(nCor)] = -1;

  // MOVER EL ESPACIO VACÍO
  emptyCoords.x = nCor.x;
  emptyCoords.y = nCor.y;

  if (check) findNextWrong();
}

// ---------------------------------------------------------------------- FIND NEXT WRONG
/**
 * Revisa a ver si la pieza está en su lugar, si no se indica index entonces regresa el
 * primer index que esté incorrecto, si todo está bien marca -1
 * @param {number | undefined} index Un index a verificar, o undefined para todos
 */
function findNextWrong(index) {
  if (index !== undefined) return positions[index] === index;

  const wrongPlace = positions.findIndex((v, i) => v !== i);
  if (wrongPlace === pieces.length) won();

  return wrongPlace;
}

// ---------------------------------------------------------------------- SPIN
/**
 * Mueve las piezas dependiendo del emptyCoords, girando en la direccion que indiquemos
 * @param {"top-l" | "top-r" | "bot-l" | "bot-r"} center Posicion del centro, para saber el primer paso
 * @param {boolean} clockwise Si giramos en sentido horario o no
 * @param {number} times Cuantos movimientos hacemos, si es 0 no hace nada, si es 4 da una vuelta entera
 */
async function spin(center, clockwise, times) {
  const startIndex = {
    "bot-r": 0,
    "bot-l": 1,
    "top-l": 2,
    "top-r": 3,
  };
  /** @type {Dir[]} */
  let moves = ["right", "down", "left", "up"];
  let index = startIndex[center];
  let step = clockwise ? 1 : -1;
  if (index === undefined) return false;
  if (!clockwise) {
    index += step;
    moves = ["left", "up", "right", "down"];
  }

  while (times > 0) {
    movePiece(moves[index]);
    await stall(delay);
    index = boundaries(0, index + step, 3, true);
    times--;
  }
  return true;
}
// #endregion

// #region ##################################################################################### MISC FUNCTIONS
// ---------------------------------------------------------------------- PARSE COORDS
/**
 * Genera un par de coordenadas según el índice que le pongamos.
 * @param {number} index Index from which calculate the respective coords.
 * @returns {{ x: number, y: number }} Pair of coords
 */
function parseCoords(index) {
  return { x: index % chartSize.x, y: Math.floor(index / chartSize.x) };
}

// ---------------------------------------------------------------------- PARSE INDEX
/**
 * Convierte unas coordenadas en un índice para buscar dentro del arreglo pieces.
 * @param {Coords} cor Coordenadas
 * @returns {number} regresa un número con el posible índice
 */
function parseIndex(cor) {
  return cor.y * chartSize.x + cor.x;
}

// ---------------------------------------------------------------------- CHECK VALIDITY
/**
 * Revisa si un par de coordenadas son válidas, o son el exterior
 * @param {number | Coords} iCors las coordenadas o el índice
 * @returns {boolean} dependiendo de si iCors es válido o no
 */
function checkValidity(iCors) {
  if (typeof iCors === "number") return iCors >= 0 && iCors < pieces.length;

  return (
    (0 <= iCors.y &&
      iCors.y < chartSize.y &&
      0 <= iCors.x &&
      iCors.x < chartSize.x) ||
    equalCoords(iCors, exterior)
  );
}

// ---------------------------------------------------------------------- EQUAL COORDS
/**
 * Verifica si dos coordenadas son iguales o no.
 * @param {Coords} cor1 Coord1
 * @param {Coords} cor2 Coord2
 * @returns {boolean} Si son o no iguales
 */
function equalCoords(cor1, cor2) {
  return cor1.x === cor2.x && cor1.y === cor2.y;
}

// ---------------------------------------------------------------------- PROXIMITY COORDS
/**
 * Indica si las coordenadas son adyacentes o no, si en que direccion en caso de que si.
 * Tambien busca aquella coordenada que sea adyacente si le colocamos una direccion
 * @param {Coords} cor1 Coord1
 * @param {Coords | undefined} cor2 Coord2
 * @param {Dir | undefined} dir Direccion
 * @returns {Dir | Coords | boolean} Direccion de donde las coordenadas
 */
function proximity(cor1, cor2, dir) {
  if (cor2 && dir) return proximity(cor1, cor2, undefined) === dir;

  if (cor2) {
    if (cor1.x === cor2.x) {
      if (cor1.y - 1 === cor2.y) return "up";
      if (cor1.y + 1 === cor2.y) return "down";
    } else {
      if (cor1.x - 1 === cor2.x) return "left";
      if (cor1.x + 1 === cor2.x) return "right";
    }
    return false;
  }

  const nCor = { ...cor1 };

  if (dir === "down") nCor.y += 1;
  else if (dir === "up") nCor.y -= 1;
  else if (dir === "left") nCor.x -= 1;
  else if (dir === "right") nCor.x += 1;
  else return false;

  return nCor;
}

// ---------------------------------------------------------------------- INVERT DIRECTION
/**
 * Invierte la direccion, si pone left, dice right; si pone up, dice down
 * @param {Dir} dir Direccion
 * @returns {Dir} la direccion opuesta
 */
function invertDir(dir) {
  if (dir === "up") return "down";
  if (dir === "down") return "up";
  if (dir === "left") return "right";
  return "left";
}

// ---------------------------------------------------------------------- RESTORE PREVLOG
/**
 * Restaura la partida a su forma original, según el prevlog
 * @deprecated
 */
function restorePrevlog() {
  for (let i = 0; i < prevlog.length; i++) {
    const originalCoords = prevlog[i];
    coords[i] = { ...originalCoords };
    updatePiece(i);
  }
  emptyCoords.x = exterior.x;
  emptyCoords.y = exterior.y;
}
// #endregion

/*
PARECE QUE NO FUNCIONA
[
  {
    "x": 0,
    "y": 3
  },
  {
    "x": 2,
    "y": 1
  },
  {
    "x": 2,
    "y": 0
  },
  {
    "x": 3,
    "y": 2
  },
  {
    "x": 0,
    "y": 1
  },
  {
    "x": 0,
    "y": 0
  },
  {
    "x": 1,
    "y": 3
  },
  {
    "x": 0,
    "y": 2
  },
  {
    "x": 2,
    "y": 3
  },
  {
    "x": 2,
    "y": 2
  },
  {
    "x": 1,
    "y": 2
  },
  {
    "x": 1,
    "y": 0
  },
  {
    "x": 1,
    "y": 1
  },
  {
    "x": 3,
    "y": 1
  },
  {
    "x": 3,
    "y": 0
  },
  {
    "x": 3,
    "y": 3
  }
]

 */
