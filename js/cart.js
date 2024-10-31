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

let productID = localStorage.getItem('productID');

if (productID) {
    fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
    .then(response => response.json())
    .then(productData => {
        // Mostrar la información del producto en la página
        document.getElementById('imagen-principal').src = `img/prod${productData.id}_1.jpg`;
        document.getElementById('nombre-producto').textContent = productData.name;
        document.getElementById('precio').textContent = `${productData.cost}`;
        document.getElementById('moneda').textContent = `${productData.currency}`;

        // Ocultar el mensaje de carrito vacío
        document.getElementById('mensaje-carrito-vacio').style.display = 'none';

        // Captura el campo de cantidad y el subtotal
        const cantidadInput = document.getElementById('cantidad');
        const subtotalElement = document.getElementById('subtotal');
        const precio = productData.cost;

        // Actualizar el subtotal al cambiar la cantidad
        cantidadInput.addEventListener('input', () => {
            const cantidad = parseInt(cantidadInput.value) || 0; // Valor 0 si está vacío o no es un número
            const subtotal = precio * cantidad;
            subtotalElement.textContent = `${subtotal}`;
        });
    })
    .catch(error => console.error('Error al cargar la información del producto:', error));
} else {
    // Mostrar el mensaje de carrito vacío
    document.getElementById('mensaje-carrito-vacio').style.display = 'block';
}


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
    
