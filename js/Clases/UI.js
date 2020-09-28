import { eliminarCita, cargarEdicion, DB } from "../funciones.js";
import { contenedorCitas } from "../selectores.js";
class UI {
    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

        if (tipo === "error") {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }

        divMensaje.textContent = mensaje;
        document
            .querySelector("#contenido")
            .insertBefore(divMensaje, document.querySelector(".agregar-cita"));

        setTimeout(() => divMensaje.remove(), 3000);
    }

    imprimirCitas() {
        this.refrescarHTML();

        const objectStore = DB.transaction("citas").objectStore("citas");

        objectStore.openCursor().onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {
                const {
                    mascota,
                    propietario,
                    telefono,
                    fecha,
                    hora,
                    sintomas,
                    id,
                } = cursor.value;

                const divCita = document.createElement("div");
                divCita.classList.add("cita", "p-3");
                divCita.dataset.id = id;

                const mascotaParrafo = document.createElement("h2");
                mascotaParrafo.classList.add("card-title", "font-weight-bolder");
                mascotaParrafo.textContent = mascota;

                const propietarioParrafo = document.createElement("p");
                propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

                const telefonoParrafo = document.createElement("p");
                telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

                const fechaParrafo = document.createElement("p");
                fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

                const horaParrafo = document.createElement("p");
                horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

                const sintomasParrafo = document.createElement("p");
                sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: </span> ${sintomas}`;

                const btnBorrar = document.createElement("button");
                btnBorrar.classList.add("btn", "btn-danger", "mr-2");
                btnBorrar.innerHTML = `Borrar <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>`;
                btnBorrar.onclick = () => {
                    eliminarCita(id);
                };

                const btnEditar = document.createElement("button");
                btnEditar.classList.add("btn", "btn-info");
                btnEditar.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>`;

                const cita = cursor.value;
                btnEditar.onclick = () => cargarEdicion(cita);

                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(btnBorrar);
                divCita.appendChild(btnEditar);

                contenedorCitas.appendChild(divCita);

                cursor.continue();
            }
        };
    }

    refrescarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

export default UI;
