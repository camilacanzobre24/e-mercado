// Verifica si hay un usuario autenticado
let usuario = localStorage.getItem('usuario');
if (usuario) {
    document.getElementById('nombre-usuario').textContent = `${usuario}`;
} else {
    window.location.href = 'login.html';
}

// Evento para cerrar sesión
document.getElementById('cerrar-sesion').addEventListener('click', function() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('isAuthenticated');
    // Otras variables de sesión que desees limpiar
    window.location.href = 'login.html';
});

// Función para agregar un producto al carrito
function agregarProductoAlCarrito(productID) {
    let productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito')) || [];
    
    // Verificar si el producto ya existe en el carrito
    if (!productosEnCarrito.includes(productID)) {
        // Si no existe, agrega el nuevo productID al array
        productosEnCarrito.push(productID);
        // Guarda el array actualizado en el localStorage
        localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));
        
        // Establecer la cantidad predeterminada como 1
        localStorage.setItem(`cantidad-${productID}`, 1);
    }

    // Actualiza el badge del carrito
    actualizarBadgeCarrito();
}

// Función para actualizar el badge del carrito
function actualizarBadgeCarrito() {
    const productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito')) || [];
    let totalCantidad = 0;

    // Suma las cantidades de los productos
    productosEnCarrito.forEach(productID => {
        const cantidadGuardada = localStorage.getItem(`cantidad-${productID}`) || 1; // Cambiado a 1 como predeterminado
        totalCantidad += parseInt(cantidadGuardada) || 0;
    });

    // Actualiza el badge con el total de cantidades
    document.getElementById('carrito-badge').textContent = totalCantidad;
}

// Cargar los productos al abrir la página de carrito
document.addEventListener("DOMContentLoaded", () => {
    actualizarBadgeCarrito(); // Actualiza el badge al cargar la página

    const productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito')) || [];
    const carritoContainer = document.getElementById('carritoContainer');

    if (productosEnCarrito.length > 0) {
        productosEnCarrito.forEach(productID => {
            fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
                .then(response => response.json())
                .then(productData => {
                    // Aquí verificamos si hay una cantidad guardada, de lo contrario, usamos 1
                    const cantidadGuardada = localStorage.getItem(`cantidad-${productID}`) || 1;

                    const productoHTML = `
                        <div id="producto-${productID}" class="row product-item justify-content-center align-items-center mb-3">
                            <div class="col-3 d-flex align-items-center justify-content-center">
                                <img src="img/prod${productData.id}_1.jpg" alt="Imagen del producto" class="img-fluid" style="width: 200px; height: 150px;" />
                            </div>
                            <div class="col-2 d-flex align-items-center justify-content-center">
                                <p>${productData.name}</p>
                            </div>
                            <div class="col-1 d-flex align-items-center justify-content-center">
                                <p>${productData.currency}</p>
                            </div>
                            <div class="col-2 d-flex align-items-center justify-content-center">
                                <p>${productData.cost}</p>
                            </div>
                            <div class="col-1 d-flex align-items-center justify-content-center">
                                <input type="number" class="form-control cantidad" data-precio="${productData.cost}" value="${cantidadGuardada}" min="1" />
                            </div>
                            <div class="col-2 d-flex align-items-center justify-content-center">
                                <p class="subtotal">${(cantidadGuardada * productData.cost).toFixed(2)}</p>
                            </div>
                            <div class="col-1 d-flex align-items-center justify-content-center">
                                <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${productID}')">X</button>
                            </div>
                        </div>
                    `;
                    carritoContainer.insertAdjacentHTML('beforeend', productoHTML);
                })
                .catch(error => console.error('Error al cargar la información del producto:', error));
        });
    } else {
        document.getElementById('mensaje-carrito-vacio').style.display = 'block';
    }

    // Actualizar el subtotal y el badge cada vez que cambia la cantidad
    document.addEventListener('input', (event) => {
        if (event.target.classList.contains('cantidad')) {
            const cantidad = parseInt(event.target.value) || 0;
            const precio = parseFloat(event.target.getAttribute('data-precio'));
            const subtotal = cantidad * precio;

            // Actualiza el subtotal correspondiente
            event.target.closest('.product-item').querySelector('.subtotal').textContent = subtotal.toFixed(2);

            // Guarda la cantidad en localStorage
            const productID = event.target.closest('.product-item').id.split('-')[1];
            localStorage.setItem(`cantidad-${productID}`, cantidad); // Guarda la cantidad ingresada

            // Actualiza el badge con la suma total de las cantidades
            actualizarBadgeCarrito(); // Llama a la función para actualizar el badge
        }
    });
});

// Función para eliminar un producto del carrito
function eliminarProducto(productID) {
    let productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito')) || [];
    // Filtra el array para eliminar el producto seleccionado
    productosEnCarrito = productosEnCarrito.filter(id => id !== productID);
    // Guarda el array actualizado en el localStorage
    localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));

    // Elimina el producto del DOM
    const productoDiv = document.getElementById(`producto-${productID}`);
    if (productoDiv) {
        productoDiv.remove();
    }

    // Borra la cantidad guardada en localStorage
    localStorage.removeItem(`cantidad-${productID}`);

    if (productosEnCarrito.length === 0) {
        document.getElementById('mensaje-carrito-vacio').style.display = 'block';
    }

    // Actualizar el badge al eliminar un producto
    actualizarBadgeCarrito();
}

// Función para aplicar el tema guardado
document.addEventListener("DOMContentLoaded", () => {
    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "oscuro") {
        document.querySelector("body").setAttribute("data-bs-theme", "dark");
    } else {
        document.querySelector("body").setAttribute("data-bs-theme", "light");
    }

    // Actualizar el badge al cargar la página
    actualizarBadgeCarrito();
});



// Función para aplicar el tema guardado
document.addEventListener("DOMContentLoaded", () => {
    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "oscuro") {
        document.querySelector("body").setAttribute("data-bs-theme", "dark");
    } else {
        document.querySelector("body").setAttribute("data-bs-theme", "light");
    }

    // Actualizar el badge al cargar la página
    actualizarBadgeCarrito();
});
