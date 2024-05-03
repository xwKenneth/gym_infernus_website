/*
*   Controlador de uso general en las páginas web del sitio privado.
*   Sirve para manejar la plantilla del encabezado y pie del documento.
*/

// Constante para completar la ruta de la API.
const USER_API = 'services/admin/administrador.php';
// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');
MAIN.style.paddingTop = '75px';
MAIN.style.paddingBottom = '100px';
MAIN.classList.add('container');
// Se establece el título de la página web.
document.querySelector('title').textContent = 'InfernusGym - Shop';
// Constante para establecer el elemento del título principal.
const MAIN_TITLE = document.getElementById('mainTitle');
MAIN_TITLE.classList.add('text-center', 'py-3');


/*  Función asíncrona para cargar el encabezado y pie del documento.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const loadTemplate = async () => {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    const DATA = await fetchData(USER_API, 'getUser');
    // Se verifica si el usuario está autenticado, de lo contrario se envía a iniciar sesión.
    if (DATA && DATA.session) {
        // Se comprueba si existe un alias definido para el usuario, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se agrega el encabezado de la página web antes del contenido principal.
            MAIN.insertAdjacentHTML('beforebegin', `
            <header>
            <nav class="navbar fixed-top navbar-expand-lg" style="background-color: #F96060">
                <div class="container">
                    <a class="navbar-brand" href="index.html"><i class="bi bi-info-circle"></i><span>&nbsp; Información</span></a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav ms-auto">
                            <a class="nav-link" href="index.html"><i class="bi bi-house-door"></i> Inicio</a>
                            <a class="nav-link" href="signup.html"><i class="bi bi-person"></i> Usuario</a>
                            <a class="nav-link" href="clasificacion.html"><i class="bi bi-shop"></i> Tienda</a>
                            <a class="nav-link" href="carrito.html"><i class="bi bi-cart4"></i> Carrito</a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
            `);
            // Se agrega el pie de la página web después del contenido principal.
            MAIN.insertAdjacentHTML('afterend', `
            <footer id="footer">
            <nav class="navbar fixed-bottom" style="background-color: #F96060">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <a class="nav-link" href="terminos.html">  
                                <img src="../../resources/img/terminos.png" alt="Image" style="width: 50px; height: 50px;">
                                <span>Términos y condiciones</span>
                            </a>
                        </div>
                        <div class="col center-text">
                            <p>Derechos Reservados © [Año] Infernus Gym Shop. Todos los derechos están reservados.</p>
                        </div>
                    </div>
                </div>
            </nav>
        </footer>
            `);
            // Call the toggleFooterVisibility function to initially hide the footer
toggleFooterVisibility();
        } else {
            sweetAlert(3, DATA.error, false, 'index.html');
        }
    } else {
        // Se comprueba si la página web es la principal, de lo contrario se direcciona a iniciar sesión.
        if (location.pathname.endsWith('index.html')) {
            // Se agrega el encabezado de la página web antes del contenido principal.
            MAIN.insertAdjacentHTML('beforebegin', `
                <header>
                    <nav class="navbar fixed-top bg-body-tertiary">
                        <div class="container">
                            <a class="navbar-brand" href="index.html">
                                <img src="../../resources/img/logo.png" alt="inventory" width="50">
                            </a>
                        </div>
                    </nav>
                </header>
            `);
            // Se agrega el pie de la página web después del contenido principal.
            MAIN.insertAdjacentHTML('afterend', `
                <footer>
                    <nav class="navbar fixed-bottom bg-body-tertiary">
                        <div class="container">
                            <p><a class="nav-link" href="https://github.com/dacasoft/coffeeshop" target="_blank"><i class="bi bi-github"></i> CoffeeShop</a></p>
                            <p><i class="bi bi-envelope-fill"></i> dacasoft@outlook.com</p>
                        </div>
                    </nav>
                </footer>
            `);
        } else {
            location.href = 'index.html';
        }
    }
    
}
// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();

    // Event listener for scroll event to toggle footer visibility
    window.addEventListener('scroll', toggleFooterVisibility);
});
// Function to toggle footer visibility based on scroll position
function toggleFooterVisibility() {
    const footer = document.querySelector('#footer');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.clientHeight;

    // Calculate the maximum scroll position for the scrollbar
    const maxScroll = documentHeight - windowHeight;

    // Show footer only when scrollbar is at the bottom
    if (scrollPosition >= maxScroll) {
        footer.style.display = 'block';
    } else {
        footer.style.display = 'none';
    }
}

