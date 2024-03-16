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

// ---------------------------------------------------------------------- STRUCTURES
/** @typedef {{x: number, y: number}} Coords */
/** @typedef { (HTMLDivElement | null)[] } Pieces */

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

  if (auto) console.log("START AUTO");
  else console.log("END AUTO");
}

// ---------------------------------------------------------------------- GOTO
/**
 * Mueve las piezas hasta que el emptyCoords sea igual al goal.
 * Sin restricciones de piezas bloqueadas ni nada.
 * Con un delay de 150 ms
 * @param {Coords} goal Coordenadas destino
 * @returns {boolean} indicando si llegó al destino o no
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
    await stall(150); // DELAY
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
  if (!checkValidity(from) || blocked?.includes(parseIndex(to))) return null;

  /** @type {{ cor: Coords, path: string }[]} */
  const next = [{ cor: from, path: "" }];
  if (!blocked) blocked = [];
  blocked.push(parseIndex(from));

  do {
    const { cor, path } = next.shift();
    if (!cor) return null;

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

    if (!auto) {
      console.log("UNEXPECTED AUTO END");
      return null;
    }
  } while (next.length);

  return null;
}

// ---------------------------------------------------------------------- GOTOv2
/**
 * Mueve las piezas hasta que el emptyCoords sea igual al goal.
 * Teniendo restricciones de piezas bloqueadas, rodeando otras piezas
 * Con un delay de 150 ms
 * @param {Coords} goal Coordenadas destino
 * @param {number[] | undefined} blocked Puntos en la tabla a omitir, en index
 * @returns {boolean} indicando si llegó al destino o no
 */
async function gotov2(goal, blocked) {
  if (!checkValidity(goal) || !auto) {
    console.log("INVALID GOAL AND/OR IS NOT AUTO");
    return false;
  }

  const str = await stepsTo(emptyCoords, goal, blocked);
  if (!str) return false;

  const steps = str.substring(1).split(",");

  for (const step of steps) {
    movePiece(step);
    await stall(150); // DELAY
    if (!auto) {
      console.log("UNEXPECTED AUTO END");
      return false;
    }
  }

  console.log("GOAL REACHED");
  return true;
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
  await stall(500); // MEDIO SEGUNDO PARA VER EL PUZZLE COMPLETO

  for (let i = 0; i < max - 1; i++) {
    shufflePieces(i, max - 2);
    await stall(150);
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
 * @param {Coords | number} cor1 Coord1
 * @param {Coords | number} cor2 Coord2
 * @returns {"up" | "left" | "down" | "right" | null} Direccion de donde las coordenadas
 */
function proximity(cor1, cor2) {
  if (typeof cor1 === "number") cor1 = parseCoords(cor1);
  if (typeof cor2 === "number") cor2 = parseCoords(cor2);

  if (cor1.x === cor2.x) {
    if (cor1.y + 1 === cor2.y) return "up";
    if (cor1.y - 1 === cor2.y) return "down";
  } else {
    if (cor1.x + 1 === cor2.x) return "right";
    if (cor1.x - 1 === cor2.x) return "left";
  }

  return null;
}
// #endregion
