// ===============================
// Manejo de sesión y roles
// ===============================
const PAGINAS_PUBLICAS = ["login.html", "registro.html"];
const PAGINAS_ADMIN = ["catalago.html", "catalogo.html"];

// Cuenta de administrador (se crea sola la primera vez)
const ADMIN_POR_DEFECTO = {
    nombre: "Administrador",
    correo: "admin@piggeonexpress.com",
    password: "Admin#2026",
    rol: "admin"
};

function crearAdminSiNoExiste() {
    let usuarios;
    try {
        usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    } catch (error) {
        usuarios = [];
    }

    if (!usuarios.some(u => u.correo === ADMIN_POR_DEFECTO.correo)) {
        usuarios.push(ADMIN_POR_DEFECTO);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
}

function obtenerSesion() {
    try {
        return JSON.parse(localStorage.getItem("sesionActiva"));
    } catch (error) {
        return null;
    }
}

function esAdmin() {
    const sesion = obtenerSesion();
    return !!sesion && sesion.rol === "admin";
}

function paginaActual() {
    return location.pathname.split("/").pop() || "index.html";
}

function cerrarSesion() {
    localStorage.removeItem("sesionActiva");
    window.location.href = "login.html";
}

// Compatibilidad: ya se ejecuta sola
function protegerPagina() {}

crearAdminSiNoExiste();

// Revisión de acceso (antes de mostrar la página)
(function () {
    const pagina = paginaActual();
    const esPublica = PAGINAS_PUBLICAS.includes(pagina);
    const sesion = obtenerSesion();

    if (!sesion && !esPublica) {
        window.location.replace("login.html?redirigir=" + encodeURIComponent(pagina));
        return;
    }

    if (sesion && esPublica) {
        window.location.replace("index.html");
        return;
    }

    // Catálogo: solo administrador
    if (PAGINAS_ADMIN.includes(pagina) && !esAdmin()) {
        alert("No tienes permiso para ver esta página.");
        window.location.replace("index.html");
    }
})();

// Oculta el catálogo del menú si no es admin
function ajustarMenuPorRol() {
    if (esAdmin()) return;

    PAGINAS_ADMIN.forEach(function (pagina) {
        document.querySelectorAll('a[href="' + pagina + '"]').forEach(a => a.remove());
    });
}

// Etiqueta de sesión en la esquina
function mostrarIndicadorSesion() {
    const sesion = obtenerSesion();
    if (!sesion) return;

    document.querySelectorAll('.menu a[href="login.html"]').forEach(a => a.remove());

    const caja = document.createElement("div");
    caja.style.cssText =
        "position:fixed; bottom:20px; right:20px; z-index:9999;" +
        "background:#fff; color:#333; border:2px solid #2e9e4f;" +
        "border-radius:30px; padding:8px 16px; font-size:14px;" +
        "box-shadow:0 2px 8px rgba(0,0,0,.25); display:flex;" +
        "align-items:center; gap:10px; font-family:Arial,sans-serif;";

    const punto = document.createElement("span");
    punto.style.cssText =
        "width:10px; height:10px; border-radius:50%; background:#2e9e4f; display:inline-block;";

    const texto = document.createElement("span");
    texto.textContent = "Sesión activa: " + sesion.nombre +
        (sesion.rol === "admin" ? " (Administrador)" : "");

    const salir = document.createElement("a");
    salir.href = "#";
    salir.textContent = "Cerrar sesión";
    salir.style.cssText = "color:#c0392b; font-weight:bold; text-decoration:none;";
    salir.addEventListener("click", function (e) {
        e.preventDefault();
        cerrarSesion();
    });

    caja.appendChild(punto);
    caja.appendChild(texto);
    caja.appendChild(salir);
    document.body.appendChild(caja);
}

document.addEventListener("DOMContentLoaded", function () {
    ajustarMenuPorRol();
    mostrarIndicadorSesion();
});