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

        formulario.querySelector('button[type="submit"]').textContent = "Crear cita";

        editando = false;

        administradorCitas.editarCita({ ...citaObj });
    } else {
        citaObj.id = Date.now();

        administradorCitas.agregarCita({ ...citaObj });
        userInterface.imprimirAlerta("Se agregó correctamente");
    }

    reiniciarObjeto();
    formulario.reset();
    userInterface.imprimirCitas(administradorCitas);
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
    administradorCitas.borrarCita(id);
    userInterface.imprimirAlerta("La cita se eliminó correctamente");
    userInterface.imprimirCitas(administradorCitas);
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
