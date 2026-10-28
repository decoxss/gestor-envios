const formulario = document.getElementById("formularioLogin");

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensajeLogin");

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(usuario =>
        usuario.correo === correo &&
        usuario.password === password
    );

    if (
        (correo === "admin@envios.com" && password === "123456") ||
        usuario
    ) {
        sessionStorage.setItem("sesionActiva", "true");

        window.location.href = "index.html";
    } else {
        mensaje.textContent = "Correo o contraseña incorrectos.";
    }
});
