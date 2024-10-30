let apiKey = '55aWr3iYrSH8Ny2NT2QxtD7vHTsLtfSC';
var loadingDiv = document.getElementById('loading');

// ----------- FIREBASE ----------- 
// --- Objeto de conexión que nos da Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD18tbaLjIQlFipK8LqmLNUoXh0h45zQIo",
    authDomain: "library-5d865.firebaseapp.com",
    projectId: "library-5d865",
    storageBucket: "library-5d865.appspot.com",
    messagingSenderId: "764581789569",
    appId: "1:764581789569:web:1b0fbb7694ea02acd33280"
};

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

const db = firebase.firestore();// db representa mi BBDD //inicia Firestore

// ----------- FORMULARIOS ----------- 
// Mostrar/Ocultar Sign In
document.getElementById('logIn').onclick = function () {
    document.getElementById('popupSignIn').style.display = 'block';
};

document.getElementById('closePopupSignIn').onclick = function () {
    document.getElementById('popupSignIn').style.display = 'none';
};

// Mostrar/Ocultar Sign Up
document.getElementById('signUp').onclick = function () {
    document.getElementById('popupSignUp').style.display = 'block';
};

document.getElementById('closePopupSignUp').onclick = function () {
    document.getElementById('popupSignUp').style.display = 'none';
};

// Cerrar popup si se hace click fuera
window.onclick = function (event) {
    const popupSignIn = document.getElementById('popupSignIn');
    const popupSignUp = document.getElementById('popupSignUp');
    if (event.target == popupSignIn) {
        popupSignIn.style.display = 'none';
    }
    if (event.target == popupSignUp) {
        popupSignUp.style.display = 'none';
    }
};

// Manejo del envío de los formularios
document.querySelector('#formSignIn').onsubmit = function (e) {
    e.preventDefault(); // Evitar el envío real del formulario
    console.log("Formulario de inicio de sesión enviado");
    document.getElementById('popupSignIn').style.display = 'none'; // Cerrar popup
};

// CUANDO NOS REGISTREMOS + CUANDO NOS LOGUEEMOS
// Ocultar login + sign up
// Mostrar logout
// Función para ocultar login + sign up y mostrar logout
function toggleButtons() {
    let logInBtn = document.querySelector("#logIn");
    let signUpBtn = document.querySelector("#signUp");
    logInBtn.classList.toggle("hide");
    signUpBtn.classList.toggle("hide");
}

// 1º crear boton y ponerle class hide
// mirar toggle class
// function myFunction() {
//     var element = document.getElementById("myDIV");
//     element.classList.toggle("mystyle");
//  }

// LISTENER PARA REGISTRAR
document.querySelector("#formSignUp").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.signUpEmail.value;
    let pass = event.target.elements.signUpPass.value;
    let pass2 = event.target.elements.signUpPass2.value;

    // VALIDACIÓN DEL FORMULARIO
    let warning = document.querySelector('.warningDiv');
    if ((pass.length < 6) || (pass2.length < 6)) { // Si las contraseñas son cortas (Firebase Auth no acepta menos de 6 caracteres)
        warning.innerHTML = '<p class="warning">Password should be more than 6 characters</p>'
    } else if (pass !== pass2) { // Si las contraseñas no son iguales
        warning.innerHTML = '<p class="warning">Passwords are not the same</p>'
    } else { // Si todo está bien
        signUpUser(email, pass); // Llamar a Firebase Auth
        document.querySelector('#popupSignUp').style.display = 'none'; // Cierra el popup
        document.getElementById('formSignUp').onsubmit = function (e) {
            e.preventDefault(); // Evitar el envío real del formulario
            console.log("Formulario de registro enviado");
            document.getElementById('popupSignUp').style.display = 'none'; // Cerrar popup
        };
    }
})
// LISTENER PARA LOGUEARSE
document.querySelector("#formSignIn").addEventListener("submit", function (event) {

    // VALIDACIÓN
    if (pass.length < 6) { // Si las contraseñas son cortas (Firebase Auth no acepta menos de 6 caracteres)
        warning.innerHTML = '<p class="warning">Password should be more than 6 characters</p>'
    } else { // Si todo está bien
        signInUser(email, pass); // Llamar a Firebase Auth
        document.querySelector('#popupSignIn').style.display = 'none'; // Cierra el popup
        document.getElementById('formSignIn').onsubmit = function (e) {
            e.preventDefault(); // Evitar el envío real del formulario
            console.log("Formulario de login enviado");
            document.getElementById('popupSignIn').style.display = 'none'; // Cerrar popup
        };
    }

    event.preventDefault();
    let email = event.target.elements.email.value;
    let pass = event.target.elements.pass.value;
    signInUser(email, pass)
})
//   document.getElementById("salir").addEventListener("click", signOut);


// ----------- SPINNER ----------- 
function showSpinner() {
    loadingDiv.style.visibility = 'visible';
}

function hideSpinner() {
    loadingDiv.style.visibility = 'hidden';
}

// ----------- FUNCIONES ----------- 

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
        h1Header.innerHTML = name.display_name;

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
    showSpinner();
    try {
        let data = await getListsBooks();
        hideSpinner();
        let section = document.body.querySelector('#data');

        let h1Header = document.body.querySelector('header h1');
        h1Header.innerHTML = '📖✨👻 Spooky Library 👻✨📖';

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
                </article>
                `
        });

        // Event listener | Cada botón
        let button = document.querySelectorAll('.viewList');

        button.forEach(button => {
            button.addEventListener('click', async function () {
                let listName = this.getAttribute('id');
                let response = await getOneList(listName);
                showSpinner();
                paintOneList(response);
                hideSpinner();
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


// ----------- FIREBASE AUTH ----------- 
// Función para registro
const signUpUser = (email, password) => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(`se ha registrado ${user.email} ID:${user.uid}`)
            alert(`se ha registrado ${user.email} ID:${user.uid}`)
            // ...
            // Saves user in firestore
            // Además de registrarse, añadimos el uID que nos devuelve Google desde userCredential.user.uid (ver en líneas 173-176)
            createUser({
                id: user.uid,
                email: user.email,
                message: "hola!"
            });

        })
        .catch((error) => {
            console.log("Error en el sistema" + error.message, "Error: " + error.code);
        });
};

// Función para loguearse
const signInUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            // Hacer flujo de la web aquí dentro
            console.log(`se ha logado ${user.email} ID:${user.uid}`)
            alert(`se ha logado ${user.email} ID:${user.uid}`)
            console.log("USER", user);
            document.body.innerHTML += `<h1>Bienvenido ${user.email}</h1>`
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        });
}

// Para desloguearse
const signOut = () => {
    // La variable firebase ya sabe quién está en el sistema con signIn
    let user = firebase.auth().currentUser;
    // Esto desloguea:
    firebase.auth().signOut().then(() => {
        console.log("Sale del sistema: " + user.email)
    }).catch((error) => {
        console.log("hubo un error: " + error);
    });
}

// Listener de usuario en el sistema
// Controlar usuario logado
//onAuthStateChanged es un lsitener que tiene Firebase para comprobar que alguien está en el sistema
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(`Está en el sistema:${user.email} ${user.uid}`);
        document.querySelector("#message").innerText = `Estás en el sistema: ${user.email} ✅`;
    } else {
        console.log("no hay usuarios en el sistema");
        document.querySelector("#message").innerText = `No hay usuarios en el sistema`;
    }
});
