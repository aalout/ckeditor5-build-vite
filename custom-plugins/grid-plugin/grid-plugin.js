import {
    Plugin,
    ButtonView,
    ContextualBalloon,
    View,
    clickOutsideHandler,
    toWidgetEditable,
} from "ckeditor5";
import ChangeCellColorCommand from "./gridCell-color-change";

class SimpleFormView extends View {
    constructor(locale) {
        super(locale);

        this.addColumnButton = this._createAddColumnButton();
        this.addRowButton = this._createAddRowButton();
        this.changeColorButton = this._createColorChangeButton();

        this.setTemplate({
            tag: "div",
            children: [
                this.addColumnButton,
                this.addRowButton,
                this.changeColorButton,
            ],
        });
    }

    _createAddColumnButton() {
        const button = new ButtonView();

        button.set({
            label: "Добавить колонку",
            withText: true,
            tooltip: true,
        });

        button.on("execute", () => {
            this.fire("addColumn");
        });

        return button;
    }

    _createColorChangeButton() {
        const button = new ButtonView();

        button.set({
            label: "Изменить цвет ячейки",
            withText: true,
            tooltip: true,
        });

        button.on("execute", () => {
            this.fire("changeColor");
        });

        return button;
    }

    _createAddRowButton() {
        const button = new ButtonView();

        button.set({
            label: "Добавить строку",
            withText: true,
            tooltip: true,
        });

        button.on("execute", () => {
            this.fire("addRow");
        });

        return button;
    }
}

export default class GridPlugin extends Plugin {
    static get requires() {
        return [ContextualBalloon];
    }

    init() {
        const editor = this.editor;
        this._balloon = this.editor.plugins.get(ContextualBalloon);
        this.formView = this._createFormView();

        editor.model.schema.register("gridRow", {
            isObject: true,
            allowWhere: "$block",
        });

        editor.model.schema.register("gridCell", {
            isLimit: false,
            allowIn: "gridRow",
            allowContentOf: "$block",
            allowAttributes: ["colspan", "backgroundColor"],
        });

        editor.commands.add(
            "changeCellColor",
            new ChangeCellColorCommand(editor)
        );

        editor.ui.componentFactory.add("insertGridRowButton", (locale) => {
            const button = new ButtonView(locale);

            button.set({
                label: "Вставить грид",
                withText: true,
            });

            button.on("execute", () => {
                editor.model.change((writer) => {
                    const gridRow = writer.createElement("gridRow");
                    const gridCell = writer.createElement("gridCell", {
                        colspan: 12,
                    });
                    writer.append(gridCell, gridRow);
                    editor.model.insertContent(
                        gridRow,
                        editor.model.document.selection.getFirstPosition()
                    );
                    this._showUI();
                });
            });

            return button;
        });

        this._defineConverters();
        this._setupListeners();
    }

    _createFormView() {
        const editor = this.editor;
        const formView = new SimpleFormView(editor.locale);

        this.listenTo(formView, "addColumn", () => {
            const selection = editor.model.document.selection;
            const position = selection.getFirstPosition();
            const gridCell = position.findAncestor("gridCell");

            if (gridCell) {
                editor.model.change((writer) => {
                    const newCell = writer.createElement("gridCell", {
                        colspan: 12,
                    });
                    writer.insert(newCell, gridCell, "after");
                });
            }

            this._hideUI();
        });

        this.listenTo(formView, "addRow", () => {
            const selection = editor.model.document.selection;
            const position = selection.getFirstPosition();
            const gridRow = position.findAncestor("gridRow");

            if (gridRow) {
                editor.model.change((writer) => {
                    const newGridRow = writer.createElement("gridRow");
                    const newGridCell = writer.createElement("gridCell", {
                        colspan: 12,
                    });
                    writer.append(newGridCell, newGridRow);
                    writer.insert(newGridRow, gridRow, "after");
                });
            }

            this._hideUI();
        });

        this.listenTo(formView, "changeColor", () => {
            const command = editor.commands.get("changeCellColor");
            const color = prompt(
                "Введите цвет в формате CSS (например, #ff0000 или red):"
            );
            if (color) {
                editor.execute("changeCellColor", { value: color });
            }
        });

        clickOutsideHandler({
            emitter: formView,
            activator: () => this._balloon.visibleView === formView,
            contextElements: [this._balloon.view.element],
            callback: () => this._hideUI(),
        });

        return formView;
    }

    _setupListeners() {
        const editor = this.editor;
        const viewDocument = editor.editing.view.document;

        this.listenTo(viewDocument, "click", () => {
            const selection = editor.model.document.selection;
            const position = selection.getFirstPosition();

            if (position && position.findAncestor("gridCell")) {
                this._showUI();
            } else {
                this._hideUI();
            }
        });
    }

    _showUI() {
        if (this._balloon.hasView(this.formView)) {
            return;
        }

        this._balloon.add({
            view: this.formView,
            position: this._getBalloonPositionData(),
        });
    }

    _hideUI() {
        if (this._balloon.hasView(this.formView)) {
            this._balloon.remove(this.formView);
        }
    }

    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;

        return {
            target: () =>
                view.domConverter.viewRangeToDom(
                    viewDocument.selection.getFirstRange()
                ),
        };
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for("upcast").elementToElement({
            model: "gridRow",
            view: {
                name: "div",
                classes: "grid-row",
            },
        });

        conversion.for("downcast").elementToElement({
            model: "gridRow",
            view: (modelElement, { writer: viewWriter }) => {
                return viewWriter.createContainerElement("section", {
                    class: "grid-row",
                });
            },
        });

        conversion.for("upcast").elementToElement({
            model: "gridCell",
            view: {
                name: "div",
                classes: "grid-cell",
            },
        });

        conversion.for("downcast").elementToElement({
            model: "gridCell",
            view: (modelElement, { writer: viewWriter }) => {
                const colspan = modelElement.getAttribute("colspan") || 1;
                const backgroundColor =
                    modelElement.getAttribute("backgroundColor");
                const div = viewWriter.createEditableElement("div", {
                    class: "grid-cell",
                    style: `flex: ${colspan}; background-color: ${backgroundColor};`,
                });
                return toWidgetEditable(div, viewWriter);
            },
        });

        conversion.for("downcast").attributeToAttribute({
            model: "backgroundColor",
            view: (modelAttributeValue) => ({
                key: "style",
                value: `background-color: ${modelAttributeValue};`,
            }),
        });
    }
}
