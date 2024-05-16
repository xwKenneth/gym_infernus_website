// Constante para completar la ruta de la API.
const CLIENTE_API = 'services/admin/cliente.php';
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
    ID_CLIENTE = document.getElementById('idCliente'),
    NOMBRE_CLIENTE = document.getElementById('nombreCliente'),
    APELLIDO_CLIENTE = document.getElementById('apellidoCliente'),
    CORREO_CLIENTE = document.getElementById('correoCliente'),
    CLAVE_CLIENTE = document.getElementById('claveCliente'),
    CONFIRMAR_CLAVE = document.getElementById('confirmarClave'),
    NACIMIENTO_CLIENTE = document.getElementById('fechaNacimientoCliente'),
    DUI_CLIENTE = document.getElementById('duiCliente'),
    TELEFONO_CLIENTE = document.getElementById('telefonoCliente'),
    DIRECCION_CLIENTE = document.getElementById('direccionCliente');
const duiInput = document.getElementById('duiCliente');
const telefonoInput = document.getElementById('telefonoCliente');

telefonoInput.addEventListener('input', function (event) {
    let value = event.target.value;

    value = value.replace(/-/g, '');

    if (value.length > 4) {
        value = value.slice(0, 4) + '-' + value.slice(4);
    }

    event.target.value = value;
});

telefonoInput.addEventListener('change', function (event) {
    if (!event.target.value.match(/^\d{4}-\d{4}$/)) {
        event.target.classList.add('invalid');
        $('#telefonoHelp').text('Ingrese un número de teléfono válido (ejemplo: 8986-9899).');
    } else {
        event.target.classList.remove('invalid');
        $('#telefonoHelp').text('Número de teléfono válido.');
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    MAIN_TITLE.textContent = 'Gestionar clientes';
    await fillTable();
});

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SEARCH_FORM);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    fillTable(FORM);
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_CLIENTE.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(CLIENTE_API, action, FORM);
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
    const DATA = await fetchData(CLIENTE_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <tr>
                    <td>${row.nombre}</td>
                    <td>${row.apellido}</td>
                    <td>${row.correo_electronico}</td>
                    <td>${row.dui}</td>  
                    <td>
                        <button type="button" class="btn btn-info" onclick="openUpdate(${row.cliente_id})">  
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-danger" onclick="openDelete(${row.cliente_id})"> 
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        ROWS_FOUND.textContent = DATA.message;
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

// Escuchar el evento input
duiInput.addEventListener('input', function (event) {
    // Obtener el valor actual del campo de entrada
    let value = event.target.value;

    // Eliminar cualquier guion existente
    value = value.replace(/-/g, '');

    // Verificar si se han ingresado los primeros ocho dígitos
    if (value.length >= 8) {
        // Insertar un guion después del séptimo dígito
        value = value.slice(0, 8) + '-' + value.slice(8);
    }

    // Asignar el valor modificado de vuelta al campo de entrada
    event.target.value = value;
});

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    MODAL_TITLE.textContent = 'Crear cliente';
    // Se prepara el formulario.
    SAVE_FORM.reset();

}

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async (id) => {
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idCliente', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(CLIENTE_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar cliente';
        // Se prepara el formulario.
        SAVE_FORM.reset();
        CLAVE_CLIENTE.disabled = true;
        CONFIRMAR_CLAVE.disabled = true;
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_CLIENTE.value = ROW.cliente_id;
        NOMBRE_CLIENTE.value = ROW.nombre;
        APELLIDO_CLIENTE.value = ROW.apellido;
        CORREO_CLIENTE.value = ROW.correo_electronico;
        TELEFONO_CLIENTE.value = ROW.telefono;
        DUI_CLIENTE.value = ROW.dui;
        NACIMIENTO_CLIENTE.value = ROW.fecha_nacimiento;
        DIRECCION_CLIENTE.value = ROW.direccion;

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
        FORM.append('idCliente', id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(CLIENTE_API, 'deleteRow', FORM);
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