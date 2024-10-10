let usuario = localStorage.getItem('usuario');
    if (usuario) {
        document.getElementById('nombre-usuario').textContent = `${usuario}`;
    } else {
        window.location.href = 'login.html';
    }
    document.getElementById('cerrar-sesion').addEventListener('click', function() {
        // Borra el usuario del localStorage
        localStorage.removeItem('usuario');
        // Redirige a la pantalla de inicio de sesión
        window.location.href = 'login.html';
    });