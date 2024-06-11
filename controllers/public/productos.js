// Constante para completar la ruta de la API.
const PRODUCTO_API = 'services/public/producto.php';
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
const PARAMS = new URLSearchParams(location.search);
const PRODUCTOS = document.getElementById('productos');
// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SEARCH_FORM);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    fillPage(FORM);
});


const fillPage = async (form = null) => {
    // Se inicializa el contenedor de productos.
    PRODUCTOS.innerHTML = '';
    
    const FORM = new FormData();
    FORM.append('idCategoria', PARAMS.get('id'));

    let action;
    // Si 'form' no es null y contiene la clave 'search', se realiza una búsqueda.
    if (form && form.has('search')) {
        action = 'searchRowsPublic';
        FORM.append('search', form.get('search'));
    } else {
        // De lo contrario, se solicitan todos los productos de la categoría.
        action = 'readProductosCategoria';
    }

    // Petición para solicitar los productos de la categoría seleccionada.
    const DATA = await fetchData(PRODUCTO_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se asigna como título principal la categoría de los productos.
        MAIN_TITLE.textContent = `Categoría: ${PARAMS.get('nombre')}`;
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las tarjetas con los datos de cada producto.
            PRODUCTOS.innerHTML += `
                <div class="col-sm-12 col-md-6 col-lg-3 d-flex align-items-stretch">
                    <div class="card mb-4 shadow">
                        <img src="${SERVER_URL}images/productos/${row.imagen_producto}" class="card-img-top" alt="${row.nombre_producto}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-center">${row.nombre_producto}</h5>
                            <div class="d-flex justify-content-between align-items-center mt-auto">
                                <p class="card-text text-muted">(US$) <strong>${row.precio_producto}</strong></p>
                                <a href="detail.html?id=${row.producto_id}" class="btn btn-primary mt-3"><i class="bi bi-cart-plus"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        // Se presenta un mensaje de error cuando no existen datos para mostrar.
        MAIN_TITLE.textContent = DATA.error;
    }
}

// Método manejador de eventos para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    fillPage();
});

