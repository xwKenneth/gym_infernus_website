// venta.js
// Constante para completar la ruta de la API.
const DETALLE_VENTA_API = 'services/admin/detalle_venta.php';
const VENTA_API = 'services/admin/venta.php';
const CLIENTE_API = 'services/admin/cliente.php';
const PRODUCTO_API = 'services/admin/producto.php';
// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_DETALLE_V = document.getElementById('idDetalleVenta'),
    VENTA_DETALLE_V = document.getElementById('ventaDetalleV'),
    PRODUCTO_DETALLE_V = document.getElementById('productoDetalleV'),
    CANTIDAD_DETALLE_V = document.getElementById('cantidadDetalleV'),
    SUBTOTAL_DETALLE_V = document.getElementById('subtotalDetalleV'),
    DESCUENTO_DETALLE_V = document.getElementById('descuentoDetalleV'),
    ESTADO_DETALLE_V = document.getElementById('estadoDetalleV'),
    DIRECCION_DETALLE_V = document.getElementById('direccionDetalleV');

document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    MAIN_TITLE.textContent = 'Gestionar detalle venta';
    await fillTable();

});

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SEARCH_FORM);
    // Convertir las fechas al formato MySQL antes de enviar el formulario

    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    fillTable(FORM);
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_DETALLE_V.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(DETALLE_VENTA_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    ROWS_FOUND.textContent = '';
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(DETALLE_VENTA_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <tr>
                    <td>${row.nombre_cliente}</td>
                    <td>${row.nombre_producto}</td>
                    <td>${row.cantidad}</td>
                    <td>${row.precio_unitario}</td>
                    <td>${row.subtotal}</td>
                    <td>${row.direccion_cliente}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.detalle_venta_id})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.detalle_venta_id})">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        // Se muestra el número de registros encontrados.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

// Función para preparar el formulario al momento de insertar un registro.
const openCreate = () => {

    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    // Se coloca el título para el formulario.
    MODAL_TITLE.textContent = 'Agregar un detalle de venta';
    // Se restauran los elementos del formulario.

    SAVE_FORM.reset();
    fillSelect(VENTA_API, 'readAll', 'ventaDetalleV');
    fillSelect(PRODUCTO_API, 'getProductos', 'productoDetalleV');
    SUBTOTAL_DETALLE_V.disabled = true;
    DESCUENTO_DETALLE_V.disabled = true;
}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idDetalleVenta', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(DETALLE_VENTA_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar detalle venta';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_DETALLE_V.value = ROW.detalle_venta_id;
        fillSelect(VENTA_API, 'readAll', 'ventaDetalleV', ROW.venta_id);
        fillSelect(PRODUCTO_API, 'getProductos', 'productoDetalleV', ROW.producto_id);
        CANTIDAD_DETALLE_V.value = ROW.cantidad
        DIRECCION_DETALLE_V.value = ROW.direccion_cliente;
        SUBTOTAL_DETALLE_V.disabled = true;
        DESCUENTO_DETALLE_V.disabled = true;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el detalle de la venta de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idDetalleVenta', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(DETALLE_VENTA_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}