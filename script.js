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


// Pintar lista en el DOM
async function paintListBooks() {
    try {
        let data = await getListsBooks();

        console.log(data)
        let section = document.body.querySelector('#data');
        data.forEach((list, index) => {
            section.innerHTML += `
                <article>
                    <div>
                        <h2>${list.list_name}</h2>
                    </div>
                    <div>
                        <p>Oldest book: ${list.oldest_published_date}</p>
                        <p>Newest book: ${list.newest_published_date}</p>
                        <p>Frecuency: ${list.updated}</p>
                        <button id='viewList${index}'></button>
                    </div>
                </article>
            `
        });  
        

    } catch (error) {
        // Manejar errores de red o del servidor
        console.error('Hubo un problema con la solicitud:', error.message);
    }
}


paintListBooks()