// Constante para completar la ruta de la API.
const CATEGORIA_API = 'services/public/categoria.php';
// Constante para establecer el contenedor de categorías.
const CATEGORIAS = document.getElementById('categorias');

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Llamada a la función para mostrar el encabezado y pie del documento.
        await loadTemplate();
        // Se establece el título del contenido principal.
        MAIN_TITLE.textContent = 'Productos por categoría';
        // Petición para obtener las categorías disponibles.
        const DATA = await fetchData(CATEGORIA_API, 'readAll');
        
        // Se comprueba si la respuesta es satisfactoria y si hay datos.
        if (DATA && DATA.dataset && DATA.dataset.length > 0) {
            // Se inicializa el contenedor de categorías.
            CATEGORIAS.innerHTML = '';
            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA.dataset.forEach(row => {
                // Se establece la página web de destino con los parámetros.
                let url = `products.html?id=${row.id_categoria}&nombre=${row.nombre_categoria}`;
                // Se crean y concatenan las tarjetas con los datos de cada categoría.
                CATEGORIAS.innerHTML += `
                    <div class="col-sm-12 col-md-6 col-lg-3">
                        <div class="card mb-3">
                            <img src="${SERVER_URL}images/categorias/${row.imagen_categoria}" class="card-img-top" alt="${row.nombre_categoria}">
                            <div class="card-body text-center">
                                <h5 class="card-title">${row.nombre_categoria}</h5>
                                <p class="card-text">${row.descripcion_categoria}</p>
                                <a href="${url}" class="btn btn-primary">Ver productos</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            // Si no hay datos, se muestra un mensaje indicando la falta de categorías.
            CATEGORIAS.innerHTML = '<p>No hay categorías disponibles.</p>';
        }
    } catch (error) {
        // Si ocurre algún error durante la carga de datos, se muestra en el título del contenido.
        document.getElementById('mainTitle').textContent = 'Error al cargar las categorías.';
        console.error('Error:', error);
    }
});
