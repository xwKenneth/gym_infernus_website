<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class DetalleVentaHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $pedido = null;
    protected $producto = null;
    protected $cantidad = null;
    protected $precio = null;
    protected $subtotal = null;

    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT detalle_pedido_id, pedido.cliente_id,  nombre_cliente, nombre_producto, cantidad, 
        detalle_pedido.precio_producto, subtotal, direccion_pedido, detalle_pedido.pedido_id, detalle_pedido.producto_id
        FROM detalle_pedido
        INNER JOIN pedido ON detalle_pedido.pedido_id = pedido.pedido_id
        INNER JOIN producto ON detalle_pedido.producto_id = producto.producto_id
        INNER JOIN cliente ON pedido.cliente_id = cliente.cliente_id
        WHERE nombre_producto LIKE ? OR nombre_cliente LIKE ?';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO detalle_pedido(pedido_id, producto_id, cantidad)
                VALUES(?, ?, ?)';

        $params = array($this->pedido, $this->producto, $this->cantidad);
        return Database::executeRow($sql, $params);
    }


    public function readAll()
    {
        $sql = 'SELECT detalle_pedido_id, pedido.cliente_id,  nombre_cliente, nombre_producto, cantidad, 
        detalle_pedido.precio_producto, subtotal, direccion_pedido, pedido.pedido_id AS pedido_id
        FROM detalle_pedido
        INNER JOIN pedido ON detalle_pedido.pedido_id = pedido.pedido_id
        INNER JOIN producto ON detalle_pedido.producto_id = producto.producto_id
        INNER JOIN cliente ON pedido.cliente_id = cliente.cliente_id WHERE pedido.pedido_id = ?
        ';
        $params = array($this->pedido);
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT detalle_pedido_id, pedido.cliente_id,  nombre_cliente, nombre_producto, cantidad, 
        detalle_pedido.precio_producto, subtotal, direccion_pedido, pedido.pedido_id AS pedido_id, detalle_pedido.producto_id
        FROM detalle_pedido
        INNER JOIN pedido ON detalle_pedido.pedido_id = pedido.pedido_id
        INNER JOIN producto ON detalle_pedido.producto_id = producto.producto_id
        INNER JOIN cliente ON pedido.cliente_id = cliente.cliente_id
                WHERE detalle_pedido_id = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT imagen_producto
                FROM producto
                WHERE producto_id = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE detalle_pedido
                SET producto_id = ?, cantidad = ?
                WHERE detalle_pedido_id = ?';
        $params = array(
           $this->producto, $this->cantidad,$this->id
        );
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM detalle_pedido
                WHERE detalle_pedido_id = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function validarExistencias()
    {
        $sql = 'SELECT existencias_producto
                FROM producto
                WHERE producto_id = ?';
        $params = array($this->producto);
        return Database::getRow($sql, $params);
    }
    /*

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
*/
    /*
    *   Métodos para generar gráficos.
    */
    public function cantidadProductosCategoria()
    {
        $sql = 'SELECT nombre_categoria, COUNT(id_producto) cantidad
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                GROUP BY nombre_categoria ORDER BY cantidad DESC LIMIT 5';
        return Database::getRows($sql);
    }

    public function porcentajeProductosCategoria()
    {
        $sql = 'SELECT nombre_categoria, ROUND((COUNT(id_producto) * 100.0 / (SELECT COUNT(id_producto) FROM producto)), 2) porcentaje
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                GROUP BY nombre_categoria ORDER BY porcentaje DESC';
        return Database::getRows($sql);
    }

    /*
    *   Métodos para generar reportes.
    */
    /*
    public function productosCategoria()
    {
        $sql = 'SELECT nombre_producto, precio_producto, estado_producto
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                WHERE id_categoria = ?
                ORDER BY nombre_producto';
        $params = array($this->categoria);
        return Database::getRows($sql, $params);
    }
    */
}
