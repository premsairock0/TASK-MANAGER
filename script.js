const wrapper = document.querySelector('.wrapper');
const backBtn = document.querySelector('.back-btn');
const menuBtn = document.querySelector('.menu-btn');

const toggleScreen = () => {
    wrapper.classList.toggle('show-category');
};

menuBtn.addEventListener('click', toggleScreen);
backBtn.addEventListener('click', toggleScreen);

const addTaskBtn = document.querySelector('.add-task-btn');
const addTaskForm = document.querySelector('.add-task');
const blackBackdrop = document.querySelector('.black-backdrop');

const toggleAddTaskForm = () => {
    addTaskForm.classList.toggle('active');
    blackBackdrop.classList.toggle('active');
    addTaskBtn.classList.toggle('active');
};

addTaskBtn.addEventListener('click', toggleAddTaskForm);
blackBackdrop.addEventListener('click', toggleAddTaskForm);

let categories = [
    { title: 'Personal', img: 'kiss.png' },
    { title: 'Work', img: 'suitcase.png' },
    { title: 'Shopping', img: 'store.png' },
    { title: 'Coding', img: 'error.png' },
    { title: 'Health', img: 'ct-scan.png' },
    { title: 'Fitness', img: 'treadmill.png' },
    { title: 'Education', img: 'training.png' },
    { title: 'Finance', img: 'budget.png' }
];

let tasks = [
    { id: 1, task: 'Schedule a dentist appointment for next Monday', category: 'Personal', completed: false, reminderTime: null },
    { id: 2, task: 'Buy groceries for the week including fresh vegetables', category: 'Personal', completed: false, reminderTime: null },
    { id: 3, task: 'Pay the electricity bill online before Friday', category: 'Personal', completed: false, reminderTime: null },
    { id: 4, task: 'Read two chapters of the new novel tonight', category: 'Personal', completed: false, reminderTime: null }
];

let selectedCategory = categories[0];

const categoriesContainer = document.querySelector('.categories');
const categoryTitle = document.querySelector('.category-title');
const totalCategoryTasks = document.querySelector('.category-tasks');
const categoryImg = document.querySelector('#category-img');
const totaltasks = document.querySelector('.totalTasks');

const calculateTotal = () => {
    const normalizedSelectedCategory = selectedCategory.title.toLowerCase();
    const categoryTasksCount = tasks.filter((task) => task.category.toLowerCase() === normalizedSelectedCategory).length;
    totalCategoryTasks.innerHTML = `${categoryTasksCount} Tasks`;
    totaltasks.innerHTML = `${tasks.length}`;
};

const renderCategories = () => {
    categoriesContainer.innerHTML = '';
    categories.forEach((category) => {
        const categoryTaskCount = tasks.filter((task) => task.category.toLowerCase() === category.title.toLowerCase()).length;
        const div = document.createElement('div');
        div.className = 'category';
        div.innerHTML = `
            <div class="left">
                <img src="img/${category.img}" alt="${category.title}">
                <div class="content">
                    <h1>${category.title}</h1>
                    <p>${categoryTaskCount} Tasks</p>
                </div>
            </div>
            <div class="options">
                <div class="toggle-btn">
                    <i class="bx bx-dots-vertical-rounded"></i>
                </div>
            </div>
        `;

        div.addEventListener('click', () => selectCategory(category));

        categoriesContainer.appendChild(div);
    });
};

const selectCategory = (category) => {
    wrapper.classList.add('show-category');
    selectedCategory = category;
    categoryTitle.innerHTML = category.title;
    categoryImg.src = `img/${category.img}`;
    calculateTotal();
    renderTasks();
};

const tasksContainer = document.querySelector('.tasks');

const renderTasks = () => {
    const normalizedSelectedCategory = selectedCategory.title.toLowerCase();
    const categoryTasks = tasks.filter((task) => task.category.toLowerCase() === normalizedSelectedCategory);

    tasksContainer.innerHTML = categoryTasks.length === 0 ? `<p class="no-task">No tasks for this category</p>` : categoryTasks.map((task) => createTaskHtml(task)).join('');

    addTaskEventListeners();

    renderCategories();
    calculateTotal();
};

const createTaskHtml = (task) => {
    return `
    <div class="task-wrapper">
        <label class="task" for="${task.id}">
            <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''}>
            <span class="checkmark"><i class="bx bx-check"></i></span>
            <p>${task.task}</p>
        </label>
        <div class="delete"><i class="bx bxs-trash"></i></div>
    </div>
    `;
};

const addTaskEventListeners = () => {
    document.querySelectorAll('.task-wrapper').forEach((taskWrapper, index) => {
        const checkbox = taskWrapper.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleTaskCompleted(index));

        const deleteBtn = taskWrapper.querySelector('.delete');
        deleteBtn.addEventListener('click', () => deleteTask(index, taskWrapper));
    });
};

const toggleTaskCompleted = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveLocal();
    renderTasks();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    saveLocal();
    renderTasks();
};

// save-get from local storage
const saveLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const getLocal = () => {
    const localTasks = JSON.parse(localStorage.getItem('tasks'));

    if (localTasks) {
        tasks = localTasks;
    }
};
const categorySelect = document.querySelector('#category-select');
const cancelBtn = document.querySelector('.cancel-btn');
const addBtn = document.querySelector('.add-btn');

const taskInput = document.querySelector('#task-input');
const reminderTimeInput = document.querySelector('#reminder-time');

cancelBtn.addEventListener('click', toggleAddTaskForm);

addBtn.addEventListener('click', () => {
    const task = taskInput.value.trim();
    const category = categorySelect.value;
    const reminderTime = reminderTimeInput.value;

    if (!task) {
        alert('Please enter a task');
        return;
    }

    if (!reminderTime) {
        alert('Please enter a reminder time');
        return;
    }

    const newTaskId = Date.now();

    const newTask = {
        id: newTaskId,
        task,
        category,
        completed: false,
        reminderTime
    };

    tasks.push(newTask);
    taskInput.value = '';
    reminderTimeInput.value = '';
    saveLocal();
    toggleAddTaskForm();
    renderTasks();
});

categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.title.toLowerCase();
    option.textContent = category.title;
    categorySelect.appendChild(option);
});

const checkReminders = () => {
    const now = new Date();
    tasks.forEach((task, index) => {
        if (task.reminderTime && new Date(task.reminderTime) <= now && !task.completed) {
            alert(`Reminder: ${task.task}`);
            deleteTask(index);
        }
    });
};

setInterval(checkReminders, 60000); // Check reminders every minute

getLocal();
calculateTotal();
renderCategories();
renderTasks();
