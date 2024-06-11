const CATEGORIA_API = 'services/public/categoria.php';
// Constante para establecer el contenedor de categorías.
const CATEGORIAS = document.getElementById('categorias');

// Constante para establecer el formulario de iniciar sesión.

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    // MAIN_TITLE.textContent = 'Clasificaciones';
    const DATA = await fetchData(CATEGORIA_API, 'readAll');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializa el contenedor de categorías.
        CATEGORIAS.innerHTML = '';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se establece la página web de destino con los parámetros.
            let url = `productos.html?id=${row.categoria_id}&nombre=${row.nombre_categoria}`;
            // Se crean y concatenan las tarjetas con los datos de cada categoría.
            CATEGORIAS.innerHTML += `

               <div class=" col-lg-4 col-sm-6 col-md-5 mb-3">
                   <div class="card">
                       <img src="${SERVER_URL}images/categorias/${row.imagen_categoria}" class="card-img-top embed-responsive-16by9" alt="${row.nombre_categoria}">
                       <div class="card-body">
                           <h5 class="card-title">${row.nombre_categoria}</h5>
 
                           <a href="${url}" class="btn btn-primary">Ver productos</a>
                       </div>
                   </div>
               </div>

           `;
        });
    } else {
        // Se asigna al título del contenido de la excepción cuando no existen datos para mostrar.
        document.getElementById('mainTitle').textContent = DATA.error;
    }
});

