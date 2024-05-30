<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class PedidoHandler
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
    protected $direccion = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/productos/';

    public function searchRows($startDate, $endDate)
    {

        $sql = 'SELECT pedido_id, cliente_id ,fecha_registro, direccion_pedido,   CONCAT_WS(" ", nombre_cliente, apellido_cliente) 
        AS "NombreFull", estado_pedido
        FROM pedido INNER JOIN cliente USING(cliente_id)
                WHERE fecha_registro BETWEEN ? AND ?';
 
        $params = array($startDate, $endDate);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO pedido(cliente_id, direccion_pedido, estado_pedido, fecha_registro)
                VALUES(?, ?, ?, ?)';

        $params = array($this->cliente, $this->direccion, $this->estado, $this->fecha);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT pedido_id, fecha_registro, direccion_pedido, 
        CONCAT_WS(" ", nombre_cliente, apellido_cliente) AS "NombreFull", estado_pedido
        FROM pedido INNER JOIN cliente USING(cliente_id)
        ';
        return Database::getRows($sql);
    }

    public function getEstado()
    {
        $sql = "SELECT COLUMN_TYPE
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = 'pedido'
                  AND COLUMN_NAME = 'estado_pedido'";
        $result = Database::getRows($sql);
    
        if (!empty($result)) {
            $enumValues = explode(",", str_replace("'", "", $result[0]['COLUMN_TYPE']));
            $options = [];
    
            foreach ($enumValues as $value) {
                $options[] = [
                    'value' => $value,
                    'text' => ucfirst($value), // Puedes personalizar el texto según tus necesidades
                ];
            }
    
            return Database::getRows($sql);// Devuelve los valores como JSON
        }
    
        return '[]'; // En caso de que no se obtengan valores del enum
    }
    
    public function readOne()
    {

        $sql = 'SELECT pedido_id, cliente_id ,fecha_registro, direccion_pedido,   CONCAT_WS(" ", nombre_cliente, apellido_cliente) 
        AS "NombreFull", estado_pedido
        FROM pedido INNER JOIN cliente USING(cliente_id)
                WHERE pedido_id = ?';
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
    //El this sirve para metodos y funciones estaticas
    public function updateRow()
    {
        $sql = 'UPDATE pedido
                SET cliente_id = ?, direccion_pedido = ?, estado_pedido = ?, fecha_registro = ?
                WHERE pedido_id = ?';
        $params = array(
            $this->cliente, $this->direccion, $this->estado, $this->fecha, $this->id);
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
