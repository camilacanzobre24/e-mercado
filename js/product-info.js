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

// Obtener catID del localStorage
let catID = localStorage.getItem("catID");

// Acceder al archivo JSON de la categoría para obtener el nombre de la categoría
fetch(`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`)
    .then(response => response.json())
    .then(data => {
        const catName = data.catName; // Obtener el nombre de la categoría

        // Obtener el productID del localStorage
        let productID = localStorage.getItem('productID');
        if (productID) {
            // Solicitar la información del producto usando el productID
            fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
                .then(response => response.json())
                .then(productData => {
                    // Mostrar la información del producto en la página
                    document.getElementById('categoria').textContent = catName;
                    document.getElementById('nombre-producto').textContent = productData.name;
                    document.getElementById('descripcion').textContent = productData.description;
                    document.getElementById('precio').textContent = `${productData.cost} ${productData.currency}`;
                    document.getElementById('vendidos').textContent = `Cantidad de vendidos: ${productData.soldCount}`;
                    document.getElementById('imagen-principal').src = `img/prod${productData.id}_1.jpg`;
                    
                    // Generar las miniaturas dinámicamente
                    let thumbnailsContainer = document.getElementById('thumbnails');
                    productData.images.forEach((image, index) => {
                        let thumbnail = document.createElement('img');
                        thumbnail.src = `img/prod${productData.id}_${index + 1}.jpg`;
                        thumbnail.alt = `Imagen ${index + 1}`;
                        thumbnail.onclick = function() {
                            changeImage(thumbnail.src);
                        };
                        thumbnailsContainer.appendChild(thumbnail);
                    });

                    // Agregar productos relacionados
                    const relatedProductsContainer = document.getElementById('productos-relacionados');
                    relatedProductsContainer.innerHTML = ''; // Limpiar el contenedor de productos relacionados
                    
                    // Iterar sobre los productos relacionados
                    productData.relatedProducts.forEach(relatedProduct => {
                        // Crear un contenedor para el producto relacionado
                        let productDiv = document.createElement('div');
                        productDiv.classList.add('producto-relacionado', 'mb-3', 'text-center');
                        
                        // Crear el enlace del producto relacionado
                        let productLink = document.createElement('a');
                        productLink.onclick = function() {
                            seleccionarProducto(relatedProduct.id); // Llama a la función con el ID del producto relacionado
                        };
                        
                        // Crear la imagen del producto relacionado
                        let productImage = document.createElement('img');
                        productImage.src = relatedProduct.image;
                        productImage.alt = relatedProduct.name;
                        productImage.style.width = '200px'; // Ajusta el tamaño de la imagen según sea necesario
                        productLink.appendChild(productImage); // Agregar la imagen al enlace
                        
                        // Crear un elemento para el nombre del producto
                        let productName = document.createElement('p');
                        productName.textContent = relatedProduct.name;
                        
                        // Agregar la imagen y el nombre al contenedor del producto relacionado
                        productDiv.appendChild(productName);
                        productDiv.appendChild(productLink);
                        
                        // Agregar el contenedor del producto relacionado al contenedor principal
                        relatedProductsContainer.appendChild(productDiv);
                        
                        function seleccionarProducto(productId) {
                            localStorage.setItem('productID', productId);
                            window.location.href = 'product-info.html'; // Redirige a la página product-info.html
                        }
                    });
                    console.log(productID);
                })
                .catch(error => console.error('Error al cargar la información del producto:', error));

            // Solicitar la información de los comentarios del producto usando el productID
            fetch(`https://japceibal.github.io/emercado-api/products_comments/${productID}.json`)
                .then(response => response.json())
                .then(commentsData => {
                    const calificaciones = document.getElementById('Calificaciones');
                    calificaciones.innerHTML = ''; // Limpiar el contenedor de calificaciones

                    commentsData.forEach(comment => {
                        // Crear un elemento div para cada comentario
                        let commentDiv = document.createElement('div');
                        commentDiv.classList.add('comentario', 'mb-3', 'p-2');
                        
                        // Fecha de los comentarios
                        const formattedDate = new Date(comment.dateTime).toLocaleString(); // Formatear la fecha

                        // Crear el contenido del comentario
                        commentDiv.innerHTML = `
                            ${mostrarEstrellas(comment.score)} <br>
                            ${comment.user}
                            <span class="fecha_calificaciones">${formattedDate}</span>
                            <br>
                            ${comment.description}
                        `;
                        
                        // Agregar el comentario al contenedor de calificaciones
                        calificaciones.appendChild(commentDiv);
                    });
                })
                .catch(error => console.error('Error al cargar las calificaciones:', error));
        }
    })
    .catch(error => console.error('Error al cargar la información de la categoría:', error));

// Función para cambiar la imagen principal al hacer clic en una miniatura
function changeImage(imageSrc) {
    document.getElementById('imagen-principal').src = imageSrc;
}

// Función para generar las estrellas según la calificación
function mostrarEstrellas(numberrange) {
    const maxStars = 5;
    const estrellasLlenas = Math.max(0, Math.min(maxStars, parseInt(numberrange)));
    let estrellasHTML = '';
    
    // Agregar estrellas llenas
    for (let i = 0; i < estrellasLlenas; i++) {
        estrellasHTML += '<span class="fa fa-star checked"></span>'; 
    }
    
    // Agregar estrellas vacías
    for (let i = estrellasLlenas; i < maxStars; i++) {
        estrellasHTML += '<span class="fa fa-star empty-star"></span>'; 
    }
    
    return estrellasHTML;
}

let calificacionSeleccionada = 0; // Variable para almacenar la calificación seleccionada

// Manejar la selección de estrellas
document.querySelectorAll('#estrellas .fa-star').forEach(function(star) {
    star.addEventListener('click', function() {
        calificacionSeleccionada = this.getAttribute('data-value'); // Obtener la calificación de la estrella
        resetStars(); // Reiniciar todas las estrellas
        highlightStars(calificacionSeleccionada); // Resaltar las estrellas hasta la seleccionada
    });
});

// Función para reiniciar todas las estrellas a su estado original
function resetStars() {
    document.querySelectorAll('#estrellas .fa-star').forEach(function(star) {
        star.classList.remove('checked');
    });
}

// Función para resaltar las estrellas seleccionadas
function highlightStars(calificacion) {
    for (let i = 0; i < calificacion; i++) {
        document.querySelectorAll('#estrellas .fa-star')[i].classList.add('checked');
    }
}

// Función para enviar el comentario con la calificación seleccionada
document.getElementById('enviarComentario').addEventListener('click', function() {
    const nuevoComentario = document.getElementById('nuevoComentario').value;
    const usuario = localStorage.getItem('usuario') || 'Usuario anónimo';
    const fechaActual = new Date().toLocaleString();

    if (calificacionSeleccionada === 0) {
        alert("Por favor, selecciona una calificación de estrellas.");
        return;
    }

    // Crear un nuevo div para el comentario
    let nuevoComentarioDiv = document.createElement('div');
    nuevoComentarioDiv.classList.add('comentario', 'mb-3', 'p-2');

    // Agregar el contenido del nuevo comentario
    nuevoComentarioDiv.innerHTML = `
        ${mostrarEstrellas(calificacionSeleccionada)} <br>
        ${usuario} 
        <span class="fecha_calificaciones">${fechaActual}</span> <br>
        ${nuevoComentario}
    `;

    // Agregar el comentario al contenedor de calificaciones nuevas
    document.getElementById('CalificacionesNuevas').appendChild(nuevoComentarioDiv);

    // Limpiar el textarea después de enviar
    document.getElementById('nuevoComentario').value = '';
    resetStars(); // Reiniciar las estrellas después de enviar
    calificacionSeleccionada = 0; // Reiniciar la calificación seleccionada
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
