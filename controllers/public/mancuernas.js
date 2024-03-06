// Constante para establecer el formulario de iniciar sesión.

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    // Llamada a la función para mostrar la primera página cuando el documento se carga
    showPage(1);
});

function showPage(pageNumber) {
    // Calculate the index of the first card to show based on the page number
    const firstCardIndex = (pageNumber - 1) * 4; // Assuming 4 cards per page

    console.log("First Card Index:", firstCardIndex); // Log the first card index for debugging

    // Show the cards based on the page number
    document.querySelectorAll('.card-item').forEach(function(card, index) {
        if (index >= firstCardIndex && index < firstCardIndex + 4) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Update the Previous and Next buttons based on the current page
    const previousButton = document.getElementById('previousButton');
    const nextButton = document.getElementById('nextButton');

    // Enable or disable the Previous button based on the current page number
    if (pageNumber === 1) {
        previousButton.classList.add('disabled');
        previousButton.querySelector('a').setAttribute('tabindex', '-1');
        previousButton.querySelector('a').setAttribute('aria-disabled', 'true');
    } else {
        previousButton.classList.remove('disabled');
        previousButton.querySelector('a').removeAttribute('tabindex');
        previousButton.querySelector('a').removeAttribute('aria-disabled');
    }

    // Enable or disable the Next button based on the current page number
    if (pageNumber === 5) {
        nextButton.classList.add('disabled');
        nextButton.querySelector('a').setAttribute('tabindex', '-1');
        nextButton.querySelector('a').setAttribute('aria-disabled', 'true');
    } else {
        nextButton.classList.remove('disabled');
        nextButton.querySelector('a').removeAttribute('tabindex');
        nextButton.querySelector('a').removeAttribute('aria-disabled');
    }
}

// Event handler for the Next button
document.getElementById('nextButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    const currentPage = getCurrentPage();
    if (currentPage < 5) { // Assuming there are 5 pages in total
        showPage(currentPage + 1); // Show the next page
    }
});

// Event handler for the Previous button
document.getElementById('previousButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    const currentPage = getCurrentPage();
    if (currentPage > 1) {
        showPage(currentPage - 1); // Show the previous page
    }
});

// Function to get the current page number
function getCurrentPage() {
    const activePage = document.querySelector('.pagination .page-item.active');
    return parseInt(activePage.textContent);
}
