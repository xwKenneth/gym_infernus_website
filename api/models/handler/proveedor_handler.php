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
    public function checkUser($mail, $password)
    {
        $sql = 'SELECT cliente_id, nombre, apellido, telefono, correo_electronico, direccion
         contrasena, estado_cliente
                FROM cliente
                WHERE correo_electronico = ?';
        $params = array($mail);
        $data = Database::getRow($sql, $params);
        if (password_verify($password, $data['contrasena'])) {
            $this->id = $data['id_cliente'];
            $this->correo = $data['correo_electronico'];
            return true;
        } else {
            return false;
        }
    }

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
        $sql = 'SELECT proveedor_id, nombre, telefono, direccion
                FROM proveedor
                WHERE nombre LIKE ? 
                ORDER BY nombre';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO proveedor(nombre, telefono, direccion)
                VALUES(?, ?, ?)';
        $params = array($this->nombre, $this->telefono, $this->direccion);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT proveedor_id, nombre, telefono, direccion
                FROM proveedor
                ORDER BY nombre';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT proveedor_id, nombre, telefono, direccion
                FROM proveedor
                WHERE proveedor_id = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE proveedor
                SET nombre = ?, telefono = ?, direccion = ?
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
