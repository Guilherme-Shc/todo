export default class TodoList{
    constructor(createButton, todoList){
        this.createButton = document.querySelector(createButton);
        this.todoList = document.querySelector(todoList)
    }

    render(tasks){
        this.todoList.innerHTML = '';

        tasks.forEach((task) => {
            this.todoList.innerHTML += `
            <li class="task" id=${task.id }>
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <p contenteditable>${task.description}</p>
                <button class="del-btn"></button>
            </li>
            `;
        });
        this.addUpdateTaskEvents();
        this.addDeleteTaskEvents();
    }
    async getTasks(){
        try{
            const resp = await fetch('http://localhost:3333/todos')
            const tasks = await resp.json();
            this.render(tasks);
        } catch (error){
            throw new Error(error);
        }
    }

    async createTask(){
        try {
            await fetch('http://localhost:3333/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: 'Write a task...',
                    completed: false,
                }),
            });
            this.getTasks();
        } catch (error) {
            throw new Error(error)
        }
    }

    
    addCreateTaskEvent(){
        this.createButton.addEventListener('click', () => this.createTask());
    }

    async updateTask ({target}){
        try {
            await fetch(`http://localhost:3333/todos/${target.parentElement.id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'applications/json',
                },
                body: JSON.stringify({
                    description:
                    target instanceof HTMLParagraphElement ? target.innerText : target.nextElementSibling.innerText,
                    completed:
                    target instanceof HTMLInputElement ? target.checked : target.previousElementSibling.checked,
                })
            });                
        } catch (error) {
            throw new Error(error)
        }

    }
    addUpdateTaskEvents(){
        const descriptions = document.querySelectorAll('.task p');
        descriptions.forEach((description) => 
            description.addEventListener('blur', (event) => this.updateTask(event)),
        );

        const checkboxes = document.querySelectorAll(
            '.task input[type="checkbox"]',
        );
        checkboxes.forEach((checkbox) =>
            checkbox.addEventListener('click', (event) => this.updateTask(event)),
        );
    }

    async deleteTask({target}) {
        try {
            await fetch(`http://localhost:3333/todos/${target.parentElement.id}`,{
                method: 'DELETE',
            });
            this.getTasks();
        } catch (error) {
            throw new Error(error)
        }
    }

    addDeleteTaskEvents() {
        const deleteButtons = document.querySelectorAll('.del-btn');
        deleteButtons.forEach((button) =>
            button.addEventListener('click', (event) => this.deleteTask(event)),
        );
    }


    init() {
        if(this.createButton && this.todoList){
            this.addCreateTaskEvent();
            this.getTasks();
        }
        return this;
    }
}