document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formularioRegistro");
    if (!formulario) return;

    const campoCorreo = document.getElementById("correoRegistro");
    const campoPassword = document.getElementById("passwordRegistro");
    const mensaje = document.getElementById("mensajeRegistro");

    // ---------- Avisos creados desde JS ----------
    const avisoCorreo = document.createElement("small");
    avisoCorreo.style.cssText = "display:block; margin:-8px 0 12px; font-weight:bold;";
    campoCorreo.insertAdjacentElement("afterend", avisoCorreo);

    const avisoPassword = document.createElement("small");
    avisoPassword.style.cssText = "display:block; margin:-8px 0 12px; font-weight:bold;";
    campoPassword.insertAdjacentElement("afterend", avisoPassword);

    // ---------- Utilidades ----------
    function obtenerUsuarios() {
        try {
            return JSON.parse(localStorage.getItem("usuarios")) || [];
        } catch (error) {
            return [];
        }
    }

    function correoExiste(correo) {
        return obtenerUsuarios().some(u => u.correo === correo);
    }

    // ---------- Contraseña ----------
    const CONTRASENAS_COMUNES = [
        "12345678", "123456789", "1234567890", "87654321", "11111111",
        "00000000", "password", "password1", "contrasena", "contraseña",
        "qwerty123", "abc12345", "admin123", "iloveyou", "12341234"
    ];

    function esSecuencia(texto) {
        const t = texto.toLowerCase();
        const secuencias = [
            "0123456789", "9876543210",
            "abcdefghijklmnopqrstuvwxyz", "zyxwvutsrqponmlkjihgfedcba",
            "qwertyuiop", "asdfghjkl", "zxcvbnm"
        ];
        return secuencias.some(s => s.includes(t));
    }

    function evaluarPassword(password) {
        if (password.length === 0) {
            return { fuerte: false, texto: "" };
        }
        if (password.length < 8) {
            return { fuerte: false, texto: "Débil: usa al menos 8 caracteres." };
        }
        if (CONTRASENAS_COMUNES.includes(password.toLowerCase())) {
            return { fuerte: false, texto: "Débil: es una contraseña muy común." };
        }
        if (/^(.)\1+$/.test(password)) {
            return { fuerte: false, texto: "Débil: no repitas el mismo carácter." };
        }
        if (esSecuencia(password)) {
            return { fuerte: false, texto: "Débil: no uses secuencias como 12345678 o abcdefgh." };
        }

        let tipos = 0;
        if (/[a-z]/.test(password)) tipos++;
        if (/[A-Z]/.test(password)) tipos++;
        if (/[0-9]/.test(password)) tipos++;
        if (/[^A-Za-z0-9]/.test(password)) tipos++;

        if (tipos < 3) {
            return {
                fuerte: false,
                texto: "Débil: combina mayúsculas, minúsculas, números o símbolos."
            };
        }

        return { fuerte: true, texto: "Fuerte" };
    }

    // ---------- Revisión del correo en vivo ----------
    function revisarCorreo() {
        const correo = campoCorreo.value.trim().toLowerCase();

        if (correo === "") {
            avisoCorreo.textContent = "";
            return;
        }

        if (correoExiste(correo)) {
            avisoCorreo.textContent = "Este correo ya está registrado. Usa otro o inicia sesión.";
            avisoCorreo.style.color = "#c0392b";
        } else {
            avisoCorreo.textContent = "Correo disponible";
            avisoCorreo.style.color = "#2e9e4f";
        }
    }

    // ---------- Revisión de la contraseña en vivo ----------
    function revisarPassword() {
        const resultado = evaluarPassword(campoPassword.value);
        avisoPassword.textContent = resultado.texto;
        avisoPassword.style.color = resultado.fuerte ? "#2e9e4f" : "#c0392b";
    }

    campoCorreo.addEventListener("input", revisarCorreo);
    campoCorreo.addEventListener("blur", revisarCorreo);
    campoPassword.addEventListener("input", revisarPassword);

    // ---------- Envío ----------
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        mensaje.style.color = "#c0392b";

        const nombre = document.getElementById("nombre").value.trim();
        const correo = campoCorreo.value.trim().toLowerCase();
        const password = campoPassword.value;
        const confirmar = document.getElementById("confirmarPassword").value;

        if (correoExiste(correo)) {
            mensaje.textContent = "Este correo ya está registrado. No se puede crear otra cuenta con el mismo correo.";
            revisarCorreo();
            return;
        }

        const fuerza = evaluarPassword(password);
        if (!fuerza.fuerte) {
            mensaje.textContent = "Tu contraseña es débil. " + fuerza.texto.replace("Débil: ", "");
            return;
        }

        if (password !== confirmar) {
            mensaje.textContent = "Las contraseñas no coinciden.";
            return;
        }

        const usuarios = obtenerUsuarios();

        // Toda cuenta creada desde el registro es de tipo cliente
        usuarios.push({
            nombre: nombre,
            correo: correo,
            password: password,
            rol: "cliente"
        });

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mensaje.style.color = "#2e9e4f";
        mensaje.textContent = "Registro exitoso. Redirigiendo al inicio de sesión...";

        formulario.reset();
        avisoCorreo.textContent = "";
        avisoPassword.textContent = "";

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1500);
    });

});