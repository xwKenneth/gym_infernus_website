'use strict';
// Constante para la URL de la API del cliente
const CLIENTE_API = 'services/public/cliente.php';
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('editProfileForm'),
    ID_MARCA = document.getElementById('idMarca'),
    NOMBRE_CLIENTE = document.getElementById('nombreCliente'),
    APELLIDO_CLIENTE = document.getElementById('apellidoCliente'),
    CORREO_CLIENTE = document.getElementById('correoCliente'),
    TELEFONO_CLIENTE = document.getElementById('telefonoCliente'),
    DUI_CLIENTE = document.getElementById('duiCliente'),
    NACIMIENTO_CLIENTE = document.getElementById('fechaNacimientoCliente'),
    DIRRECION_CLIENTE = document.getElementById('direccionCliente');

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(CLIENTE_API, 'editProfile', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillForm();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

document.querySelectorAll('.needs-validation').forEach(form => {
    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    }, false);
});

const applyMask = (element, mask) => {
    const maskOptions = { mask };
    const maskInstance = IMask(element, maskOptions);
    maskInstance.updateValue(); 
    return maskInstance;
};

const fillForm = async (form = null) => {
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CLIENTE_API, 'readCliente', form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        const ROW = DATA.dataset;
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        NOMBRE_CLIENTE.value = ROW.nombre_cliente;
        APELLIDO_CLIENTE.value = ROW.apellido_cliente;
        TELEFONO_CLIENTE.value = ROW.telefono_cliente;
        DUI_CLIENTE.value = ROW.dui_cliente;
        NACIMIENTO_CLIENTE.value = ROW.nacimiento_cliente;
        CORREO_CLIENTE.value = ROW.correo_cliente;
        DIRRECION_CLIENTE.value = ROW.direccion_cliente;
        //Aplicar una mascara a los campos
        applyMask(TELEFONO_CLIENTE, '0000-0000');
        applyMask(DUI_CLIENTE, '00000000-0');
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

// Método del evento para cuando el documento ha cargado
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();


    await fillForm();
});
