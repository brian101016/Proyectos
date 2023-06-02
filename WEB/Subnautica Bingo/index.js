let chart = [];
chart = new Array( 5 ).fill(" ").map( () => new Array( 5 ).fill(" ") );

let bingo_cards = []; // Almacenara las probabilidades del bingo progresivamente

let temporal = [];
let prev_temporal = [" ", " "," "," "," "];

// #######################################################################################################################################
// #######################################################################################################################################
document.addEventListener('DOMContentLoaded', () => { // INICIAR EL PROCESO

    const obj_chart = document.querySelector("#chart");

    const obj_new_chart = document.querySelector("#create")
    const obj_read_seed = document.querySelector("#read-seed");
    const obj_seed = document.querySelector("#seed");
    const obj_timer_container = document.querySelector("#timer");
    const obj_stop_timer = document.querySelector("#stop-timer");

    const timer = new Obj_Timer(obj_timer_container, null, null);

    // NEW CHART
    obj_new_chart.addEventListener("click", (event) => {
        event.preventDefault();

        // Crear una semilla
        let new_seed = "";
        for (let i = 0; i < 16; i++) new_seed += "" + random_range(0, 9);
        obj_seed.value = new_seed;

        console.log("Valor en obj: " + obj_seed.value);
        new_chart(obj_chart, obj_seed.value);

        timer.restart();
        obj_stop_timer.innerText = "Pausar";
    });

    // READ SEED
    obj_read_seed.addEventListener("click", (event) => {
        event.preventDefault();

        // La semilla no es válida, crear una
        if(obj_seed.value == null || obj_seed.value == "") {
            let new_seed = "";
            for (let i = 0; i < 16; i++) new_seed += "" + random_range(0, 9);
            obj_seed.value = new_seed;
        }

        console.log("Valor en obj: " + obj_seed.value);
        new_chart(obj_chart, obj_seed.value);

        timer.restart();
        obj_stop_timer.innerText = "Pausar";
    });

    // TIMER CONTAINER
    obj_timer_container.innerText = "00:00.000";

    //STOP TIMER
    obj_stop_timer.addEventListener("click", (event) => {
        event.preventDefault();
        timer.toggle();
        if(timer.is_timer_playing()) obj_stop_timer.innerText = "Pausar";
        else obj_stop_timer.innerText = "Resumir";
    });

});

// #######################################################################################################################################
// #######################################################################################################################################

function new_chart(obj_chart, seed) {

    // VARIABLES
    bingo_cards = [...bingo.subnautica]; // Construir por primera vez
    prev_temporal = [...temporal];
    temporal = [];
    
    chart = [];
    chart = new Array( 5 ).fill(" ").map( () => new Array( 5 ).fill(" ") );

    const obj_chart_childs = document.querySelectorAll("div#chart > *");
    for(let _item of obj_chart_childs) _item.remove();

    const numlist = read_seed(seed);

    // CREAR LA TABLA
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {

        const new_button = document.createElement("button");
        new_button.classList.add("chart-cell");
        new_button.classList.add("cell-color-blue");
        new_button.classList.add("no-selectable");

        if(i == 0) new_button.classList.add("border-top-on");
        if(j == 0) new_button.classList.add("border-left-on");

        // ELEGIR UNA CARTA DE BINGO
        let numindex = Math.floor((numlist.pop() / 100 * (bingo_cards.length -1)) % (bingo_cards.length-1));
        new_button.textContent = bingo_cards.splice(numindex, 1)[0];
        temporal.push(new_button.textContent);

        if(prev_temporal.length > 1 && prev_temporal.includes(temporal[temporal.length - 1])) console.log("Repetido");
        
        obj_chart.appendChild( new_button );

        new_button.onmousedown = function(event) {
            let neutral = new_button.classList.contains("cell-color-blue");
            let color_change = "cell-color-blue";

            switch (event.button) {
                case 0: color_change = "cell-color-yellow"; break;
                case 1: color_change = "cell-color-green";  break;
                case 2: color_change = "cell-color-red";    break;
            }

            // Si lleva algun color y queremos cambiar al color que ya tiene
            if(!neutral && new_button.classList.contains(color_change)) color_change = "cell-color-blue";

            new_button.classList.remove("cell-color-blue");
            new_button.classList.remove("cell-color-red");
            new_button.classList.remove("cell-color-yellow");
            new_button.classList.remove("cell-color-green");

            new_button.classList.add(color_change);
        }

        new_button.oncontextmenu = function(event) {
            event.preventDefault();
        };

        chart[i][j] = new_button;
    }
}

// #######################################################################################################################################
// #######################################################################################################################################

function read_seed(seed) {

    // La semilla no es válida, crear una
    if(seed == null || seed == "") {
        seed = "";
        for (let i = 0; i < 16; i++) seed += "" + random_range(0, 9);
    }

    seed = seed.toString();

    let seed_total_sum = 0;
    for (let i = 0; i < seed.length; i++) seed_total_sum += seed.charCodeAt(i);

    // BUSCAR FILA Y COLUMNA DE LOS NUMEROS DE PI
    let sequence = seed.charCodeAt( boundaries(0, 0, seed.length - 1, false)) * 10; // 18 - 27 para numeros
    sequence += seed.charCodeAt( boundaries(0, 1, seed.length - 1, false));
    sequence = (sequence % seed_total_sum) % 30; // Fila
    let section  = seed.charCodeAt( boundaries(0, seed_total_sum % seed.length, seed.length - 1, false)) %  5; // Columna
    let number   = seed.charCodeAt( boundaries(0, seed_total_sum % seed_total_sum.toString().charCodeAt(seed_total_sum.toString().length), seed.length - 1, false)) % 10; // Position

    // console.log("Secuencia, seccion y numero: " + sequence, section, number);

    let numlist = [];
    let aux = 0;

    while(numlist.length < 25) {

        const num_from_pi = Number.parseInt(number_chart[sequence][section][number]); // 0 - 9
        const num_from_seed = ( seed.charCodeAt((seed.length-1) - (aux % seed.length)) % 10 ); // 0 - 9 / [0 - 15]

        aux++;
        number++;
        if(number > 9) {
            number = 0;
            section++;
        }
        if(section > 4) {
            section = 0;
            sequence++;
        }
        if(sequence > 29) sequence = 0;

        let some_number = (num_from_pi * 100) + (num_from_seed * 10) + ((number + section + sequence) % 10);
        some_number = (some_number / 1000) * (bingo_cards.length - aux);
        some_number = Math.round(some_number);

        numlist.push( num_from_pi*10 + num_from_seed );
    }

    return numlist;
}