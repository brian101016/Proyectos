const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const db = {
  "bautizos.jpg": {
    width: "136mm",
    height: "213mm",
    top: "0mm",
    left: "42mm",
    flip: false,
    inputs: [
      {
        store: "nombre",
        top: "59mm",
        left: "65mm",
        width: "100mm",
        placeholder: "Nombre del bebé...",
        fontWeight: 700,
      },
      {
        store: "sexo",
        spec: "sexo",
        top: "66.5mm",
        left: "62mm",
        width: "7mm",
        placeholder: "O/A",
      },
      { store: "padre", top: "66.5mm", left: "78mm", width: "87mm" },
      { store: "madre", top: "74mm", left: "65mm", width: "100mm" },
      {
        store: "ciudad_nacimiento",
        top: "82mm",
        left: "85mm",
        width: "80mm",
        placeholder: "Ciudad...",
      },
      {
        store: "fecha_nacimiento",
        spec: "day",
        top: "89.5mm",
        left: "67mm",
        width: "12mm",
        textAlign: "center",
      },
      {
        store: "fecha_nacimiento",
        spec: "month",
        top: "89.5mm",
        left: "103.5mm",
        width: "42mm",
        textAlign: "center",
      },
      {
        store: "fecha_nacimiento",
        spec: "year",
        top: "89.5mm",
        left: "152mm",
        width: "11mm",
        textAlign: "center",
      },
      {
        store: "fecha_sacramento",
        spec: "day",
        top: "105.25mm",
        left: "67mm",
        width: "13mm",
        textAlign: "center",
      },
      {
        store: "fecha_sacramento",
        spec: "month",
        top: "105.25mm",
        left: "105mm",
        width: "36mm",
        textAlign: "center",
      },
      {
        store: "fecha_sacramento",
        spec: "year",
        top: "105.25mm",
        left: "149mm",
        width: "14mm",
        textAlign: "center",
      },
      {
        store: "presbitero",
        top: "125.5mm",
        left: "86mm",
        width: "80mm",
      },
      {
        store: "padrino",
        top: "133mm",
        left: "112mm",
        width: "54mm",
      },
      { top: "141mm", left: "54mm", width: "23mm" },
      {
        store: "madrina",
        top: "141mm",
        left: "84mm",
        width: "82mm",
      },
      {
        store: "libro",
        top: "148.5mm",
        left: "121mm",
        width: "42mm",
        textAlign: "center",
      },
      {
        store: "pagina",
        top: "156.25mm",
        left: "75mm",
        width: "27mm",
        textAlign: "center",
      },
      {
        store: "partida",
        top: "156.25mm",
        left: "125mm",
        width: "38mm",
        textAlign: "center",
      },
      {
        store: "notas_marginales",
        top: "163mm",
        left: "50mm",
        width: "117mm",
        placeholder: "Notas marginales...",
        textAlign: "center",
        fontWeight: 700,
      },
      {
        // store: "today",
        // spec: "day",
        top: "172mm",
        left: "84.5mm",
        width: "9mm",
        value: new Date().getDate(),
        placeholder: new Date().getDate(),
        textAlign: "center",
      },
      {
        // store: "today",
        // spec: "month",
        top: "172mm",
        left: "117mm",
        width: "24mm",
        value: months[new Date().getMonth()],
        placeholder: months[new Date().getMonth()],
        textAlign: "center",
      },
      {
        // store: "today",
        // spec: "year",
        top: "172mm",
        left: "147.5mm",
        width: "15mm",
        value: new Date().getFullYear(),
        placeholder: new Date().getFullYear(),
        textAlign: "center",
      },
      {
        top: "198.75mm",
        left: "66mm",
        width: "84mm",
        placeholder: "RECTOR PBRO. Luis Armando González Torres",
        value: "RECTOR PBRO. Luis Armando González Torres",
        textAlign: "center",
      },
    ],
  },

  "comuniones.jpg": {
    width: "214mm",
    height: "138mm",
    left: "1.5mm",
    top: "38mm",
    flip: true,
    inputs: [
      {
        store: "nombre",
        top: "74mm",
        left: "56mm",
        width: "115mm",
        fontWeight: 700,
      },
      {
        store: "fecha_sacramento",
        spec: "day",
        top: "88mm",
        left: "51mm",
        width: "22mm",
        textAlign: "center",
      },
      {
        store: "fecha_sacramento",
        spec: "month",
        top: "88mm",
        left: "82mm",
        width: "63mm",
        textAlign: "center",
      },
      {
        store: "fecha_sacramento",
        spec: "year",
        top: "88mm",
        left: "150mm",
        width: "21mm",
        textAlign: "center",
      },
      { store: "presbitero", top: "95mm", left: "82mm", width: "116mm" },
      { store: "padrino_madrina", top: "102mm", left: "46mm", width: "152mm" },
      { store: "padre", top: "109mm", left: "46mm", width: "152mm" },
      { store: "madre", top: "116mm", left: "46mm", width: "152mm" },
      { store: "ciudad_bautizo", top: "123mm", left: "55mm", width: "143mm" },
      {
        store: "parroquia_bautizo",
        top: "130mm",
        left: "46mm",
        width: "152mm",
      },
      {
        store: "fecha_bautizo",
        spec: "date",
        top: "137mm",
        left: "28mm",
        width: "170mm",
      },
      {
        store: "libro",
        top: "144mm",
        left: "36mm",
        width: "27mm",
        textAlign: "center",
      },
      {
        store: "partida",
        top: "151mm",
        left: "36mm",
        width: "27mm",
        textAlign: "center",
      },
      {
        store: "pagina",
        top: "158mm",
        left: "36mm",
        width: "27mm",
        textAlign: "center",
      },
      {
        top: "154.5mm",
        left: "122mm",
        width: "80mm",
        placeholder: "RECTOR PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
        value: "RECTOR PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
        textAlign: "center",
      },
    ],
  },

  "confirmaciones.jpg": {
    width: "212.96mm",
    height: "134.79mm",
    left: "1.5mm",
    top: "41mm",
    flip: true,
    inputs: [
      {
        store: "fecha_sacramento",
        spec: "day",
        top: "91mm",
        left: "105mm",
        width: "10mm",
        textAlign: "center",
      },
      {
        store: "fecha_sacramento",
        spec: "month",
        top: "91mm",
        left: "123mm",
        width: "42mm",
        textAlign: "center",
      },
      {
        store: "fecha_sacramento",
        spec: "year",
        top: "91mm",
        left: "173mm",
        width: "22mm",
        textAlign: "center",
      },
      {
        store: "nombre",
        top: "98mm",
        left: "40mm",
        width: "155mm",
        fontWeight: 700,
      },
      {
        store: "sexo",
        spec: "sexo",
        top: "105mm",
        left: "25mm",
        width: "5mm",
        textAlign: "center",
      },
      { store: "padre", top: "105mm", left: "35mm", width: "160mm" },
      { store: "madre", top: "112mm", left: "30mm", width: "165mm" },
      { store: "padrino_madrina", top: "119mm", left: "63mm", width: "132mm" },
      {
        store: "parroquia_bautizo",
        top: "128mm",
        left: "80mm",
        width: "115mm",
      },
      { store: "ciudad_bautizo", top: "135mm", left: "35mm", width: "160mm" },
      {
        store: "libro",
        top: "142mm",
        left: "40mm",
        width: "25mm",
        textAlign: "center",
      },
      {
        store: "partida",
        top: "149mm",
        left: "40mm",
        width: "25mm",
        textAlign: "center",
      },
      {
        store: "pagina",
        top: "156mm",
        left: "40mm",
        width: "25mm",
        textAlign: "center",
      },
      {
        // store: "today",
        // spec: "day",
        top: "141.5mm",
        left: "105mm",
        width: "10mm",
        textAlign: "center",
        value: new Date().getDate(),
        placeholder: new Date().getDate(),
      },
      {
        // store: "today",
        // spec: "month",
        top: "141.5mm",
        left: "123mm",
        width: "42mm",
        textAlign: "center",
        value: months[new Date().getMonth()],
        placeholder: months[new Date().getMonth()],
      },
      {
        // store: "today",
        // spec: "year",
        top: "141.5mm",
        left: "173mm",
        width: "22mm",
        textAlign: "center",
        value: new Date().getFullYear(),
        placeholder: new Date().getFullYear(),
      },
      {
        top: "156mm",
        left: "116mm",
        width: "84mm",
        placeholder: "RECTOR PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
        value: "RECTOR PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
        textAlign: "center",
      },
    ],
  },

  "matrimonios.jpg": {
    width: "248mm",
    height: "182mm",
    left: "0mm",
    top: "18mm",
    flip: true,
    inputs: [
      {
        store: "novios",
        spec: "novios",
        top: "70.5mm",
        left: "38mm",
        width: "165mm",
        placeholder: "Nombre de los novios...",
        textAlign: "center",
        fontWeight: 700,
        fontSize: "16px",
      },
      {
        store: "fecha_sacramento",
        spec: "day",
        top: "101mm",
        left: "36mm",
        width: "10mm",
        textAlign: "center",
      },
      {
        store: "fecha_sacramento",
        spec: "month",
        top: "101mm",
        left: "58mm",
        width: "40mm",
        textAlign: "center",
      },
      {
        store: "fecha_sacramento",
        spec: "year-crop",
        top: "101mm",
        left: "121mm",
        width: "6mm",
        textAlign: "center",
      },
      { store: "presbitero", top: "101mm", left: "168mm", width: "53mm" },
      {
        store: "testigos",
        spec: "0",
        top: "123mm",
        left: "30mm",
        width: "85mm",
      },
      {
        store: "testigos",
        spec: "1",
        top: "123mm",
        left: "130mm",
        width: "85mm",
      },
      {
        store: "testigos",
        spec: "2",
        top: "135mm",
        left: "30mm",
        width: "85mm",
      },
      {
        store: "testigos",
        spec: "3",
        top: "135mm",
        left: "130mm",
        width: "85mm",
      },
      {
        store: "libro",
        top: "141.5mm",
        left: "54mm",
        width: "46mm",
        textAlign: "center",
      },
      {
        store: "pagina",
        top: "147mm",
        left: "54mm",
        width: "46mm",
        textAlign: "center",
      },
      {
        store: "partida",
        top: "152.5mm",
        left: "54mm",
        width: "46mm",
        textAlign: "center",
      },
      { store: "presentacion", top: "163.5mm", left: "30mm", width: "70mm" },
      {
        top: "161mm",
        left: "130mm",
        width: "85mm",
        placeholder: "PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
        value: "PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
        textAlign: "center",
      },
    ],
  },

  "platicas.jpg": {
    width: "213mm",
    height: "134.5mm",
    left: "1.5mm",
    top: "41mm",
    flip: true,
    inputs: [
      { top: "96.5mm", left: "50mm", width: "150mm" },
      { top: "104.5mm", left: "50mm", width: "150mm" },
      { top: "112.5mm", left: "54mm", width: "146mm" },
      { top: "120.5mm", left: "50mm", width: "150mm" },
      {
        top: "144mm",
        left: "20mm",
        width: "80mm",
        placeholder: "Válido por dos años",
        value: "Válido por dos años",
        textAlign: "center",
      },
      {
        top: "159mm",
        left: "50mm",
        width: "17mm",
        value: new Date().getDate(),
        placeholder: new Date().getDate(),
        textAlign: "center",
      },
      {
        top: "159mm",
        left: "75mm",
        width: "50mm",
        value: months[new Date().getMonth()],
        placeholder: months[new Date().getMonth()],
        textAlign: "center",
      },
      {
        top: "159mm",
        left: "132mm",
        width: "18mm",
        value: new Date().getFullYear(),
        placeholder: new Date().getFullYear(),
        textAlign: "center",
      },
      {
        top: "152mm",
        left: "122mm",
        width: "78mm",
        placeholder: "RECTOR PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
        value: "RECTOR PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
        textAlign: "center",
      },
    ],
  },
};

// ------------------------------------------------------------------------------------ GET FECHA STRING
/**
 * Regresa un formato de fecha correcto según el valor que le demos. Para el mes lo regresa con `m`.
 * @param {Date | number} d Fecha de la cual sacar la info.
 * @param {string} [s=""] Qué cosa de la fecha hay que sacar.
 */
function fecha(d, s = "") {
  if (typeof d === "number") d = new Date(d);
  let dd = d?.getDate?.();
  if (!dd) return "";
  if (s === "day") return dd.toString();
  let mm = months[d.getMonth()];
  if (s === "month") return mm;
  let yy = d.getFullYear();
  if (s === "year") return yy.toString();
  if (s === "year-crop") return yy - 2000 + "";

  return dd + " de " + mm + " del " + yy;
}

/**
 * Normalizar para buscar por strings sin acentos ni mayusculas
 * @param {*} str
 * @returns
 */
function plain(str = "") {
  return str
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

document.addEventListener("DOMContentLoaded", () => {
  // ################################################################ VARS
  // const controls = document.getElementById("controls");
  const image = document.getElementById("image");

  const select = document.getElementById("select");
  const print = document.getElementById("print");
  const toggle = document.getElementById("toggle");
  const clear = document.getElementById("clear");

  const form = document.getElementById("form");

  const docs = db;
  const def = new URLSearchParams(location.search); // SEARCH DEFAULTS

  // ################################################################ SETUP
  const t = def.get("tipo");

  for (const doc in docs) {
    const op = document.createElement("option");
    op.value = doc;
    op.text = doc.substring(0, doc.length - 4).toUpperCase();
    select.appendChild(op);

    if (t && doc === t + ".jpg") {
      for (const data of docs[doc].inputs) {
        /** @type string | undefined */
        const s = data.spec;
        /** @type string | undefined */
        const v = data.store;
        let value = v ? JSON.parse(def.get(v)) : "";

        // ------------------------------------------ SPECIAL DATA
        if (v) {
          if (v === "today") value = fecha(new Date(), s);
          else if (v === "sexo" && value !== null) value = value ? "A" : "O";
          else if (v === "testigos" && value) value = value[s || 0];

          if (s === "novios") {
            const no = JSON.parse(def.get("novio"));
            const na = JSON.parse(def.get("novia"));
            if (no && na) value = no + " & " + na;
          } else if (v.includes("fecha")) value = fecha(value, s);

          if (value) data.value = value;
        }
      }
    }
  }
  if (t) select.value = t + ".jpg";

  toggle.onchange = () => {
    if (toggle.checked) image.classList.remove("will-hide");
    else image.classList.add("will-hide");
  };

  // ################################################################ SELECT CHANGE
  select.onchange = () => {
    const doc = docs[select.value];

    image.src = `./docs/${select.value}`;
    image.style.backgroundImage = `url(./docs/${select.value})`;
    image.style.width = doc.width;
    image.style.height = doc.height;
    image.style.left = doc.left;
    image.style.top = doc.top;

    form.replaceChildren();

    for (const data of doc.inputs) {
      const i = document.createElement("input");

      i.placeholder = data.placeholder || "";
      i.value = data.value || "";
      i.style.top = data.top;
      i.style.left = data.left;
      i.style.width = data.width;
      i.style.fontWeight = data.fontWeight;
      i.style.textAlign = data.textAlign;

      i.onchange = () => (data.value = i.value);
      form.appendChild(i);
    }
  };

  select.onchange();

  // ################################################################ PRINT CLICK
  print.onclick = () => {
    const doc = docs[select.value];
    if (doc.flip) document.body.classList.add("landscape");
    else document.body.classList.remove("landscape");

    window.print();
  };

  // ################################################################ CLEAR CLICK
  clear.onclick = () => {
    for (const input of form.children) {
      if (plain(input.value) !== plain(input.placeholder)) {
        input.value = "";
        input.onchange();
      }
    }
  };
});

function saveStyles(el = document.getElementById("form")) {
  for (const i of el.children) {
    let ss = "{ ";
    ss += i.style.top && `top: "${i.style.top}", `;
    ss += i.style.left && `left: "${i.style.left}", `;
    ss += i.style.width && `width: "${i.style.width}", `;
    ss += i.placeholder && `placeholder: "${i.placeholder}", `;
    ss += i.value && `value: "${i.value}", `;
    ss += i.style.textAlign && `textAlign: "${i.style.textAlign}", `;
    ss += i.style.fontWeight && `fontWeight: ${i.style.fontWeight}, `;
    ss += i.style.fontSize && `fontSize: "${i.style.fontSize}", `;
    ss += " },";
    console.log(ss);
  }
}
