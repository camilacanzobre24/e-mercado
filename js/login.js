/* Control de datos vacíos */
function showAlertError(message) {
    const alertDanger = document.getElementById("alert-danger");
    alertDanger.querySelector('p').innerText = message; // Cambia el mensaje de error
    alertDanger.classList.add("show");
}

document.getElementById('ingresar').addEventListener('click', function () {
    let usuario = document.getElementById("usuario").value.trim();
    let password = document.getElementById("password").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para email

    // Verifica si el campo de usuario está vacío
    if (!usuario) {
        showAlertError("El campo de usuario no puede estar vacío.");
        return;
    }

    // Verifica si el usuario cumple con el formato de email
    if (!emailPattern.test(usuario)) {
        showAlertError("Por favor, ingrese un correo electrónico válido.");
        return;
    }

    // Verifica si el campo de contraseña está vacío
    if (!password) {
        showAlertError("El campo de contraseña no puede estar vacío.");
        return;
    }

    // Almacena los datos en localStorage y redirige
    localStorage.setItem('usuario', usuario);
    localStorage.setItem('isAuthenticated', "true"); /* Desafiate */
    window.location.href = "index.html";
});

