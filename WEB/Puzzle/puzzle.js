let chartSize = 4;
const prevCoords = { x: 0, y: 0 };
const exterior = { x: 0, y: 0 };

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

gen.onclick = (e) => {
  reset();
  genStart();
};

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

function reset() {
  chartSize = inp.value ? parseInt(inp.value) : chartSize;
  cont.style.height = cont.style.width = chartSize * 100 + "px";
  prevCoords.x = exterior.x = chartSize * 100;
  prevCoords.y = exterior.y = (chartSize - 1) * 100;
  stat.textContent = "...";
}

/**
 *
 * @param {number} size
 */
function genStart() {
  let url = "";
  if (photo.files.length) {
    url = URL.createObjectURL(photo.files[0]);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } else url = "https://picsum.photos/id/88/1280/1707";

  preview.style.backgroundImage = `url(${url})`;
  preview.style.width = preview.style.backgroundSize = chartSize * 100 + "px";
  cont.replaceChildren();

  /** @type {{ x: number, y: number }[]} */
  const coords = [];
  for (let y = 0; y < chartSize; y++)
    for (let x = 0; x < chartSize; x++) coords.push({ x, y });

  for (let y = 0; y < chartSize; y++) {
    for (let x = 0; x < chartSize; x++) {
      const n = coords.length > 1 ? random_range(0, coords.length - 2) : 0;
      // const n = 0;
      const coord = coords.splice(n, 1)[0];
      const img = document.createElement("div");
      img.src = url;
      img.className = "piece";
      img.style.top = y * 100 + "px";
      img.style.left = x * 100 + "px";
      img.style.backgroundImage = `url(${url})`;
      img.style.backgroundPositionX = `-${coord.x * 100}px`;
      img.style.backgroundPositionY = `-${coord.y * 100}px`;
      img.style.backgroundSize = chartSize * 100 + "px";
      cont.appendChild(img);
    }
  }
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

  if (win) showWin();
}

function showWin() {
  stat.textContent = "WIN!";
}

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

const touchCoords = { x: null, y: null };

function handleTouchStart(evt) {
  const firstTouch = evt.touches[0];
  touchCoords.x = firstTouch.clientX;
  touchCoords.y = firstTouch.clientY;
}

function handleTouchMove(evt) {
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
