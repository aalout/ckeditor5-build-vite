import {
    Plugin,
    ButtonView,
    ContextualBalloon,
    View,
    clickOutsideHandler,
    toWidgetEditable,
} from "ckeditor5";
import ChangeCellColorCommand from "./gridCell-color-change";
import DeleteCellContentCommand from "./gridCell-content-delete";

// Создание balloon context
class SimpleFormView extends View {
    constructor(locale) {
        super(locale);

        this.addColumnButton = this._createAddColumnButton();
        this.addRowButton = this._createAddRowButton();
        this.changeColorButton = this._createColorChangeButton();
        this.deleteCellContentButton = this._deleteCellContentButton();

        this.setTemplate({
            tag: "div",
            children: [
                this.addColumnButton,
                this.addRowButton,
                this.changeColorButton,
                this.deleteCellContentButton,
            ],
        });
    }

    // Создание кнопок в balloon context
    // Кнопка добавления колонки
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

    // Кнопка удаления контента из ячейки
    _deleteCellContentButton() {
        const button = new ButtonView();

        button.set({
            label: "Удалить контент ячейки",
            withText: true,
            tooltip: true,
        });

        button.on("execute", () => {
            this.fire("deleteCellContent");
        });

        return button;
    }

    // Кнопка изменения цвета ячейки
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

    // Кнопка добавления строки
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

// Сам грид
export default class GridPlugin extends Plugin {
    static get requires() {
        return [ContextualBalloon];
    }

    init() {
        const editor = this.editor;
        this._balloon = this.editor.plugins.get(ContextualBalloon);
        this.formView = this._createFormView();

        // _defineSchema
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

        editor.commands.add(
            "deleteCellContent",
            new DeleteCellContentCommand(editor)
        );

        // Кнопка вставки этого плагина
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

    // Даем понять balloon context`у понять, что если вставляем новую колонку, то вставляем ее справа от текущего gridCell, тоже самое с gridRow.
    _createFormView() {
        const editor = this.editor;
        const formView = new SimpleFormView(editor.locale);

        // Добавить колонку
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

        // Добавить строку
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

        // Изменить цвет
        this.listenTo(formView, "changeColor", () => {
            const command = editor.commands.get("changeCellColor");
            const color = prompt(
                "Введите цвет в формате CSS (например, #ff0000 или red):"
            );
            if (color) {
                editor.execute("changeCellColor", { value: color });
            }
        });

        // Удалить контент ячейки
        this.listenTo(formView, "deleteCellContent", () => {
            editor.execute("deleteCellContent");
            this._hideUI();
        });

        // При аутсайд клике закрываем balloon
        clickOutsideHandler({
            emitter: formView,
            activator: () => this._balloon.visibleView === formView,
            contextElements: [this._balloon.view.element],
            callback: () => this._hideUI(),
        });

        return formView;
    }

    // Даем balloon context`y понять, где мы сейчас находимся, получаем родителя (gridCell)
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

    // Показываем балун
    _showUI() {
        if (this._balloon.hasView(this.formView)) {
            return;
        }

        this._balloon.add({
            view: this.formView,
            position: this._getBalloonPositionData(),
        });
    }

    // Прячем балун
    _hideUI() {
        if (this._balloon.hasView(this.formView)) {
            this._balloon.remove(this.formView);
        }
    }

    // Отображение балуна
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

    // Конвертеры в модель
    _defineConverters() {
        const conversion = this.editor.conversion;

        // Апкаст для строки
        conversion.for("upcast").elementToElement({
            model: "gridRow",
            view: {
                name: "div",
                classes: "grid-row",
            },
        });

        // Даункаст для строки (строка - секция, колонки - дивы)
        conversion.for("downcast").elementToElement({
            model: "gridRow",
            view: (modelElement, { writer: viewWriter }) => {
                return viewWriter.createContainerElement("section", {
                    class: "grid-row",
                });
            },
        });

        // Апкаст для колонки
        conversion.for("upcast").elementToElement({
            model: "gridCell",
            view: {
                name: "div",
                classes: "grid-cell",
            },
        });

        // Даункаст для колонки со всеми модификациями и стилями
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

        // Даункаст для стилей
        conversion.for("downcast").attributeToAttribute({
            model: "backgroundColor",
            view: (modelAttributeValue) => ({
                key: "style",
                value: `background-color: ${modelAttributeValue};`,
            }),
        });
    }
}
