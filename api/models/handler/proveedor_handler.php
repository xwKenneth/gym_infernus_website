<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla CLIENTE.
*/
class ProveedorHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $correo = null;
    protected $telefono = null;
    protected $dui = null;
    protected $nacimiento = null;
    protected $direccion = null;
    protected $clave = null;
    protected $estado = null;

    /*
    *   Métodos para gestionar la cuenta del cliente.
    */

    public function checkStatus()
    {
        if ($this->estado) {
            $_SESSION['cliente_id'] = $this->id;
            $_SESSION['correo_electronico'] = $this->correo;
            return true;
        } else {
            return false;
        }
    }


    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT proveedor_id, nombre_proveedor, telefono_proveedor, direccion_proveedor
                FROM proveedor
                WHERE nombre_proveedor LIKE ? 
                ORDER BY nombre_proveedor';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO proveedor(nombre_proveedor, telefono_proveedor, direccion_proveedor)
                VALUES(?, ?, ?)';
        $params = array($this->nombre, $this->telefono, $this->direccion);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT proveedor_id, nombre_proveedor, telefono_proveedor, direccion_proveedor
                FROM proveedor
                ORDER BY nombre_proveedor';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT proveedor_id, nombre_proveedor, telefono_proveedor, direccion_proveedor
                FROM proveedor
                WHERE proveedor_id = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE proveedor
                SET nombre_proveedor = ?, telefono_proveedor = ?, direccion_proveedor = ?
                WHERE proveedor_id = ?';
        $params = array($this->nombre, $this->telefono, $this->direccion, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM proveedor
                WHERE proveedor_id = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
