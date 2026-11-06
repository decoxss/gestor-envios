document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formularioLogin");

    if (!formulario) return;

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const correo = document.getElementById("correoLogin").value.trim().toLowerCase();
        const password = document.getElementById("passwordLogin").value;
        const mensaje = document.getElementById("mensajeLogin");

        let usuarios;
        try {
            usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        } catch (error) {
            usuarios = [];
        }

        const usuario = usuarios.find(u =>
            u.correo === correo && u.password === password
        );

        if (!usuario) {
            mensaje.style.color = "#c0392b";
            mensaje.textContent = "Correo o contraseña incorrectos.";
            return;
        }

        // Crea la sesión guardando también el rol
        localStorage.setItem("sesionActiva", JSON.stringify({
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol || "cliente"
        }));

        // Si es administrador va directo al catálogo; si no, a donde quería ir o al inicio
        let destino = new URLSearchParams(location.search).get("redirigir");

        // Evita redirigir a páginas externas o inválidas
        if (!destino || !/^[\w-]+\.html$/.test(destino)) {
            destino = "index.html";
        }

        window.location.href = destino;
    });

});