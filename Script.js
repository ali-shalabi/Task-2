let taskToDelete = null;
let taskToEdit = null;

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}
  
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function saveTasksToLocalStorage() {
    const tasksContainer = document.getElementById('tasksContainer');
    const tasks = Array.from(tasksContainer.querySelectorAll('.task')).map(task => {
        const taskName = task.querySelector('span').textContent;
        const isCompleted = task.querySelector('.checkbox').checked;
        return { name: taskName, completed: isCompleted };
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';

        const taskName = document.createElement('span');
        taskName.textContent = task.name;
        if (task.completed) {
            taskName.classList.add('completed-task');
        }

        const taskButtons = document.createElement('div');
        taskButtons.className = 'task-buttons';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.innerHTML = '🗑';
        deleteButton.onclick = () => {
            taskToDelete = taskElement;
            openModal('deleteModal');
        };

        const editButton = document.createElement('button');
        editButton.className = 'edit';
        editButton.innerHTML = '✏️';
        editButton.onclick = () => {
            taskToEdit = taskName;
            document.getElementById('editTaskInput').value = taskName.textContent;
            openModal('editModal');
        };

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = () => {
            if (checkbox.checked) {
                taskName.classList.add('completed-task');
            } else {
                taskName.classList.remove('completed-task');
            }
            saveTasksToLocalStorage();
        };

        taskButtons.appendChild(checkbox);
        taskButtons.appendChild(editButton);
        taskButtons.appendChild(deleteButton);

        taskElement.appendChild(taskName);
        taskElement.appendChild(taskButtons);

        document.getElementById('tasksContainer').appendChild(taskElement);
    });
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const tasksContainer = document.getElementById('tasksContainer');
    const validationMessage = document.getElementById('validationMessage');

    if (taskInput.value.trim() === '' || taskInput.value.length < 5 || /^[0-9]/.test(taskInput.value)) {
        validationMessage.style.display = 'block';
        validationMessage.textContent = taskInput.value.trim() === ''
            ? 'Task must not be empty.'
            : taskInput.value.length < 5
                ? 'Task must be at least 5 characters long.'
                : 'Task cannot start with a number.';
        return;
    }

    validationMessage.style.display = 'none';

    const task = document.createElement('div');
    task.className = 'task';

    const taskName = document.createElement('span');
    taskName.textContent = taskInput.value;

    const taskButtons = document.createElement('div');
    taskButtons.className = 'task-buttons';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.innerHTML = '🗑';
    deleteButton.onclick = () => {
        taskToDelete = task;
        openModal('deleteModal');
    };

    const editButton = document.createElement('button');
    editButton.className = 'edit';
    editButton.innerHTML = '✏️';
    editButton.onclick = () => {
        taskToEdit = taskName;
        document.getElementById('editTaskInput').value = taskName.textContent;
        openModal('editModal');
    };

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.onchange = () => {
        if (checkbox.checked) {
            taskName.classList.add('completed-task');
        } else {
            taskName.classList.remove('completed-task');
        }
        saveTasksToLocalStorage();
    };

    taskButtons.appendChild(checkbox);
    taskButtons.appendChild(editButton);
    taskButtons.appendChild(deleteButton);

    task.appendChild(taskName);
    task.appendChild(taskButtons);

    tasksContainer.appendChild(task);

    taskInput.value = '';
    saveTasksToLocalStorage();
}

function filterTasks(filter) {
    const tasksContainer = document.getElementById('tasksContainer');
    const tasks = tasksContainer.querySelectorAll('.task');

    tasks.forEach(task => {
        const checkbox = task.querySelector('.checkbox');
        if (filter === 'all') {
            task.style.display = 'flex';
        } else if (filter === 'done') {
            task.style.display = checkbox.checked ? 'flex' : 'none';
        } else if (filter === 'todo') {
            task.style.display = !checkbox.checked ? 'flex' : 'none';
        }
    });
}

function confirmDelete() {
    if (taskToDelete) {
        taskToDelete.remove();
        saveTasksToLocalStorage();
        taskToDelete = null;
    }
    closeModal('deleteModal');
}

function confirmEdit() {
    const newTaskName = document.getElementById('editTaskInput').value;
    if (newTaskName.trim() !== '') {
        taskToEdit.textContent = newTaskName;
        saveTasksToLocalStorage();
    }
    closeModal('editModal');
}

function deleteDoneTasks() {
    openModal('deleteDoneModal');
}

function confirmDeleteDone() {
    const tasksContainer = document.getElementById('tasksContainer');
    const tasks = tasksContainer.querySelectorAll('.task');

    tasks.forEach(task => {
        const checkbox = task.querySelector('.checkbox');
        if (checkbox && checkbox.checked) {
            task.remove();
        }
    });

    saveTasksToLocalStorage();
    closeModal('deleteDoneModal');
}

function deleteAllTasks() {
    openModal('deleteAllModal');
}

function confirmDeleteAll() {
    const tasksContainer = document.getElementById('tasksContainer');
    tasksContainer.innerHTML = '';
    localStorage.removeItem('tasks');
    closeModal('deleteAllModal');
}

// Load tasks from localStorage on page load
window.onload = loadTasksFromLocalStorage;  