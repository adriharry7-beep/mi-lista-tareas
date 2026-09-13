// Seleccionamos los elementos del HTML
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');

// --- NUEVA FUNCIÓN: Cargar tema guardado ---
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
}

// --- NUEVA FUNCIÓN: Guardar tema ---
function saveTheme(theme) {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

// --- FUNCIÓN: Actualizar icono del tema ---
function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}

// --- NUEVA FUNCIÓN: Cambiar modo ---
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    saveTheme(newTheme);
}

// --- NUEVA FUNCIÓN: Cargar datos al iniciar ---
// Esta función se ejecuta automáticamente cuando abres la página.
// Busca en el "cuaderno" (localStorage) si hay tareas guardadas.
function loadTasks() {
    const savedTasks = localStorage.getItem('myTasks');
    if (savedTasks) {
        // Convertimos el texto guardado de nuevo en una lista real (JSON.parse)
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(taskText => {
            renderTask(taskText);
        });
    }
}

// --- NUEVA FUNCIÓN: Guardar en el "cuaderno" ---
// Cada vez que algo cambia, guardamos la lista completa en localStorage.
function saveTasks() {
    const tasks = [];
    // Recorremos todos los elementos de la lista en la pantalla
    const items = taskList.querySelectorAll('li');
    items.forEach(item => {
        // Guardamos solo el texto de la tarea si existe
        const textElement = item.querySelector('.task-text');
        if (textElement) {
            tasks.push(textElement.innerText);
        }
    });
    // Guardamos la lista como un texto (JSON.stringify)
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

// --- NUEVA FUNCIÓN: Actualizar contador ---
function updateCounter() {
    const total = taskList.querySelectorAll('li').length;
    const completed = taskList.querySelectorAll('li.completed').length;
    const counter = document.getElementById('taskCounter');
    counter.innerText = `${completed} de ${total}`;
    
    // Estilo condicional
    if (total === 0) {
        counter.style.color = '#777';
    } else if (completed === total) {
        counter.style.color = '#2ecc71';
    } else {
        counter.style.color = '#333';
    }
}

// Función para crear el elemento visual en la pantalla
function renderTask(taskText) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <button class="delete-btn">Eliminar</button>
    `;

    // Acción de marcar como completada
    li.querySelector('.task-text').addEventListener('click', function() {
        li.classList.toggle('completed');
        updateCounter(); // Actualizar contador
    });

    // Acción de eliminar
    li.querySelector('.delete-btn').addEventListener('click', function() {
        if (confirm('¿Estás seguro de eliminar esta tarea?')) {
            li.remove();
            saveTasks(); // Guardamos el cambio inmediatamente
            updateCounter(); // Actualizar contador
        }
    });

    taskList.appendChild(li);
}

// Función principal para añadir una tarea
function addTask() {
    const taskText = taskInput.value;

    if (taskText === "") {
        alert("Por favor, escribe una tarea antes de añadirla.");
        return;
    }

    renderTask(taskText);
    saveTasks(); // Guardamos la nueva tarea en el "cuaderno"
    taskInput.value = "";
    updateCounter(); // Actualizar contador
}

// Eventos de botones y teclado
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Ejecutamos la carga de tareas al iniciar
loadTasks();

updateCounter();

// Cargar tema guardado
loadTheme();

// Evento para alternar modo noche
themeToggle.addEventListener('click', toggleTheme);

// --- NUEVA FUNCIÓN: Exportar/Guardar lista ---
function exportTasks() {
    const tasks = [];
    // Recorremos todas las tareas en la pantalla
    taskList.querySelectorAll('li').forEach(li => {
        // Obtenemos el texto y el estado completado
        const textElement = li.querySelector('.task-text');
        if (textElement) {
            tasks.push({
                text: textElement.innerText,
                completed: li.classList.contains('completed')
            });
        }
    });

    // Formato de archivo con fecha
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mi-lista-tareas-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// --- NUEVA FUNCIÓN: Copiar al portapapeles ---
function copyToClipboard() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        const textElement = li.querySelector('.task-text');
        if (textElement) {
            tasks.push(textElement.innerText);
        }
    });

    const textToCopy = JSON.stringify(tasks);
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Feedback visual temporal
        const originalText = exportBtn.innerText;
        exportBtn.innerText = '✓';
        setTimeout(() => {
            exportBtn.innerText = '📤';
        }, 2000);
    });
}

// --- NUEVA FUNCIÓN: Limpiar todas las tareas ---
function clearAllTasks() {
    if (confirm('¿Eliminar todas las tareas?')) {
        taskList.innerHTML = '';
        localStorage.removeItem('myTasks');
        updateCounter(); // Actualizar contador si existe
    }
}

// Agregar event listeners a los nuevos botones
exportBtn.addEventListener('click', function(e) {
    // Alternar entre exportar y copiar con un solo botón
    // Primero intentamos exportar, si falla o podemos decidir...
    // Por ahora: click largo = copiar, click normal = exportar
    // Simplificamos: un solo click exporta, doble click copia
    if (e.detail === 2) {
        // Doble click = copiar
        e.preventDefault();
        copyToClipboard();
    } else {
        // Click simple = exportar
        exportTasks();
    }
});

// Cambiar cursor para indicar doble click posible
exportBtn.setAttribute('title', 'Click: exportar | Doble click: copiar al portapapeles');

// También añadiremos un botón de "Limpiar todo" al footer después del h1
// (Esto se hará en el próximo paso cuando implementemos la función #4)