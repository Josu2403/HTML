// ===== SISTEMA DE AUTENTICACIÓN Y REGISTRO =====

// Usuarios predefinidos
const usuariosPredefinidos = {
    "estudiante": { 
        password: "1234", 
        rol: "👨‍🎓 Estudiante", 
        nombre: "Josué García",
        avatar: "Bienvenido🤓",
        email: "josue@ejemplo.com"
    },
    "profesor": { 
        password: "abcd", 
        rol: "👨‍🏫 Profesor", 
        nombre: "Carlos Ovalle",
        avatar: "Bienvenido👨‍🏫",
        email: "carlos@ejemplo.com"
    },
    "admin": { 
        password: "admin123", 
        rol: "👨‍💼 Administrador", 
        nombre: "Josué",
        avatar: "Bienvenido😎",
        email: "adminjosue@ejemplo.com"
    }
};

// Cargar usuarios desde localStorage o inicializar con usuarios predefinidos
function cargarUsuarios() {
    let usuarios = localStorage.getItem('usuariosRegistrados');
    if (!usuarios) {
        // Si no hay usuarios guardados, usar los predefinidos
        usuarios = usuariosPredefinidos;
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
    } else {
        usuarios = JSON.parse(usuarios);
    }
    return usuarios;
}

// Guardar usuarios en localStorage
function guardarUsuarios(usuarios) {
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
}

// Elementos del DOM
const overlayLogin = document.getElementById('overlayLogin');
const modalLogin = document.getElementById('modalLogin');
const modalRegistro = document.getElementById('modalRegistro');
const formLogin = document.getElementById('formLogin');
const formRegistro = document.getElementById('formRegistro');
const barraUsuario = document.getElementById('barraUsuario');
const userName = document.getElementById('userName');
const userRole = document.getElementById('userRole');
const userAvatar = document.getElementById('userAvatar');
const btnLogout = document.getElementById('btnLogout');
const btnShowRegistro = document.getElementById('btnShowRegistro');
const btnShowLogin = document.getElementById('btnShowLogin');
const loginErrors = document.getElementById('loginErrors');
const registroErrors = document.getElementById('registroErrors');
const registroSuccess = document.getElementById('registroSuccess');
const passwordStrength = document.getElementById('passwordStrength');
const regPassword = document.getElementById('regPassword');

// Cambiar a formulario de registro
btnShowRegistro.addEventListener('click', mostrarRegistro);

// Cambiar a formulario de login
btnShowLogin.addEventListener('click', mostrarLogin);

function mostrarRegistro() {
    modalLogin.classList.remove('active');
    modalRegistro.classList.add('active');
    limpiarMensajes();
}

function mostrarLogin() {
    modalRegistro.classList.remove('active');
    modalLogin.classList.add('active');
    limpiarMensajes();
}

function limpiarMensajes() {
    loginErrors.style.display = 'none';
    registroErrors.style.display = 'none';
    registroSuccess.style.display = 'none';
}

// Validar fortaleza de contraseña en tiempo real
regPassword.addEventListener('input', function() {
    const password = this.value;
    let strength = '';
    let strengthClass = '';
    
    if (password.length === 0) {
        strength = '';
    } else if (password.length < 6) {
        strength = 'Débil';
        strengthClass = 'strength-weak';
    } else if (password.length < 8) {
        strength = 'Media';
        strengthClass = 'strength-medium';
    } else {
        // Verificar si tiene números y letras
        const hasNumbers = /\d/.test(password);
        const hasLetters = /[a-zA-Z]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        if (hasNumbers && hasLetters && hasSpecial) {
            strength = 'Fuerte';
            strengthClass = 'strength-strong';
        } else if (hasNumbers && hasLetters) {
            strength = 'Buena';
            strengthClass = 'strength-medium';
        } else {
            strength = 'Media';
            strengthClass = 'strength-medium';
        }
    }
    
    if (strength) {
        passwordStrength.textContent = `Fortaleza: ${strength}`;
        passwordStrength.className = `password-strength ${strengthClass}`;
    } else {
        passwordStrength.textContent = '';
    }
});

// Manejar envío del formulario de registro
formRegistro.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('regNombre').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const usuario = document.getElementById('regUsuario').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Validaciones
    const errores = [];
    
    if (nombre.length < 2) {
        errores.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!isValidEmail(email)) {
        errores.push('El email no es válido');
    }
    
    if (usuario.length < 3) {
        errores.push('El usuario debe tener al menos 3 caracteres');
    }
    
    if (password.length < 6) {
        errores.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    if (password !== confirmPassword) {
        errores.push('Las contraseñas no coinciden');
    }
    
    // Verificar si el usuario ya existe
    const usuarios = cargarUsuarios();
    if (usuarios[usuario]) {
        errores.push('Este usuario ya está registrado');
    }
    
    // Mostrar errores o proceder con el registro
    if (errores.length > 0) {
        registroErrors.innerHTML = errores.map(error => `• ${error}`).join('<br>');
        registroErrors.style.display = 'block';
        registroSuccess.style.display = 'none';
    } else {
        // Registrar nuevo usuario
        usuarios[usuario] = {
            password: password,
            rol: "👨‍🎓 Estudiante",
            nombre: nombre,
            avatar: nombre.charAt(0).toUpperCase(),
            email: email,
            fechaRegistro: new Date().toISOString()
        };
        
        guardarUsuarios(usuarios);
        
        // Mostrar mensaje de éxito
        registroSuccess.innerHTML = '✅ ¡Cuenta creada exitosamente! Ya puedes iniciar sesión.';
        registroSuccess.style.display = 'block';
        registroErrors.style.display = 'none';
        
        // Limpiar formulario
        formRegistro.reset();
        passwordStrength.textContent = '';
        
        // Cambiar a login después de 2 segundos
        setTimeout(() => {
            mostrarLogin();
            document.getElementById('username').value = usuario;
        }, 2000);
    }
});

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Manejar envío del formulario de login
formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const usuarios = cargarUsuarios();
    
    if (usuarios[username] && usuarios[username].password === password) {
        const usuarioInfo = {
            username: username,
            nombre: usuarios[username].nombre,
            rol: usuarios[username].rol,
            avatar: usuarios[username].avatar,
            email: usuarios[username].email
        };
        
        localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioInfo));
        mostrarUsuarioLogeado(usuarioInfo);
        overlayLogin.style.display = 'none';
        
        // Efecto de confeti visual
        mostrarConfeti();
    } else {
        loginErrors.textContent = '❌ Usuario o contraseña incorrectos';
        loginErrors.style.display = 'block';
    }
});

// Cargar usuarios demo
document.querySelectorAll('.usuario-demo').forEach(usuario => {
    usuario.addEventListener('click', function() {
        const user = this.getAttribute('data-user');
        const pass = this.getAttribute('data-pass');
        
        document.getElementById('username').value = user;
        document.getElementById('password').value = pass;
    });
});

// Efecto de confeti visual
function mostrarConfeti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    const barra = document.querySelector('.barra-usuario');
    
    for (let i = 0; i < 20; i++) {
        const confeti = document.createElement('div');
        confeti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 2px;
            top: ${barra.offsetTop}px;
            left: ${Math.random() * window.innerWidth}px;
            animation: confetiFall 1s ease-out forwards;
            z-index: 100;
        `;
        
        document.body.appendChild(confeti);
        
        setTimeout(() => {
            confeti.remove();
        }, 1000);
    }
}

// ===== SISTEMA DE ADMINISTRACIÓN DE USUARIOS =====

// Función para ver usuarios guardados (para desarrollo)
function verUsuariosGuardados() {
    const usuarios = cargarUsuarios();
    console.log('=== USUARIOS REGISTRADOS ===', usuarios);
    
    // También mostrar en un alert para fácil visualización
    let usuariosInfo = '=== USUARIOS REGISTRADOS ===\n\n';
    let totalUsuarios = 0;
    
    for (const [username, userData] of Object.entries(usuarios)) {
        usuariosInfo += `👤 Usuario: ${username}\n`;
        usuariosInfo += `📛 Nombre: ${userData.nombre}\n`;
        usuariosInfo += `📧 Email: ${userData.email || 'No especificado'}\n`;
        usuariosInfo += `🎯 Rol: ${userData.rol}\n`;
        usuariosInfo += `📅 Registro: ${userData.fechaRegistro ? new Date(userData.fechaRegistro).toLocaleDateString() : '08/10/2025'}\n`;
        usuariosInfo += `---\n`;
        totalUsuarios++;
    }
    
    usuariosInfo += `\n📊 Total de usuarios: ${totalUsuarios}`;
    alert(usuariosInfo);
    return usuarios;
}

// Función para crear interfaz de administración
function crearPanelAdministracion() {
    // Verificar si ya existe un panel
    if (document.getElementById('panelAdmin')) {
        return;
    }
    
    const panel = document.createElement('div');
    panel.id = 'panelAdmin';
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 15px;
        border-radius: 10px;
        z-index: 9999;
        font-size: 12px;
        max-width: 300px;
        backdrop-filter: blur(10px);
        border: 2px solid #e74c3c;
        box-shadow: 0 0 20px rgba(231, 76, 60, 0.3);
    `;
    
    panel.innerHTML = `
        <div style="margin-bottom: 10px; font-weight: bold; color: #e74c3c;">⚡ Panel de Administración</div>
        <div style="margin-bottom: 10px; font-size: 10px; opacity: 0.8;">Solo visible para administradores</div>
        
        <button onclick="verUsuariosGuardados()" style="background: #3498db; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; margin: 2px; font-size: 11px; width: 100%;">
            👥 Ver Todos los Usuarios
        </button>
        <button onclick="exportarUsuarios()" style="background: #2ecc71; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; margin: 2px; font-size: 11px; width: 100%;">
            📊 Exportar Usuarios
        </button>
        <button onclick="limpiarUsuariosNoAdmin()" style="background: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; margin: 2px; font-size: 11px; width: 100%;">
            🗑️ Limpiar Usuarios (No Admin)
        </button>
        <button onclick="this.parentElement.style.display='none'" style="background: #7f8c8d; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; margin: 2px; font-size: 11px; width: 100%;">
            ❌ Cerrar Panel
        </button>
    `;
    
    document.body.appendChild(panel);
}

// Función para exportar usuarios
function exportarUsuarios() {
    const usuarios = cargarUsuarios();
    const usuariosCSV = ['Usuario,Nombre,Email,Rol,FechaRegistro'];
    
    for (const [username, userData] of Object.entries(usuarios)) {
        usuariosCSV.push(
            `"${username}","${userData.nombre}","${userData.email || ''}","${userData.rol}","${userData.fechaRegistro || ''}"`
        );
    }
    
    const blob = new Blob([usuariosCSV.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios_registrados.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    alert('📊 Usuarios exportados como CSV');
}

// Función para limpiar solo usuarios no admin
function limpiarUsuariosNoAdmin() {
    const usuarios = cargarUsuarios();
    const usuariosOriginales = ['estudiante', 'profesor', 'admin'];
    let usuariosEliminados = 0;
    
    for (const username of Object.keys(usuarios)) {
        if (!usuariosOriginales.includes(username)) {
            delete usuarios[username];
            usuariosEliminados++;
        }
    }
    
    guardarUsuarios(usuarios);
    alert(`🗑️ Se eliminaron ${usuariosEliminados} usuarios no administradores`);
}

// Agregar botón flotante para mostrar panel (SOLO para admin)
function agregarBotonPanel() {
    // Verificar si ya existe el botón
    if (document.querySelector('.boton-admin-panel')) {
        return;
    }
    
    const usuarioActual = localStorage.getItem('usuarioLogeado');
    
    if (usuarioActual) {
        const usuario = JSON.parse(usuarioActual);
        
        // Solo mostrar si es admin
        if (usuario.rol === '👨‍💼 Administrador' || usuario.username === 'admin') {
            const boton = document.createElement('button');
            boton.className = 'boton-admin-panel';
            boton.innerHTML = '⚡';
            boton.title = 'Panel de Administración';
            boton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
                border: none;
                font-size: 20px;
                cursor: pointer;
                z-index: 9998;
                box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
                transition: all 0.3s ease;
            `;
            
            boton.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.background = 'linear-gradient(135deg, #c0392b, #e74c3c)';
            });
            
            boton.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            });
            
            boton.addEventListener('click', function() {
                crearPanelAdministracion();
            });
            
            document.body.appendChild(boton);
            
            // También agregar acceso por tecla rápida (Ctrl+Shift+A)
            document.addEventListener('keydown', function(e) {
                if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                    e.preventDefault();
                    crearPanelAdministracion();
                }
            });
        }
    }
}

// Verificar permisos de admin
function esAdministrador() {
    const usuarioActual = localStorage.getItem('usuarioLogeado');
    if (usuarioActual) {
        const usuario = JSON.parse(usuarioActual);
        return usuario.rol === '👨‍💼 Administrador' || usuario.username === 'admin';
    }
    return false;
}

// Proteger las funciones de admin
function protegerFuncionAdmin(funcion) {
    return function(...args) {
        if (!esAdministrador()) {
            alert('⛔ Acceso denegado. Solo los administradores pueden realizar esta acción.');
            return null;
        }
        return funcion.apply(this, args);
    };
}

// Aplicar protección a las funciones administrativas
window.verUsuariosGuardados = protegerFuncionAdmin(verUsuariosGuardados);
window.exportarUsuarios = protegerFuncionAdmin(exportarUsuarios);
window.limpiarUsuariosNoAdmin = protegerFuncionAdmin(limpiarUsuariosNoAdmin);

// También hacer las funciones globales para acceder desde consola (protegidas)
window.adminVerUsuarios = protegerFuncionAdmin(verUsuariosGuardados);
window.adminExportarUsuarios = protegerFuncionAdmin(exportarUsuarios);

// Inicializar panel de desarrollo solo para admin
document.addEventListener('DOMContentLoaded', function() {
    // Verificar después de que el usuario haya iniciado sesión
    setTimeout(() => {
        agregarBotonPanel();
    }, 1000);
});

// También verificar cuando cambia el estado de login
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const barraUsuario = document.getElementById('barraUsuario');
            if (barraUsuario && barraUsuario.style.display === 'flex') {
                // Esperar un poco y luego agregar el botón si es admin
                setTimeout(agregarBotonPanel, 500);
            }
        }
    });
});

// Observar cambios en la barra de usuario
const barraUsuarioElement = document.getElementById('barraUsuario');
if (barraUsuarioElement) {
    observer.observe(barraUsuarioElement, { attributes: true });
}

// Navegación entre unidades
document.querySelectorAll('.boton-unidad').forEach(boton => {
    boton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remover clase activa de todos los botones
        document.querySelectorAll('.boton-unidad').forEach(b => {
            b.classList.remove('activa');
        });
        
        // Añadir clase activa al botón clickeado
        this.classList.add('activa');
        
        // Ocultar todas las secciones
        document.querySelectorAll('.seccion-unidad').forEach(seccion => {
            seccion.classList.remove('activa');
        });
        
        // Mostrar sección correspondiente
        const unidadId = this.getAttribute('data-unidad');
        document.getElementById(unidadId).classList.add('activa');
        
        // Cerrar todos los acordeones al cambiar de unidad
        document.querySelectorAll('.acordeon').forEach(acc => {
            acc.classList.remove('active');
        });
    });
});

// JavaScript para el acordeón
document.querySelectorAll('.acordeon-titulo').forEach(button => {
    button.addEventListener('click', () => {
        const acordeon = button.parentNode;
        const isActive = acordeon.classList.contains('active');
        
        // Cerrar todos los acordeones de la misma unidad
        const unidad = acordeon.closest('.seccion-unidad');
        unidad.querySelectorAll('.acordeon').forEach(acc => {
            acc.classList.remove('active');
        });
        
        // Abrir el actual si no estaba activo
        if (!isActive) {
            acordeon.classList.add('active');
        }
    });
});

// JavaScript para el formulario de demostración (Unidad 2)
document.getElementById('formProducto')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const producto = document.getElementById('producto').value;
    const precio = document.getElementById('precio').value;
    const categoria = document.getElementById('categoria').value;
    
    const tabla = document.getElementById('tablaProductos').getElementsByTagName('tbody')[0];
    const nuevaFila = tabla.insertRow();
    
    nuevaFila.innerHTML = `
        <td>${producto}</td>
        <td>$${parseFloat(precio).toFixed(2)}</td>
        <td>${categoria}</td>
        <td style="cursor: pointer;" onclick="this.parentElement.remove()">❌</td>
    `;
    
    // Limpiar formulario
    this.reset();
});

// Efecto de partículas para el fondo
document.addEventListener('DOMContentLoaded', function() {
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            opacity: ${Math.random() * 0.6};
            z-index: -1;
        `;
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        document.body.appendChild(particle);
    }
});

// ===== MEJORAS RESPONSIVE PARA MÓVILES =====
function ajustarModalParaMovil() {
    const overlay = document.getElementById('overlayLogin');
    const modales = document.querySelectorAll('.modal-login, .modal-registro');
    
    if (window.innerWidth <= 480) {
        overlay.style.alignItems = 'flex-start';
        overlay.style.paddingTop = '20px';
        overlay.style.paddingBottom = '20px';
        
        modales.forEach(modal => {
            modal.style.margin = 'auto';
        });
    } else {
        overlay.style.alignItems = 'center';
        overlay.style.paddingTop = '0';
        overlay.style.paddingBottom = '0';
    }
}

// ===== FUNCIONES MEJORADAS PARA LA BARRA DE USUARIO =====
// Función para mostrar/ocultar modal
function alternarModal() {
    const overlayLogin = document.getElementById('overlayLogin');
    
    if (overlayLogin.style.display === 'none' || overlayLogin.style.display === '') {
        overlayLogin.style.display = 'flex';
        mostrarLogin();
    } else {
        overlayLogin.style.display = 'none';
    }
}

// Función para manejar el cierre de sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioLogeado');
    mostrarInvitado();
    overlayLogin.style.display = 'flex';
    mostrarLogin();
}

// Función para mostrar usuario logeado
function mostrarUsuarioLogeado(usuario) {
    const barraUsuario = document.getElementById('barraUsuario');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const userAvatar = document.getElementById('userAvatar');
    const btnReabrirLogin = document.getElementById('btnReabrirLogin');
    const btnLogout = document.getElementById('btnLogout');
    
    // Mostrar información del usuario
    userName.textContent = usuario.nombre;
    userRole.textContent = usuario.rol;
    userAvatar.textContent = usuario.avatar;
    barraUsuario.style.display = 'flex';
    
    // Configurar botones
    btnReabrirLogin.style.display = 'none';
    btnLogout.style.display = 'block';
    
    // Añadir estilo según el rol
    if (usuario.rol === '👨‍🏫 Profesor') {
        userAvatar.style.background = 'linear-gradient(135deg, #f093fb, #f5576c)';
    } else if (usuario.rol === '👨‍💼 Administrador') {
        userAvatar.style.background = 'linear-gradient(135deg, #4facfe, #00f2fe)';
    } else {
        userAvatar.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
}

// Función para mostrar estado de invitado
function mostrarInvitado() {
    const barraUsuario = document.getElementById('barraUsuario');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const userAvatar = document.getElementById('userAvatar');
    const btnReabrirLogin = document.getElementById('btnReabrirLogin');
    const btnLogout = document.getElementById('btnLogout');
    
    // Configurar como invitado
    userName.textContent = 'Bienvenido a WebLearning';
    userRole.textContent = 'Por ahora eres invitado, registrate o inicia sesión.';
    userAvatar.textContent = '¿Estás listo para explorar? 🤩';
    
    
    // Mostrar barra y configurar botones
    barraUsuario.style.display = 'flex';
    btnReabrirLogin.style.display = 'block';
    btnLogout.style.display = 'none';
}

// ===== INICIALIZACIÓN MEJORADA =====

// Reemplazar completamente la inicialización anterior
document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogeado = localStorage.getItem('usuarioLogeado');
    
    if (usuarioLogeado) {
        // Usuario ya logeado
        mostrarUsuarioLogeado(JSON.parse(usuarioLogeado));
        overlayLogin.style.display = 'none';
    } else {
        // Modo invitado
        mostrarInvitado();
        setTimeout(() => {
            overlayLogin.style.display = 'flex';
            mostrarLogin();
        }, 1000);
    }
});

// Configurar eventos de los botones
btnLogout.addEventListener('click', cerrarSesion);
document.getElementById('btnReabrirLogin').addEventListener('click', alternarModal);

// Eventos de teclado y click fuera
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        alternarModal();
    }
});

overlayLogin.addEventListener('click', function(e) {
    if (e.target === overlayLogin) {
        alternarModal();
    }
});

// Ejecutar al cargar y al redimensionar
window.addEventListener('load', ajustarModalParaMovil);
window.addEventListener('resize', ajustarModalParaMovil);

// ===== SISTEMA DE GESTIÓN DE DOCUMENTOS =====

// Función para guardar documentos
function guardarDocumento(event, unidad) {
    event.preventDefault();
    
    const form = event.target;
    const nombreInput = document.getElementById(`nombre-doc-${unidad}`);
    const archivosInput = document.getElementById(`archivos-${unidad}`);
    const linkInput = document.getElementById(`link-${unidad}`);
    const descripcionInput = document.getElementById(`descripcion-${unidad}`);
    
    const nombre = nombreInput.value.trim();
    const link = linkInput.value.trim();
    const descripcion = descripcionInput.value.trim();
    const archivos = archivosInput.files;
    
    // Validaciones básicas
    if (!nombre) {
        mostrarMensaje('error', 'Por favor ingresa un nombre para el documento');
        return;
    }
    
    if (archivos.length === 0 && !link) {
        mostrarMensaje('error', 'Por favor sube al menos un archivo o ingresa un enlace');
        return;
    }
    
    // Crear objeto del documento
    const documento = {
        id: Date.now().toString(),
        nombre: nombre,
        descripcion: descripcion,
        link: link,
        archivos: [],
        fecha: new Date().toISOString(),
        unidad: unidad
    };
    
    // Procesar archivos si existen
    if (archivos.length > 0) {
        for (let i = 0; i < archivos.length; i++) {
            const archivo = archivos[i];
            documento.archivos.push({
                nombre: archivo.name,
                tipo: archivo.type,
                tamaño: archivo.size,
                // En un sistema real, aquí subirías el archivo a un servidor
                // Por ahora simulamos la subida
                url: URL.createObjectURL(archivo)
            });
        }
    }
    
    // Guardar en localStorage
    guardarDocumentoEnStorage(documento);
    
    // Limpiar formulario
    form.reset();
    
    // Actualizar lista
    cargarDocumentos(unidad);
    
    // Mostrar mensaje de éxito
    mostrarMensaje('exito', '📄 Documento guardado exitosamente');
}

// Función para guardar documento en localStorage
function guardarDocumentoEnStorage(documento) {
    let documentos = JSON.parse(localStorage.getItem('documentos')) || [];
    documentos.push(documento);
    localStorage.setItem('documentos', JSON.stringify(documentos));
}

// Función para cargar documentos de una unidad específica
function cargarDocumentos(unidad) {
    const lista = document.getElementById(`lista-documentos-${unidad}`);
    const documentos = JSON.parse(localStorage.getItem('documentos')) || [];
    
    // Filtrar documentos por unidad
    const documentosUnidad = documentos.filter(doc => doc.unidad === unidad);
    
    if (documentosUnidad.length === 0) {
        lista.innerHTML = `
            <div class="documento-vacio">
                <div>📁</div>
                <p>No hay documentos subidos aún</p>
                <small>¡Sé el primero en subir un documento!</small>
            </div>
        `;
        return;
    }
    
    // Ordenar por fecha (más reciente primero)
    documentosUnidad.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    lista.innerHTML = documentosUnidad.map(documento => `
        <div class="documento-item" data-id="${documento.id}">
            <div class="documento-header">
                <h4 class="documento-titulo">${documento.nombre}</h4>
                <span class="documento-fecha">${formatearFecha(documento.fecha)}</span>
            </div>
            
            ${documento.descripcion ? `
                <div class="documento-descripcion">${documento.descripcion}</div>
            ` : ''}
            
            <div class="documento-enlaces">
                ${documento.archivos.map(archivo => `
                    <a href="${archivo.url}" target="_blank" class="documento-enlace archivo" download="${archivo.nombre}">
                        📎 ${archivo.nombre}
                    </a>
                `).join('')}
                
                ${documento.link ? `
                    <a href="${documento.link}" target="_blank" class="documento-enlace link">
                        🔗 Enlace web
                    </a>
                ` : ''}
            </div>
            
            <div class="documento-acciones">
                <button class="btn-eliminar" onclick="eliminarDocumento('${documento.id}', '${unidad}')">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Función para eliminar documento
function eliminarDocumento(id, unidad) {
    if (!confirm('¿Estás seguro de que quieres eliminar este documento?')) {
        return;
    }
    
    let documentos = JSON.parse(localStorage.getItem('documentos')) || [];
    documentos = documentos.filter(doc => doc.id !== id);
    localStorage.setItem('documentos', JSON.stringify(documentos));
    
    // Recargar lista
    cargarDocumentos(unidad);
    
    mostrarMensaje('exito', 'Documento eliminado correctamente');
}

// Función para formatear fecha
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para mostrar mensajes
function mostrarMensaje(tipo, mensaje) {
    // Crear mensaje temporal
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = tipo === 'exito' ? 'mensaje-exito' : 'mensaje-error';
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.display = 'block';
    
    // Insertar al inicio del body
    document.body.insertBefore(mensajeDiv, document.body.firstChild);
    
    // Auto-eliminar después de 4 segundos
    setTimeout(() => {
        mensajeDiv.remove();
    }, 4000);
}

// Función para inicializar el sistema de documentos
function inicializarSistemaDocumentos() {
    // Cargar documentos para cada unidad al iniciar
    ['unidad1', 'unidad2', 'unidad3', 'unidad4'].forEach(unidad => {
        cargarDocumentos(unidad);
    });
}

// ===== INICIALIZACIÓN COMPLETA DEL SISTEMA =====
document.addEventListener('DOMContentLoaded', function() {
    // Sistema de autenticación (existente)
    const usuarioLogeado = localStorage.getItem('usuarioLogeado');
    
    if (usuarioLogeado) {
        mostrarUsuarioLogeado(JSON.parse(usuarioLogeado));
        overlayLogin.style.display = 'none';
    } else {
        mostrarInvitado();
        setTimeout(() => {
            overlayLogin.style.display = 'flex';
            mostrarLogin();
        }, 1000);
    }
    
    // Inicializar sistema de documentos
    inicializarSistemaDocumentos();
    
    // Observar cambios en las unidades para recargar documentos
    const observerUnidades = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const unidadActiva = document.querySelector('.seccion-unidad.activa');
                if (unidadActiva) {
                    const unidadId = unidadActiva.id;
                    // Recargar documentos cuando se cambia de unidad
                    setTimeout(() => cargarDocumentos(unidadId), 100);
                }
            }
        });
    });
    
    // Observar cambios en las secciones de unidades
    document.querySelectorAll('.seccion-unidad').forEach(seccion => {
        observerUnidades.observe(seccion, { attributes: true });
    });
});

// También agregar esta función para manejar la navegación entre unidades
document.querySelectorAll('.boton-unidad').forEach(boton => {
    boton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remover clase activa de todos los botones
        document.querySelectorAll('.boton-unidad').forEach(b => {
            b.classList.remove('activa');
        });
        
        // Añadir clase activa al botón clickeado
        this.classList.add('activa');
        
        // Ocultar todas las secciones
        document.querySelectorAll('.seccion-unidad').forEach(seccion => {
            seccion.classList.remove('activa');
        });
        
        // Mostrar sección correspondiente
        const unidadId = this.getAttribute('data-unidad');
        document.getElementById(unidadId).classList.add('activa');
        
        // Cerrar todos los acordeones al cambiar de unidad
        document.querySelectorAll('.acordeon').forEach(acc => {
            acc.classList.remove('active');
        });
        
        // Cargar documentos de la unidad activa
        setTimeout(() => cargarDocumentos(unidadId), 100);
    });
});