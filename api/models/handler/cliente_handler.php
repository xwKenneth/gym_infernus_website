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
        $sql = 'SELECT cliente_id, correo_cliente, clave_cliente, estado_cliente
                FROM cliente
                WHERE correo_cliente = ?';
        $params = array($mail);
        $data = Database::getRow($sql, $params);
        if (isset($data['clave_cliente']) &&  password_verify($password, $data['clave_cliente'])) {
            $this->id = $data['cliente_id'];
            $this->correo = $data['correo_cliente'];
            $this->estado = $data['estado_cliente'];
            return true;
        } else {
            return false;
        }
    }
    public function changePassword()
    {
        $sql = 'UPDATE cliente
                SET clave_cliente = ?
                WHERE cliente_id = ?';
        $params = array($this->clave, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function checkPassword($password)
    {
        $sql = 'SELECT clave_cliente
                FROM cliente
                WHERE cliente_id = ?';
        $params = array($_SESSION['idCliente']);
        $data = Database::getRow($sql, $params);
        
        // Verificar si se obtuvo un resultado válido
        if ($data !== false) {
            // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
            if (password_verify($password, $data['clave_cliente'])) {
                return true;
            }
        }
        return false;
    }
    
    public function checkStatus()
    {
        if ($this->estado) {
            $_SESSION['idCliente'] = $this->id;
            $_SESSION['correoCliente'] = $this->correo;
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
        $sql = 'SELECT cliente_id, nombre_cliente, apellido_cliente, telefono_cliente, dui_cliente, nacimiento_cliente, correo_cliente, direccion_cliente
                FROM cliente
                WHERE apellido_cliente LIKE ? OR nombre_cliente LIKE ? OR correo_cliente LIKE ?
                ORDER BY apellido_cliente';
        $params = array($value, $value, $value);
        return Database::getRows($sql, $params);
    }


    public function createRow()
    {
        $sql = 'INSERT INTO cliente (nombre_cliente, apellido_cliente, telefono_cliente, dui_cliente, nacimiento_cliente, correo_cliente, direccion_cliente, clave_cliente)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array(
            $this->nombre, $this->apellido, $this->telefono, $this->dui, $this->nacimiento, $this->correo, $this->direccion,$this->clave
        );
        return Database::executeRow($sql, $params);
    }


    public function readAll()
    {
        $sql = 'SELECT cliente_id, nombre_cliente, apellido_cliente, correo_cliente, dui_cliente
                FROM cliente
                ORDER BY apellido_cliente';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT cliente_id, nombre_cliente, apellido_cliente, telefono_cliente, dui_cliente, nacimiento_cliente, correo_cliente, direccion_cliente
                FROM cliente
                WHERE cliente_id = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
    
    public function updateRow()
    {
        $sql = 'UPDATE cliente
                SET nombre_cliente = ?, apellido_cliente = ?, telefono_cliente = ?, dui_cliente = ?, nacimiento_cliente = ?, correo_cliente = ?, direccion_cliente = ?
                WHERE cliente_id = ?';
        $params = array(
            $this->nombre, $this->apellido, $this->telefono, $this->dui, $this->nacimiento,$this->correo, $this->direccion, $this->id
        );
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
                WHERE dui_cliente = ? OR correo_cliente = ?';
        $params = array($value, $value);
        return Database::getRow($sql, $params);
    }

    public function getClientes()
    {
        $sql = "SELECT cliente_id, CONCAT_WS(' ', nombre_cliente, apellido_cliente) AS `NombreFull` FROM cliente";
        return Database::getRows($sql);
    }
}
