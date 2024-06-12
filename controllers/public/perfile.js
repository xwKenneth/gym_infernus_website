// Muestra una alerta con información del usuario
function showInfo() {
    alert('Información del usuario');
}

// Previsualiza la imagen de perfil seleccionada
function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('profileImage');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

// Guarda los cambios realizados en la página de edición de perfil
function saveChanges() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // En una aplicación real, aquí enviarías los datos a un servidor para guardarlos
    alert(`¡Cambios guardados!\nNombre de usuario: ${username}\nContraseña: ${password}`);
    // Redirigir de nuevo a la página principal del perfil
    window.location.href = 'index.html';
}
