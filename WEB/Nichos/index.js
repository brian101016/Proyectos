class database {
  parroquias = [new Parroquia()];
  secretos = [new Secreto()];
}

class Persona {
  nombres = "";
  apellidos = "";
  direccion = "";
  telefono_celular = "";
  telefono_auxiliar = "";
  telefono_casa = "";
  correo = "";
  notas = "";
}

class Secreto {
  email = "";
  pass = "";
  parroquia = "";
  notas = "";
}

class Tipo_Nicho {
  nombre = "";
  capacidad = 0;
  precio = 0;
  notas = "";
}

class Parroquia {
  nombre = "";
  secciones = [new Seccion()];
  documentos = [new Documento()];
  tipos_nichos = [new Tipo_Nicho()];
  notas = "";
}

class Documento {
  nombre = "";
  entregado = false;
  notas = "";
}

class Seccion {
  nombre = "";
  color = "";
  orden = 0;
  nichos = [[new Nicho()]];
  notas = "";
}

class Vendedor extends Persona {
  activo = false;
  notas = "";
}

class Nicho {
  placa = "";
  tipo = "";
  precio = 0;
  capacidad = 0;
  unido_con = "0-0";
  expediente = new Expediente();
  vendedor = new Vendedor();
  cenizas = [new Ceniza()];
  pagos = [new Pago()];
  beneficiaros = [new Beneficiario()];
  notas = "";
}

class Beneficiario extends Persona {
  orden = 0;
  cancelado = false;
  nuevo_titular = false;
  titulo_entregado = false;
  fecha_entrega = new Date();
  notas = "";
}

class Ceniza {
  nombres = "";
  apellidos = "";
  fecha_defuncion = new Date();
  documentos = [new Documento()];
  notas = "";
}

class Expediente extends Persona {
  folio = "";
  titulo_entregado = false;
  fecha_entrega = new Date();
  cancelado = false;
  notas = "";
}

class Pago {
  folio = "";
  cargo = 0;
  fecha = new Date();
  anticipo = false;
  notas = "";
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

document.addEventListener("DOMContentLoaded", () => {
  function display(object) {
    if (!object) return document.createTextNode("...undefined");

    // Arreglos
    if (object.length !== undefined) {
      const fg = document.createDocumentFragment();
      const open = document.createElement("p");
      open.textContent = "[";
      fg.appendChild(open);

      const ol = document.createElement("ol");
      for (const item of object) {
        const li = document.createElement("li");
        li.appendChild(display(item));
      }
      fg.appendChild(ol);

      const close = document.createElement("p");
      close.textContent = "]";
      fg.appendChild(close);
      return fg;
    }

    // Objetos
    if (object.notas !== undefined || object.secretos !== undefined) {
      const fg = document.createDocumentFragment();
      const open = document.createElement("p");
      open.textContent = "{";
      fg.appendChild(open);

      const ul = document.createElement("ul");
      for (const key in object) {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(key.toString() + ": "));
        li.appendChild(display(object[key]));
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

  document.getElementById("container").appendChild(display(db));
});
