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
                <nav class="navbar fixed-top navbar-expand-lg" style="background-color: rgb(249 96 96 / 100%)">
                    <div class="container">
                        <a class="navbar-brand" href="dashboard.html">
                            <img src="../../resources/img/logo.png" alt="CoffeeShop" width="50">
                        </a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
                            aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarContent">
                            <ul class="navbar-nav ms-auto">
                                <li class="nav-item">
                                    <a class="nav-link" href="../../views/admin/administrar_productos.html"><i class="bi bi-cart-fill"></i> Productos</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="../../views/admin/administrar_categorias.html"><i class="bi bi-bag-fill"></i> Categorías</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="../../views/admin/administrar_clientes.html"><i class="bi bi-person"></i> Clientes</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="../../views/admin/administrar_empleados.html"><i class="bi bi-people"></i> Empleados</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link"><i class="bi bi-shield-shaded"></i> Cuenta: Admin</a>
                                </li>
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown"
                                        aria-expanded="false"><i class="bi bi-three-dots"></i> Más<b></b></a>
                                    <ul class="dropdown-menu" style="background-color: rgb(249 96 96 / 80%);">
                                        <li><a class="dropdown-item" href="../../views/admin/administrar_pedidos.html"><i class="bi bi-clipboard2-check"></i> Pedido</a></li>
                                        <li>
                                            <hr class="dropdown-divider">
                                        </li>
                                        <li>
                                            <hr class="dropdown-divider">
                                        </li>
                                        <li><a class="dropdown-item" href="../../views/admin/administrar_valoracion.html" onclick=""><i class="bi bi-chat-dots-fill"></i> Valoración</a></li>
                                        <li>
                                            <hr class="dropdown-divider">
                                        </li>
                                        <li><a class="dropdown-item" href="../../views/admin/administrar_marcas.html" onclick=""><i class="bi bi-award"></i> Marca</a></li>
                                        <li>
                                            <hr class="dropdown-divider">
                                        </li>
                                        <li><a class="dropdown-item" href="../../views/admin/administrar_proveedores.html" onclick=""><i class="bi bi-truck"></i> Proveedor</a></li>
                                        <li>
                                            <hr class="dropdown-divider">
                                        </li>
                                        <li><a class="dropdown-item" href="javascript:;" onclick="logOut()"><i class="bi bi-box-arrow-in-right"></i> Cerrar Sesión</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            `);
            // Se agrega el pie de la página web después del contenido principal.
            MAIN.insertAdjacentHTML('afterend', `
            <footer>
                <nav class="navbar fixed-bottom" style="background-color: rgb(249 96 96 / 100%)">
                    <div class="container">
                        <div class="row justify-content-center"> <!-- Center the content horizontally -->
                            <div class="col-md-6 center-text"> <!-- Adjust the column width as needed -->
                                <p style=" white-space: nowrap; text-overflow: ellipsis;">Derechos Reservados © [Año] Infernus Gym Shop. Todos los derechos están reservados.</p>
                            </div>
                        </div>
                    </div>
                </nav>
            </footer>
            `);
        } else {
            sweetAlert(3, DATA.error, false, 'index.html');
        }
    } else {
        // Se comprueba si la página web es la principal, de lo contrario se direcciona a iniciar sesión.
        if (location.pathname.endsWith('index.html')) {
            // Se agrega el encabezado de la página web antes del contenido principal.
            MAIN.insertAdjacentHTML('beforebegin', `
                <header>
                    <nav class="navbar fixed-top" style="background-color: rgb(201 88 88 / 46%)" >
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
                    <nav class="navbar fixed-bottom" style="background-color: rgb(201 88 88 / 46%)">
                        <div class="container">
                            <p><i class="bi bi-envelope-fill"></i> kenzz@gyminfernus.com</p>
                        </div>
                    </nav>
                </footer>
            `);
        } else {
            location.href = 'index.html';
        }
    }
}

// Function to toggle footer visibility based on scroll position
function toggleFooterVisibility() {
    const footer = document.querySelector('footer');
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
// Event listener for scroll event to toggle footer visibility
window.addEventListener('scroll', toggleFooterVisibility);