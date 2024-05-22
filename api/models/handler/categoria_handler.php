<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class CategoriaHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $descuento = null;
    protected $descripcion = null;
    protected $imagen = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/categorias/';

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT categoria_id, nombre_categoria, descuento_categoria, imagen_categoria
                FROM categoria
                WHERE nombre_categoria LIKE ? 
                ORDER BY nombre_categoria';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO categoria(nombre_categoria, descuento_categoria, imagen_categoria)
                VALUES(?, ?, ?)';
        $params = array($this->nombre, $this->descuento, $this->imagen);
        
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT categoria_id, nombre_categoria, descuento_categoria, imagen_categoria
                FROM categoria
                ORDER BY nombre_categoria';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT imagen_categoria, nombre_categoria, descuento_categoria, categoria_id
                FROM categoria
                WHERE categoria_id = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readFilename()
    {
        $sql = 'SELECT imagen_categoria
                FROM categoria
                WHERE categoria_id = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE categoria
                SET imagen_categoria = ?, nombre_categoria = ?, descuento_categoria = ?
                WHERE categoria_id = ?';
        $params = array($this->imagen, $this->nombre, $this->descuento, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM categoria
                WHERE categoria_id = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
