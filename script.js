// Seleccionamos los elementos del HTML
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

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
        // Guardamos solo el texto de la tarea
        tasks.push(item.querySelector('.task-text').innerText);
    });
    // Guardamos la lista como un texto (JSON.stringify)
    localStorage.setItem('myTasks', JSON.stringify(tasks));
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
    });

    // Acción de eliminar
    li.querySelector('.delete-btn').addEventListener('click', function() {
        li.remove();
        saveTasks(); // Guardamos el cambio inmediatamente
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
}

// Eventos de botones y teclado
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Ejecutamos la carga de tareas apenas se abre la página
loadTasks();