let usuario = localStorage.getItem('usuario');
if (usuario) {
  document.getElementById('nombre-usuario').textContent = `${usuario}`;
}

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
            thumbnail.onclick = function () {
              changeImage(thumbnail.src);
            };
            thumbnailsContainer.appendChild(thumbnail);
          });
        })
        .catch(error => console.error('Error al cargar la información del producto:', error));
    }
  })
  .catch(error => console.error('Error al cargar la información de la categoría:', error));

// Función para cambiar la imagen principal al hacer clic en una miniatura
function changeImage(imageSrc) {
  document.getElementById('imagen-principal').src = imageSrc;
}
