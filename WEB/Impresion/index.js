document.addEventListener("DOMContentLoaded", () => {
  // ################################################################ VARS
  // const controls = document.getElementById("controls");
  const image = document.getElementById("image");

  const select = document.getElementById("select");
  const print = document.getElementById("print");
  const toggle = document.getElementById("toggle");
  const clear = document.getElementById("clear");

  const form = document.getElementById("form");

  const stylesheet = document.createElement("style");

  class DOC {
    name = "";
    width = "";
    height = "";
    inputs = [new INPUT(0, 0, 1, "", "")];

    constructor(n, w, h, i) {
      this.name = n;
      this.width = w;
      this.height = h;
      this.inputs = i;
    }
  }

  class INPUT {
    left = "";
    top = "";
    width = "";
    placeholder = "";
    value = "";

    constructor(ttop, lleft, wwidth, pplaceholder, vvalue) {
      this.top = ttop;
      this.left = lleft;
      this.width = wwidth;
      this.placeholder = pplaceholder;
      this.value = vvalue;
    }
  }

  const docs = [
    new DOC("bautizo.jpg", 137.0, 214.0, [
      new INPUT("58.25mm", "21mm", "100mm", "", ""),
      new INPUT("66mm", "18.5mm", "9.5mm", "", ""),
      new INPUT("66mm", "34mm", "87mm", "", ""),
      new INPUT("73.75mm", "21mm", "100mm", "", ""),
      new INPUT("81.25mm", "41.25mm", "80mm", "", ""),
      new INPUT("89mm", "24.5mm", "12.5mm", "", ""),
      new INPUT("89mm", "59.5mm", "44.5mm", "", ""),
      new INPUT("89mm", "110.25mm", "11mm", "", ""),
      new INPUT("104.75mm", "24.5mm", "14mm", "", ""),
      new INPUT("104.75mm", "60.75mm", "39mm", "", ""),
      new INPUT("104.75mm", "106.5mm", "14.5mm", "", ""),
      new INPUT("125mm", "42.25mm", "79mm", "", ""),
      new INPUT("132.5mm", "67.75mm", "53.5mm", "", ""),
      new INPUT("140.25mm", "12.25mm", "23mm", "", ""),
      new INPUT("140.25mm", "40.25mm", "81mm", "", ""),
      new INPUT("148mm", "78.5mm", "43mm", "", ""),
      new INPUT("155.5mm", "32.5mm", "27.5mm", "", ""),
      new INPUT("155.5mm", "83mm", "38mm", "", ""),
      new INPUT("163mm", "12.5mm", "109mm", "", ""),
      new INPUT("171.75mm", "42mm", "10mm", "", ""),
      new INPUT("171.75mm", "73mm", "26mm", "", ""),
      new INPUT("171.75mm", "105mm", "16mm", "", ""),
    ]),
    new DOC("comunion.jpg", 216.0, 141.0, [
      new INPUT("37.75mm", "52.5mm", "119mm", "", ""),
      new INPUT("51.75mm", "50mm", "22mm", "", ""),
      new INPUT("51.75mm", "77.5mm", "68mm", "", ""),
      new INPUT("51.75mm", "149.5mm", "21mm", "", ""),
      new INPUT("58.75mm", "78.5mm", "120mm", "", ""),
      new INPUT("65.75mm", "43.5mm", "155mm", "", ""),
      new INPUT("72.75mm", "41.5mm", "157mm", "", ""),
      new INPUT("79.75mm", "41.5mm", "157mm", "", ""),
      new INPUT("86.75mm", "51mm", "147mm", "", ""),
      new INPUT("93.75mm", "41.5mm", "157mm", "", ""),
      new INPUT("100.75mm", "25mm", "173mm", "", ""),
      new INPUT("107.75mm", "33.5mm", "28mm", "", ""),
      new INPUT("114.75mm", "33.5mm", "28mm", "", ""),
      new INPUT("121.75mm", "33.5mm", "28mm", "", ""),
    ]),
    new DOC("matrimonio.jpg", 229.5, 170.5, [
      new INPUT("48.5mm", "34mm", "164mm", "", ""),
      new INPUT("75.75mm", "35mm", "10mm", "", ""),
      new INPUT("75.75mm", "52mm", "46mm", "", ""),
      new INPUT("75.75mm", "111.5mm", "8mm", "", ""),
      new INPUT("75.75mm", "155.5mm", "55mm", "", ""),
      new INPUT("96mm", "28.5mm", "84.5mm", "", ""),
      new INPUT("96mm", "120.5mm", "84.5mm", "", ""),
      new INPUT("108mm", "28.5mm", "84.5mm", "", ""),
      new INPUT("108mm", "120.5mm", "84.5mm", "", ""),
      new INPUT("114mm", "48mm", "50mm", "", ""),
      new INPUT("118.75mm", "51mm", "47mm", "", ""),
      new INPUT("123.75mm", "51mm", "47mm", "", ""),
      new INPUT("128.75mm", "74mm", "24mm", "", ""),
      new INPUT("133.75mm", "29mm", "69mm", "", ""),
    ]),
  ];

  // ################################################################ SETUP
  for (const doc of docs) {
    const op = document.createElement("option");
    op.value = doc.name;
    op.text = doc.name.substring(0, doc.name.length - 4).toUpperCase();
    select.appendChild(op);
  }

  // stylesheet.type = "text/css";
  function handlePrint(width = "100mm", height = "100mm", show = false) {
    stylesheet.innerText = `@media print {
        @page { margin: 0; size: ${width} ${height}; }
        #image { opacity: ${show ? 1 : 0}; } }`;

    window.print();
  }
  document.head.appendChild(stylesheet);

  // ################################################################ SELECT CHANGE
  select.onchange = () => {
    const doc = docs[select.selectedIndex];

    image.src = `./docs/${doc.name}`;
    image.style.backgroundImage = `url(./docs/${doc.name})`;
    image.style.width = doc.width + "mm";
    image.style.height = doc.height + "mm";

    form.replaceChildren();
    for (const input of doc.inputs) {
      const io = document.createElement("input");
      io.style.top = input.top;
      io.style.left = input.left;
      io.style.width = input.width;
      io.placeholder = input.placeholder;
      io.value = input.value;

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
    handlePrint(doc.width, doc.height, toggle.checked);
  };

  // ################################################################ CLEAR CLICK
  clear.onclick = () => {
    for (const input of form.children) {
      input.value = "";
      input.onchange();
    }
  };
});
