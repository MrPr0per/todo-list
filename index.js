function createElement(tag, attributes, children, callbacks = {}) { // callbacks: {event: handler}
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
            newTaskText: "" // текс водящейся таски
        };
    }

    render() {
        return createElement("div", {class: "todo-list"}, [
            createElement("h1", {}, "TODO List"),
            createElement("div", {class: "add-todo"}, [
                createElement("input", {
                    id: "new-todo",
                    type: "text",
                    placeholder: "Задание",
                }, null, {
                    input: this.onAddInputChange.bind(this)
                }),
                createElement("button", {id: "add-btn"}, "+", {
                    click: this.onAddTask.bind(this)
                }),
            ]),
            createElement("ul", {id: "todos"},
                this.state.tasks.map((todo) =>
                    createElement("li", {}, [
                        createElement("input", {
                            type: "checkbox",
                            ...(todo.completed && {checked: "checked"})
                        }),
                        createElement("label", {}, todo.text),
                        createElement("button", {}, "🗑️")
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
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(new TodoList().getDomNode());
});
