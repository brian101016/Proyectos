/**
 * @typedef {{
 *  id: number,
 *  name: string,
 *  height: number,
 *  weight: number,
 *  forms: {
 *    name: string,
 *    url: string,
 *  }[],
 *  is_default: boolean,
 *  types: {
 *    slot: number,
 *    type: {
 *      name: string,
 *      url: string,
 *    },
 *  }[]
 *  species: {
 *    name: string,
 *    url: string,
 *  },
 *  sprites: {
 *    front_default: string,
 *    front_female: string | null,
 *  },
 * }} Pokemon
 *
 * @typedef {{
 *  color: {
 *    name: string,
 *    url: string,
 *  },
 *  evolves_from_species: {
 *    name: string,
 *    url: string,
 *  } | null,
 *  habitat: {
 *    name: string,
 *    url: string,
 *  } | null,
 *  generation: {
 *    name: string,
 *    url: string,
 *  },
 *  gender_rate: number,
 *  has_gender_differences: boolean,
 *  id: number,
 *  is_baby: boolean,
 *  is_legendary: boolean,
 *  is_mythical: boolean,
 *  name: string,
 *  shape: {
 *    name: string,
 *    url: string,
 *  } | null,
 *  forms_switchable: boolean,
 *  varieties: {
 *    is_default: boolean,
 *    pokemon: {
 *      name: string,
 *      url: string,
 *    },
 *  }[],
 * }} Species
 */

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

// ---------------------------------------------------------------------------------------------------- EXPERT SYSTEM
async function se(...deflist) {
  const el_se = document.getElementById("se");
  el_se.style.display = "block";
  const el_title = document.getElementById("se-title");
  el_title.textContent = "Generating...";
  const el_table = document.getElementById("se-list");
  el_table.replaceChildren();

  /** @type {(number | string)[]} */
  const pokeIDs = deflist?.length > 0 ? [...deflist] : [];
  const maxLen = 50;
  const topPoke = 1025;

  while (pokeIDs.length < maxLen) {
    let numRand = random_range(1, topPoke);
    while (pokeIDs.includes(numRand)) {
      numRand = boundaries(1, numRand + 1, topPoke);
    }
    pokeIDs.push(numRand);
  }

  for (const pokemon of pokeIDs) {
    const tr = document.createElement("tr");
    const url = "https://pokeapi.co/api/v2/pokemon/" + pokemon;
    const request = await fetch(url);
    if (request.status !== 200) {
      tr.textContent = `Failed to load "${pokemon}"`;
      el_table.appendChild(tr);
      continue;
    }

    /** @type {Pokemon} */
    const pokedata = await request.json();
    const req2 = await fetch(pokedata.species.url);
    /** @type {Species} */
    const species = await req2.json();

    tr.innerHTML = `
      <td>${pokedata.id}</td>
      <td>${pokedata.name}</td>
      <td>${pokedata.height}</td>
      <td>${pokedata.weight}</td>

      <td>${species.generation.name.substring(11).toUpperCase() || "N/A"}</td>
      <td>${species.evolves_from_species?.name || "N/A"}</td>

      <td>${pokedata.types[0].type.name}</td>
      <td>${pokedata.types[1]?.type?.name || "N/A"}</td>

      <td>${
        species.gender_rate === -1
          ? "No gender"
          : species.gender_rate === 0
          ? "Always male"
          : species.gender_rate === 8
          ? "Always female"
          : "Both genders"
      }</td>
      <td>${species.has_gender_differences}</td>
      <td>
        <img src="${pokedata.sprites.front_default}" alt="front default" />
      </td>
      <td>${
        pokedata.sprites.front_female
          ? `<img src="${pokedata.sprites.front_female}" alt="front female" />`
          : "N/A"
      }</td>

      <td>${species.color?.name || "N/A"}</td>
      <td>${species.shape?.name || "N/A"}</td>
      <td>${species.habitat?.name || "N/A"}</td>

      <td>${species.is_baby}</td>
      <td>${species.is_legendary}</td>
      <td>${species.is_mythical}</td>
    
      <td>
        <ol>
          ${(() => {
            let inn = "";
            pokedata.forms.forEach((item, i) => {
              inn += `<li>${item.name}</li>\n`;
            });
            return inn;
          })()}
        </ol>
      </td>
      <td>${pokedata.is_default}</td>
      <td>${species.forms_switchable}</td>

      <td>${species.name}</td>
      ${(() => {
        let inn = "";
        let isdef = false;
        species.varieties.forEach((item, i) => {
          inn += `<li>${item.pokemon.name}</li>\n`;
          if (item.is_default && item.pokemon.name === pokedata.name) {
            isdef = true;
          }
        });
        return `<td><ol>${inn}</ol></td>
          <td>${isdef}</td>`;
      })()}
    `;
    el_table.appendChild(tr);
  }

  el_title.textContent = "Done!";
}
