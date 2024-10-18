document.addEventListener("DOMContentLoaded", function () {
    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const emailUsuario = localStorage.getItem('usuario'); // Email del usuario logueado

    if (isAuthenticated !== 'true') {
        window.location.href = 'login.html'; // Redirige si no está autenticado
        return;
    }

    // Obtener elementos del DOM
    const nombre = document.getElementById('nombre');
    const segundoNombre = document.getElementById('segundo-nombre');
    const apellido = document.getElementById('apellido');
    const segundoApellido = document.getElementById('segundo-apellido');
    const telefono = document.getElementById('telefono');
    const email = document.getElementById('email');
    const guardarCambios = document.getElementById('guardar-cambios');
    const cerrarSesion = document.getElementById('cerrar-sesion');
    const profileImage = document.querySelector('.profile-image');
    const toggleFotoInput = document.createElement('input'); // Input para cargar foto
    toggleFotoInput.type = 'file';
    toggleFotoInput.accept = 'image/*';

    // Cargar valores guardados en localStorage, si existen
    nombre.value = localStorage.getItem('nombre') || '';
    segundoNombre.value = localStorage.getItem('segundoNombre') || '';
    apellido.value = localStorage.getItem('apellido') || '';
    segundoApellido.value = localStorage.getItem('segundoApellido') || '';
    telefono.value = localStorage.getItem('telefono') || '';
    email.value = emailUsuario || '';

    // Cargar foto de perfil desde localStorage, si existe
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
        profileImage.style.backgroundImage = `url(${storedImage})`;
        profileImage.style.backgroundSize = 'cover';
        profileImage.style.backgroundPosition = 'center';
    }

    // Evento para cargar nueva foto de perfil
    profileImage.addEventListener('click', () => toggleFotoInput.click());
    toggleFotoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageData = event.target.result;
                localStorage.setItem('profileImage', imageData); // Guardar en localStorage
                profileImage.style.backgroundImage = `url(${imageData})`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Guardar cambios en los campos del formulario
    guardarCambios.addEventListener('click', function () {
        limpiarMensajes();
        let valido = true;

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
            localStorage.removeItem('segundoNombre');
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
            localStorage.removeItem('segundoApellido');
        }

        // Guardar o eliminar "teléfono"
        if (telefono.value.trim() !== '') {
            localStorage.setItem('telefono', telefono.value.trim());
            mostrarCheck(telefono);
        } else {
            localStorage.removeItem('telefono');
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
            localStorage.setItem('usuario', email.value.trim());
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

   
   // Cerrar sesión y limpiar datos de usuario
cerrarSesion.addEventListener('click', function () {
    // Eliminar datos de localStorage
    localStorage.removeItem('usuario');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('nombre');
    localStorage.removeItem('segundoNombre');
    localStorage.removeItem('apellido');
    localStorage.removeItem('segundoApellido');
    localStorage.removeItem('telefono');
    localStorage.removeItem('profileImage');

    // Limpiar los campos del formulario
    nombre.value = '';
    segundoNombre.value = '';
    apellido.value = '';
    segundoApellido.value = '';
    telefono.value = '';
    email.value = '';

    // Limpiar la imagen de perfil
    profileImage.style.backgroundImage = ''; // Restablecer la imagen de perfil

    // Redirigir a la página de inicio de sesión
    window.location.href = 'login.html';
});

    // Función para mostrar mensajes de error
    function mostrarError(campo, mensaje) {
        campo.classList.add('is-invalid');
        let errorDiv = campo.parentNode.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.classList.add('invalid-feedback');
            errorDiv.textContent = mensaje;
            campo.parentNode.appendChild(errorDiv);
        }
    }

    // Función para mostrar el ícono de verificación
    function mostrarCheck(campo) {
        campo.classList.remove('is-invalid');
        campo.classList.add('is-valid');
        let checkDiv = campo.parentNode.querySelector('.valid-feedback');
        if (!checkDiv) {
            checkDiv = document.createElement('div');
            checkDiv.classList.add('valid-feedback');
            checkDiv.innerHTML = '✔️';
            campo.parentNode.appendChild(checkDiv);
        }
    }

    // Función para limpiar mensajes de error y ticks verdes
    function limpiarMensajes() {
        const campos = [nombre, segundoNombre, apellido, segundoApellido, telefono, email];
        campos.forEach(campo => {
            campo.classList.remove('is-invalid', 'is-valid');
            const errorDiv = campo.parentNode.querySelector('.invalid-feedback');
            const checkDiv = campo.parentNode.querySelector('.valid-feedback');
            if (errorDiv) errorDiv.remove();
            if (checkDiv) checkDiv.remove();
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
