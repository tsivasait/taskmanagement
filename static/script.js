// Load tasks when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskElement.innerHTML = `
            <input type="checkbox" class="checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onclick="toggleTask(${task.id})">
            <span class="task-title">${task.title}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        
        taskList.appendChild(taskElement);
    });
}

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const title = taskInput.value.trim();
    
    if (!title) return;
    
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        
        if (response.ok) {
            taskInput.value = '';
            loadTasks();
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadTasks();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

async function toggleTask(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}/toggle`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            loadTasks();
        }
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

// Allow adding tasks with Enter key
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});