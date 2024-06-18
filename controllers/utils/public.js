// Constante para completar la ruta de la API.
const USER_API = 'services/public/cliente.php';

// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');
MAIN.style.paddingTop = '75px';
MAIN.style.paddingBottom = '100px';
MAIN.classList.add('container');

// Se establece el título de la página web.
document.querySelector('title').textContent = 'InfernusGym - Shop';

// Constante para establecer el elemento del título principal.
const MAIN_TITLE = document.getElementById('mainTitle');
MAIN_TITLE.classList.add('text-center');

// Función para agregar el CSS por defecto al documento.
function addDefaultCSS() {
    const style = document.createElement('style');
    style.textContent = `
        html, body {
            height: 100%;
            margin: 0;
            display: flex;
            flex-direction: column;
        }
        main {
            flex: 1;
        }
    `;
    document.head.appendChild(style);
}

/* Función asíncrona para cargar el encabezado y pie del documento.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const loadTemplate = async () => {
    // Petición para obtener el nombre del usuario que ha iniciado sesión.
    const DATA = await fetchData(USER_API, 'getUser');
    
    // Se comprueba si el usuario está autenticado para establecer el encabezado respectivo.
    if (DATA.session) {
        // Se verifica si la página web no es el inicio de sesión, de lo contrario se direcciona a la página web principal.
        if (!location.pathname.endsWith('login.html')) {
            // Se agrega el encabezado de la página web antes del contenido principal.
            MAIN.insertAdjacentHTML('beforebegin', `
                <header>
                    <nav class="navbar fixed-top navbar-expand-lg" style="background-color: rgb(201 88 88 / 46%)">
                        <div class="container">
                            <a class="navbar-brand" href="index.html"><img src="../../resources/img/logo.png" height="50" alt="GymInfernus"></a>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                                <div class="navbar-nav ms-auto">
                                    <a class="nav-link" href="clasificacion.html"><i class="bi bi-shop"></i> Catálogo</a>
                                    <a class="nav-link" href="carrito.html"><i class="bi bi-cart"></i> Carrito</a>
                                    <a class="nav-link" href="historial.html"><i class="bi bi-clock-history"></i> Historial</a>
                                    <a class="nav-link" href="contraseña.html"><i class="bi bi-person-fill"></i> Perfil</a>
                                    <a class="nav-link" href="#" onclick="logOut()"><i class="bi bi-box-arrow-left"></i> Cerrar sesión</a>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
            `);
        } else {
            location.href = 'index.html';
        }
    } else {
        // Se agrega el encabezado de la página web antes del contenido principal.
        MAIN.insertAdjacentHTML('beforebegin', `
        <header>
            <nav class="navbar fixed-top navbar-expand-lg" style="background-color: rgb(201 88 88 / 46%)">
                <div class="container">
                    <a class="navbar-brand" href="index.html"><i class="bi bi-info-circle"></i><span>&nbsp; Información</span></a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav ms-auto">
                            <a class="nav-link" href="index.html"><i class="bi bi-house-door"></i> Inicio</a>
                            <a class="nav-link" href="login.html"><i class="bi bi-person"></i> Usuario</a>
                            <a class="nav-link" href="clasificacion.html"><i class="bi bi-shop"></i> Tienda</a>
                            <a class="nav-link" href="carrito.html"><i class="bi bi-cart4"></i> Carrito</a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        `);
    }
    
    // Se agrega el pie de la página web después del contenido principal.
    MAIN.insertAdjacentHTML('afterend', `
    <footer id="footer">
        <nav class="navbar sticky-bottom" style="background-color: rgb(201 88 88 / 46%)">
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
}

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    addDefaultCSS();
    
});

// Function to toggle footer visibility based on scroll position
function toggleFooterVisibility() {
    const footer = document.querySelector('#footer');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.clientHeight;

    const maxScroll = documentHeight - windowHeight;

    if (scrollPosition >= maxScroll || scrollPosition === 0) {
        footer.style.display = 'block';
    } else {
        footer.style.display = 'none';
    }
}
