<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla CLIENTE.
*/
class ClienteHandler
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

    public function changePassword()
    {
        $sql = 'UPDATE cliente
                SET contrasena = ?
                WHERE cliente_id = ?';
        $params = array($this->clave, $this->id);
        return Database::executeRow($sql, $params);
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

    public function editProfile()
    {
        $sql = 'UPDATE cliente
                SET nombre = ?, apellido = ?, correo_electronico = ?, dui_cliente = ?, telefono_cliente = ?, nacimiento_cliente = ?, direccion_cliente = ?
                WHERE cliente_id = ?';
        $params = array($this->nombre, $this->apellido, $this->correo, $this->dui, $this->telefono, $this->nacimiento, $this->direccion, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function changeStatus()
    {
        $sql = 'UPDATE cliente
                SET estado_cliente = ?
                WHERE cliente_id = ?';
        $params = array($this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT cliente_id, nombre, apellido, telefono, dui, fecha_nacimiento, correo_electronico, direccion
                FROM cliente
                WHERE apellido LIKE ? OR nombre LIKE ? OR correo_electronico LIKE ?
                ORDER BY apellido';
        $params = array($value, $value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO cliente(nombre, apellido, telefono, dui, fecha_nacimiento, correo_electronico, direccion, contrasena)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->nombre, $this->apellido, $this->telefono, $this->dui, $this->nacimiento, $this->correo, $this->direccion, $this->clave);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT cliente_id, nombre, apellido, correo_electronico, dui
                FROM cliente
                ORDER BY apellido';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT cliente_id, nombre, apellido, dui, correo_electronico, telefono, fecha_nacimiento, direccion
                FROM cliente
                WHERE cliente_id = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE cliente
                SET nombre = ?, apellido = ?, dui = ?, telefono = ?, fecha_nacimiento = ?, direccion = ?
                WHERE cliente_id = ?';
        $params = array($this->nombre, $this->apellido, $this->dui, $this->telefono, $this->nacimiento, $this->direccion, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM cliente
                WHERE cliente_id = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function checkDuplicate($value)
    {
        $sql = 'SELECT cliente_id
                FROM cliente
                WHERE dui = ? OR correo_electronico = ?';
        $params = array($value, $value);
        return Database::getRow($sql, $params);
    }

    public function getClientes()
    {
        $sql = "SELECT cliente_id, CONCAT_WS(' ', cliente.nombre, cliente.apellido) AS `NombreFull` FROM cliente";
        return Database::getRows($sql);
    }
    
    
}
