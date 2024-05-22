    <?php
    // Se incluye la clase del modelo.
    require_once('../../models/data/proveedor_data.php');

    // Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_GET['action'])) {
      // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
      session_start();
      // Se instancia la clase correspondiente.
      $proveedor = new ProveedorData;
      // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
      $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
      // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
      if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
          case 'searchRows':
            if (!Validator::validateSearch($_POST['search'])) {
              $result['error'] = Validator::getSearchError();
            } elseif ($result['dataset'] = $proveedor->searchRows()) {
              $result['status'] = 1;
              $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
            } else {
              $result['error'] = 'No hay coincidencias';
            }
            break;
          case 'createRow':
            $_POST = Validator::validateForm($_POST);
            if (
              !$proveedor->setNombre($_POST['nombreProveedor']) or
              !$proveedor->setTelefono($_POST['telefonoProveedor']) or
              !$proveedor->setDireccion($_POST['direccionProveedor'])
            ) {
              $result['error'] = $proveedor->getDataError();
            } elseif ($proveedor->createRow()) {
              $result['status'] = 1;
              $result['message'] = 'Proveedor creado correctamente'; // Cambio de 'Administrador' a 'proveedor'
            } else {
              $result['error'] = 'Ocurrió un problema al crear el proveedor'; // Cambio de 'administrador' a 'proveedor'
            }
            break;
          case 'readAll':
            if ($result['dataset'] = $proveedor->readAll()) {
              $result['status'] = 1;
              $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
            } else {
              $result['error'] = 'No existen proveedores registrados';
            }
            break;
          case 'readOne':
            if (!$proveedor->setId($_POST['idProveedor'])) {
              $result['error'] = 'Proveedor incorrecto';
            } elseif ($result['dataset'] = $proveedor->readOne()) {
              $result['status'] = 1;
            } else {
              $result['error'] = 'Proveedor inexistente';
            }
            break;
          case 'updateRow':
            $_POST = Validator::validateForm($_POST);
            if (
              !$proveedor->setNombre($_POST['nombreProveedor']) or
              !$proveedor->setTelefono($_POST['telefonoProveedor']) or
              !$proveedor->setDireccion($_POST['direccionProveedor']) or
              !$proveedor->setId($_POST['idProveedor'])
            ) {
              $result['error'] = $proveedor->getDataError();
            } elseif ($proveedor->updateRow()) {
              $result['status'] = 1;
              $result['message'] = 'Proveedor modificado correctamente';
            } else {
              $result['error'] = 'Ocurrió un problema al modificar el proveedor';
            }
            break;
          case 'deleteRow':
            if (!$proveedor->setId($_POST['idProveedor'])) {
              $result['error'] = $proveedor->getDataError();
            } elseif ($proveedor->deleteRow()) {
              $result['status'] = 1;
              $result['message'] = 'Proveedor eliminado correctamente';
            } else {
              $result['error'] = 'Ocurrió un problema al eliminar el proveedor';
            }
            break;
          case 'getUser':
            if (isset($_SESSION['aliasAdministrador'])) {
              $result['status'] = 1;
              $result['username'] = $_SESSION['aliasAdministrador'];
            } else {
              $result['error'] = 'Alias de proveedor indefinido';
            }
            break;
          case 'logOut':
            if (session_destroy()) {
              $result['status'] = 1;
              $result['message'] = 'Sesión eliminada correctamente';
            } else {
              $result['error'] = 'Ocurrió un problema al cerrar la sesión';
            }
            break;
          default:
            $result['error'] = 'Acción no disponible dentro de la sesión';
        }
      }
      // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
      $result['exception'] = Database::getException();
      // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
      header('Content-type: application/json; charset=utf-8');
      // Se imprime el resultado en formato JSON y se retorna al controlador.
      print(json_encode($result));
    } else {
      print(json_encode('Recurso no disponible'));
    }
