document.addEventListener("DOMContentLoaded", function () {
    const tabla = document.getElementById("tablaEnvios");
    const mensaje = document.getElementById("mensajeCatalogo");

    if (!tabla) return;

    const ejemplos = [
        {
            guia: "ENV001",
            remitente: "Juan Pérez",
            destinatario: "Ana López",
            destino: "Tuxtla Gutiérrez",
            estado: "En tránsito"
        },
        {
            guia: "ENV002",
            remitente: "Carlos Ruiz",
            destinatario: "María Díaz",
            destino: "San Cristóbal",
            estado: "Entregado"
        }
    ];

    const enviosGuardados = Object.keys(localStorage)
        .filter(clave => clave.startsWith("envio_"))
        .map(clave => JSON.parse(localStorage.getItem(clave)))
        .filter(envio => envio !== null);

    const envios = [
        ...ejemplos,
        ...enviosGuardados
    ];

    envios.forEach(envio => {
        const fila = document.createElement("tr");

        [
            envio.guia || "Sin guía",
            envio.remitente || "No disponible",
            envio.destinatario || "No disponible",
            envio.destino || "No disponible",
            envio.estado || "Registrado"
        ].forEach(dato => {
            const celda = document.createElement("td");
            celda.textContent = dato;
            celda.style.padding = "12px";
            celda.style.borderBottom = "1px solid #ddd";
            fila.appendChild(celda);
        });

        tabla.appendChild(fila);
    });

    mensaje.textContent =
        "Total de envíos mostrados: " + envios.length;
});
