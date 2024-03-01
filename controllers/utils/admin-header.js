/*
*   Controlador es de uso general en las páginas web del sitio público.
*   Sirve para manejar las plantillas del encabezado y pie del documento.
*/

// Constante para completar la ruta de la API.
const USER_API = 'services/public/cliente.php';
// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');
MAIN.style.paddingTop = '75px';
MAIN.style.paddingBottom = '100px';
MAIN.classList.add('container');
// Se establece el título de la página web.
document.querySelector('title').textContent = 'CoffeeShop - Dashboard';
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
    // Se comprueba si el usuario está autenticado para establecer el encabezado respectivo.
    if (DATA && DATA.session) {

        // Se verifica si la página web no es el inicio de sesión, de lo contrario se direcciona a la página web principal.
        if (!location.pathname.endsWith('login.html')) {
            // Se agrega el encabezado de la página web antes del contenido principal.
            MAIN.insertAdjacentHTML('beforebegin', `
            <header>
            <link type="text/css" rel="stylesheet" href="../../resources/css/style-index.css">

            <nav class="navbar fixed-top navbar-expand-lg" style="background-color: rgb(201 88 88 / 46%)">
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
                                <a style="color: white;" class="nav-link disabled" href=../../views/admin/administrar_productos.html">Productos</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="../../views/admin/administrar_categorias.html">Categorías</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="../../views/admin/administrar_clientes.html">Clientes</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="../../views/admin/administrar_empleados.html">Empleados</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="">Cuenta: Admnistrador</a>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown"
                                    aria-expanded="false">Cuenta: <b>${DATA.username}</b></a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="profile.html">Editar perfil</a></li>
                                    <li>
                                        <hr class="dropdown-divider">
                                    </li>
                                    <li><a class="dropdown-item" href="#" onclick="logOut()">Cerrar sesión</a></li>
                                </ul>
                            </li>
                        </ul>
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
                            <a class="nav-link" href="../../views/admin/administrar_categoria.html"><i class="bi bi-bag-fill"></i> Categorías</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="../../views/admin/administrar_clientes.html"><i class="bi bi-person"></i> Clientes</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="../../views/admin/administrar_empleados.html"><i class="bi bi-people"></i> Empleados</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="../../views/admin/administrar_empleados.html"><i class="bi bi-shield-shaded"></i> Cuenta: Admin</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown"
                                aria-expanded="false"><i class="bi bi-three-dots"></i> Más<b></b></a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="profile.html"><img src="../../resources/img/icons/ventas.png" width="20"> Venta</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="#" onclick="logOut()" ><img src="../../resources/img/icons/informacion.png" width="20"> Detalle Venta</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="#" onclick=""><img src="../../resources/img/icons/valoracion.png" width="20"> Valoración</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="#" onclick=""><img src="../../resources/img/icons/marca.png"  width="20"> Marca</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="#" onclick=""><img src="../../resources/img/icons/cargo.png" width="20"> Cargo</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    
        `);
    }
    // Se agrega el pie de la página web después del contenido principal.
    MAIN.insertAdjacentHTML('afterend', `
    <footer>
        <nav class="navbar fixed-bottom" style="background-color: rgb(201 88 88 / 46%)">
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

}