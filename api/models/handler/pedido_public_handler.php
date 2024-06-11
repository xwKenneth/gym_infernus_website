<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de las tablas PEDIDO y DETALLE_PEDIDO.
*/
class PedidoPublicHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id_pedido = null;
    protected $id_detalle = null;
    protected $cliente = null;
    protected $producto = null;
    protected $cantidad = null;
    protected $estado = null;
    protected $categoria = null;

    /*
    *   ESTADOS DEL PEDIDO
    *   Pendiente (valor por defecto en la base de datos). Pedido en proceso y se puede modificar el detalle.
    *   Finalizado. Pedido terminado por el cliente y ya no es posible modificar el detalle.
    *   Entregado. Pedido enviado al cliente.
    *   Anulado. Pedido cancelado por el cliente después de ser finalizado.
    */

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    // Método para verificar si existe un pedido en proceso con el fin de iniciar o continuar una compra.


 

    public function getOrder()
    {
        $this->estado = 'Pendiente';
        $sql = 'SELECT pedido_id
                FROM pedido
                WHERE estado_pedido = ? AND cliente_id = ?';
        $params = array($this->estado, $_SESSION['idCliente']);
        if ($data = Database::getRow($sql, $params)) {
            $_SESSION['idPedido'] = $data['pedido_id'];
            return true;
        } else {
            return false;
        }
    }
    // Método para iniciar un pedido en proceso.
    public function startOrder()
    {
        if ($this->getOrder()) {
            return true;
        } else {
            $sql = 'INSERT INTO pedido(direccion_pedido, cliente_id)
                    VALUES((SELECT direccion_cliente FROM cliente WHERE cliente_id = ?), ?)';
            $params = array($_SESSION['idCliente'], $_SESSION['idCliente']);
            // Se obtiene el ultimo valor insertado de la llave primaria en la tabla pedido.
            if ($_SESSION['idPedido'] = Database::getLastRow($sql, $params)) {
                return true;
            } else {
                return false;
            }
        }
    }
    public function readDetail()
    {
        $sql = 'SELECT detalle_pedido_id, nombre_producto, detalle_pedido.precio_producto, detalle_pedido.cantidad
                FROM detalle_pedido
                INNER JOIN pedido USING(pedido_id)
                INNER JOIN producto USING(producto_id)
                WHERE pedido_id = ?';
        $params = array($_SESSION['idPedido']);
        return Database::getRows($sql, $params);
    }
    // Método para agregar un producto al carrito de compras.

    public function createDetail()
    {
        $sql = 'INSERT INTO detalle_pedido(producto_id, precio_producto, cantidad, pedido_id)
                VALUES(?, (SELECT precio_producto FROM producto WHERE producto_id = ?), ?, ?)';

        $params = array($this->producto, $this->producto, $this->cantidad, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para finalizar un pedido por parte del cliente.
    public function finishOrder()
    {
        $this->estado = 'Finalizado';
        $sql = 'UPDATE pedido
                SET estado_pedido = ?
                WHERE pedido_id = ?';
        $params = array($this->estado, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para actualizar la cantidad de un producto agregado al carrito de compras.
    public function updateDetail()
    {
        $sql = 'UPDATE detalle_pedido
                SET cantidad = ?
                WHERE detalle_pedido_id = ? AND pedido_id = ?';
        $params = array($this->cantidad, $this->id_detalle, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar un producto que se encuentra en el carrito de compras.
    public function deleteDetail()
    {
        $sql = 'DELETE FROM detalle_pedido
                WHERE detalle_pedido_id = ? AND pedido_id = ?';
        $params = array($this->id_detalle, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }
    public function readProductosCategoria()
    {
        $sql = 'SELECT producto_id, foto, nombre, descripcion, precio, existencias
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                WHERE categoria_id = ? AND estado = true
                ORDER BY nombre';
        $params = array($this->categoria);
        return Database::getRows($sql, $params);
    }
}
