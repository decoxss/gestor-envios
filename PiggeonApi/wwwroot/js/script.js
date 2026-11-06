document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formularioEnvio");

    if (formulario) {

        formulario.addEventListener("submit", function (event) {
            event.preventDefault();

            const guia = "ENV-" + Math.floor(Math.random() * 900000 + 100000);

            const envio = {
                guia: guia,
                remitente: document.getElementById("remitente").value,
                telefonoRemitente: document.getElementById("telefonoRemitente").value,
                destinatario: document.getElementById("destinatario").value,
                telefonoDestinatario: document.getElementById("telefonoDestinatario").value,
                origen: document.getElementById("origen").value,
                destino: document.getElementById("destino").value,
                tipo: document.getElementById("tipo").value,
                peso: document.getElementById("peso").value,
                entrega: document.getElementById("entrega").value,
                estado: "Registrado",
                fecha: new Date().toLocaleDateString()
            };

            localStorage.setItem("envio_" + guia, JSON.stringify(envio));

            const resultado = document.getElementById("resultado");

            resultado.innerHTML =
                "<div class='datos-envio'>" +
                "<h3>Envío registrado correctamente</h3>" +
                "<p><strong>Número de guía:</strong> " + guia + "</p>" +
                "<p>Guarda este número para consultar tu envío.</p>" +
                "<a href='seguimiento.html' class='btn'>Consultar envío</a>" +
                "</div>";

            formulario.reset();
        });
    }

});


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

    resultado.innerHTML =
        "<div class='datos-envio'>" +

        "<h3>Información del envío</h3>" +

        "<p><strong>Número de guía:</strong> " + envio.guia + "</p>" +

        "<p><strong>Remitente:</strong> " + envio.remitente + "</p>" +

        "<p><strong>Teléfono del remitente:</strong> " +
        envio.telefonoRemitente + "</p>" +

        "<p><strong>Destinatario:</strong> " +
        envio.destinatario + "</p>" +

        "<p><strong>Teléfono del destinatario:</strong> " +
        envio.telefonoDestinatario + "</p>" +

        "<p><strong>Origen:</strong> " + envio.origen + "</p>" +

        "<p><strong>Destino:</strong> " + envio.destino + "</p>" +

        "<p><strong>Tipo de paquete:</strong> " +
        envio.tipo + "</p>" +

        "<p><strong>Peso:</strong> " +
        envio.peso + " kg</p>" +

        "<p><strong>Tipo de entrega:</strong> " +
        envio.entrega + "</p>" +

        "<p><strong>Fecha de registro:</strong> " +
        envio.fecha + "</p>" +

        "<p><strong>Estado actual:</strong> " +
        envio.estado + "</p>" +

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