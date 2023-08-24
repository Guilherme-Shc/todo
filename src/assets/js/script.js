import DisplayToday from "./modules/displayToday.js";
import TodoList from "./modules/todoList.js";



const displayToday = new DisplayToday('.today') ;
displayToday.init()

const todoList = new TodoList('.create-btn', '.todo-list');
todoList.init();