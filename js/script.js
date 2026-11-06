// ===============================
// Constantes
// ===============================
export const TARIFA_BASE = 60;
export const COSTO_TIPO = { Sobre: 20, Caja: 25, Paquete: 40 };
export const COSTO_POR_KG = 18;
export const COSTO_DOMICILIO = 50;

export const ESTADOS = {
    REGISTRADO: "Registrado",
    EN_TRANSITO: "En tránsito",
    ENTREGADO: "Entregado"
};


// ===============================
// Clase Envio
// ===============================
export class Envio {
    constructor(datos) {
        this.guia = datos.guia || Envio.generarGuia();
        this.folio = datos.folio || Envio.generarFolio();

        this.remitente = datos.remitente;
        this.telefonoRemitente = datos.telefonoRemitente;
        this.correoRemitente = datos.correoRemitente;
        this.direccionRemitente = datos.direccionRemitente;
        this.cpRemitente = datos.cpRemitente;

        this.destinatario = datos.destinatario;
        this.telefonoDestinatario = datos.telefonoDestinatario;
        this.correoDestinatario = datos.correoDestinatario;
        this.direccionDestinatario = datos.direccionDestinatario;
        this.cpDestinatario = datos.cpDestinatario;

        this.origen = datos.origen;
        this.destino = datos.destino;

        this.tipo = datos.tipo;
        this.descripcion = datos.descripcion;
        this.peso = Number(datos.peso);

        this.largo = Number(datos.largo);
        this.ancho = Number(datos.ancho);
        this.alto = Number(datos.alto);

        this.entrega = datos.entrega;

        this.costo = datos.costo || 0;

        this.estado = datos.estado || ESTADOS.REGISTRADO;
        this.ubicacion = datos.ubicacion || "Pendiente de recepción";

        // Se guarda en formato ISO; al mostrarla usa: new Date(envio.fecha).toLocaleString()
        this.fecha = datos.fecha || new Date().toISOString();
    }

    // Genera una guía que no exista todavía en localStorage
    static generarGuia() {
        let guia;
        do {
            guia = "ENV-" + Math.floor(Math.random() * 900000 + 100000);
        } while (Envio.buscar(guia) !== null);
        return guia;
    }

    // Genera un folio aleatorio que no se repita en ningún envío guardado
    static generarFolio() {
        const folios = new Set();

        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            if (clave && clave.startsWith("envio_")) {
                try {
                    const envio = JSON.parse(localStorage.getItem(clave));
                    if (envio && envio.folio) {
                        folios.add(envio.folio);
                    }
                } catch (error) {
                    // ignora datos dañados
                }
            }
        }

        let folio;
        do {
            folio = "FOL-" + Math.floor(Math.random() * 900000 + 100000);
        } while (folios.has(folio));

        return folio;
    }

    // Único lugar donde se calcula el costo
    static calcular(tipo, peso, entrega) {
        const costoPaquete = (COSTO_TIPO[tipo] || 0) + (Number(peso) || 0) * COSTO_POR_KG;
        const costoEntrega = entrega === "Domicilio" ? COSTO_DOMICILIO : 0;

        return {
            tarifaBase: TARIFA_BASE,
            costoPaquete,
            costoEntrega,
            total: TARIFA_BASE + costoPaquete + costoEntrega
        };
    }

    calcularCosto() {
        this.costo = Envio.calcular(this.tipo, this.peso, this.entrega).total;
        return this.costo;
    }

    guardar() {
        localStorage.setItem("envio_" + this.guia, JSON.stringify(this));
    }

    static buscar(guia) {
        const datos = localStorage.getItem("envio_" + guia);

        if (datos === null) {
            return null;
        }

        try {
            return JSON.parse(datos);
        } catch (error) {
            return null;
        }
    }
}


// ===============================
// Utilidades
// ===============================

// Evita XSS al insertar texto del usuario en innerHTML
function escapar(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

function soloDigitos(valor) {
    return String(valor).replace(/[\s-]/g, "");
}

function validar(datos) {
    const errores = [];

    if (!/^\d{10}$/.test(soloDigitos(datos.telefonoRemitente))) {
        errores.push("El teléfono del remitente debe tener 10 dígitos.");
    }
    if (!/^\d{10}$/.test(soloDigitos(datos.telefonoDestinatario))) {
        errores.push("El teléfono del destinatario debe tener 10 dígitos.");
    }
    if (!/^\d{5}$/.test(datos.cpRemitente.trim())) {
        errores.push("El código postal del remitente debe tener 5 números.");
    }
    if (!/^\d{5}$/.test(datos.cpDestinatario.trim())) {
        errores.push("El código postal del destinatario debe tener 5 números.");
    }

    const peso = Number(datos.peso);
    if (!(peso > 0)) {
        errores.push("El peso debe ser mayor a 0.");
    } else if (peso > 70) {
        errores.push("El peso máximo permitido es de 70 kg.");
    }

    ["largo", "ancho", "alto"].forEach(medida => {
        if (!(Number(datos[medida]) > 0)) {
            errores.push("La medida '" + medida + "' debe ser mayor a 0.");
        }
    });

    if (!datos.tipo) {
        errores.push("Selecciona el tipo de paquete.");
    }
    if (!datos.entrega) {
        errores.push("Selecciona el tipo de entrega.");
    }

    return errores;
}


// ===============================
// Formulario
// ===============================
const formulario = document.getElementById("formularioEnvio");

if (formulario) {

    const resultado = document.getElementById("resultado");
    const entrega = document.getElementById("entrega");
    const informacionBodega = document.getElementById("informacionBodega");

    // Para lectores de pantalla
    resultado.setAttribute("aria-live", "polite");

    function actualizarCosto() {
        const tipo = document.getElementById("tipo").value;
        const peso = document.getElementById("peso").value;

        const c = Envio.calcular(tipo, peso, entrega.value);

        document.getElementById("tarifaBase").textContent = "$" + c.tarifaBase.toFixed(2);
        document.getElementById("costoPaquete").textContent = "$" + c.costoPaquete.toFixed(2);
        document.getElementById("costoEntrega").textContent = "$" + c.costoEntrega.toFixed(2);
        document.getElementById("total").textContent = c.total.toFixed(2);
    }

    ["peso", "tipo", "entrega"].forEach(id => {
        const campo = document.getElementById(id);
        campo.addEventListener("input", actualizarCosto);
        campo.addEventListener("change", actualizarCosto);
    });

    entrega.addEventListener("change", function () {
        informacionBodega.style.display = entrega.value === "Bodega" ? "block" : "none";
    });

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        const datos = {
            remitente: document.getElementById("remitente").value.trim(),
            telefonoRemitente: document.getElementById("telefonoRemitente").value,
            correoRemitente: document.getElementById("correoRemitente").value.trim(),
            direccionRemitente: document.getElementById("direccionRemitente").value.trim(),
            cpRemitente: document.getElementById("cpRemitente").value,

            destinatario: document.getElementById("destinatario").value.trim(),
            telefonoDestinatario: document.getElementById("telefonoDestinatario").value,
            correoDestinatario: document.getElementById("correoDestinatario").value.trim(),
            direccionDestinatario: document.getElementById("direccionDestinatario").value.trim(),
            cpDestinatario: document.getElementById("cpDestinatario").value,

            origen: document.getElementById("origen").value.trim(),
            destino: document.getElementById("destino").value.trim(),

            tipo: document.getElementById("tipo").value,
            descripcion: document.getElementById("descripcion").value.trim(),
            peso: document.getElementById("peso").value,

            largo: document.getElementById("largo").value,
            ancho: document.getElementById("ancho").value,
            alto: document.getElementById("alto").value,

            entrega: entrega.value,

            ubicacion: entrega.value === "Bodega"
                ? "Pendiente de recepción en Plaza Verona"
                : "Pendiente de recolección"
        };

        // Validaciones
        const errores = validar(datos);

        if (errores.length > 0) {
            resultado.innerHTML =
                "<h3>Revisa los siguientes datos:</h3><ul>" +
                errores.map(e => "<li>" + escapar(e) + "</li>").join("") +
                "</ul>";
            resultado.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        // Crear, calcular y guardar
        const envio = new Envio(datos);
        const costo = envio.calcularCosto();

        try {
            envio.guardar();
        } catch (error) {
            resultado.innerHTML =
                "<h3>No se pudo guardar el envío.</h3>" +
                "<p>Es posible que el almacenamiento del navegador esté lleno o bloqueado.</p>";
            return;
        }

        const aviso = envio.entrega === "Domicilio"
            ? "<p>Recogeremos tu paquete en: <strong>" + escapar(envio.direccionRemitente) + "</strong></p>"
            : "<p>Recuerda llevar tu paquete a nuestra bodega en Plaza Verona.</p>";

        resultado.innerHTML = `
            <h3>¡Envío registrado correctamente!</h3>

            <p><strong>Folio:</strong> ${escapar(envio.folio)}</p>
            <p><strong>Número de guía:</strong> <span id="guiaGenerada">${escapar(envio.guia)}</span></p>
            <p><strong>Remitente:</strong> ${escapar(envio.remitente)}</p>
            <p><strong>Destinatario:</strong> ${escapar(envio.destinatario)}</p>
            <p><strong>Destino:</strong> ${escapar(envio.destino)}</p>
            <p><strong>Costo total:</strong> $${costo.toFixed(2)} MXN</p>
            <p><strong>Estado:</strong> ${escapar(envio.estado)}</p>
            <p><strong>Ubicación:</strong> ${escapar(envio.ubicacion)}</p>

            ${aviso}

            <p>Guarda tu número de guía para consultar tu paquete.</p>

            <button type="button" class="btn" id="copiarGuia">Copiar guía</button>
            <a class="btn" href="seguimiento.html">Ir a seguimiento</a>
        `;

        document.getElementById("copiarGuia").addEventListener("click", function () {
            navigator.clipboard.writeText(envio.guia).then(() => {
                this.textContent = "¡Guía copiada!";
            });
        });

        formulario.reset();
        informacionBodega.style.display = "none";
        actualizarCosto();

        resultado.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    actualizarCosto();
}