// Constante para establecer el formulario de registro.
const SESSION_FORM = document.getElementById('sessionForm');
MAIN.style.paddingTop = '55px';
MAIN.style.paddingBottom = '75px';
MAIN.style.paddingLeft = '0px';
MAIN.classList.remove('container');
// Método del evento para cuando el documento ha cargado.
const telefonoInput = document.getElementById('telefonoCliente');
const duiInput = document.getElementById('duiCliente');

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
    } else {
        event.target.classList.remove('invalid');
    }
});

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


document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Se establece el título del contenido principal.
    reCAPTCHA();
    MAIN_TITLE.textContent = 'Crear cuenta';
});

// Método del evento para cuando se envía el formulario de registro.
SESSION_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SESSION_FORM);
    // Petición para determinar si el cliente se encuentra registrado.
    const DATA = await fetchData(USER_API, 'signUp', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        sweetAlert(1, DATA.message, true, 'login.html');
    } else if (DATA.recaptcha) {
        sweetAlert(2, DATA.error, false, 'index.html');
    } else {
        sweetAlert(2, DATA.error, false);
        // Se genera un nuevo token cuando ocurre un problema.
        reCAPTCHA();
    }
});

/*
*   Función para obtener un token del reCAPTCHA y asignarlo al formulario.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
function reCAPTCHA() {
    // Método para generar el token del reCAPTCHA.
    grecaptcha.ready(() => {
        // Constante para establecer la llave pública del reCAPTCHA.
        const PUBLIC_KEY = '6LdBzLQUAAAAAJvH-aCUUJgliLOjLcmrHN06RFXT';
        // Se obtiene un token para la página web mediante la llave pública.
        grecaptcha.execute(PUBLIC_KEY, { action: 'homepage' }).then((token) => {
            // Se asigna el valor del token al campo oculto del formulario
            document.getElementById('gRecaptchaResponse').value = token;
        });
    });
}