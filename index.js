function createElement(tag, attributes = null, children = null, callbacks = null) { // callbacks: {event: handler}
    const element = document.createElement(tag);

    if (attributes) {
        Object.keys(attributes).forEach((key) => {
            element.setAttribute(key, attributes[key]);
        });
    }

    if (Array.isArray(children)) {
        children.forEach((child) => {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });
    } else if (typeof children === "string") {
        element.appendChild(document.createTextNode(children));
    } else if (children instanceof HTMLElement) {
        element.appendChild(children);
    }

    if (callbacks) {
        Object.entries(callbacks).forEach(([event, handler]) => {
            element.addEventListener(event, handler);
        });
    }

    return element;
}

class Component {
    getDomNode() {
        this._domNode = this.render();
        return this._domNode;
    }

    update() {
        const newNode = this.render();
        this._domNode.replaceWith(newNode);
        this._domNode = newNode;
    }
}

class TodoList extends Component {
    static storageKey = "todo-list-tasks";

    constructor() {
        super();
        const savedTasks = localStorage.getItem(TodoList.storageKey);
        this.state = {
            tasks: savedTasks ? JSON.parse(savedTasks) : [
                {text: "Сделать домашку", completed: false},
                {text: "Сделать практику", completed: false},
                {text: "Пойти домой", completed: false},
            ],
        };

        this.saveState = this.saveState.bind(this);
        this.onAddTask = this.onAddTask.bind(this);
        this.onDeleteTask = this.onDeleteTask.bind(this);
        this.onToggleTaskCompleted = this.onToggleTaskCompleted.bind(this);
    }

    saveState() {
        localStorage.setItem(TodoList.storageKey, JSON.stringify(this.state.tasks));
    }

    onAddTask(text) {
        this.state.tasks.push({text, completed: false});
        this.saveState();
        this.update();
    }

    onDeleteTask(index) {
        this.state.tasks.splice(index, 1);
        this.saveState();
        this.update();
    }

    onToggleTaskCompleted(index) {
        this.state.tasks[index].completed = !this.state.tasks[index].completed;
        this.saveState();
        this.update();
    }

    render() {
        return createElement("div", {class: "todo-list"}, [
            createElement("h1", {}, "TODO List"),
            new AddTask(this.onAddTask).getDomNode(),
            createElement("ul", {},
                this.state.tasks.map((todo, index) =>
                    new Task(todo, index, this.onToggleTaskCompleted, this.onDeleteTask).getDomNode(),
                ),
            ),
        ]);
    }
}

class AddTask extends Component {
    constructor(onAddTask) {
        super();
        this.onAddTask = onAddTask;
        this.inputValue = "";
        this.onInput = this.onInput.bind(this);
        this.onAdd = this.onAdd.bind(this);
    }

    onInput(e) {
        this.inputValue = e.target.value;
    }

    onAdd() {
        const text = this.inputValue.trim();
        if (text) this.onAddTask(text);
    }

    render() {
        return createElement("div", {class: "add-todo"}, [
            createElement("input", {
                type: "text",
                placeholder: "Задание",
                value: this.inputValue,
            }, null, {input: this.onInput}),
            createElement("button", {}, "+", {click: this.onAdd}),
        ]);
    }
}

class Task extends Component {
    constructor(todo, index, onToggle, onDelete) {
        super();
        this.todo = todo;
        this.index = index;
        this.onToggle = onToggle;
        this.onDeleteCallback = onDelete
        this.onDelete = this.onDelete.bind(this);

        this.isNeedToConfirmDelete = true;
    }

    onDelete(index) {
        if (this.isNeedToConfirmDelete) {
            this.isNeedToConfirmDelete = false;
            this.update();
        } else {
            this.onDeleteCallback(index);
        }
    }

    render() {
        const children = [
            createElement("input", {
                type: "checkbox",
                ...(this.todo.completed && {checked: "checked"}),
            }, null, {
                change: () => this.onToggle(this.index),
            }),
            createElement("label", {
                style: this.todo.completed ? "color: gray;" : "",
            }, this.todo.text),
            createElement("button", {
                style: this.isNeedToConfirmDelete ? "" : "background-color: red;",
            }, "🗑️", {
                click: () => this.onDelete(this.index),
            }),
        ]
        if (!this.isNeedToConfirmDelete) {
            children.push(createElement("button", {
                style: "background-color: red; margin-left:5px;",
            }, "Отмена", {
                click: () => {
                    this.isNeedToConfirmDelete = true;
                    this.update();
                },
            }))
        }

        return createElement("li", null, children);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(new TodoList().getDomNode());
});

