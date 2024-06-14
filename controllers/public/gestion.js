// Constante para la URL de la API del cliente
const CLIENTE_API = 'services/public/cliente.php';

// Función asíncrona para cambiar la contraseña del usuario
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
            // Éxito al cambiar la contraseña
            swal({
                title: 'Contraseña cambiada',
                text: data.message,
                icon: 'success',
                button: 'Aceptar'
            }).then(() => {
                // Redireccionar a una página o realizar otras acciones necesarias
                window.location.href = 'index.html';
            });
        } else {
            // Mostrar mensaje de error si no se pudo cambiar la contraseña
            throw new Error(data.error || 'No se pudo cambiar la contraseña');
        }
    } catch (error) {
        // Mostrar mensaje de error utilizando SweetAlert o cualquier otro método
        swal({
            title: 'Error',
            text: error.message,
            icon: 'error',
            button: 'Aceptar'
        });
    }
};

// Método del evento para cuando el documento ha cargado
document.addEventListener('DOMContentLoaded', () => {
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
