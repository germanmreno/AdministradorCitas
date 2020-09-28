import UI from "./Clases/UI.js";
import Citas from "./Clases/Citas.js";

import {
    mascotaInput,
    propietarioInput,
    telefonoInput,
    fechaInput,
    horaInput,
    formulario,
    sintomasInput,
} from "./selectores.js";

const userInterface = new UI();
const administradorCitas = new Citas();

let editando = false;
export let DB;

const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: "",
};

export function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

export function nuevaCita(e) {
    e.preventDefault();

    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    if (
        mascota === "" ||
        propietario == "" ||
        telefono == "" ||
        fecha == "" ||
        hora == "" ||
        sintomas == ""
    ) {
        userInterface.imprimirAlerta("Todos los campos son obligatorios", "error");
        return;
    }

    if (editando) {
        userInterface.imprimirAlerta("Editado correctamente");

        const transaction = DB.transaction(["citas"], "readwrite");
        const objectStore = transaction.objectStore("citas");

        objectStore.put(citaObj);

        transaction.oncomplete = () => {
            formulario.querySelector('button[type="submit"]').textContent =
                "Crear cita";

            editando = false;
        };

        transaction.onerror = () => {
            console.log("Hubo un error");
        };
    } else {
        citaObj.id = Date.now();

        administradorCitas.agregarCita({ ...citaObj });

        const transaction = DB.transaction(["citas"], "readwrite");

        const objectStore = transaction.objectStore("citas");

        objectStore.add(citaObj);

        transaction.oncomplete = function () {
            console.log("Cita agregada");
            userInterface.imprimirAlerta("Se agregó correctamente");
        };
    }

    reiniciarObjeto();
    formulario.reset();
    userInterface.imprimirCitas();
}

export function reiniciarObjeto() {
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}

export function eliminarCita(id) {
    const transaction = DB.transaction(["citas"], "readwrite");

    const objectStore = transaction.objectStore("citas");

    objectStore.delete(id);

    transaction.oncomplete = () => {
        console.log(`Cita ${id} ha sido eliminada`);
        userInterface.imprimirCitas();
    };

    transaction.onerror = () => {
        console.log("Hubo un error");
    };
}

export function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent =
        "Guardar cambios";

    editando = true;
}

export function crearDB() {
    const crearDB = window.indexedDB.open("citas", 1);

    crearDB.onerror = function () {
        console.log("Hubo un error");
    };

    crearDB.onsuccess = function () {
        console.log("Base de datos creada");

        DB = crearDB.result;

        userInterface.imprimirCitas();
    };

    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore("citas", {
            keyPath: "id",
            autoIncrement: true,
        });

        objectStore.createIndex("mascota", "mascota", { unique: false });
        objectStore.createIndex("propietario", "propietario", { unique: false });
        objectStore.createIndex("telefono", "telefono", { unique: false });
        objectStore.createIndex("fecha", "fecha", { unique: false });
        objectStore.createIndex("hora", "hora", { unique: false });
        objectStore.createIndex("sintomas", "sintomas", { unique: false });
        objectStore.createIndex("id", "id", { unique: true });

        console.log("Base creada y lista");
    };
}
