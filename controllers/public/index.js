// Constante para establecer el formulario de iniciar sesión.
const SESSION_FORM = document.getElementById('sessionForm');
MAIN.style.paddingTop = '0px';
MAIN.style.paddingBottom = '0px';
MAIN.style.paddingLeft = '0px';
MAIN.classList.remove('container');

document.addEventListener('DOMContentLoaded', async function() {
    await loadTemplate();
    adjustMainPadding();
});

// Función para ajustar el padding del main
function adjustMainPadding() {
    const headerHeight = document.querySelector('header').offsetHeight;
    document.querySelector('main').style.paddingTop = `${headerHeight}px`;
}
