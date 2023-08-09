import { Obj_Timer, random_range, boundaries } from "../Wold Global/scripts";
import { bingo } from "./bingo";

// #################################################################################################### MEMORY
let bingo_cards = []; // Almacenara las probabilidades del bingo progresivamente
let temporal = [];
let prev_temporal = [" ", " ", " ", " ", " "];

// #################################################################################################### START APP
document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------- DOM ELEMENTS
  const chart = document.getElementById("#chart");
  const game_select = document.getElementById("#game-select");
  const create_button = document.getElementById("#create");

  // ######################### SEED
  const seed_button = document.getElementById("#read-seed");
  const seed_input = document.getElementById("#seed");

  // ######################### TIMER
  const timer_span = document.getElementById("#timer");
  const timer_button = document.getElementById("#stop-timer");
  const timer = new Obj_Timer(timer_span, null, null);

  // -------------------------------------------------- CLICK NEW CHART
  function handleClick(read = false) {
    if (!read || !seed_input.value) {
      seed_input.value = "";
      for (let i = 0; i < 16; i++) seed_input.value += random_range(0, 9);
    }

    new_chart();

    timer.restart();
    timer_button.innerText = "Pausar";
  }

  create_button.onclick = () => handleClick(false);
  seed_button.onclick = () => handleClick(true);

  // -------------------------------------------------- TIMER BUTTON
  timer_button.onclick = () => {
    timer.toggle();
    timer_button.innerText = timer.is_timer_playing() ? "Pausar" : "Resumir";
  };

  // #################################################################################################### NEW CHART
  function new_chart() {
    const type = game_select.value || "subnautica";

    bingo_cards = [...bingo[type]];
    prev_temporal = [...temporal];
    temporal = [];

    chart.replaceChildren();
    const numlist = read_seed(seed_input.value);

    // CREAR LA TABLA
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 5; j++) {
        const new_button = document.createElement("button");
        new_button.classList.add("chart-cell");
        new_button.classList.add("cell-color-blue");

        // ELEGIR UNA CARTA DE BINGO
        let numindex = Math.floor(
          ((numlist.pop() / 100) * (bingo_cards.length - 1)) %
            (bingo_cards.length - 1)
        );
        new_button.textContent = bingo_cards.splice(numindex, 1)[0];
        temporal.push(new_button.textContent);

        if (
          prev_temporal.length > 1 &&
          prev_temporal.includes(temporal[temporal.length - 1])
        ) {
          console.log("Repetido");
        }

        chart.appendChild(new_button);

        new_button.onmousedown = (event) => {
          let color_change = "cell-color-blue";

          switch (event.button) {
            case 0:
              color_change = "cell-color-yellow";
              break;
            case 1:
              color_change = "cell-color-green";
              break;
            case 2:
              color_change = "cell-color-red";
              break;
          }

          // Si lleva algun color y queremos cambiar al color que ya tiene
          if (
            !new_button.classList.contains("cell-color-blue") &&
            new_button.classList.contains(color_change)
          ) {
            color_change = "cell-color-blue";
          }

          new_button.classList.remove("cell-color-blue");
          new_button.classList.remove("cell-color-red");
          new_button.classList.remove("cell-color-yellow");
          new_button.classList.remove("cell-color-green");

          new_button.classList.add(color_change);
        };

        new_button.oncontextmenu = (event) => event.preventDefault();
      }
  }
});

// #################################################################################################### READ SEED
function read_seed(seed) {
  // La semilla no es válida, crear una
  if (!seed) {
    seed = "";
    for (let i = 0; i < 16; i++) seed += "" + random_range(0, 9);
  }

  seed = seed.toString();

  let seed_total_sum = 0;
  for (let i = 0; i < seed.length; i++) seed_total_sum += seed.charCodeAt(i);

  // BUSCAR FILA Y COLUMNA DE LOS NUMEROS DE PI
  let sequence = seed.charCodeAt(boundaries(0, 0, seed.length - 1, false)) * 10; // 18 - 27 para numeros
  sequence += seed.charCodeAt(boundaries(0, 1, seed.length - 1, false));
  sequence = (sequence % seed_total_sum) % 30; // Fila
  let section =
    seed.charCodeAt(
      boundaries(0, seed_total_sum % seed.length, seed.length - 1, false)
    ) % 5; // Columna
  let number =
    seed.charCodeAt(
      boundaries(
        0,
        seed_total_sum %
          seed_total_sum
            .toString()
            .charCodeAt(seed_total_sum.toString().length),
        seed.length - 1,
        false
      )
    ) % 10; // Position

  // console.log("Secuencia, seccion y numero: " + sequence, section, number);

  let numlist = [];
  let aux = 0;

  while (numlist.length < 25) {
    const num_from_pi = Number.parseInt(
      number_chart[sequence][section][number]
    ); // 0 - 9
    const num_from_seed =
      seed.charCodeAt(seed.length - 1 - (aux % seed.length)) % 10; // 0 - 9 / [0 - 15]

    aux++;
    number++;
    if (number > 9) {
      number = 0;
      section++;
    }
    if (section > 4) {
      section = 0;
      sequence++;
    }
    if (sequence > 29) sequence = 0;

    let some_number =
      num_from_pi * 100 +
      num_from_seed * 10 +
      ((number + section + sequence) % 10);
    some_number = (some_number / 1000) * (bingo_cards.length - aux);
    some_number = Math.round(some_number);

    numlist.push(num_from_pi * 10 + num_from_seed);
  }

  return numlist;
}
