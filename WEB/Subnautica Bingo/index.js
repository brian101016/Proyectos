// #################################################################################################### MEMORY
let bingo_cards = []; // Almacenara las probabilidades del bingo progresivamente
let temporal = [];
let prev_temporal = [" ", " ", " ", " ", " "];

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

// #################################################################################################### RANDOM RANGE
function random_range(_min, _max) {
  let _diff = _max - _min;
  return Math.round(_min + _diff * Math.random());
}

// #################################################################################################### BOUNDARIES
function boundaries(_min, _value, _max, _wrap) {
  if (!_wrap) {
    if (_value < _min) return _min;
    if (_value > _max) return _max;
    return _value;
  }

  if (_value < _min) return _max;
  if (_value > _max) return _min;
  return _value;
}

// #################################################################################################### OBJ TIMER
class Obj_Timer {
  constructor(display, countdown, ejfunction) {
    this.starting_time = 0;
    this.diff_time = 0;
    this.stopping_time = [0, 0, 0, "00:00.000"]; // MIN, SEG, MIL, "00:00.000"

    this.is_playing = false;
    this.interval_id = null;

    this.display = display;
    this.say_time = this.say_time.bind(this);
    this.update_display = this.update_display.bind(this);

    this.countdown = countdown;
    this.ejfunction = ejfunction;
  }

  // INICIAR A CONTAR
  start() {
    if (this.is_playing) return; // Ya está corriendo, entonces salir

    this.diff_time = 0;
    this.resume();
  }

  // CONTINUAR EL TIEMPO DESDE DONDE SE QUEDÓ
  resume() {
    if (this.is_playing) return;

    this.starting_time = performance.now();
    this.is_playing = true;

    if (this.display != null)
      this.interval_id = window.setInterval(this.update_display, 10);
  }

  // DEJAR DE CONTAR
  stop() {
    if (!this.is_playing) return; // No estaba corriendo, entonces salir

    this.pause();
    this.diff_time = 0;
  }

  // PAUSAR TEMPORIZADOR
  pause() {
    if (!this.is_playing) return;

    this.stopping_time = this.say_time();
    this.diff_time = performance.now() - this.starting_time + this.diff_time;
    this.is_playing = false;

    window.clearInterval(this.interval_id);
    this.interval_id = null;
  }

  // STOP Y START
  restart() {
    this.stop();
    this.start();
  }

  // TOGGLE
  toggle() {
    if (this.is_playing) this.pause();
    else this.resume();
  }

  // IS PLAYING
  is_timer_playing() {
    return this.is_playing;
  }

  // MOSTRAR EL TIEMPO
  say_time() {
    if (!this.is_playing) return this.stopping_time; // SI YA SE DETUVO, REGRESA SU ÚLTIMO TIEMPO

    // TIEMPO DE PREGUNTA, INICIO DE CONTAR, EL TIEMPO ANTERIOR
    let _mil = Math.floor(
      performance.now() - this.starting_time + this.diff_time
    );

    // SI HAY UNA CUENTA REGRESIVA
    if (this.countdown != null) {
      _mil =
        this.countdown[0] * 60000 +
        this.countdown[1] * 1000 +
        this.countdown[2] -
        _mil;
      if (_mil <= 0) {
        this.stopping_time = [0, 0, 0, "00:00.000"];
        this.is_playing = false;
        this.diff_time = 0;

        window.clearInterval(this.interval_id);
        this.interval_id = null;

        if (this.ejfunction != null) this.ejfunction();

        return [0, 0, 0, "Time out!"];
      }
    }

    let _seg = Math.floor((_mil / 1000) % 60);
    let _min = Math.floor(_mil / 1000 / 60);
    _mil = Math.floor(_mil % 1000);

    let _time_string = "";
    _time_string += _min < 10 ? "0" + _min + ":" : _min + ":";
    _time_string += _seg < 10 ? "0" + _seg + "." : _seg + ".";
    _time_string += _mil < 100 ? "0" : "";
    _time_string += _mil < 10 ? "0" + _mil : _mil;

    return [_min, _seg, _mil, _time_string]; // MIN, SEG, MIL, "00:00.000"
  }

  // ACTUALIZAR ALGÚN DISPLAY
  update_display() {
    if (this.display === null) return;

    const time = this.say_time();
    this.display.innerText = time[3];
  }
}

// #################################################################################################### BINGO CHART DATA
const bingo = {
  subnautica: [
    // ESCANEAR ENTIDADES
    "Warper",
    "Segador leviatán",
    "Crabsquid",
    "Crabsnake",
    "Leviatán fantasma",
    "Reptador de sangre",
    "Sea treader",
    "Ameba",

    // LOCALIZACIONES
    "Respirador alienígena",
    "Portal alienígena",
    "Dos bases de la Degasi",
    "Ir al borde del cráter",
    "3 zonas calientes diferentes",
    "Encontrar 5 lifepods distintas",
    "Ir a +900",
    "3 lugares más altos",
    "Visitar 8 biomas",
    "Ir a 10 shipwrecks distintos",

    // ACCIONES / ACTIVIDADES
    "Gastar 2 baterías",
    "Reparar la Aurora",
    "Cultivar palmera helecho",
    "Integridad del casco +20",
    "Plantar hierba tigre",
    "Ver un bug",
    "Energía de +1000",
    "Saltar al agua desde alto",
    "Matar a dos carnívoros distintos",
    "Reparar una fuga de agua",
    "Inféctate y escanear alguien infectado",
    "3 macetas crecidas (no hongos)",
    "Ver un eclipse",

    // CONSTRUCCIÓN
    "Termocuchilla",
    "Cañon de propulsión",
    "Rifle de estásis",
    "Agua grande",
    "2 plastiacero",
    "2 benceno",
    "Cortador láser",
    "Reclamo de criaturas",
    "Kit de cableado avanzado",
    "Aletas ultradeslizantes",
    "Sala de escaner al máximo",
    "Observatorio",
    "Acuario alienigena",
    "2 polianilita",
    "Piscina lunar",
    "Seamoth",
    "Prawn",
    "Base del Neptune",
    "2 barras de Control",
    "Biorreactor",
    "2 fibras sintéticas",
    "Bomba de aire hasta +300m",
    "5 de aerogel",
    "Dos mejoras de vehículo",

    // RECOLECCIÓN
    "Huevo Cuddlefish",
    "Póster",
    "15 de oro",
    "Black Box",
    "5 hongos de las profundidades",
    "2/3 de Cyclops",
    "4 huevos distintos",
    "2 misceláneos",
    "Aurora de miniatura",
    "8 semillas de plantas",
    "5 dientes de acechante",
    "2 tablillas moradas",
    "6 sulfuro",
    "6 peces",
    "12 comida",
    "12 agua",
    "10+ diálogos de PDA",
    "Azufre cristalino",
  ],
  minecraft: [
    // CONSTRUCCIÓN
    "3 Maderas diferentes",
    "Cristal entintado",
    "Ladrillo de piedra cincelado",
    "Piedra musgosa",
    "Andamio",
    "Bloque de algas secas",
    "Bloque de oro",
    "3 bloques de hierro",
    "3 bloques de cobre",
    "5 esmeraldas",
    "Diamante",
    "Bloque de lapislázuli",
    "3 bloques de redstone",
    "Bloque de slime",
    "Bloque de heno",
    "Bloque de hueso",
    "2 colores de concreto",
    "Terracota vidriada",
    "Ladrillo de barro",

    // EQUIPO
    "1pza de armadura de oro",
    "2pza de armadura de hierro",
    "2pza de armadura de malla",
    "2pza de armadura de cuero",
    "Ballesta",
    "24 flechas",
    "5 peces",
    "Estofado de conejo",
    "Pay de calabaza",
    "Betabel",
    "Caña de pescar con zanahoria",
    "3 correas",
    "Reloj",
    "Mapa localizador",
    "Armadura para caballo",
    "Catalejo",
    "Pincel",

    // OBJETOS
    "2 camas de colores",
    "Linterna",
    "Horno de fusión",
    "Piedra de afilar",
    "Atril",
    "Caldero",
    "Soporte para armaduras",
    "Disco",
    "Botella de miel",
    "Maceta",
    "Campana",
    "Concha de Nautilus",
    "Piel de conejo",
    "Ojo de araña fermentado",
    "Pararrayos",
    "Libro y pluma",
    "Riel detector",
    "Riel activador",
    "Vagoneta con dinamita",
    "Repetidor de redstone",
    "Dispensador",
    "Pistón pegajoso",
    "Estandarte con diseño",
    "Fuegos artificiales con diseño",
    "Estofado sospechoso",

    // NATURALEZA
    "Tierra estéril",
    "64 bloques de hojas",
    "16 semillas",
    "Sandía",
    "Zanahoria dorada",
    "Papa venenosa",
    "Moras brillantes",
    "Bayas dulces",
    "2 flores altas",
    "3 tintes diferentes",
    "Saco de tinta brillante",
    "10 sacos de tinta",
    "Nenúfar",
    "Arbusto seco",
    "Espeleotema puntiaguda",
    "Pez tropical",
    "Huevo",
    "5 bloques de magma",
    "5 bloques de nieve",
  ],
  minecraft_facil: [
    // TINTES
    "Cohete con carga naranja",
    "Terracota vidriada rosa",
    "Concreto gris",
    "Cama celeste",
    "Estandarte con diseño magenta",
    "Tinte verde lima",
    "Tinte morado",

    // OBJETOS
    "Huevo",
    "Manzana",
    "Pez tropical",
    "Zanahoria o papa",
    "Concha de Nautilus",
    "Piel de conejo",
    "Encantamiento",
    "Saco de tinta brillante",
    "Esmeralda",
    "Bola de slime",
    "Perla de ender",

    // NATURALEZA
    "Arbusto seco",
    "Piedra musgosa",
    "Bloque de magma",
    "Bloque de algas secas",
    "Bloque de lapislázuli",
    "Bloque de heno",
    "Bloque de hueso",
    "Botella de miel",
    "Ladrillo de barro",
    "Liquen luminoso",
    "Bola de nieve",

    // CRAFTEOS SENCILLOS
    "Ojo de araña fermentado",
    "Ballesta",
    "Libro y pluma",
    "Linterna",
    "Piedra de afilar",
    "Pincel",
    "Soporte para armaduras",
    "Pieza de armadura de cuero",
    "Armadura para caballo",
    "Correa",
    "Estofado sospechoso",
    "Linterna de calabaza",
    "Cubeta con salmones",

    // CRAFTEOS DIFICILES
    "Escaleras de cobre cortado",
    "TNT",
    "Atril",
    "Dispensador",
    "Pistón",
    "Repetidor de redstone",
    "Mapa localizador",
  ],
};

// #################################################################################################### Numbers of PI
// 47101819 983817 57780
const number_chart = [
  ["1415926535", "8979323846", "2643383279", "5028841971", "6939937510"],
  ["5820974944", "5923078164", "0628620899", "8628034825", "3421170679"],
  ["8214808651", "3282306647", "0938446095", "5058223172", "5359408128"],
  ["4811174502", "8410270193", "8521105559", "6446229489", "5493038196"],
  ["4428810975", "6659334461", "2847564823", "3786783165", "2712019091"],
  ["4564856692", "3460348610", "4543266482", "1339360726", "0249141273"],
  ["7245870066", "0631558817", "4881520920", "9628292540", "9171536436"],
  ["7892590360", "0113305305", "4882046652", "1384146951", "9415116094"],
  ["3305727036", "5759591953", "0921861173", "8193261179", "3105118548"],
  ["0744623799", "6274956735", "1885752724", "8912279381", "8301194912"],
  ["9833673362", "4406566430", "8602139494", "6395224737", "1907021798"],
  ["6094370277", "0539217176", "2931767523", "8467481846", "7669405132"],
  ["0005681271", "4526356082", "7785771342", "7577896091", "7363717872"],
  ["1468440901", "2249534301", "4654958537", "1050792279", "6892589235"],
  ["4201995611", "2129021960", "8640344181", "5981362977", "4771309960"],
  ["5187072113", "4999999837", "2978049951", "0597317328", "1609631859"],
  ["5024459455", "3469083026", "4252230825", "3344685035", "2619311881"],
  ["7101000313", "7838752886", "5875332083", "8142061717", "7669147303"],
  ["5982534904", "2875546873", "1159562863", "8823537875", "9375195778"],
  ["1857780532", "1712268066", "1300192787", "6611195909", "2164201989"],
  ["3809525720", "1065485863", "2788659361", "5338182796", "8230301952"],
  ["0353018529", "6899577362", "2599413891", "2497217752", "8347913151"],
  ["5574857242", "4541506959", "5082953311", "6861727855", "8890750983"],
  ["8175463746", "4939319255", "0604009277", "0167113900", "9848824012"],
  ["8583616035", "6370766010", "4710181942", "9555961989", "4676783744"],
  ["9448255379", "7747268471", "0404753464", "6208046684", "2590694912"],
  ["9331367702", "8989152104", "7521620569", "6602405803", "8150193511"],
  ["2533824300", "3558764024", "7496473263", "9141992726", "0426992279"],
  ["6782354781", "6360093417", "2164121992", "4586315030", "2861829745"],
  ["5570674983", "8505494588", "5869269956", "9092721079", "7509302955"],
];

// #################################################################################################### START APP
document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------- DOM ELEMENTS
  const chart = document.getElementById("chart");
  const game_select = document.getElementById("game-select");
  const create_button = document.getElementById("create");
  const tactil = document.getElementById("tactil");

  // ######################### SEED
  const seed_button = document.getElementById("read-seed");
  const seed_input = document.getElementById("seed");

  // ######################### TIMER
  const timer_span = document.getElementById("timer");
  const timer_button = document.getElementById("stop-timer");
  const timer = new Obj_Timer(timer_span, null, null);

  // -------------------------------------------------- CREATE SELECT OPTIONS
  for (const key in bingo) {
    const opt = document.createElement("option");
    opt.text = key;
    game_select.appendChild(opt);
  }

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
    const styles = ["yellow", "green", "red", ""];

    // CREAR LA TABLA
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const new_button = document.createElement("button");

        // ELEGIR UNA CARTA DE BINGO
        let numindex = Math.floor(
          ((numlist.pop() / 100) * (bingo_cards.length - 1)) %
            (bingo_cards.length - 1)
        );
        new_button.textContent = bingo_cards.splice(numindex, 1)[0];
        temporal.push(new_button.textContent);

        chart.appendChild(new_button);

        new_button.onmousedown = (event) => {
          // USAR MODO TACTIL PARA ROTAR ENTRE COLORES
          if (tactil.checked) {
            new_button.className =
              styles[styles.indexOf(new_button.className) + 1] ?? "yellow";
          } else {
            const color_change = styles[event.button] || "";
            if (new_button.className === color_change)
              new_button.className = "";
            else new_button.className = color_change;
          }
        };

        new_button.oncontextmenu = (event) => event.preventDefault();
      }
    }
  }
});
