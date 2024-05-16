<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class VentaHandler
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

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/productos/';
    
    public function searchRows($startDate, $endDate)
    {

        $sql = 'SELECT venta_id, fecha, total, CONCAT_WS(" ",cliente.nombre, cliente.apellido) AS "NombreFull"
                 FROM ventas 
                 INNER JOIN cliente USING(cliente_id)
                 WHERE fecha BETWEEN ? AND ?';
        $params = array($startDate, $endDate);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO ventas(fecha, total, cliente_id)
                VALUES(?, ?, ?)';

        $params = array($this->fecha, $this->total, $this->cliente);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT venta_id, fecha, total, CONCAT_WS(" ",cliente.nombre, cliente.apellido) AS "NombreFull"
        FROM ventas INNER JOIN cliente USING(cliente_id)
        ';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT venta_id, fecha, total, cliente_id
                FROM ventas
                WHERE venta_id = ?';
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
        $sql = 'UPDATE ventas
                SET fecha = ?, total = ?, cliente_id = ?
                WHERE venta_id = ?';
        $params = array(
            $this->fecha, $this->total, $this->cliente, $this->id
        );
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM ventas
                WHERE venta_id = ?';
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
