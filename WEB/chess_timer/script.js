document.addEventListener("DOMContentLoaded", () => {
  timer.p1 = new Obj_Timer(
    document.getElementById("timerp1"),
    [minminut, 0, 0],
    endgame
  );

  timer.p2 = new Obj_Timer(
    document.getElementById("timerp2"),
    [minminut, 0, 0],
    endgame
  );
});

// OBJECTS
const maxtime = document.getElementById("maxtime");
const start = document.getElementById("start");
const toggle = document.getElementById("toggle");
const end = document.getElementById("end");
const change = document.getElementById("change");

// FUNCTIONS
function endgame() {
  // Detener contadores
  timer.p1.stop();
  timer.p2.stop();

  // Si se acaba el juego, y esta jugando el P1, es que pierde el P1
  if (isP1Playing) {
    timer.p1.display.classList.add("lose");
    timer.p2.display.classList.add("win");
  } else {
    timer.p1.display.classList.add("win");
    timer.p2.display.classList.add("lose");
  }

  ended = true;
  paused = false;
}

function startgame() {
  isP1Playing = true;
  ended = false;
  paused = false;

  // Timer
  const time = Number.parseFloat(maxtime.value) || minminut;
  const minut = Math.floor(time);
  const sec = Math.floor((time % (minut || 1)) * 60);

  // Restart timers
  timer.p1.countdown = [minut, sec, 0];
  timer.p2.countdown = [minut, sec, 0];
  timer.p1.restart();
  timer.p1.pause();
  timer.p2.restart();
  timer.p2.pause();

  // Restart displays
  timer.p1.update_display();
  timer.p2.update_display();
  timer.p1.display.classList.remove("win", "lose", "active");
  timer.p2.display.classList.remove("win", "lose", "active");

  // start
  timer.p1.start();
  timer.p1.display.classList.add("active");
}

function pausegame() {
  if (ended) return;

  if (paused) timer[isP1Playing ? "p1" : "p2"].resume();
  else {
    timer.p1.pause();
    timer.p2.pause();
  }

  paused = !paused;
}

function nextturn() {
  if (ended) return;
  if (paused) pausegame();

  isP1Playing = !isP1Playing;
  timer.p1.toggle();
  timer.p2.toggle();

  const t1 = timer.p1.say_time();
  const t2 = timer.p2.say_time();

  if (!t1[0] && t1[1] < 5 && timer.p1.is_playing) {
    timer.p1.countdown = [0, 5, 0];
    timer.p1.restart();
  }

  if (!t2[0] && t2[1] < 5 && timer.p2.is_playing) {
    timer.p2.countdown = [0, 5, 0];
    timer.p2.restart();
  }

  timer.p1.display.classList.toggle("active");
  timer.p2.display.classList.toggle("active");
}

// EVENT LISTENERS
start.onclick = startgame;
toggle.onclick = pausegame;
end.onclick = endgame;
change.onclick = nextturn;
document.onkeydown = (e) => {
  if (e.key === " ") nextturn();
  else if (e.key === "Enter") startgame();
  else if (e.key === "Shift") pausegame();
  else if (e.key === "Escape") endgame();
};

// VARS
let isP1Playing = true;
let ended = true;
let paused = false;

// CONSTS
const minsec = 5;
const minminut = 5;
const timer = {
  p1: null,
  p2: null,
};
