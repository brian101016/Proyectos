class database {
  parroquias = [new Parroquia()];
  secretos = [new Secreto()];

  constructor(parroquias = [new Parroquia()], secretos = [new Secreto()]) {
    this.parroquias = parroquias;
    this.secretos = secretos;
  }
}

class Persona {
  nombres = "nombre-persona";
  apellidos = "apellidos-persona";
  direccion = "direccion-persona";
  telefono_celular = "tel-cel-persona";
  telefono_auxiliar = "tel-aux-persona";
  telefono_casa = "tel-casa-persona";
  correo = "correo-persona";
  notas = "notas-personas";

  constructor(
    nombres = "nombre-persona",
    apellidos = "apellidos-persona",
    direccion = "direccion-persona",
    telefono_celular = "tel-cel-persona",
    telefono_auxiliar = "tel-aux-persona",
    telefono_casa = "tel-casa-persona",
    correo = "correo-persona",
    notas = "notas-personas"
  ) {
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.direccion = direccion;
    this.telefono_celular = telefono_celular;
    this.telefono_auxiliar = telefono_auxiliar;
    this.telefono_casa = telefono_casa;
    this.correo = correo;
    this.notas = notas;
  }
}

class Secreto {
  email = "email-secreto";
  pass = "pass-secreto";
  parroquia = "parroquia-secreto";
  notas = "notas-secreto";

  constructor(
    email = "email-secreto",
    pass = "pass-secreto",
    parroquia = "parroquia-secreto",
    notas = "notas-secreto"
  ) {
    this.email = email;
    this.pass = pass;
    this.parroquia = parroquia;
    this.notas = notas;
  }
}

class Tipo_Nicho {
  nombre = "nombre-tipo";
  capacidad = 1;
  precio = 1;
  notas = "notas-tipo";

  constructor(
    nombre = "nombre-tipo",
    capacidad = 1,
    precio = 1,
    notas = "notas-tipo"
  ) {
    nombre = "nombre-tipo";
    capacidad = 1;
    precio = 1;
    notas = "notas-tipo";
  }
}

class Parroquia {
  nombre = "nombre-parroquia";
  secciones = [new Seccion()];
  documentos = [new Documento()];
  tipos_nichos = [new Tipo_Nicho()];
  notas = "notas-parroquia";
}

class Documento {
  nombre = "nombre-documento";
  entregado = true;
  notas = "notas-documento";
}

class Seccion {
  nombre = "nombre-seccion";
  color = "color-seccion";
  orden = 1;
  nichos = [[new Nicho()]];
  notas = "notas-seccion";
}

class Vendedor extends Persona {
  activo = true;
  notas = "notas-vendedor";
}

class Nicho {
  placa = "placa-nicho";
  tipo = "tipo-nicho";
  precio = 1;
  capacidad = 1;
  unido_con = "0-0";
  expediente = new Expediente();
  vendedor = new Vendedor();
  cenizas = [new Ceniza()];
  pagos = [new Pago()];
  beneficiaros = [new Beneficiario()];
  notas = "notas-nicho";
}

class Beneficiario extends Persona {
  orden = 1;
  cancelado = true;
  nuevo_titular = true;
  titulo_entregado = true;
  fecha_entrega = "date"; // new Date();
  notas = "notas-beneficiario";
}

class Ceniza {
  nombres = "nombres-ceniza";
  apellidos = "apellidos-ceniza";
  fecha_defuncion = "date"; //new Date();
  documentos = [new Documento()];
  notas = "notas-ceniza";
}

class Expediente extends Persona {
  folio = "folio-expediente";
  titulo_entregado = true;
  fecha_entrega = "date"; //new Date();
  cancelado = true;
  notas = "notas-expediente";
}

class Pago {
  folio = "folio-pago";
  cargo = 1;
  fecha = "date"; //new Date();
  anticipo = true;
  notas = "notas-pago";
}

const secciones = {
  I: {
    nombre: "Piedad",
    color: "Celeste",
  },
  II: {
    nombre: "Paz",
    color: "Lima",
  },
  III: {
    nombre: "Bencidión",
    color: "Morado",
  },
  IV: {
    nombre: "Misericordia",
    color: "Rosa",
  },
  V: {
    nombre: "Fe",
    color: "Naranja",
  },
  VI: {
    nombre: "Esperanza",
    color: "Amarillo",
  },
};

const db = new database();
const stack = [];

function manageDisplay(object, onto = document.getElementById("showcase")) {
  stack.push({ object, onto });
  onto.replaceChildren();
  const starttime = new Date().getTime();

  do {
    const s = stack.shift();
    s.onto.appendChild(display(s.object));

    if (new Date().getTime() - starttime > 3000) break;
  } while (stack.length > 0);
}

function display(object) {
  if (!object) return document.createTextNode("...undefined");

  // Arreglos
  if (typeof object !== "string" && object.length !== undefined) {
    const fg = document.createDocumentFragment();
    const open = document.createTextNode("[");
    fg.appendChild(open);

    const ol = document.createElement("ol");
    for (let i = 0; i < object.length; i++) {
      const li = document.createElement("li");
      stack.push({ object: object[i], onto: li });
      ol.appendChild(li);
    }
    fg.appendChild(ol);

    const close = document.createElement("p");
    close.textContent = "]";
    fg.appendChild(close);

    return fg;
  }

  // Objetos
  if (typeof object === "object") {
    const fg = document.createDocumentFragment();
    const open = document.createElement("p");
    open.textContent = "{";
    fg.appendChild(open);

    const ul = document.createElement("ul");
    for (const key in object) {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(key.toString() + ": "));
      stack.push({ object: object[key], onto: li });

      ul.appendChild(li);
    }
    fg.appendChild(ul);

    const close = document.createElement("p");
    close.textContent = "}";
    fg.appendChild(close);

    return fg;
  }

  // Primitivos
  return document.createTextNode(object.toString?.());
}

function dummyInfo() {
  db.secretos = [new Secreto()];
}

document.addEventListener("DOMContentLoaded", () => {
  // const input_documents = document.getElementById("input-documents");

  dummyInfo();

  manageDisplay(db);
});
