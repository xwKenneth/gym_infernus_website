<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class ProductoHandler
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

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/productos/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT producto.producto_id, producto.nombre AS nombre_producto, descripcion, precio, producto.foto, proveedor.nombre AS nombre_proveedor, marcas.nombre AS nombre_marca, categoria.nombre AS nombre_categoria, existencias, estado
               FROM producto
               INNER JOIN categoria USING(categoria_id)
                INNER JOIN proveedor USING(proveedor_id)
                INNER JOIN marcas USING(marca_id)
                WHERE producto.nombre LIKE ? 
                ORDER BY nombre_producto';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO producto(nombre, descripcion, precio, foto, proveedor_id, marca_id, categoria_id, existencias, estado)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array(
            $this->nombre, $this->descripcion, $this->precio, $this->imagen, $this->proveedor, $this->marca,
            $this->categoria,  $this->existencias, $this->estado
        );
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT producto.producto_id, producto.nombre AS nombre_producto, descripcion, precio, producto.foto, proveedor.nombre AS nombre_proveedor, marcas.nombre AS nombre_marca, categoria.nombre AS nombre_categoria, existencias, estado
        FROM producto
        INNER JOIN categoria USING(categoria_id)
        INNER JOIN proveedor USING(proveedor_id)
        INNER JOIN marcas USING(marca_id)
        ORDER BY producto.nombre';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT producto_id, nombre, descripcion, precio, foto, proveedor_id, marca_id, categoria_id, existencias, estado
                FROM producto
                WHERE producto_id = ?';
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
        $sql = 'UPDATE producto
                SET nombre = ?, descripcion = ?, precio = ?, foto = ?, proveedor_id = ?, marca_id = ?, categoria_id =?,
                existencias= ?, estado= ?
                WHERE producto_id = ?';
        $params = array(
            $this->nombre, $this->descripcion, $this->precio, $this->imagen, $this->proveedor, $this->marca,  $this->categoria,
            $this->existencias, $this->estado, $this->id
        );
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM producto
                WHERE producto_id = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function getProductos()
    {
        $sql = "SELECT producto_id, CONCAT_WS(' ', producto.producto_id, producto.nombre) AS `producto_nombre` FROM producto";
        return Database::getRows($sql);
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
