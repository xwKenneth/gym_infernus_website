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
        $sql = 'SELECT empleado_id, correo_electronico, contrasena
                FROM empleado
                WHERE  correo_electronico  = ?';
        $params = array($username);
        $data = Database::getRow($sql, $params);
        if (password_verify($password, $data['contrasena'])) {
            $_SESSION['idAdministrador'] = $data['empleado_id'];
            $_SESSION['aliasAdministrador'] = $data['correo_electronico'];
            return true;
        } else {
            return false;
        }
    }

    public function checkPassword($password)
    {
        $sql = 'SELECT contrasena
                FROM empleado
                WHERE empleado_id = ?';
        $params = array($_SESSION['empleado_id']);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['contrasena'])) {
            return true;
        } else {
            return false;
        }
    }

    public function changePassword()
    {
        $sql = 'UPDATE administrador
                SET clave_administrador = ?
                WHERE id_administrador = ?';
        $params = array($this->clave, $_SESSION['idadministrador']);
        return Database::executeRow($sql, $params);
    }

    public function readProfile()
    {
        $sql = 'SELECT empleado_id, nombre, apellido, correo_electronico
                FROM administrador
                WHERE empleado_id = ?';
        $params = array($_SESSION['empleado_id']);
        return Database::getRow($sql, $params);
    }

    public function editProfile()
    {
        $sql = 'UPDATE administrador
                SET nombre_administrador = ?, apellido_administrador = ?, correo_administrador = ?, alias_administrador = ?
                WHERE id_administrador = ?';
        $params = array($this->nombre, $this->apellido, $this->correo, $this->alias, $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT empleado_id, nombre, apellido, correo_electronico
                FROM empleado
                WHERE apellido LIKE ? OR nombre LIKE ?
                ORDER BY apellido';
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
        $sql = 'INSERT INTO empleado(nombre, apellido, correo_electronico, contrasena, cargo_id)
                VALUES(?, ?, ?, ?, ?)';
        $params = array($this->nombre, $this->apellido, $this->correo, $this->clave, $this->rol);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT empleado.empleado_id, empleado.nombre, empleado.apellido, empleado.correo_electronico, cargo.cargo
                FROM empleado INNER JOIN cargo ON empleado.cargo_id = cargo.cargo_id
                ORDER BY apellido';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT empleado_id, nombre, apellido, correo_electronico, cargo_id 
                FROM empleado
                WHERE empleado_id = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE empleado
                SET nombre = ?, apellido = ?, correo_electronico = ?, cargo_id = ?
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
