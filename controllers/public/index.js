// Constante para establecer el formulario de iniciar sesión.
const SESSION_FORM = document.getElementById('sessionForm');
MAIN.style.paddingTop = '0px';
MAIN.style.paddingBottom = '0px';
MAIN.style.paddingLeft = '0px';
MAIN.classList.remove('container');
// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async function() {
    await loadTemplate();
});
