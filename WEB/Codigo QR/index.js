document.addEventListener("DOMContentLoaded", () => {
  const folio = document.getElementById("folio");
  const nombre = document.getElementById("nombre");
  const campo1 = document.getElementById("campo-1");
  const campo2 = document.getElementById("campo-2");
  const fecha = document.getElementById("fecha");

  const seccion_info = document.getElementById("seccion-info");
  const seccion_search = document.getElementById("seccion-search");
  const not_found = document.getElementById("not-found");

  const search = document.getElementById("search");
  const button = document.getElementById("button");

  button.onclick = () => {
    window.location.href += "?id=" + search.value;
  };

  const db = {
    ["a53asd21"]: {
      nombre: "Joe Doe",
      campo1: "Informacion 1",
      campo2: "prueba 1",
      fecha: "12/12/12",
    },
    ["nd295sdf"]: {
      nombre: "Joe Doe 2",
      campo1: "Informacion 2",
      campo2: "prueba 2",
      fecha: "12/12/13",
    },
    ["paf48vna"]: {
      nombre: "Joe Doe 3",
      campo1: "Informacion 3",
      campo2: "prueba 3",
      fecha: "12/12/14",
    },
    ["vja842df"]: {
      nombre: "Joe Doe 4",
      campo1: "Informacion 4",
      campo2: "prueba asadasd 4",
      fecha: "12/12/15",
    },
    ["0vdcasdn"]: {
      nombre: "Joe Doe 5",
      campo1: "Informacion 5",
      campo2: "prueba asadasd 5",
      fecha: "12/12/16",
    },
    ["vnaisd62"]: {
      nombre: "Joe Doe 6",
      campo1: "Informacion 6",
      campo2: "prueba 6",
      fecha: "12/12/17",
    },
  };

  function getURLParameter(param) {
    const url = window.location.search.substring(1); // Quitamos el ? por default
    if (url === "") return null;
    const vars = url.split("&");
    for (let i = 0; i < vars.length; i++) {
      const currParam = vars[i].split("=");
      if (currParam[0] == param) return currParam[1];
    }
    return null;
  }

  if (window.location.search === "") seccion_info.style.display = "none";
  else {
    seccion_search.style.display = "none";
    const id = getURLParameter("id");
    if (!id || !db[id]) {
      not_found.style.display = "initial";
      seccion_info.style.display = "none";
      return;
    }

    folio.value = id;
    nombre.value = db[id].nombre;
    campo1.value = db[id].campo1;
    campo2.value = db[id].campo2;
    fecha.value = db[id].fecha;
  }
});
