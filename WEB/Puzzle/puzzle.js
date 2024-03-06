let playing = false;
let auto = false;
let generating = false;
let consecutive_num = null;
let chartSize = 4;
let url = "";
const prevCoords = { x: 0, y: 0 };
const exterior = { x: 0, y: 0 };
/** @type { (HTMLDivElement | null)[] } */
const pieces = [];
/** @type {{ x: number, y: number }[]} */
const coords = [];

document.onkeydown = handleKeyDown;
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

gen.onclick = genStart;

previewStyle.onchange = () => {
  preview.className = previewStyle.value;
  if (previewStyle.value === "hover") {
    previewBtn.classList.remove("hidden");
    preview.classList.add("hover-hide");
  } else previewBtn.classList.add("hidden");
};

previewBtn.onclick = () => {
  if (previewStyle.value === "hover") preview.classList.toggle("hover-hide");
};

consecutive_el.onchange = (e) => setConsecutive(e.target.checked);

function setConsecutive(value) {
  consecutive_el.checked = !!value;

  clearTimeout(consecutive_num);
  consecutive_num = null;

  if (playing) return;
  if (!value) return (stat.textContent = "WIN!");

  stat.textContent = "WIN! New one will start soon...";
  consecutive_num = setTimeout(genStart, 3000);
}

auto_el.onchange = (e) => setAuto(e.target.checked);

function setAuto(value) {
  auto = auto_el.checked = value;

  if (auto) console.log("START AUTO");
  else console.log("END AUTO");
}

function reset() {
  chartSize = inp.value ? parseInt(inp.value) : chartSize;
  cont.style.height = cont.style.width = chartSize * 100 + "px";
  prevCoords.x = exterior.x = chartSize * 100;
  prevCoords.y = exterior.y = (chartSize - 1) * 100;
  playing = auto = false;
  consecutive_num = null;
}

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

/**
 *
 * @param {number} size
 */
async function genStart() {
  if (generating) return;
  block((generating = true));
  url = "";
  if (photo.files.length) {
    url = URL.createObjectURL(photo.files[0]);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } else {
    const res = await fetch("https://picsum.photos/" + chartSize * 100);
    url = res.url;
  }

  preview.style.backgroundImage = `url(${url})`;
  preview.style.width = preview.style.backgroundSize = chartSize * 100 + "px";
  cont.replaceChildren();
  pieces.length = coords.length = 0;
  pieces.length = coords.length = chartSize * chartSize;

  // ESTE CICLO ES ESTÉTICO PARA QUE SE VEAN LAS PIEZAS ANTES DE REVOLVERLAS
  for (let i = 0; i < coords.length; i++) updatePiece(i);
  await stall(500); // MEDIO SEGUNDO PARA VER EL PUZZLE COMPLETO

  for (let i = 0; i < coords.length - 1; i++) {
    shufflePieces(i, coords.length - 2);
    await stall(150);
  }

  // updatePiece(i); // ESTE NO ES NECESARIO SI SE ACTIVA EL CICLO ESTÉTICO

  block((generating = false));
}

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

  updatePiece(curri);
  updatePiece(n1);
  updatePiece(n2);

  return [n1, n2];
}

/**
 * @param {number} index
 */
function updatePiece(index) {
  const piece = pieces[index] || document.createElement("div");
  const actualCoords = parseCoords(index);
  const coord = coords[index] || actualCoords;

  piece.src = url;
  piece.className = "piece";
  piece.style.top = coord.y * 100 + "px";
  piece.style.left = coord.x * 100 + "px";
  piece.style.backgroundImage = `url(${url})`;
  piece.style.backgroundPositionX = `-${actualCoords.x * 100}px`;
  piece.style.backgroundPositionY = `-${actualCoords.y * 100}px`;
  piece.style.backgroundSize = chartSize * 100 + "px";

  if (!pieces[index]) {
    pieces[index] = piece;
    coords[index] = coord;
    cont.appendChild(piece);
  }
}

/**
 * @param {number} index Index from which calculate the respective coords.
 * @returns {{ x: number, y: number }} Pair of coords
 */
function parseCoords(index) {
  return { x: index % chartSize, y: Math.floor(index / chartSize) };
}

/**
 * Swaps to indexes inside an array
 * @param {any[]} arr Array to mutate
 * @param {number} index1 First index to swap
 * @param {number} index2 Second index to swap
 */
function swap(arr, index1, index2) {
  if (index1 === index2) index2 += index2 === 0 ? 1 : -1;
  const aux = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = aux;
}

function handleKeyDown(e) {
  const value = invert.checked ? -100 : 100;
  let ntt = prevCoords.y;
  let nll = prevCoords.x;
  if (e.code === "ArrowUp" || e.code === "KeyW") ntt += value;
  else if (e.code === "ArrowDown" || e.code === "KeyS") ntt -= value;
  else if (e.code === "ArrowRight" || e.code === "KeyD") nll -= value;
  else if (e.code === "ArrowLeft" || e.code === "KeyA") nll += value;
  else return;

  movePiece(ntt, nll);
}

function movePiece(ntt, nll) {
  if (auto || !playing) return console.log("CANT MOVE IN AUTO");

  let check = false;
  if (0 <= ntt && ntt < chartSize * 100 && 0 <= nll && nll < chartSize * 100) {
  } else if (ntt === exterior.y && nll === exterior.x) check = true;
  else return;
  let win = check;

  const els = document.querySelectorAll(".piece");
  for (const el of els) {
    let tt = parseInt(el.style.top);
    let ll = parseInt(el.style.left);

    if (tt === ntt && ll === nll) {
      el.style.left = prevCoords.x + "px";
      el.style.top = prevCoords.y + "px";
      prevCoords.x = ll;
      prevCoords.y = tt;

      if (!check) break;
    }

    win =
      win &&
      parseInt(el.style.top) + parseInt(el.style.backgroundPositionY) === 0 &&
      parseInt(el.style.left) + parseInt(el.style.backgroundPositionX) === 0;
  }

  if (win) won();
}

function won() {
  playing = false;
  setConsecutive(consecutive_el.checked);
}

cont.addEventListener("touchstart", handleTouchStart, false);
cont.addEventListener("touchmove", handleTouchMove, false);

const touchCoords = { x: null, y: null };

function handleTouchStart(evt) {
  evt.preventDefault();
  const firstTouch = evt.touches[0];
  touchCoords.x = firstTouch.clientX;
  touchCoords.y = firstTouch.clientY;
}

function handleTouchMove(evt) {
  evt.preventDefault();
  if (touchCoords.x === null || touchCoords.y === null) return;

  const xUp = evt.touches[0].clientX;
  const yUp = evt.touches[0].clientY;

  const xDiff = touchCoords.x - xUp;
  const yDiff = touchCoords.y - yUp;

  const value = invert.checked ? 100 : -100;
  let ntt = prevCoords.y;
  let nll = prevCoords.x;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) nll -= value;
    else nll += value;
  } else {
    if (yDiff > 0) ntt -= value;
    else ntt += value;
  }

  movePiece(ntt, nll);
  touchCoords.y = touchCoords.x = null;
}

// ########################################################################### AUTO FUNCTIONS
function findNextWrong() {
  console.log("Finding...");

  const els = document.querySelectorAll(".piece");
  let index = 0;
  for (const el of els) {
    const im_in = {
      x: parseInt(el.style.left),
      y: parseInt(el.style.top),
    };
    const need_to_be = {
      x: parseInt(el.style.backgroundPositionX),
      y: parseInt(el.style.backgroundPositionY),
    };

    index++;

    console.log(index + ".- ", im_in, need_to_be);
    if (im_in.x + need_to_be.x !== 0) {
      console.log("   Wrong X coord");
    } else if (im_in.y + need_to_be.y !== 0) console.log("   Wrong Y coord");
  }

  console.log("Found: ");
}
