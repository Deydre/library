let apiKey = '55aWr3iYrSH8Ny2NT2QxtD7vHTsLtfSC';

// Función | Recibir los datos de la lista de libros de la API -> Devolver array de objetos
async function getListsBooks() {
    try {
        // Realizar la solicitud a la API
        const response = await fetch(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=${apiKey}`);

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

// Función | Obtener una lista concreta pasando el nombre -> Devolver el objeto de datos + el array de libros
async function getOneList(name) {

    try {
        // Realizar la solicitud a la API
        const response = await fetch(`https://api.nytimes.com/svc/books/v3/lists/${name}.json?api-key=${apiKey}`);

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
}

// Función | Recibir objeto de datos + el array de libros -> Quitar lo que haya en el DOM -> Pintar lista en el DOM
async function paintOneList(name) {
    try {
        let section = document.body.querySelector('#data');
        let h1Header = document.body.querySelector('header h1');
        h1Header.innerHTML = `📖✨${name.display_name}✨📖`
        
        section.innerHTML = `
        <div id='divBack'><button id='back'>< VOLVER A LISTAS DE LIBROS</button></div>        
        `;

        let books = name.books;

        books.forEach((book, index) => {
            section.innerHTML += `
            <article class="book">
                <div>
                    <h2>#${(index + 1)} ${book.title}</h2>
                    <p>${book.author}</p>
                </div>
                <div><img src="${book.book_image}"></div>
                <div>
                    <p><strong>Weeks on list:</strong> ${book.weeks_on_list}</p>
                    <p><strong>Description:</strong> ${book.description}</p>
                </div>
                <div>
                    <a target="_blank" class="button" href="${book.buy_links[0].url}">BUY AT AMAZON</a>
                </div>
            </article>
        `
        })

        // Event listener | Botón volver atrás
        let button = document.querySelector('#back');

        button.addEventListener('click', async function () {
            section.innerHTML = "";
            paintListBooks();
        });


    } catch (error) {
        // Manejar errores de red o del servidor
        console.error('Hubo un problema con la solicitud:', error.message);
    }
}

// Función | Recibir lista de libros -> Pintar lista en el DOM -> Activar AddEventListeners
async function paintListBooks() {
    try {
        let data = await getListsBooks();
        let section = document.body.querySelector('#data');

        data.forEach(list => {
            section.innerHTML += `
                <article>
                    <div>
                        <h2>${list.list_name}</h2>
                        <p><strong>Oldest book:</strong> ${list.oldest_published_date}</p>
                        <p><strong>Newest book:</strong> ${list.newest_published_date}</p>
                        <p><strong>Frecuency:</strong> ${list.updated.charAt(0) + list.updated.substring(1).toLowerCase()}</p>
                    </div>
                    <div>
                        <button class='viewList' id='${list.list_name}'>VIEW LIST ></button>
                    </div>
                </ >
                `
        });

        // Event listener | Cada botón
        let button = document.querySelectorAll('.viewList');

        button.forEach((button) => {
            button.addEventListener('click', async function () {
                let listName = this.getAttribute('id');
                let response = await getOneList(listName);
                paintOneList(response)
            });
            // FUTURO: EVENTOS DE TARJETA en hover de btn
            // article.addEventListener('mouseover', function() {
            //     // Sustituir el HTML por el gif
            //         article.style.background = '#AAFF00';
            // });

            // article.addEventListener('mouseout', function() {
            //     // Sustituir el HTML por el gif
            //         article.style.background = '#097969';
            // });
        });

    } catch (error) {
        // Manejar errores de red o del servidor
        console.error('Hubo un problema con la solicitud:', error.message);
    }
}

paintListBooks();

