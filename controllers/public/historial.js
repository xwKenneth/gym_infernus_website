// Constante para completar la ruta de la API.
const PEDIDO_API = 'services/public/pedido.php';
// Constante para establecer el cuerpo de la tabla.
const TABLE_BODY = document.getElementById('tableBody');

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    readDetail()
});


/*
*   Función para obtener el detalle de los pedidos realizados
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
async function readDetail() {
    // Petición para obtener los datos del pedido en proceso.
    const DATA = await fetchData(PEDIDO_API, 'getHistory');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializa el cuerpo de la tabla.
        TABLE_BODY.innerHTML = '';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <tr>
                    <td>${row.nombre_producto}</td>
                    <td>${row.precio_producto}</td>
                    <td>${row.cantidad}</td>
                    <td>${row.subtotal}</td>
                    <td>${row.estado_pedido}</td>
                </tr>
            `;
        });
        // Se muestra el total a pagar con dos decimales.
     //   document.getElementById('pago').textContent = total.toFixed(2);
    } else {
        sweetAlert(4, DATA.error, false, 'index.html');
    }
}