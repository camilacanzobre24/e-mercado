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
    }
    };
});
