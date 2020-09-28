class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];

        console.log(this.citas);
    }

    borrarCita(id) {
        this.citas = this.citas.filter((cita) => cita.id !== id);
    }

    editarCita(cita) {
        const { id } = cita;

        const indexCita = this.citas.findIndex((cita) => cita.id == id);

        this.citas[indexCita] = cita;

        console.log(this.citas);
    }
}

export default Citas;
