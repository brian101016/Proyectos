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
    no_efectivo: ["Planta", "Eléctrico", "Volador"],
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
  const ef_list = document.getElementById("ef");
  const noef_list = document.getElementById("noef");

  ef_list.replaceChildren();
  noef_list.replaceChildren();
  sel.replaceChildren();

  // ################################################## CREATE ITEM
  function createItem(value = "Fuego") {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = value;
    btn.className = value;
    btn.onclick = () => {
      sel.value = value;
      sel.onchange();
    };
    li.appendChild(btn);

    return li;
  }

  // ################################################## START SELECT OPTIONS
  for (const type in db) {
    const op = document.createElement("option");
    op.value = type;
    op.text = type;
    sel.appendChild(op);
  }

  // ################################################## SELECT ON-CHANGE
  sel.onchange = () => {
    ef_list.replaceChildren();
    noef_list.replaceChildren();
    /**
     * @type { {efectivo: string[], no_efectivo: string[], inmune: string[]} }
     */
    const subdb = db[sel.value];

    // FUERTE CONTRA...
    for (const item of subdb.efectivo) {
      noef_list.appendChild(createItem(item));
    }

    // DEBIL CONTRA...
    for (const type in db) {
      /**
       * @type {string[]}
       */
      const arr = db[type].efectivo;
      if (arr.includes(sel.value)) ef_list.appendChild(createItem(type));
    }
  };
});
