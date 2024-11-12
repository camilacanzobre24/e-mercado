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
        productosEnCarrito.push(productID);
        localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));
        localStorage.setItem(`cantidad-${productID}`, 1);
    }

    actualizarBadgeCarrito();
}

// Función para actualizar el badge del carrito
function actualizarBadgeCarrito() {
    const productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito')) || [];
    let totalCantidad = 0;

    productosEnCarrito.forEach(productID => {
        const cantidadGuardada = localStorage.getItem(`cantidad-${productID}`) || 1;
        totalCantidad += parseInt(cantidadGuardada) || 0;
    });

    document.getElementById('carrito-badge').textContent = totalCantidad;
}

// Cargar los productos al abrir la página de carrito
document.addEventListener("DOMContentLoaded", () => {
    actualizarBadgeCarrito();

    const productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito')) || [];
    const carritoContainer = document.getElementById('carritoContainer');
    let totalPesos = 0;
    let totalDolares = 0;

    if (productosEnCarrito.length > 0) {
        productosEnCarrito.forEach(productID => {
            fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
                .then(response => response.json())
                .then(productData => {
                    const cantidadGuardada = localStorage.getItem(`cantidad-${productID}`) || 1;

                    const productoHTML = `
                        <div id="producto-${productID}" class="row product-item justify-content-center align-items-center mb-3">
                            <div class="col-3 d-flex align-items-center justify-content-center">
                                <img src="img/prod${productData.id}_1.jpg" alt="Imagen del producto" class="img-fluid img-carrito" style="width: 200px; height: 150px;" />
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

                    if (productData.currency === "UYU") {
                        totalPesos += cantidadGuardada * productData.cost;
                    } else if (productData.currency === "USD") {
                        totalDolares += cantidadGuardada * productData.cost;
                    }

                    actualizarTotales(totalPesos, totalDolares);
                })
                .catch(error => console.error('Error al cargar la información del producto:', error));
        });
    } else {
        document.getElementById('mensaje-carrito-vacio').style.display = 'block';
        actualizarTotales(0, 0); // Establece totales en cero si el carrito está vacío
    }

    document.addEventListener('input', (event) => {
        if (event.target.classList.contains('cantidad')) {
            const cantidad = parseInt(event.target.value) || 0;
            const precio = parseFloat(event.target.getAttribute('data-precio'));
            const subtotal = cantidad * precio;

            event.target.closest('.product-item').querySelector('.subtotal').textContent = subtotal.toFixed(2);

            const productID = event.target.closest('.product-item').id.split('-')[1];
            localStorage.setItem(`cantidad-${productID}`, cantidad);

            actualizarBadgeCarrito();
            recalcularTotales();
        }
    });
});

// Función para recalcular los totales
function recalcularTotales() {
    const productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito')) || [];
    let totalPesos = 0;
    let totalDolares = 0;

    if (productosEnCarrito.length > 0) {
        productosEnCarrito.forEach(productID => {
            const cantidadGuardada = parseInt(localStorage.getItem(`cantidad-${productID}`)) || 1;
            
            fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
                .then(response => response.json())
                .then(productData => {
                    if (productData.currency === "UYU") {
                        totalPesos += cantidadGuardada * productData.cost;
                    } else if (productData.currency === "USD") {
                        totalDolares += cantidadGuardada * productData.cost;
                    }

                    actualizarTotales(totalPesos, totalDolares);
                });
        });
    } else {
        actualizarTotales(0, 0); // Establece totales en cero si el carrito está vacío
    }
}

// Función para actualizar los totales en la interfaz
function actualizarTotales(totalPesos, totalDolares) {
    document.getElementById('total-pesos').textContent = totalPesos.toFixed(2);
    document.getElementById('total-dolares').textContent = totalDolares.toFixed(2);
    document.getElementById('subtotal-pesos2').textContent = totalPesos.toFixed(2);
    document.getElementById('subtotal-dolares2').textContent = totalDolares.toFixed(2);
}

// Función para eliminar un producto del carrito
function eliminarProducto(productID) {
    let productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito')) || [];
    productosEnCarrito = productosEnCarrito.filter(id => id !== productID);
    localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));

    const productoDiv = document.getElementById(`producto-${productID}`);
    if (productoDiv) {
        productoDiv.remove();
    }

    localStorage.removeItem(`cantidad-${productID}`);

    if (productosEnCarrito.length === 0) {
        document.getElementById('mensaje-carrito-vacio').style.display = 'block';
    }

    actualizarBadgeCarrito();
    recalcularTotales();
}

//---------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    // Encuentra todos los botones que cambian entre modales
    const nextButtons = document.querySelectorAll('[data-bs-toggle="modal"]');
  
    nextButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        // Obtiene el modal actualmente activo
        const currentModal = event.target.closest('.modal');
  
        // Cierra el modal activo antes de abrir el siguiente
        if (currentModal) {
          const modalInstance = bootstrap.Modal.getInstance(currentModal);
          modalInstance.hide();
        }
      });
    });
  });


// Función para calcular el costo de envío basado en el subtotal
function calcularCostoEnvio() {
    recalcularTotales();
    const costoEnvioP = document.getElementById('costo-de-envio-pesos');
    const costoEnvioD = document.getElementById('costo-de-envio-dolares');
    const subtotalElementPesos = document.getElementById('subtotal-pesos2'); // El subtotal en pesos
    const subtotalPesos = parseFloat(subtotalElementPesos.textContent) || 0; // Obtener el subtotal (en pesos)
    const subtotalElementDolares = document.getElementById('subtotal-dolares2'); // El subtotal en pesos
    const subtotalDolares = parseFloat(subtotalElementDolares.textContent) || 0; // Obtener el subtotal (en dolares)
    const tipoEnvio = document.querySelector('input[name="flexRadioDefault"]:checked'); // Opción de envío seleccionada
    const totalPesos = document.getElementById('total-pesos2');
    const totalDolares = document.getElementById('total-dolares2');
    let porcentaje = 0;
  
    // Si hay un tipo de envío seleccionado, obtener el porcentaje correspondiente
    if (tipoEnvio) {
      switch (tipoEnvio.value) {
        case 'premium':
          porcentaje = 0.15; // 15% de costo adicional
          break;
        case 'express':
          porcentaje = 0.07; // 7% de costo adicional
          break;
        case 'standard':
          porcentaje = 0.05; // 5% de costo adicional
          break;
      }
    }
  
    // Calcular el costo de envío
    const costoEnvioPesos = subtotalPesos * porcentaje;
    const costoEnvioDolares = subtotalDolares * porcentaje;
    const totalFinalPesos = costoEnvioPesos + subtotalPesos;
    const totalFinalDolares = costoEnvioDolares + subtotalDolares;
    // Actualizar el texto con el costo de envío calculado
    costoEnvioP.textContent = `${costoEnvioPesos.toFixed(2)} `;
    costoEnvioD.textContent = `${costoEnvioDolares.toFixed(2)} `;
    totalPesos.textContent = `${totalFinalPesos.toFixed(2)}`;
    totalDolares.textContent = `${totalFinalDolares.toFixed(2)}`;
  }
  
  // Asignar el evento a los radio buttons para calcular el costo de envío cuando se cambie la opción
  const radios = document.querySelectorAll('input[name="flexRadioDefault"]');
  radios.forEach(radio => {
    radio.addEventListener('change', calcularCostoEnvio);
  });
  
  // Inicializar el costo de envío al cargar la página
  window.addEventListener('DOMContentLoaded', calcularCostoEnvio);
  












// Función para aplicar el tema guardado
document.addEventListener("DOMContentLoaded", () => {
    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "oscuro") {
        document.querySelector("body").setAttribute("data-bs-theme", "dark");
    } else {
        document.querySelector("body").setAttribute("data-bs-theme", "light");
    }

    actualizarBadgeCarrito();
});

