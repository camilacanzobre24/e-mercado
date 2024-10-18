document.addEventListener("DOMContentLoaded", function () {
    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const emailUsuario = localStorage.getItem('usuario'); // Email del usuario logueado

    if (isAuthenticated !== 'true') {
        window.location.href = 'login.html'; // Redirige si no está autenticado
        return;
    }

    // Obtener los elementos del formulario
    const nombre = document.getElementById('nombre');
    const segundoNombre = document.getElementById('segundo-nombre');
    const apellido = document.getElementById('apellido');
    const segundoApellido = document.getElementById('segundo-apellido');
    const telefono = document.getElementById('telefono');
    const email = document.getElementById('email');
    const guardarCambios = document.getElementById('guardar-cambios');

    // Cargar valores guardados en localStorage, si existen
    nombre.value = localStorage.getItem('nombre') || '';
    segundoNombre.value = localStorage.getItem('segundoNombre') || '';
    apellido.value = localStorage.getItem('apellido') || '';
    segundoApellido.value = localStorage.getItem('segundoApellido') || '';
    telefono.value = localStorage.getItem('telefono') || '';
    email.value = emailUsuario || '';

    // Evento para validar y guardar los cambios
    guardarCambios.addEventListener('click', function () {
        limpiarMensajes(); // Limpia mensajes previos
        let valido = true; // Controla si el formulario es válido

        // Validación del campo "nombre"
        if (nombre.value.trim() === '') {
            mostrarError(nombre, 'Debe ingresar un nombre.');
            valido = false;
        } else {
            mostrarCheck(nombre);
            localStorage.setItem('nombre', nombre.value.trim());
        }

        // Guardar o eliminar "segundo nombre"
        if (segundoNombre.value.trim() !== '') {
            localStorage.setItem('segundoNombre', segundoNombre.value.trim());
            mostrarCheck(segundoNombre);
        } else {
            localStorage.removeItem('segundoNombre'); // Elimina si está vacío
        }

        // Validación del campo "apellido"
        if (apellido.value.trim() === '') {
            mostrarError(apellido, 'Debe ingresar un apellido.');
            valido = false;
        } else {
            mostrarCheck(apellido);
            localStorage.setItem('apellido', apellido.value.trim());
        }

        // Guardar o eliminar "segundo apellido"
        if (segundoApellido.value.trim() !== '') {
            localStorage.setItem('segundoApellido', segundoApellido.value.trim());
            mostrarCheck(segundoApellido);
        } else {
            localStorage.removeItem('segundoApellido'); // Elimina si está vacío
        }

        // Guardar o eliminar "teléfono"
        if (telefono.value.trim() !== '') {
            localStorage.setItem('telefono', telefono.value.trim());
            mostrarCheck(telefono);
        } else {
            localStorage.removeItem('telefono'); // Elimina si está vacío
        }

        // Validación del campo "email"
        if (email.value.trim() === '') {
            mostrarError(email, 'Debe ingresar un email.');
            valido = false;
        } else if (!email.validity.valid) {
            mostrarError(email, 'Por favor, ingrese un email válido.');
            valido = false;
        } else {
            mostrarCheck(email);
            localStorage.setItem('usuario', email.value.trim()); // Actualiza el email guardado
        }

        if (valido) {
            console.log('Datos guardados:', {
                nombre: localStorage.getItem('nombre'),
                segundoNombre: localStorage.getItem('segundoNombre'),
                apellido: localStorage.getItem('apellido'),
                segundoApellido: localStorage.getItem('segundoApellido'),
                telefono: localStorage.getItem('telefono'),
                email: localStorage.getItem('usuario'),
            });
        }
    });

    // Función para mostrar mensajes de error
    function mostrarError(campo, mensaje) {
        campo.classList.add('is-invalid'); // Marca el campo como inválido

        let errorDiv = campo.parentNode.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.classList.add('invalid-feedback');
            errorDiv.textContent = mensaje;
            campo.parentNode.appendChild(errorDiv);
        }
    }

    // Función para mostrar el ícono de verificación (tick verde)
    function mostrarCheck(campo) {
        campo.classList.remove('is-invalid'); // Quita la clase de error si existía
        campo.classList.add('is-valid'); // Marca el campo como válido

        let checkDiv = campo.parentNode.querySelector('.valid-feedback');
        if (!checkDiv) {
            checkDiv = document.createElement('div');
            checkDiv.classList.add('valid-feedback');
            checkDiv.innerHTML = '✔️'; // Icono de verificación
            campo.parentNode.appendChild(checkDiv);
        }
    }

    // Función para limpiar mensajes de error y ticks verdes
    function limpiarMensajes() {
        const campos = [nombre, segundoNombre, apellido, segundoApellido, telefono, email];

        campos.forEach(campo => {
            campo.classList.remove('is-invalid', 'is-valid'); // Quita las clases de validación

            const errorDiv = campo.parentNode.querySelector('.invalid-feedback');
            const checkDiv = campo.parentNode.querySelector('.valid-feedback');

            if (errorDiv) errorDiv.remove(); // Elimina mensajes de error si existen
            if (checkDiv) checkDiv.remove(); // Elimina ticks verdes si existen
        });
    }
});

// Función para aplicar el tema oscuro
const temaOscuro = () => {
    document.querySelector("body").setAttribute("data-bs-theme", "dark");
    document.querySelector("#dl-icon").setAttribute("class", "bi bi-sun-fill"); // Cambia a icono de sol
    document.querySelector("#theme-switch").style.backgroundColor = "#6c757d"; // Switch oscuro
    localStorage.setItem('tema', 'oscuro'); // Guarda el tema en localStorage
    document.querySelector("#theme-switch").checked = true; // Marca el switch
};

// Función para aplicar el tema claro
const temaClaro = () => {
    document.querySelector("body").setAttribute("data-bs-theme", "light");
    document.querySelector("#dl-icon").setAttribute("class", "bi bi-moon-fill"); // Cambia a icono de luna
    document.querySelector("#theme-switch").style.backgroundColor = "#ffffff"; // Switch claro
    localStorage.setItem('tema', 'claro'); // Guarda el tema en localStorage
    document.querySelector("#theme-switch").checked = false; // Desmarca el switch
};

// Función para cambiar el tema cuando el switch es clicado
const cambiarTema = () => {
    const temaActual = document.querySelector("body").getAttribute("data-bs-theme");

    if (temaActual === "light") {
        temaOscuro();
    } else {
        temaClaro();
    }
};

// Cargar el tema guardado al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const temaGuardado = localStorage.getItem("tema");

    if (temaGuardado === "oscuro") {
        temaOscuro();
    } else {
        temaClaro();
    }

    // Añadir evento al switch
    document.querySelector("#theme-switch").addEventListener("change", cambiarTema);
});

