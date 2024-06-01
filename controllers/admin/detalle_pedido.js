// venta.js
// Constante para completar la ruta de la API.
const DETALLE_PEDIDO_API = 'services/admin/detalle_pedido.php';
const PEDIDO_API = 'services/admin/pedido.php';
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
    ID_DETALLE_P = document.getElementById('idDetallePedido'),
    PEDIDO_DETALLE_P = document.getElementById('pedidoDetalleP'),
    PRODUCTO_DETALLE_P = document.getElementById('productoDetalleP'),
    CANTIDAD_DETALLE_P = document.getElementById('cantidadDetalleP'),
    SUBTOTAL_DETALLE_P = document.getElementById('subtotalDetalleP'),
    PRECIO_UNITARIO_DETALLE_P = document.getElementById('precioUnitarioDetalleP');

document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    MAIN_TITLE.textContent = 'Gestionar detalle pedido';
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
    (ID_DETALLE_P.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(DETALLE_PEDIDO_API, action, FORM);
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
    const DATA = await fetchData(DETALLE_PEDIDO_API, action, form);
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
                    <td>$${row.precio_producto}</td>
                    <td>$${row.subtotal}</td>
                    <td>${row.direccion_pedido}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.detalle_pedido_id})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.detalle_pedido_id})">
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
const openCreate = async (id) => {

    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    // Se coloca el título para el formulario.
    MODAL_TITLE.textContent = 'Agregar un detalle de pedido';
    // Se restauran los elementos del formulario.

    SAVE_FORM.reset();
    fillSelect(PEDIDO_API, 'readAll', 'pedidoDetalleP');
    fillSelect(PRODUCTO_API, 'getProductos', 'productoDetalleP');
 
}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idDetallePedido', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(DETALLE_PEDIDO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar detalle pedido';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_DETALLE_P.value = ROW.detalle_pedido_id;

        fillSelect(PEDIDO_API, 'readAll', 'pedidoDetalleP', ROW.pedido_id);
        fillSelect(PRODUCTO_API, 'getProductos', 'productoDetalleP', ROW.producto_id);
        CANTIDAD_DETALLE_P.value = ROW.cantidad;
        SUBTOTAL_DETALLE_P.value = ROW.subtotal;
        PRECIO_UNITARIO_DETALLE_P.value = ROW.precio_producto;
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
        FORM.append('idDetallePedido', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(DETALLE_PEDIDO_API, 'deleteRow', FORM);
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