// Recibir los datos de la lista de libros de la API
async function getListsBooks() {
    try {
        // Realizar la solicitud a la API
        const response = await fetch('https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=55aWr3iYrSH8Ny2NT2QxtD7vHTsLtfSC');

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        // Si la respuesta es exitosa, procesar los datos
        const data = await response.json();
        //data.results nos devuelve un array de objetos, que habrá que pintar en el DOM
        return data.results;

    } catch (error) {
        // Manejar errores de red o del servidor
        console.error('Hubo un problema con la solicitud:', error.message);
    }
};

