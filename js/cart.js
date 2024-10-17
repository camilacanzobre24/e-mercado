let usuario = localStorage.getItem('usuario');
if (usuario) {
    document.getElementById('nombre-usuario').textContent = `${usuario}`;
} else {
    window.location.href = 'login.html';
}

document.getElementById('cerrar-sesion').addEventListener('click', function() {
    // Borra todos los datos relevantes del localStorage
    localStorage.removeItem('usuario');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('nombre');
    localStorage.removeItem('segundoNombre');
    localStorage.removeItem('apellido');
    localStorage.removeItem('segundoApellido');
    localStorage.removeItem('telefono');
    localStorage.removeItem('profileImage');

    // Redirige a la pantalla de inicio de sesión
    window.location.href = 'login.html';
});

    document.addEventListener("DOMContentLoaded", () => {
        // Verificar si el tema está guardado en localStorage
        const temaGuardado = localStorage.getItem("tema");
    
        // Aplicar el tema al cargar la página
        if (temaGuardado === "oscuro") {
            document.querySelector("body").setAttribute("data-bs-theme", "dark");
        } else {
            document.querySelector("body").setAttribute("data-bs-theme", "light");
        }
    
        console.log("Tema aplicado:", document.querySelector("body").getAttribute("data-bs-theme"));
    });
    