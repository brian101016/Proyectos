// ---------------------------------------------------------------------------------------------------- DB
const db = {
  Acero: {
    efectivo: ["Hielo", "Roca", "Hada"],
    no_efectivo: ["Agua", "Eléctrico", "Fuego", "Acero"],
    inmune: ["Veneno"],
  },
  Volador: {
    efectivo: ["Planta", "Bicho", "Lucha"],
    no_efectivo: ["Eléctrico", "Roca", "Acero"],
    inmune: ["Tierra"],
  },
  Agua: {
    efectivo: ["Roca", "Tierra", "Fuego"],
    no_efectivo: ["Agua", "Planta", "Dragón"],
    inmune: [],
  },
  Hielo: {
    efectivo: ["Volador", "Planta", "Tierra", "Dragón"],
    no_efectivo: ["Hielo", "Fuego", "Agua", "Acero"],
    inmune: [],
  },
  Planta: {
    efectivo: ["Agua", "Roca", "Tierra"],
    no_efectivo: [
      "Volador",
      "Planta",
      "Bicho",
      "Fuego",
      "Veneno",
      "Dragón",
      "Acero",
    ],
    inmune: [],
  },
  Bicho: {
    efectivo: ["Planta", "Psíquico", "Siniestro"],
    no_efectivo: [
      "Volador",
      "Fuego",
      "Lucha",
      "Hada",
      "Veneno",
      "Fantasma",
      "Acero",
    ],
    inmune: [],
  },
  Eléctrico: {
    efectivo: ["Volador", "Agua"],
    no_efectivo: ["Planta", "Eléctrico", "Dragón"],
    inmune: [],
  },
  Normal: {
    efectivo: [],
    no_efectivo: ["Roca", "Acero"],
    inmune: ["Fantasma"],
  },
  Roca: {
    efectivo: ["Hielo", "Volador", "Bicho", "Fuego"],
    no_efectivo: ["Tierra", "Lucha", "Acero"],
    inmune: [],
  },
  Tierra: {
    efectivo: ["Eléctrico", "Roca", "Fuego", "Veneno", "Acero"],
    no_efectivo: ["Planta", "Bicho"],
    inmune: ["Eléctrico"],
  },
  Fuego: {
    efectivo: ["Hielo", "Planta", "Bicho", "Acero"],
    no_efectivo: ["Agua", "Roca", "Fuego", "Dragón"],
    inmune: [],
  },
  Lucha: {
    efectivo: ["Hielo", "Normal", "Roca", "Siniestro", "Acero"],
    no_efectivo: ["Volador", "Bicho", "Hada", "Psíquico", "Veneno"],
    inmune: [],
  },
  Hada: {
    efectivo: ["Lucha", "Dragón", "Siniestro"],
    no_efectivo: ["Fuego", "Veneno", "Acero"],
    inmune: ["Dragón"],
  },
  Psíquico: {
    efectivo: ["Lucha", "Veneno"],
    no_efectivo: ["Acero", "Psíquico"],
    inmune: [],
  },
  Veneno: {
    efectivo: ["Planta", "Hada"],
    no_efectivo: ["Roca", "Tierra", "Veneno", "Fantasma"],
    inmune: [],
  },
  Dragón: {
    efectivo: ["Dragón"],
    no_efectivo: ["Acero"],
    inmune: [],
  },
  Fantasma: {
    efectivo: ["Psíquico", "Fantasma"],
    no_efectivo: ["Siniestro"],
    inmune: ["Normal", "Lucha"],
  },
  Siniestro: {
    efectivo: ["Psíquico", "Fantasma"],
    no_efectivo: ["Lucha", "Hada", "Siniestro"],
    inmune: ["Psíquico"],
  },
};

// ---------------------------------------------------------------------------------------------------- START APP
document.addEventListener("DOMContentLoaded", () => {
  // ################################################## VARIABLES
  const sel = document.getElementById("tipos");
  const these_beat_me = document.getElementById("these-beat-me");
  const i_beat_these = document.getElementById("i-beat-these");
  const these_endure_me = document.getElementById("these-endure-me");
  const i_endure_these = document.getElementById("i-endure-these");

  /**
   * @type CanvasRenderingContext2D
   */
  const ctx = document.getElementById("canvas")?.getContext?.("2d");

  these_beat_me.replaceChildren();
  i_beat_these.replaceChildren();
  these_endure_me.replaceChildren();
  i_endure_these.replaceChildren();
  sel.replaceChildren();

  // ################################################## DRAW FUNCTION
  function draw() {
    ctx.reset();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#8c8c8c";

    const arr = document.querySelectorAll("button");
    arr.forEach((el) => {
      let cx = sel.offsetLeft + sel.offsetWidth / 2;
      let cy = sel.offsetTop + sel.offsetHeight / 2;
      let rx = el.offsetLeft + el.offsetWidth / 2;
      let ry = el.offsetTop + el.offsetHeight / 2;

      if (rx > cx) {
        cx += sel.offsetWidth / 2;
        rx -= el.offsetWidth / 2;
      } else {
        cx -= sel.offsetWidth / 2;
        rx += el.offsetWidth / 2;
      }

      if (ry > cy) cy += sel.offsetHeight / 4;
      else cy -= sel.offsetHeight / 4;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(rx, ry);
      ctx.stroke();
    });
  }

  // ################################################## CREATE ITEM
  function createItem(value = "Fuego", inmune = false) {
    const it = document.createElement("p");
    const btn = document.createElement("button");
    btn.textContent = value;
    btn.className = inmune ? value + " inmune" : value;
    btn.onclick = () => {
      sel.value = value;
      sel.onchange();
    };
    it.appendChild(btn);

    return it;
  }

  // ################################################## START SELECT OPTIONS
  for (const type in db) {
    const op = document.createElement("option");
    op.value = type;
    op.text = type;
    op.className = type;
    sel.appendChild(op);
  }

  // ################################################## SELECT ON-CHANGE
  sel.onchange = () => {
    these_beat_me.replaceChildren();
    i_beat_these.replaceChildren();
    these_endure_me.replaceChildren();
    i_endure_these.replaceChildren();
    /**
     * @type { {efectivo: string[], no_efectivo: string[], inmune: string[]} }
     */
    const subdb = db[sel.value];
    sel.className = sel.value;

    // ------------------------- FUERZA (ARRIBA)
    // ITEMS DONDE YO GANO...
    for (const item of subdb.efectivo) {
      i_beat_these.appendChild(createItem(item));
    }

    // PARA TODOS LOS TIPOS...
    for (const type in db) {
      /**
       * @type {string[]}
       */
      const arr = db[type].efectivo;
      // SI ESE TIPO ME GANA...
      if (arr.includes(sel.value)) these_beat_me.appendChild(createItem(type));
    }

    // ------------------------- RESISTENCIA (ABAJO)
    // ITEMS DONDE NO LES HAGO DAÑO...
    for (const item of subdb.no_efectivo) {
      these_endure_me.appendChild(createItem(item));
    }

    // PARA TODOS LOS TIPOS...
    for (const type in db) {
      /**
       * @type {string[]}
       */
      const arr = db[type].no_efectivo;
      // SI ESE TIPO NO ME HACE DAÑO...
      if (arr.includes(sel.value)) i_endure_these.appendChild(createItem(type));
    }

    // ------------------------- INMUNIDADES
    // ITEMS A LOS QUE SOY INMUNE
    for (const item of subdb.inmune) {
      i_endure_these.appendChild(createItem(item, true));
    }

    // PARA TODOS LOS TIPOS...
    for (const type in db) {
      /**
       * @type {string[]}
       */
      const arr = db[type].inmune;
      // QUE SEAN INMUNES A MI...
      if (arr.includes(sel.value))
        these_endure_me.appendChild(createItem(type, true));
    }

    draw();
  };

  // START
  sel.onchange();
});
