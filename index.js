function createElement(tag, attributes = {}, children = null, callbacks = {}) { // callbacks: {event: handler}
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

    Object.entries(callbacks).forEach(([event, handler]) => {
        element.addEventListener(event, handler);
    });

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
    constructor() {
        super();
        this.state = {
            tasks: [
                {text: "Сделать домашку", completed: false},
                {text: "Сделать практику", completed: false},
                {text: "Пойти домой", completed: false}
            ],
            newTaskText: "" // текс водящейся сейчас таски
        };

        this.onAddInputChange = this.onAddInputChange.bind(this);
        this.onAddTask = this.onAddTask.bind(this);
        this.onDeleteTask = this.onDeleteTask.bind(this);
        this.onCompleteTask = this.onCompleteTask.bind(this);
    }

    render() {
        return createElement("div", {class: "todo-list"}, [
            createElement("h1", {}, "TODO List"),
            createElement("div", {class: "add-todo"}, [
                createElement("input", {
                    id: "new-todo",
                    type: "text",
                    placeholder: "Задание",
                    value: this.state.newTaskText
                }, null, {
                    input: this.onAddInputChange
                }),
                createElement("button", {id: "add-btn"}, "+", {
                    click: this.onAddTask
                }),
            ]),
            createElement("ul", {id: "todos"},
                this.state.tasks.map((todo, index) =>
                    createElement("li", {}, [
                        createElement("input", {
                            type: "checkbox",
                            ...(todo.completed && {checked: "checked"})
                        }, null, {
                            click: () => this.onCompleteTask(index)
                        }),
                        createElement("label", {
                            style: todo.completed ? "color: gray;" : ""
                        }, todo.text),
                        createElement("button", {}, "🗑️", {
                            click: () => this.onDeleteTask(index)
                        })
                    ])
                )
            )
        ]);
    }

    onAddInputChange(e) {
        this.state.newTaskText = e.target.value;
    }

    onAddTask() {
        const text = this.state.newTaskText.trim();
        if (!text) return;

        this.state.tasks.push({text, completed: false});
        this.state.newTaskText = "";
        this.update();
    }

    onDeleteTask(index) {
        this.state.tasks.splice(index, 1);
        this.update();
    }

    onCompleteTask(index) {
        this.state.tasks[index].completed = !this.state.tasks[index].completed;
        this.update();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(new TodoList().getDomNode());
});
