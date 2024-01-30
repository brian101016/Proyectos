let chartSize = 5;
const prevCoords = { x: 0, y: 0 };
const exterior = { x: 0, y: 0 };

document.onkeydown = handleKeyDown;
const cont = document.getElementById("container");
const gen = document.getElementById("gen");
const inp = document.getElementById("size");
const stat = document.getElementById("status");
gen.onclick = (e) => {
  reset();
  genStart();
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
  const url = "https://picsum.photos/id/36/" + chartSize * 100;
  cont.replaceChildren();

  /** @type {{ x: number, y: number }[]} */
  const coords = [];
  for (let y = 0; y < chartSize; y++)
    for (let x = 0; x < chartSize; x++) coords.push({ x, y });

  for (let y = 0; y < chartSize; y++) {
    for (let x = 0; x < chartSize; x++) {
      const n = coords.length > 1 ? random_range(0, coords.length - 2) : 0;
      const coord = coords.splice(n, 1)[0];
      const img = document.createElement("div");
      img.src = url;
      img.className = "piece";
      img.style.top = y * 100 + "px";
      img.style.left = x * 100 + "px";
      img.style.backgroundImage = `url(${url})`;
      img.style.backgroundPositionX = `-${coord.x * 100}px`;
      img.style.backgroundPositionY = `-${coord.y * 100}px`;
      cont.appendChild(img);
    }
  }
}

function handleKeyDown(e) {
  let ntt = prevCoords.y;
  let nll = prevCoords.x;
  if (e.code === "ArrowUp" || e.code === "KeyW") ntt += 100;
  else if (e.code === "ArrowDown" || e.code === "KeyS") ntt -= 100;
  else if (e.code === "ArrowRight" || e.code === "KeyD") nll -= 100;
  else if (e.code === "ArrowLeft" || e.code === "KeyA") nll += 100;
  else return;

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
