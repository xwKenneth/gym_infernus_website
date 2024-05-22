<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class AdministradorHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $correo = null;
    protected $alias = null;
    protected $clave = null;
    protected $rol = null;

    /*
     *  Métodos para gestionar la cuenta del administrador.
     */
    public function checkUser($username, $password)
    {
        $sql = 'SELECT empleado_id, correo_empleado, clave_empleado
                FROM empleado
                WHERE  correo_empleado  = ?';
        $params = array($username);
        $data = Database::getRow($sql, $params);
        if (isset($data['clave_empleado']) && password_verify($password, $data['clave_empleado'])) {
            $_SESSION['idAdministrador'] = $data['empleado_id'];
            $_SESSION['aliasAdministrador'] = $data['correo_empleado'];
            return true;
        } else {
            return false;
        }
    }
    

    public function checkPassword($password)
    {
        $sql = 'SELECT clave_empleado
                FROM empleado
                WHERE empleado_id = ?';
        $params = array($_SESSION['idAdministrador']);
        $data = Database::getRow($sql, $params);
        if (password_verify($password, $data['clave_empleado'])) {
            return true;
        } else {
            return false;
        }
    }

    public function changePassword()
    {
        $sql = 'UPDATE empleado
                SET clave_empleado = ?
                WHERE empleado_id = ?';
        $params = array($this->clave, $_SESSION['empleado_id']);
        return Database::executeRow($sql, $params);
    }

    public function readProfile()
    {
        $sql = 'SELECT empleado_id, nombre_empleado, apellido_empleado, correo_empleado
                FROM empleado
                WHERE empleado_id = ?';
        $params = array($_SESSION['empleado_id']);
        return Database::getRow($sql, $params);
    }

    public function editProfile()
    {
        $sql = 'UPDATE empleado
                SET nombre_empleado = ?, apellido_empleado = ?, correo_empleado = ?
                WHERE empleado_id = ?';
        $params = array($this->nombre, $this->apellido, $this->correo, $_SESSION['empleado_id']);
        return Database::executeRow($sql, $params);
    }

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT empleado_id, nombre_empleado, apellido_empleado, correo_empleado
                FROM empleado
                WHERE apellido_empleado LIKE ? OR nombre_empleado LIKE ?
                ORDER BY apellido_empleado';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }


    public function getCargos()
    {
        $query = "SELECT cargo_id, cargo FROM cargo";
        $params = array();
        return Database::getRows($query, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO empleado(nombre_empleado, apellido_empleado, correo_empleado, clave_empleado, cargo_id)
                VALUES(?, ?, ?, ?, ?)';
        $params = array($this->nombre, $this->apellido, $this->correo, $this->clave, $this->rol);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT empleado_id, nombre_empleado, apellido_empleado, correo_empleado, cargo.cargo
                FROM empleado INNER JOIN cargo ON empleado.cargo_id = cargo.cargo_id
                ORDER BY apellido_empleado';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT empleado_id, nombre_empleado, apellido_empleado, correo_empleado, cargo_id 
                FROM empleado
                WHERE empleado_id = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE empleado
                SET nombre_empleado = ?, apellido_empleado = ?, correo_empleado = ?, cargo_id = ?
                WHERE empleado_id = ?';
        $params = array($this->nombre, $this->apellido, $this->correo, $this->rol, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM empleado
                WHERE empleado_id = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
