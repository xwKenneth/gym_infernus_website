// Constante para completar la ruta de la API.
const PEDIDO_API = 'services/admin/pedido.php';
const CLIENTE_API = 'services/admin/cliente.php';
const DETALLE_PEDIDO_API = 'services/admin/detalle_pedido.php';
const PRODUCTO_API = 'services/admin/producto.php';
// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// Constantes para establecer los elementos de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
const CRUD_BODY = document.getElementById('crudBody'),
    CRUD_FOUND = document.getElementById('crudFound');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');
// Constantes para establecer los elementos del componente CRUD.
const CRUD_MODAL = new bootstrap.Modal('#crudModal'),
    CRUD_TITLE = document.getElementById('crudTitle');

const SAVE_CRUD = document.getElementById('saveCrud'),
    ID_PEDIDO_CRUD = document.getElementById('idPedidoCRUD'),
    ID_DETALLE_PEDIDO = document.getElementById('idDetallePedido'),
    PRODUCTO = document.getElementById('productoDetalleP'),
    CANTIDAD = document.getElementById('cantidadDetalleP');

// Constantes para establecer los elementos del formulario de guardar.

const SAVE_FORM = document.getElementById('saveForm'),
    ID_PEDIDO = document.getElementById('idPedido'),
    CLIENTE_PEDIDO = document.getElementById('clientePedido'),
    FECHA_PEDIDO = document.getElementById('fechaPedido'),
    ESTADO_PEDIDO = document.getElementById('estadoPedido'),
    DIRECCION_PEDIDO = document.getElementById('direccionPedido');
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    MAIN_TITLE.textContent = 'Gestionar pedidos';
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
    (ID_PEDIDO.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(PEDIDO_API, action, FORM);
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
    const DATA = await fetchData(PEDIDO_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <tr>
                    <td>${row.fecha_registro}</td>
                    <td>${row.NombreFull}</td>
                    <td>${row.direccion_pedido}</td>
                    <td>${row.estado_pedido}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.pedido_id})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.pedido_id})">
                            <i class="bi bi-trash3"></i>
                        </button>
                        <button type="button" class="btn btn-warning" onclick="openDetails(${row.pedido_id})">
                        <i class="bi bi-info-circle"></i>
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


// Método del evento para cuando se envía el formulario de guardar.
SAVE_CRUD.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    //console.log(idPedidoTest);
    (ID_DETALLE_PEDIDO.value) ? action = 'updateRow' : action = 'createRow';

    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_CRUD);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(DETALLE_PEDIDO_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        CRUD_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

/*
*   Función asíncrona para llenar el CRUD con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillCrud = async (id) => {

    fillSelect(PRODUCTO_API, 'getProductos', 'productoDetalleP');
    // Se inicializa el contenido de la tabla.
    CRUD_FOUND.textContent = '';
    CRUD_BODY.innerHTML = '';
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idPedidoCRUD', id);
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(DETALLE_PEDIDO_API, 'readAll', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            CRUD_BODY.innerHTML += `
                <tr>
                    <td>${row.nombre_producto}</td>
                    <td>${row.cantidad}</td>
                    <td>$${row.precio_producto}</td>
                    <td>$${row.subtotal}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdateCrud(${row.detalle_pedido_id})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDeleteCrud(${row.detalle_pedido_id})">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        // Se muestra el número de registros encontrados.
        CRUD_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

// Función para preparar el formulario al momento de insertar un registro.
const openDetails = async (id) => {
    //Para guardar el id del pedido
    ID_PEDIDO_CRUD.value = id;
    // Llenar crud
    await fillCrud(ID_PEDIDO_CRUD.value);
    // Se muestra la caja de diálogo con su título.
    CRUD_MODAL.show();
    // Se coloca el título para el formulario.
    CRUD_TITLE.textContent = 'Informacion detalle del pedido';
    SAVE_CRUD.reset();
}


const openDeleteCrud = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el detalle pedido de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        ID_PEDIDO_CRUD.value = id;
        const FORM = new FormData();-
        FORM.append('idDetallePedido', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(DETALLE_PEDIDO_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            await fillCrud(ID_PEDIDO_CRUD.value);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

const openUpdateCrud = async (id) => {
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idDetallePedido', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(DETALLE_PEDIDO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        CRUD_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar venta';
        // Se prepara el formulario.
        SAVE_CRUD.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_DETALLE_PEDIDO.value = ROW.detalle_pedido_id;
        CANTIDAD.value = ROW.cantidad;
        fillSelect(PRODUCTO_API, 'getProductos', 'productoDetalleP', ROW.producto_id);
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// Función para preparar el formulario al momento de insertar un registro.
const openCreate = () => {

    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    // Se coloca el título para el formulario.
    MODAL_TITLE.textContent = 'Crear pedido';

    // Se restauran los elementos del formulario.
    SAVE_FORM.reset();
    const fechaActual = new Date();
    // Formatea la fecha en el formato "año-mes-día"
    const fechaFormateada = fechaActual.toISOString().split('T')[0];
    fillSelect(CLIENTE_API, 'getClientes', 'clientePedido');
    fillSelect(PEDIDO_API, 'getEstados', 'estadoPedido');
    // Establece la fecha actual como valor predeterminado
    FECHA_PEDIDO.value = fechaFormateada;


}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idPedido', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(PEDIDO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar venta';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_PEDIDO.value = ROW.pedido_id;
        DIRECCION_PEDIDO.value = ROW.direccion_pedido;
        FECHA_PEDIDO.value = ROW.fecha_registro;
        fillSelect(CLIENTE_API, 'getClientes', 'clientePedido', ROW.cliente_id)
        fillSelect(PEDIDO_API, 'getEstados', 'estadoPedido', ROW.estado_pedido);
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
    const RESPONSE = await confirmAction('¿Desea eliminar el administrador de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idPedido', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(PEDIDO_API, 'deleteRow', FORM);
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