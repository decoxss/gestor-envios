function escapar(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

function buscarEnvio() {

    const campoGuia = document.getElementById("numeroGuia");
    const resultado = document.getElementById("informacionEnvio");

    const guia = campoGuia.value.trim();

    if (guia === "") {
        resultado.innerHTML =
            "<div class='datos-envio'>" +
            "<p>Escribe un número de guía.</p>" +
            "</div>";
        return;
    }

    const datos = localStorage.getItem("envio_" + guia);

    if (datos === null) {
        resultado.innerHTML =
            "<div class='datos-envio'>" +
            "<p>No se encontró ningún envío con ese número de guía.</p>" +
            "</div>";
        return;
    }

    const envio = JSON.parse(datos);

    const fecha = isNaN(new Date(envio.fecha))
        ? envio.fecha
        : new Date(envio.fecha).toLocaleString();

    const costo = envio.costo
        ? "<p><strong>Costo total:</strong> $" + Number(envio.costo).toFixed(2) + " MXN</p>"
        : "";

    resultado.innerHTML =
        "<div class='datos-envio'>" +

        "<h3>Información del envío</h3>" +

        "<p><strong>Número de guía:</strong> " + escapar(envio.guia) + "</p>" +
        "<p><strong>Remitente:</strong> " + escapar(envio.remitente) + "</p>" +
        "<p><strong>Teléfono del remitente:</strong> " + escapar(envio.telefonoRemitente) + "</p>" +
        "<p><strong>Destinatario:</strong> " + escapar(envio.destinatario) + "</p>" +
        "<p><strong>Teléfono del destinatario:</strong> " + escapar(envio.telefonoDestinatario) + "</p>" +
        "<p><strong>Origen:</strong> " + escapar(envio.origen) + "</p>" +
        "<p><strong>Destino:</strong> " + escapar(envio.destino) + "</p>" +
        "<p><strong>Tipo de paquete:</strong> " + escapar(envio.tipo) + "</p>" +
        "<p><strong>Peso:</strong> " + escapar(envio.peso) + " kg</p>" +
        "<p><strong>Tipo de entrega:</strong> " + escapar(envio.entrega) + "</p>" +
        costo +
        "<p><strong>Fecha de registro:</strong> " + escapar(fecha) + "</p>" +
        "<p><strong>Estado actual:</strong> " + escapar(envio.estado) + "</p>" +

        "<div class='historial'>" +

        "<h3>Historial del envío</h3>" +

        "<div class='estado'>" +
        "<strong>Registrado</strong>" +
        "<p>El paquete fue registrado.</p>" +
        "</div>" +

        "<div class='estado'>" +
        "<strong>En tránsito</strong>" +
        "<p>El paquete se encuentra en camino.</p>" +
        "</div>" +

        "<div class='estado'>" +
        "<strong>En sucursal</strong>" +
        "<p>El paquete llegó a una sucursal.</p>" +
        "</div>" +

        "<div class='estado'>" +
        "<strong>En reparto</strong>" +
        "<p>El paquete salió para ser entregado.</p>" +
        "</div>" +

        "<div class='estado'>" +
        "<strong>Entregado</strong>" +
        "<p>El paquete fue entregado al destinatario.</p>" +
        "</div>" +

        "</div>" +

        "</div>";
}