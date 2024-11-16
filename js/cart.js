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
        actualizarTotales(0, 0); 
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
        actualizarTotales(0, 0); 
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
    const subtotalElementPesos = document.getElementById('subtotal-pesos2'); 
    const subtotalPesos = parseFloat(subtotalElementPesos.textContent) || 0; 
    const subtotalElementDolares = document.getElementById('subtotal-dolares2'); 
    const subtotalDolares = parseFloat(subtotalElementDolares.textContent) || 0; 
    const tipoEnvio = document.querySelector('input[name="flexRadioDefault"]:checked'); 
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
  
// Llamar a calcularCostoEnvio cada vez que el modal se abre
const envioModal = document.getElementById('exampleModalToggle'); 
if (exampleModalToggle) {
    exampleModalToggle.addEventListener('shown.bs.modal', calcularCostoEnvio);
}



// Función para mostrar la alerta de error en el Paso 1
function showAlertError(message) {
    const alertDanger = document.getElementById("alert-danger-tipo-de-envio");
    alertDanger.querySelector('p').innerText = message; // Cambia el mensaje de error
    alertDanger.classList.add("show"); // Muestra la alerta
    alertDanger.style.display = 'block'; // Asegura que la alerta sea visible
}

// Función para ocultar la alerta de error en el Paso 1
function hideAlertError() {
    const alertDanger = document.getElementById("alert-danger-tipo-de-envio");
    alertDanger.classList.remove("show"); // Elimina la clase 'show' para ocultar la alerta
    alertDanger.style.display = 'none'; // Asegura que la alerta esté oculta
}

// Event listener para el botón de 'Siguiente' en el Paso 1
document.getElementById('siguiente1').addEventListener('click', function (event) {
    // Verifica si hay algún radio button seleccionado
    const tipoDeEnvio = document.querySelector('input[name="flexRadioDefault"]:checked');
    
    if (!tipoDeEnvio) {
        // Si no hay selección, muestra la alerta y evita avanzar
        event.preventDefault(); // Evita que avance al siguiente paso
        showAlertError("Debe seleccionar una opción");
    } else {
        // Si hay selección, oculta la alerta
        hideAlertError();

        // Cierra el modal actual (Paso 1)
        const modal1 = bootstrap.Modal.getInstance(document.getElementById('exampleModalToggle'));
        modal1.hide(); // Cierra el modal

        // Muestra el siguiente modal (Paso 2)
        const modal2 = new bootstrap.Modal(document.getElementById('exampleModalToggle2'));
        modal2.show(); // Muestra el siguiente modal
    }
});

// Función para mostrar la alerta de error en el Paso 2
function showAlertError2(message) {
    const alertDanger = document.getElementById("alert-danger-direccion-de-envio");
    alertDanger.querySelector('p').innerText = message; // Cambia el mensaje de error
    alertDanger.classList.add("show"); // Muestra la alerta
    alertDanger.style.display = 'block'; // Asegura que la alerta sea visible
}

// Función para ocultar la alerta de error en el Paso 2
function hideAlertError2() {
    const alertDanger = document.getElementById("alert-danger-direccion-de-envio");
    if (alertDanger) {
        alertDanger.classList.remove("show"); // Elimina la clase 'show' para ocultar la alerta
        alertDanger.style.display = 'none'; // Asegura que la alerta esté oculta
    }
}

// Event listener para el botón de 'Siguiente' en el Paso 2
document.getElementById('siguiente2').addEventListener('click', function (event) {
    // Obtiene los valores de los campos
    let departamento = document.getElementById("departamento").value.trim();
    let localidad = document.getElementById("localidad").value.trim();
    let calle = document.getElementById("calle").value.trim();
    let numero = document.getElementById("número").value.trim();
    let esquina = document.getElementById("esquina").value.trim();

    // Verifica si algún campo está vacío
    if (!departamento || !localidad || !calle || !numero || !esquina) {
        // Si hay campos vacíos, muestra la alerta y evita avanzar
        event.preventDefault(); // Evita que el modal avance
        showAlertError2("No pueden haber campos vacíos");
    } else {
        // Si todos los campos están completos, oculta la alerta
        hideAlertError2();

        // Cierra el modal actual (Paso 2)
        const modal2 = bootstrap.Modal.getInstance(document.getElementById('exampleModalToggle2'));
        modal2.hide(); // Cierra el modal

        // Muestra el siguiente modal (Paso 3)
        const modal3 = new bootstrap.Modal(document.getElementById('exampleModalToggle3'));
        modal3.show(); // Muestra el siguiente modal
    }
});



// Función para mostrar la alerta de error en el inicio de compra
function showAlertError3(message) {
    const alertDanger = document.getElementById("alert-danger-totales");
    if (alertDanger) { // Verificamos si alertDanger existe
        const alertMessage = alertDanger.querySelector('p');
        if (alertMessage) {
            alertMessage.textContent = message; // Actualiza el mensaje de la alerta
        }
        alertDanger.classList.add("show"); // Muestra la alerta
        alertDanger.style.display = 'block'; // Asegura que la alerta sea visible
    } else {
        console.error("No se encontró el elemento con el ID 'alert-danger-totales'");
    }
}

// Función para ocultar la alerta de error en el inicio de compra
function hideAlertError3() {
    const alertDanger = document.getElementById("alert-danger-totales");
    if (alertDanger) { // Verificamos si alertDanger existe
        alertDanger.classList.remove("show"); // Elimina la clase 'show' para ocultar la alerta
        alertDanger.style.display = 'none'; // Asegura que la alerta esté oculta
    } else {
        console.error("No se encontró el elemento con el ID 'alert-danger-totales'");
    }
}

// Lógica para el evento de clic en el botón de "Iniciar Proceso de Compra"
document.getElementById('inicio-de-compra').addEventListener('click', function (event) {
    recalcularTotales(); 
    const totalPesos = document.getElementById('total-pesos');
    const totalDolares = document.getElementById('total-dolares');
    const totalPesosValue = parseFloat(totalPesos.textContent);
    const totalDolaresValue = parseFloat(totalDolares.textContent);

    // Si ambos totales son 0, evita abrir el modal, muestra la alerta y detiene la acción
    if (totalPesosValue === 0 && totalDolaresValue === 0) {
        event.preventDefault(); // Evita que el modal avance
        event.stopPropagation(); // Previene la propagación del evento de clic
        showAlertError3("Debe haber al menos un producto agregado al carrito");
        const modalElement = document.getElementById('exampleModalToggle'); 
        if (modalElement) {
            var myModal = bootstrap.Modal.getInstance(modalElement);
            if (myModal) {
                myModal.hide(); // Cierra el modal si está abierto
            }
        }
    } else {
        hideAlertError3(); // Oculta la alerta si los totales son válidos
        const modalElement = document.getElementById('exampleModalToggle'); // 

        // Verifica si el modal existe y está listo para abrir
        if (modalElement) {
            var myModal = new bootstrap.Modal(modalElement);
            myModal.show(); // Esto abrirá el modal
        }
    }
});


// Función para mostrar la alerta de error en el Paso 3
function showAlertError4(message) {
    const alertDanger = document.getElementById("alert-danger-forma-de-pago");
    alertDanger.querySelector('p').innerText = message; // Cambia el mensaje de error
    alertDanger.classList.add("show"); // Muestra la alerta
    alertDanger.style.display = 'block'; // Asegura que la alerta sea visible
}

// Función para ocultar la alerta de error en el Paso 3
function hideAlertError4() {
    const alertDanger = document.getElementById("alert-danger-forma-de-pago");
    alertDanger.classList.remove("show"); // Elimina la clase 'show' para ocultar la alerta
    alertDanger.style.display = 'none'; // Asegura que la alerta esté oculta
}

// Event listener para el botón de 'Siguiente' en el Paso 3
document.getElementById('siguiente3').addEventListener('click', function (event) {
    // Verifica si hay algún radio button seleccionado
    const formaDePago = document.querySelector('input[name="flexRadioDefault2"]:checked');
    
    if (!formaDePago) {
        // Si no hay selección, muestra la alerta y evita avanzar
        event.preventDefault(); // Evita que avance al siguiente paso
        showAlertError4("Debe seleccionar una opción");
        return; // Sale de la función para no continuar con la validación
    } 
    
    // Si la opción seleccionada es 'Tarjeta de Crédito', validamos los campos
    const tarjetaCreditoRadio = document.getElementById("flexRadioDefault4");
    if (tarjetaCreditoRadio.checked) {
        const cardNumber = document.getElementById("card-number").value;
        const cardHolder = document.getElementById("card-holder").value;
        const cardExpiration = document.getElementById("card-expiration").value;
        const cardCvv = document.getElementById("card-cvv").value;

        // Verifica que todos los campos estén completos
        if (!cardNumber || !cardHolder || !cardExpiration || !cardCvv) {
            event.preventDefault(); // Evita que avance al siguiente paso
            showAlertError4("Debe completar todos los campos de la tarjeta.");
            return; // Sale de la función para no continuar con la validación
        }
    }
    
    // Si todo está correcto, oculta la alerta y avanza
    hideAlertError4();

    // Cierra el modal actual (Paso 1)
    const modal3 = bootstrap.Modal.getInstance(document.getElementById('exampleModalToggle3'));
    modal3.hide(); // Cierra el modal

    // Muestra el siguiente modal (Paso 2)
    const modal4 = new bootstrap.Modal(document.getElementById('exampleModalToggle4'));
    modal4.show(); // Muestra el siguiente modal
});

// Selecciona los elementos del DOM
const tarjetaCreditoRadio = document.getElementById("flexRadioDefault4");
const transferenciaBancariaRadio = document.getElementById("flexRadioDefault5");
const creditCardForm = document.getElementById("credit-card-form");
const informacionBancaria = document.getElementById("informacion-bancaria");

// Inicialmente, ocultamos el formulario de tarjeta de crédito y la información bancaria
creditCardForm.style.display = "none"; 
informacionBancaria.style.display = "none";

//Mostramos o no el formulario de Tarjeta de crédito
if (tarjetaCreditoRadio.checked) {
    creditCardForm.style.display = "block"; // Muestra el formulario de tarjeta si "Tarjeta de Crédito" está seleccionado
} else {
    creditCardForm.style.display = "none"; // Aseguramos que el formulario esté oculto si no está seleccionado
}
// Mostramos o no la informacion bancaria
if (transferenciaBancariaRadio.checked) {
    informacionBancaria.style.display = "block"; // Muestra el formulario de tarjeta si "Tarjeta de Crédito" está seleccionado
} else {
    informacionBancaria.style.display = "none"; // Aseguramos que el formulario esté oculto si no está seleccionado
}

// Event listener para mostrar el formulario cuando se selecciona "Tarjeta de Crédito"
tarjetaCreditoRadio.addEventListener("change", function () {
  if (tarjetaCreditoRadio.checked) {
    creditCardForm.style.display = "block"; 
    informacionBancaria.style.display = "none";
  }
});

// Event listener para ocultar el formulario cuando se selecciona "Transferencia Bancaria"
transferenciaBancariaRadio.addEventListener("change", function () {
  if (transferenciaBancariaRadio.checked) {
    creditCardForm.style.display = "none"; 
    informacionBancaria.style.display = "block";
  }
});

document.getElementById("finalizar-compra").addEventListener("click", function() {

    // Obtén la alerta de éxito
    var alertSuccess = document.getElementById("alert-success-compra");
    alertSuccess.style.display = "block";
    alertSuccess.classList.remove("fade");

    // Ocultar la alerta después de 5 segundos
    setTimeout(function() {
        alertSuccess.style.display = "none";  // Ocultar la alerta
    }, 5000);

    vaciarCarrito();
});


// Función para vaciar el carrito
function vaciarCarrito() {
    // Elimina los productos almacenados en el carrito
    localStorage.removeItem('productosEnCarrito');
    // Elimina las cantidades de los productos
    const productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito')) || [];
    productosEnCarrito.forEach(productID => {
        localStorage.removeItem(`cantidad-${productID}`);
    });
    // Actualiza el badge del carrito
    actualizarBadgeCarrito();
    // Actualiza el contenido del carrito en la página
    const carritoContainer = document.getElementById('carritoContainer');
    carritoContainer.innerHTML = '';  // Vacía el contenedor del carrito
    document.getElementById('mensaje-carrito-vacio').style.display = 'block';
    actualizarTotales(0, 0);
}


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

