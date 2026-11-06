document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formularioRegistro");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correoRegistro").value.trim();
        const password = document.getElementById("passwordRegistro").value;
        const confirmar = document.getElementById("confirmarPassword").value;
        const mensaje = document.getElementById("mensajeRegistro");

        if (password !== confirmar) {
            mensaje.textContent = "Las contraseñas no coinciden.";
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        if (usuarios.some(usuario => usuario.correo === correo)) {
            mensaje.textContent = "Este correo ya está registrado.";
            return;
        }

        usuarios.push({
            nombre: nombre,
            correo: correo,
            password: password
        });

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mensaje.textContent = "Registro exitoso. Ahora puedes iniciar sesión.";

        formulario.reset();
    });

});