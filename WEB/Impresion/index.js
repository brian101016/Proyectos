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
    margins = "";
    inputs = [new INPUT(0, 0, 1, "", "")];

    constructor(n, w, h, o, m, i) {
      this.name = n;
      this.width = w;
      this.height = h;
      this.orientation = o;
      this.margins = m;
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
    fontSize = "";

    constructor(
      ttop,
      lleft,
      wwidth,
      pplaceholder,
      vvalue,
      aalign,
      ffont,
      ssize = "13px"
    ) {
      this.top = ttop;
      this.left = lleft;
      this.width = wwidth;
      this.placeholder = pplaceholder;
      this.value = vvalue;
      this.textAlign = aalign;
      this.fontWeight = ffont;
      this.fontSize = ssize;
    }
  }

  const docs = [
    new DOC(
      "bautizo.jpg",
      "134.11mm",
      "209.97mm",
      "portrait",
      "3mm 0mm 0mm 6mm",
      [
        new INPUT(
          "57.75mm",
          "23mm",
          "97mm",
          "Nombre del bebé...",
          "",
          "",
          "700"
        ),
        new INPUT("65.5mm", "19mm", "7mm", "O/A", "", "", ""),
        new INPUT("65.5mm", "36mm", "84mm", "", "", "", ""),
        new INPUT("73mm", "22mm", "98mm", "", "", "", ""),
        new INPUT("80.5mm", "42.25mm", "77mm", "Ciudad...", "", "", ""),
        new INPUT("88.5mm", "24mm", "12.5mm", "", "", "center", ""),
        new INPUT("88.5mm", "59.5mm", "42mm", "", "", "", ""),
        new INPUT("88.5mm", "109.25mm", "10mm", "", "", "center", ""),
        new INPUT("103.75mm", "24mm", "13mm", "", "", "center", ""),
        new INPUT("103.75mm", "60.75mm", "37mm", "", "", "", ""),
        new INPUT("103.75mm", "105.5mm", "13.5mm", "", "", "center", ""),
        new INPUT("124mm", "43.25mm", "76mm", "", "", "", ""),
        new INPUT("131.5mm", "67.75mm", "51.5mm", "", "", "", ""),
        new INPUT("139.25mm", "11.25mm", "23mm", "", "", "", ""),
        new INPUT("139.25mm", "41mm", "78mm", "", "", "", ""),
        new INPUT("146.5mm", "82mm", "37mm", "", "", "", ""),
        new INPUT("154mm", "33.5mm", "24.5mm", "", "", "", ""),
        new INPUT("154mm", "82mm", "37mm", "", "", "", ""),
        new INPUT(
          "161.5mm",
          "11mm",
          "109mm",
          "Notas marginales...",
          "",
          "center",
          "700"
        ),
        new INPUT("169.75mm", "42mm", "8mm", "", "", "center", ""),
        new INPUT("169.75mm", "73mm", "23mm", "", "", "", ""),
        new INPUT("169.75mm", "105mm", "14mm", "", "", "center", ""),
        new INPUT(
          "195.75mm",
          "26mm",
          "78mm",
          "RECTOR PBRO. Luis Armando González Torres",
          "RECTOR PBRO. Luis Armando González Torres",
          "center",
          ""
        ),
      ]
    ),
    new DOC(
      "comunion.jpg",
      "208.96mm",
      "134.79mm",
      "landscape",
      "3mm 0mm 0mm 0mm",
      [
        new INPUT("33.5mm", "52.5mm", "117mm", "", "", "", "700"),
        new INPUT("47.5mm", "49mm", "19mm", "", "", "center", ""),
        new INPUT("47.5mm", "77.5mm", "62mm", "", "", "", ""),
        new INPUT("47.5mm", "146.5mm", "17mm", "", "", "center", ""),
        new INPUT("55mm", "78.5mm", "113mm", "", "", "", ""),
        new INPUT("62mm", "43.5mm", "148mm", "", "", "", ""),
        new INPUT("69mm", "40.5mm", "151mm", "", "", "", ""),
        new INPUT("76mm", "40.5mm", "151mm", "", "", "", ""),
        new INPUT("83.5mm", "51mm", "140mm", "", "", "", ""),
        new INPUT("90.25mm", "41.5mm", "150mm", "", "", "", ""),
        new INPUT("96.75mm", "25mm", "166mm", "", "", "", ""),
        new INPUT("103.75mm", "32.5mm", "28mm", "", "", "center", ""),
        new INPUT("110.5mm", "32.5mm", "28mm", "", "", "center", ""),
        new INPUT("117.5mm", "32.5mm", "28mm", "", "", "center", ""),
        new INPUT(
          "113.5mm",
          "117mm",
          "78mm",
          "RECTOR PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
          "RECTOR PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
          "",
          ""
        ),
      ]
    ),
    new DOC(
      "matrimonio.jpg",
      "227.92mm",
      "167.64mm",
      "landscape",
      "11mm 0mm 0mm 0mm",
      [
        new INPUT(
          "48.5mm",
          "34mm",
          "162mm",
          "Nombre de los novios...",
          "",
          "center",
          "700",
          "16px"
        ),
        new INPUT("78.5mm", "34mm", "10mm", "", "", "center", ""),
        new INPUT("78.5mm", "52mm", "44mm", "", "", "", ""),
        new INPUT("78.5mm", "111.5mm", "7mm", "", "", "center", ""),
        new INPUT("78.5mm", "155.5mm", "53mm", "", "", "", ""),
        new INPUT("98mm", "28.5mm", "83.5mm", "", "", "", ""),
        new INPUT("98mm", "120.5mm", "83.5mm", "", "", "", ""),
        new INPUT("110mm", "28.5mm", "83.5mm", "", "", "", ""),
        new INPUT("110mm", "120.5mm", "83.5mm", "", "", "", ""),
        new INPUT("117mm", "51mm", "45mm", "", "", "", ""),
        new INPUT("121mm", "51mm", "45mm", "", "", "", ""),
        new INPUT("121mm", "51mm", "45mm", "", "", "", ""),
        new INPUT("131mm", "75mm", "21mm", "", "", "", ""),
        new INPUT("136mm", "29mm", "67mm", "", "", "", ""),
        new INPUT(
          "133.25mm",
          "120mm",
          "83mm",
          "PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
          "PBRO. LUIS ARMANDO GONZÁLEZ TORRES",
          "center",
          ""
        ),
      ]
    ),
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
      io.style.fontSize = input.fontSize;

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
      stylesheet.innerHTML = `@media print {body.landscape {width: ${doc.height}; height: ${doc.width};}} @page{ margin: ${doc.margins}; }`;
    } else {
      document.body.classList.remove("landscape");
      stylesheet.innerHTML = `@media print {body.landscape {width: ${doc.width}; height: ${doc.height};}} @page{ margin: ${doc.margins}; }`;
    }

    window.print();
  };

  // ################################################################ CLEAR CLICK
  clear.onclick = () => {
    for (const input of form.children) {
      if (input.value !== input.placeholder) {
        input.value = "";
        input.onchange();
      }
    }
  };
});
