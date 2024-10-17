// Cargar el archivo JSON desde la URL
let catID = localStorage.getItem("catID"); // Obtener el valor de catID del localStorage

fetch(`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`) 
    .then(response => response.json())
    .then(data => {
        const contenido = document.getElementById('contenido');
        let productos = data.products; // Almacena los productos originales
        let productosFiltrados = [...productos]; // Inicia con todos los productos

        function mostrarProductos(filtrados) {
            contenido.innerHTML = filtrados.map(product => `
            <div class="card" onclick="seleccionarProducto(${product.id})">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <div class="card-price">${product.cost} ${product.currency}</div>
                    <p class="card-text">${product.description}</p>
                </div>
                <div class="card-footer">
                    <p class="card-sold-count">Vendidos ${product.soldCount}</p>
                </div>
            </div>
            `).join('');
        }

        mostrarProductos(productosFiltrados); // Mostrar todos los productos al cargar la página

        // Función para aplicar el filtro de precio
        function filtrarPorPrecio() {
            const minPrice = document.getElementById('minPrice').value;
            const maxPrice = document.getElementById('maxPrice').value;

            // Filtrar los productos según el precio ingresado
            productosFiltrados = productos.filter(product => {
                return (!minPrice || product.cost >= minPrice) &&
                       (!maxPrice || product.cost <= maxPrice);
            });

            ordenar(); // Aplicar el orden después del filtro
        }

        // Función para aplicar el orden
        function ordenar() {
            const sortOption = document.getElementById('sortOptions').value;

            if (sortOption === 'ascPrice') {
                // Ordenar por precio de menor a mayor
                productosFiltrados.sort((a, b) => a.cost - b.cost);
            } else if (sortOption === 'descPrice') {
                // Ordenar por precio de mayor a menor
                productosFiltrados.sort((a, b) => b.cost - a.cost);
            } else if (sortOption === 'descRelevance') {
                // Ordenar por relevancia (vendidos de mayor a menor)
                productosFiltrados.sort((a, b) => b.soldCount - a.soldCount);
            }

            mostrarProductos(productosFiltrados); // Mostrar los productos filtrados y ordenados
        }

        //DESAFIATE Función para buscar
        function buscar() {
            const searchText = document.getElementById('productSearch').value.toLowerCase(); //con toLowerCase paso todo a minuscula
            // Filtrar los productos según el texto ingresado
            productosFiltrados = productosFiltrados.filter(product => {
                return product.name.toLowerCase().includes(searchText) ||
                product.description.toLowerCase().includes(searchText);
            });
            ordenar(); // Aplicar el orden después de la búsqueda
        }



        // Event listener para el botón de filtrar
        document.getElementById('filterBtn').addEventListener('click', function() {
          filtrarPorPrecio(); // Aplica el filtro y luego el orden
        });

        // Event listener para el botón de limpiar
        document.getElementById('limpiarBtn').addEventListener('click', function() {
            document.getElementById('minPrice').value = '';
            document.getElementById('maxPrice').value = '';
            productosFiltrados = [...productos]; // Restablecer a todos los productos
            ordenar(); // Aplica el orden sobre todos los productos
        });

        // Event listener para el cambio en el ordenamiento
        document.getElementById('sortOptions').addEventListener('change', function() {
            ordenar(); // Aplica el orden con los productos filtrados
        });
        
        // DESAFIATE Event listener para el campo de búsqueda
        document.getElementById('productSearch').addEventListener('input', function() {
            buscar(); // Aplica la búsqueda en tiempo real;
        });


        //El título cambia según la categoría
        const catName = data.catName;  
        const categoriaTitulo = document.getElementById('categoriaTitulo');
        categoriaTitulo.textContent = `¡Bienvenido a la sección de ${catName}!`;
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));

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

    // Función para seleccionar un producto, guardar su id en el localStorage y redirigir
    function seleccionarProducto(productId) {
        localStorage.setItem('productID', productId);
        window.location.href = 'product-info.html'; // Redirige a la página product-info.html
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
    