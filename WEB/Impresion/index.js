document.addEventListener("DOMContentLoaded", () => {
  // ################################################################ VARS
  // const controls = document.getElementById("controls");
  const image = document.getElementById("image");

  const select = document.getElementById("select");
  const print = document.getElementById("print");
  const toggle = document.getElementById("toggle");
  const clear = document.getElementById("clear");

  const form = document.getElementById("form");
  const stylesheet = document.getElementById("stylesheet");

  class DOC {
    name = "";
    width = "";
    height = "";
    orientation = "";
    inputs = [new INPUT(0, 0, 1, "", "")];

    constructor(n, w, h, o, i) {
      this.name = n;
      this.width = w;
      this.height = h;
      this.orientation = o;
      this.inputs = i;
    }
  }

  class INPUT {
    left = "";
    top = "";
    width = "";
    placeholder = "";
    value = "";
    textAlign = "";
    fontWeight = "";

    constructor(ttop, lleft, wwidth, pplaceholder, vvalue, aalign, ffont) {
      this.top = ttop;
      this.left = lleft;
      this.width = wwidth;
      this.placeholder = pplaceholder;
      this.value = vvalue;
      this.textAlign = aalign;
      this.fontWeight = ffont;
    }
  }

  const docs = [
    new DOC("bautizo.jpg", "137.0mm", "214.0mm", "portrait", [
      new INPUT("59.25mm", "22mm", "99mm", "Nombre del bebé...", "", "", "700"),
      new INPUT("67mm", "18.5mm", "9.5mm", "O/A", "", "", ""),
      new INPUT("67mm", "35mm", "86mm", "", "", "", ""),
      new INPUT("74.75mm", "22mm", "99mm", "", "", "", ""),
      new INPUT("82.25mm", "42.25mm", "79mm", "Ciudad...", "", "", ""),
      new INPUT("90mm", "24.5mm", "12.5mm", "", "", "center", ""),
      new INPUT("90mm", "59.5mm", "44.5mm", "", "", "", ""),
      new INPUT("90mm", "110.25mm", "11mm", "", "", "center", ""),
      new INPUT("105.75mm", "24.5mm", "14mm", "", "", "center", ""),
      new INPUT("105.75mm", "60.75mm", "39mm", "", "", "", ""),
      new INPUT("105.75mm", "106.5mm", "14.5mm", "", "", "center", ""),
      new INPUT("126mm", "43.25mm", "78mm", "", "", "", ""),
      new INPUT("133.5mm", "68.75mm", "52.5mm", "", "", "", ""),
      new INPUT("141.25mm", "12.25mm", "23mm", "", "", "", ""),
      new INPUT("141.25mm", "41.25mm", "80mm", "", "", "", ""),
      new INPUT("149mm", "78.5mm", "43mm", "", "", "", ""),
      new INPUT("156.5mm", "32.5mm", "27.5mm", "", "", "", ""),
      new INPUT("156.5mm", "83mm", "38mm", "", "", "", ""),
      new INPUT(
        "164mm",
        "12.5mm",
        "109mm",
        "Notas marginales...",
        "",
        "center",
        "700"
      ),
      new INPUT("172.75mm", "42mm", "10mm", "", "", "center", ""),
      new INPUT("172.75mm", "74mm", "25mm", "", "", "", ""),
      new INPUT("172.75mm", "105mm", "16mm", "", "", "center", ""),
      new INPUT(
        "198.75mm",
        "29mm",
        "78mm",
        "",
        "RECTOR PBRO. Luis Armando González Torres",
        "",
        ""
      ),
    ]),
    new DOC("comunion.jpg", "216.0mm", "141.0mm", "landscape", [
      new INPUT("38.75mm", "53.5mm", "117mm", "", "", "", "700"),
      new INPUT("52.75mm", "50mm", "22mm", "", "", "center", ""),
      new INPUT("52.75mm", "78.5mm", "66mm", "", "", "", ""),
      new INPUT("52.75mm", "149.5mm", "21mm", "", "", "center", ""),
      new INPUT("59.75mm", "79.5mm", "118mm", "", "", "", ""),
      new INPUT("66.75mm", "44.5mm", "154mm", "", "", "", ""),
      new INPUT("73.75mm", "41.5mm", "157mm", "", "", "", ""),
      new INPUT("80.75mm", "41.5mm", "157mm", "", "", "", ""),
      new INPUT("87.75mm", "52mm", "146mm", "", "", "", ""),
      new INPUT("94.75mm", "42.5mm", "156mm", "", "", "", ""),
      new INPUT("101.75mm", "26mm", "172mm", "", "", "", ""),
      new INPUT("108.75mm", "33.5mm", "28mm", "", "", "center", ""),
      new INPUT("115.75mm", "33.5mm", "28mm", "", "", "center", ""),
      new INPUT("122.75mm", "33.5mm", "28mm", "", "", "center", ""),
      new INPUT(
        "119.75mm",
        "122.5mm",
        "78mm",
        "",
        "RECTOR PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
        "",
        ""
      ),
    ]),
    new DOC("matrimonio.jpg", "229.5mm", "170.5mm", "landscape", [
      new INPUT(
        "49mm",
        "35mm",
        "162mm",
        "Nombre de los novios...",
        "",
        "",
        "700"
      ),
      new INPUT("76.25mm", "35mm", "10mm", "", "", "center", ""),
      new INPUT("76.25mm", "53mm", "44mm", "", "", "", ""),
      new INPUT("76.25mm", "112.5mm", "7mm", "", "", "center", ""),
      new INPUT("76.25mm", "156.5mm", "53mm", "", "", "", ""),
      new INPUT("96mm", "29.5mm", "83.5mm", "", "", "", ""),
      new INPUT("96mm", "121.5mm", "83.5mm", "", "", "", ""),
      new INPUT("108mm", "29.5mm", "83.5mm", "", "", "", ""),
      new INPUT("108mm", "121.5mm", "83.5mm", "", "", "", ""),
      new INPUT("115mm", "49mm", "48mm", "", "", "", ""),
      new INPUT("119.75mm", "52mm", "45mm", "", "", "", ""),
      new INPUT("124.75mm", "52mm", "45mm", "", "", "", ""),
      new INPUT("129.75mm", "76mm", "21mm", "", "", "", ""),
      new INPUT("134.75mm", "30mm", "67mm", "", "", "", ""),
      new INPUT(
        "123.25mm",
        "121mm",
        "83mm",
        "",
        "PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
        "",
        ""
      ),
    ]),
  ];

  // ################################################################ SETUP
  for (const doc of docs) {
    const op = document.createElement("option");
    op.value = doc.name;
    op.text = doc.name.substring(0, doc.name.length - 4).toUpperCase();
    select.appendChild(op);
  }

  toggle.onchange = () => {
    if (toggle.checked) image.classList.remove("will-hide");
    else image.classList.add("will-hide");
  };

  // ################################################################ SELECT CHANGE
  select.onchange = () => {
    const doc = docs[select.selectedIndex];

    image.src = `./docs/${doc.name}`;
    image.style.backgroundImage = `url(./docs/${doc.name})`;
    image.style.width = doc.width;
    image.style.height = doc.height;

    form.replaceChildren();
    for (const input of doc.inputs) {
      const io = document.createElement("input");
      io.style.top = input.top;
      io.style.left = input.left;
      io.style.width = input.width;
      io.placeholder = input.placeholder;
      io.value = input.value;
      io.style.textAlign = input.textAlign;
      io.style.fontWeight = input.fontWeight;

      io.onchange = () => {
        input.value = io.value;
      };

      form.appendChild(io);
    }
  };

  select.onchange();

  // ################################################################ PRINT CLICK
  print.onclick = () => {
    const doc = docs[select.selectedIndex];
    if (doc.orientation === "landscape") {
      document.body.classList.add("landscape");
      stylesheet.innerHTML = `@media print {body.landscape {width: ${doc.height}; height: ${doc.width};}}`;
    } else {
      document.body.classList.remove("landscape");
      stylesheet.innerHTML = `@media print {body.landscape {width: ${doc.width}; height: ${doc.height};}}`;
    }

    window.print();
  };

  // ################################################################ CLEAR CLICK
  clear.onclick = () => {
    for (const input of form.children) {
      input.value = "";
      input.onchange();
    }
  };
});
