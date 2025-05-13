function createElement(tag, attributes, children) {
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

    return element;
}

class Component {
    constructor() {
    }

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
                { text: "Сделать домашку", completed: false },
                { text: "Сделать практику", completed: false },
                { text: "Пойти домой", completed: false }
            ]
        };
    }

    render() {
        return createElement("div", { class: "todo-list" }, [
            createElement("h1", {}, "TODO List"),
            createElement("div", { class: "add-todo" }, [
                createElement("input", {
                    id: "new-todo",
                    type: "text",
                    placeholder: "Задание",
                }),
                createElement("button", { id: "add-btn" }, "+"),
            ]),
            createElement("ul", { id: "todos" },
                this.state.tasks.map((todo) =>
                    createElement("li", {}, [
                        createElement("input", {
                            type: "checkbox",
                            ...(todo.completed && { checked: "checked" })
                        }),
                        createElement("label", {}, todo.text),
                        createElement("button", {}, "🗑️")
                    ])
                )
            )
        ]);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(new TodoList().getDomNode());
});