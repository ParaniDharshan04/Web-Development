document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("taskList")) {
        loadTasks(); // Load tasks on tasks.html
    }
});

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    let tasks = getStoredTasks();
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
}

function loadTasks() {
    let savedTasks = getStoredTasks();
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    savedTasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.className = "list-group-item";

        let span = document.createElement("span");
        span.textContent = task.text;
        if (task.completed) span.classList.add("completed");
        span.onclick = function () {
            this.classList.toggle("completed");
            savedTasks[index].completed = !savedTasks[index].completed;
            localStorage.setItem("tasks", JSON.stringify(savedTasks));
        };

        let btnGroup = document.createElement("div");

        let editBtn = document.createElement("button");
        editBtn.className = "btn btn-warning btn-sm me-2";
        editBtn.textContent = "Edit";
        editBtn.onclick = function () {
            let newText = prompt("Edit your task:", task.text);
            if (newText !== null) {
                savedTasks[index].text = newText.trim();
                localStorage.setItem("tasks", JSON.stringify(savedTasks));
                loadTasks();
            }
        };

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger btn-sm";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function () {
            savedTasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(savedTasks));
            loadTasks();
        };

        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(deleteBtn);
        li.appendChild(span);
        li.appendChild(btnGroup);
        taskList.appendChild(li);
    });
}

function getStoredTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}
