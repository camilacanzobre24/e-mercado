document.addEventListener("DOMContentLoaded", function(){
    //Desafiate
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      window.location.href = 'login.html';
      return;
    //---------------------------------------------------------------------------
    } else{
        document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
        document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
        document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
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
    };
});
