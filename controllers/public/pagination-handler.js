// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Llamada a la función para mostrar la primera página cuando el documento se carga
    showPage(1);

    // Obtener referencias a los botones Anterior y Siguiente
    const previousButton = document.getElementById('previousButton');
    const nextButton = document.getElementById('nextButton');

    // Agregar escuchadores de eventos a los botones Anterior y Siguiente
    previousButton.addEventListener('click', prevPage);
    nextButton.addEventListener('click', nextPage);
});

function showPage(pageNumber) {
    // Calcular el índice de la primera tarjeta a mostrar según el número de página
    const firstCardIndex = (pageNumber - 1) * 4; 

    //console.log("First Card Index:", firstCardIndex); 

    // Mostrar las tarjetas según el número de página
    document.querySelectorAll('.card-item').forEach(function(card, index) {
        if (index >= firstCardIndex && index < firstCardIndex + 4) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Obtener referencias a los botones Anterior y Siguiente
    const previousButton = document.getElementById('previousButton');
    const nextButton = document.getElementById('nextButton');

    // Habilitar o deshabilitar el botón Anterior según el número de página actual
    if (pageNumber === 1) {
        previousButton.classList.add('disabled');
        previousButton.querySelector('a').setAttribute('tabindex', '-1');
        previousButton.querySelector('a').setAttribute('aria-disabled', 'true');
    } else {
        previousButton.classList.remove('disabled');
        previousButton.querySelector('a').removeAttribute('tabindex');
        previousButton.querySelector('a').removeAttribute('aria-disabled');
    }

    // Habilitar o deshabilitar el botón Siguiente según el número de página actual
    if (pageNumber === 5) {
        nextButton.classList.add('disabled');
        nextButton.querySelector('a').setAttribute('tabindex', '-1');
        nextButton.querySelector('a').setAttribute('aria-disabled', 'true');
    } else {
        nextButton.classList.remove('disabled');
        nextButton.querySelector('a').removeAttribute('tabindex');
        nextButton.querySelector('a').removeAttribute('aria-disabled');
    }

    // Actualizar el indicador de página activa
    updateActivePage(pageNumber);
}


function nextPage(event) {
    event.preventDefault(); // Prevenir el comportamiento de enlace predeterminado
    const currentPage = getCurrentPage();
    if (currentPage < 5) { // Suponiendo que hay 5 páginas en total
        showPage(currentPage + 1); // Mostrar la página siguiente
    }
}


function prevPage(event) {
    event.preventDefault(); // Prevenir el comportamiento de enlace predeterminado
    const currentPage = getCurrentPage();
    if (currentPage > 1) {
        showPage(currentPage - 1); // Mostrar la página anterior
    }
}

 
function getCurrentPage() {
    const activePage = document.querySelector('.pagination .page-item.active');
    return parseInt(activePage.textContent);
}

 
function updateActivePage(pageNumber) {
    // Eliminar la clase activa de todos los elementos de página
    document.querySelectorAll('.pagination .page-item').forEach(pageItem => {
        pageItem.classList.remove('active');
    });

    // Agregar la clase activa al elemento de página actual
    const currentPageItem = document.querySelector(`.pagination .page-item:nth-child(${pageNumber + 1})`);
    currentPageItem.classList.add('active');
}
