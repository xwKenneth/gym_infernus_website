<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class ValoracionHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $nombre = null;
    protected $fecha = null;
    protected $cliente = null;
    protected $producto = null;
    protected $calificacion = null;
    protected $comentario = null;
    protected $total = null;

    // Constante para establecer la ruta de las imágenes.

    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT valoracion_id, cliente_id, producto_id, nombre_producto,  
        CONCAT_WS(" ",nombre_cliente, apellido_cliente) AS "nombre_cliente", 
        calificacion ,comentario, fecha_valoracion
        FROM valoracion 
		  INNER JOIN cliente USING(cliente_id)
		INNER JOIN producto USING(producto_id)
        WHERE nombre_cliente LIKE ?';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO valoracion(producto_id, cliente_id, calificacion, comentario, fecha_valoracion)
                VALUES(?, ?, ?, ?, ?)';

        $params = array($this->producto, $this->cliente, $this->calificacion, $this->comentario, $this->fecha);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT valoracion_id, nombre_producto,  
        CONCAT_WS(" ", nombre_cliente, apellido_cliente) AS "nombre_cliente", 
        calificacion ,comentario, fecha_valoracion
        FROM valoracion 
		  INNER JOIN cliente USING(cliente_id)
		INNER JOIN producto USING(producto_id)';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT valoracion_id, cliente_id, producto_id, nombre_producto,  
        CONCAT_WS(" ",nombre_cliente, apellido_cliente) AS "nombre_cliente", 
        calificacion ,comentario, fecha_valoracion
        FROM valoracion 
		  INNER JOIN cliente USING(cliente_id)
		INNER JOIN producto USING(producto_id)
                WHERE valoracion_id = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE valoracion
                SET producto_id = ?, cliente_id = ?, calificacion = ?, comentario = ?, fecha_valoracion = ?
                WHERE valoracion_id = ?';
        $params = array(
            $this->producto, $this->cliente, $this->calificacion, $this->comentario, $this->fecha, $this->id
        );
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM valoracion
                WHERE valoracion_id = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
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
}
