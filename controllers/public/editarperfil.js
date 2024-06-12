document.addEventListener("DOMContentLoaded", function() {
    // Muestra una alerta con información del usuario
    document.querySelector('.info-bar button').addEventListener('click', function() {
        alert('Información del usuario');
    });

    // Previsualiza la imagen de perfil seleccionada
    document.getElementById('profilePhotoInput').addEventListener('change', function(event) {
        const reader = new FileReader();
        reader.onload = function() {
            const output = document.getElementById('profileImage');
            output.src = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    });

    // Guarda los cambios realizados en la página de edición de perfil
    document.getElementById('saveChangesButton').addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        // En una aplicación real, aquí enviarías los datos a un servidor para guardarlos
        alert(`¡Cambios guardados!\nNombre de usuario: ${username}\nContraseña: ${password}`);
        // Redirigir de nuevo a la página principal del perfil
        window.location.href = 'index.html';
    });
});
