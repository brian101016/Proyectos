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
let consecutive_num = null;
let url = "";

// ---------------------------------------------------------------------- STRUCTURES
const chartSize = { x: 4, y: 4 };
const emptyCoords = { x: 0, y: 0 };
const exterior = { x: 0, y: 0 };
/** @type { (HTMLDivElement | null)[] } */
const pieces = [];
/** @type {{ x: number, y: number }[]} */
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

  if (e.code === "ArrowUp" || e.code === "KeyW") direction = "up";
  else if (e.code === "ArrowDown" || e.code === "KeyS") direction = "down";
  else if (e.code === "ArrowRight" || e.code === "KeyD") direction = "right";
  else if (e.code === "ArrowLeft" || e.code === "KeyA") direction = "left";
  else return;

  movePiece(direction);
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

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) direction = "right";
    else direction = "left";
  } else if (yDiff > 0) direction = "down";

  movePiece(direction);
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
 * @param {{x: number, y: number}} cor Coordenadas
 * @returns {number} regresa un número con el posible índice
 */
function parseIndex(cor) {
  return cor.y * chartSize.x + cor.x;
}

// ---------------------------------------------------------------------- CHECK VALIDITY
/**
 * Revisa si un par de coordenadas son válidas
 * @param {number} indexx la coordenada x o el índice
 * @param {number | undefined} yy la coordenada y, si no existe, entonces se considera al indexx como índice
 * @returns {boolean} dependiendo de si las coords o index son válidas o no
 */
function checkValidity(indexx, yy) {
  if (indexx < 0 || yy < 0) return false;
  if (yy === undefined) return indexx < pieces.length;
  return 0 <= yy && yy < chartSize.y && 0 <= indexx && indexx < chartSize.x;
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
  if (auto || !playing) return console.log("CANT MOVE IN AUTO");

  const value = invert.checked ? -1 : 1;
  let { x, y } = emptyCoords;

  if (direction === "up") y += value;
  else if (direction === "down") y -= value;
  else if (direction === "right") x -= value;
  else x += value;

  let check = false;
  if (checkValidity(x, y)) check = false;
  else if (y === exterior.y && x === exterior.x) check = true;
  else return;

  const magicIndex = positions[parseIndex({ x, y })];
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
  positions[parseIndex({ x, y })] = -1;

  // MOVER EL ESPACIO VACÍO
  emptyCoords.x = x;
  emptyCoords.y = y;

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
