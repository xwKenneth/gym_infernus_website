<?php
// Se incluye la clase del modelo.
require_once('../../models/data/pedido_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $pedido = new PedidoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if (!empty($_POST['startDate']) && !empty($_POST['endDate'])) {
                    $startDate = $_POST['startDate'];
                    $endDate = $_POST['endDate'];
                    // Validar las fechas
                    if (!Validator::validateDateSQL($startDate) || !Validator::validateDateSQL($endDate)) {
                        $result['error'] = Validator::getSearchError();
                    } else {
                        // Llamada a la función de búsqueda pasando las fechas sin convertir
                        $result['dataset'] = $pedido->searchRows($startDate, $endDate);
                        if ($result['dataset']) {
                            $result['status'] = 1;
                            $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                        } else {
                            $result['error'] = 'No hay coincidencias';
                        }
                    }
                } else {
                    $result['error'] = 'Fechas no especificadas';
                }
                break;
            case 'createRow':
                // Validar y registrar los datos del formulario
                $_POST = Validator::validateForm($_POST);

                // Validar los datos y procesar la creación de la venta
                if (
                    !$pedido->setFechaVenta($_POST['fechaVenta']) or
                    !$pedido->setTotalVenta($_POST['totalVenta']) or
                    !$pedido->setCliente($_POST['clienteVenta'])
                ) {
                    // Error de validación
                    $result['error'] = $pedido->getDataError();
                    error_log('Error de validación: ' . $pedido->getDataError());
                } elseif ($pedido->createRow()) {
                    // Venta creada correctamente
                    $result['status'] = 1;
                    $result['message'] = 'Venta creada correctamente';
                } else {
                    // Error general al crear la venta
                    $result['error'] = 'Ocurrió un problema al crear la venta';
                    error_log('Error al crear la venta: Ocurrió un problema al crear la venta');
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $pedido->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen ventas registradas';
                }
                break;
            case 'readOne':
                if (!$pedido->setId($_POST['idVenta'])) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($result['dataset'] = $pedido->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Venta inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$pedido->setFechaVenta($_POST['fechaVenta']) or
                    !$pedido->setTotalVenta($_POST['totalVenta']) or
                    !$pedido->setCliente($_POST['clienteVenta']) or
                    !$pedido->setId($_POST['idVenta'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Venta modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la venta';
                }
                break;
            case 'deleteRow':
                if (
                    !$pedido->setId($_POST['idVenta'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($pedido->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto eliminado correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($pedido::RUTA_IMAGEN, $pedido->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el producto';
                }
                break;
            case 'cantidadProductosCategoria':
                if ($result['dataset'] = $pedido->cantidadProductosCategoria()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            case 'porcentajeProductosCategoria':
                if ($result['dataset'] = $pedido->porcentajeProductosCategoria()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
