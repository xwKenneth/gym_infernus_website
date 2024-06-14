// gestion.js

// Constante para la URL de la API del cliente
const CLIENTE_API = 'services/public/cliente.php';

// Método asíncrono para verificar la autenticación del usuario
const checkAuthentication = async () => {
    try {
        // Realizar la solicitud utilizando la función fetchData
        const data = await fetchData(CLIENTE_API, 'readUsers', new FormData());

        if (data.status !== 1) {
            await sweetAlert(2, 'No has iniciado sesión'); // Error type = 2
            // No autenticado, redirigir a login.html después de mostrar el mensaje
            setTimeout(() => {
            window.location.href = 'login.html';
            }, 600); // Redirigir después de 2 segundos (2000 milisegundos)
        }
    } catch (error) {
        // Mostrar mensaje de error utilizando SweetAlert
        await sweetAlert(2, 'No se pudo verificar la autenticación'); // Error type = 2
    }
};

// Método asíncrono para cambiar la contraseña del usuario
const changePassword = async (currentPassword, newPassword, repeatPassword) => {
    try {
        // Validación básica del formulario en el lado del cliente
        if (!currentPassword || !newPassword || !repeatPassword) {
            throw new Error('Todos los campos son obligatorios');
        }

        if (newPassword !== repeatPassword) {
            throw new Error('Las contraseñas nuevas no coinciden');
        }

        // Crear un objeto FormData para enviar los datos al servidor
        const formData = new FormData();
        formData.append('claveActual', currentPassword);
        formData.append('claveNueva', newPassword);
        formData.append('confirmarClave', repeatPassword);

        // Realizar la solicitud utilizando la función fetchData
        const data = await fetchData(CLIENTE_API, 'changePassword', formData);

        if (data.status === 1) {
            // Éxito al cambiar la contraseña, mostrar SweetAlert de éxito
            await sweetAlert(1, data.message, true, 'index.html'); // Success type = 1
        } else {
            // Mostrar mensaje de error si no se pudo cambiar la contraseña
            await sweetAlert(2, data.error || 'No se pudo cambiar la contraseña'); // Error type = 2
        }
    } catch (error) {
        // Mostrar mensaje de error utilizando SweetAlert
        await sweetAlert(2, error.message || 'Ocurrió un problema al cambiar la contraseña'); // Error type = 2
    }
};

// Método del evento para cuando el documento ha cargado
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthentication(); // Llamada a la función para verificar la autenticación

    loadTemplate(); // Llamada a la función para cargar el encabezado y pie de página

    const form = document.querySelector('form#changePasswordForm'); // Obtener el formulario por su ID

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevenir la recarga de la página por defecto del formulario

            // Obtener los valores actuales de los campos de contraseña
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const repeatPassword = document.getElementById('repeat-password').value;

            // Llamar a la función changePassword con los datos de los campos
            await changePassword(currentPassword, newPassword, repeatPassword);
        });
    }
});
