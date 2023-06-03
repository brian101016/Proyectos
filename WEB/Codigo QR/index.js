document.addEventListener("DOMContentLoaded", () => {
  // Variables
  const seccion_search = document.getElementById("seccion-search");
  const not_found = document.getElementById("not-found");
  const search = document.getElementById("search");
  const button = document.getElementById("button");
  const title = document.getElementById("title");

  button.onclick = () => {
    location.search = "id=" + search.value;
  };

  // Base de datos improvisada
  const db = {
    ["ACJPI-77292"]: {
      fecha_pago: "07/01/2023",
      total: "244.00",
      nombre: "DENISSE ELISA CERECER ESQUER",
      rfc: "CEED760315LE5",
      fecha_validacion: "02/06/2023 07:16:34",
    },
    ["ACJLC002-7417"]: {
      fecha_pago: "30/04/2023",
      total: "778.00",
      nombre: "CINDY CALBIMONTE PEREZ",
      rfc: "CAPC8902191S6",
      fecha_validacion: "20/05/2023 11:43:11",
    },
  };

  // Function Get URL Parameters
  function getURLParameter(param) {
    const url = location.search.substring(1); // Quitamos el ? por default
    if (url === "") return null;
    const vars = url.split("&");
    for (let i = 0; i < vars.length; i++) {
      const currParam = vars[i].split("=");
      if (currParam[0] == param) return currParam[1];
    }
    return null;
  }

  // Verificamos si hay algo que mostrar
  if (location.search === "") {
    title.textContent = "BUSCAR RECIBO";
    seccion_search.classList.remove("hidden");
    not_found.classList.add("hidden");
  } else {
    const id = getURLParameter("id");
    if (!id || !db[id]) {
      title.textContent = "RECIBO NO ENCONTRADO";
      seccion_search.classList.remove("hidden");
      not_found.classList.remove("hidden");
      return;
    }

    title.textContent = "RECIBO VÁLIDO";
    seccion_search.classList.add("hidden");
    not_found.classList.add("hidden");

    const data = db[id];
    const tags = [
      "Folio del Recibo:",
      id,
      "Fecha de Pago:",
      data.fecha_pago,
      "Total:",
      data.total,
      "Nombre:",
      data.nombre,
      "RFC:",
      data.rfc,
      "Fecha de Validación:",
      data.fecha_validacion,
    ];

    // const table = document.createElement("table");
    const table = document.getElementById("table-container");

    for (let i = 0; i < tags.length; i += 2) {
      const tr = document.createElement("div");
      tr.classList.add("as-tr");
      if ((i + 4) % 4 === 0) tr.classList.add("table-row-par");
      const td1 = document.createElement("div");
      td1.textContent = tags[i];
      td1.classList.add("as-td");
      const td2 = document.createElement("div");
      td2.textContent = tags[i + 1];
      td2.classList.add("as-td");
      tr.appendChild(td1);
      tr.appendChild(td2);
      table.appendChild(tr);
    }
  }
});
