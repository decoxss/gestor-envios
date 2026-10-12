
export class Envio {
    constructor(datos) {
        this.guia = datos.guia || (
            "ENV-" + Math.floor(Math.random() * 900000 + 100000)
        );

        this.remitente = datos.remitente;
        this.telefonoRemitente = datos.telefonoRemitente;
        this.destinatario = datos.destinatario;
        this.telefonoDestinatario = datos.telefonoDestinatario;
        this.origen = datos.origen;
        this.destino = datos.destino;
        this.tipo = datos.tipo;
        this.peso = datos.peso;
        this.entrega = datos.entrega;
        this.estado = datos.estado || "Registrado";
        this.fecha = datos.fecha || new Date().toLocaleDateString();
    }

    guardar() {
        localStorage.setItem(
            "envio_" + this.guia,
            JSON.stringify(this)
        );
    }

    static buscar(guia) {
        const datos = localStorage.getItem("envio_" + guia);

        if (datos === null) {
            return null;
        }

        return JSON.parse(datos);
    }
}
