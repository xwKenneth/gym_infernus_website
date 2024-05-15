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
    protected $nombre = null;
    protected $descripcion = null;
    protected $precio = null;
    protected $existencias = null;
    protected $proveedor = null;
    protected $marca = null;
    protected $imagen = null;
    protected $categoria = null;
    protected $estado = null;
    protected $fecha = null;
    protected $total = null;
    protected $cliente = null;

    protected $venta = null;
    protected $producto = null;
    protected $cantidad  = null;
    protected $direccion = null;
 

 


    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT detalle_venta_id, ventas.cliente_id, cliente.nombre AS nombre_cliente, producto.nombre AS nombre_producto, cantidad, 
        precio_unitario, subtotal, descuento, direccion_cliente
        FROM detalle_ventas
        INNER JOIN ventas ON detalle_ventas.venta_id = ventas.venta_id
        INNER JOIN producto ON detalle_ventas.producto_id = producto.producto_id
        INNER JOIN cliente ON ventas.cliente_id = cliente.cliente_id;
        WHERE producto.nombre LIKE ? OR cliente.nombre LIKE ?';              
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO detalle_ventas(venta_id, producto_id, cantidad, direccion_cliente)
                VALUES(?, ?, ?, ?)';

        $params = array($this->venta, $this->producto, $this->cantidad, $this->direccion);
        return Database::executeRow($sql, $params);
    }
    

    public function readAll()
    {
        $sql = 'SELECT detalle_venta_id, ventas.cliente_id, cliente.nombre AS nombre_cliente, producto.nombre AS nombre_producto, cantidad, 
        precio_unitario, subtotal, descuento, direccion_cliente
        FROM detalle_ventas
        INNER JOIN ventas ON detalle_ventas.venta_id = ventas.venta_id
        INNER JOIN producto ON detalle_ventas.producto_id = producto.producto_id
        INNER JOIN cliente ON ventas.cliente_id = cliente.cliente_id;
        ';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT detalle_venta_id, ventas.cliente_id, cliente.nombre AS nombre_cliente, producto.nombre AS nombre_producto, cantidad, 
        precio_unitario, subtotal, descuento, direccion_cliente
        FROM detalle_ventas
        INNER JOIN ventas ON detalle_ventas.venta_id = ventas.venta_id
        INNER JOIN producto ON detalle_ventas.producto_id = producto.producto_id
        INNER JOIN cliente ON ventas.cliente_id = cliente.cliente_id;
                WHERE detalle_venta_id = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT foto
                FROM producto
                WHERE producto_id = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE detalle_ventas
                SET producto_id = ?, cantidad = ?, direccion_cliente = ?
                WHERE detalle_venta_id = ?';
        $params = array(
            $this->producto, $this->cantidad, $this->direccion, $this->id
        );
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM detalle_ventas
                WHERE detalle_venta_id = ?';
        $params = array($this->id);
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
}
