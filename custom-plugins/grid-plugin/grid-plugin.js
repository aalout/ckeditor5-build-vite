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
import MergeCellsCommand from "./gridCell-merge";
import SetFlexCommand from "./gridColumn-set-flex";

// Создание balloon context
class SimpleFormView extends View {
    constructor(locale) {
        super(locale);

        this.addColumnButton = this._createAddColumnButton();
        this.addRowButton = this._createAddRowButton();
        this.changeColorButton = this._createColorChangeButton();
        this.deleteCellContentButton = this._deleteCellContentButton();
        this.createMergeCellButton = this._createMergeCellButton();
        this.setFlexButton = this._createSetFlexButton();

        this.setTemplate({
            tag: "div",
            children: [
                this.addColumnButton,
                this.addRowButton,
                this.changeColorButton,
                this.deleteCellContentButton,
                this.createMergeCellButton,
                this.setFlexButton,
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

    // Кнопка изменения flex значения
    _createSetFlexButton() {
        const button = new ButtonView();

        button.set({
            label: "Изменить flex значение",
            withText: true,
            tooltip: true,
        });

        button.on("execute", () => {
            this.fire("setFlex");
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

    // Кнопка объединения ячеек
    _createMergeCellButton() {
        const button = new ButtonView();

        button.set({
            label: "Объединить ячейки",
            withText: true,
            tooltip: true,
        });

        button.on("execute", () => {
            const direction = prompt(
                "Введите направление объединения (left, right, up, down):"
            );
            if (direction) {
                this.fire("mergeCells", { direction });
            }
        });

        return button;
    }
}

// Сам грид
export default class GridPlugin extends Plugin {
    updateFlexValues(gridRow, writer) {
        const cells = Array.from(gridRow.getChildren());

        // Проверяем, есть ли объединенные ячейки
        const anyMerged = cells.some(
            (cell) =>
                cell.hasAttribute("_isMerged") || cell.hasAttribute("rowspan")
        );

        if (anyMerged) {
            // Логика для объединенных ячеек
            const totalColspan = cells.reduce(
                (sum, cell) => sum + (cell.getAttribute("colspan") || 1),
                0
            );

            if (totalColspan !== 12) {
                console.warn(
                    "Сумма colspan должна быть равна 12. Корректировка значений."
                );

                const scalingFactor = 12 / totalColspan;
                const scaledColspans = cells.map(
                    (cell) =>
                        (cell.getAttribute("colspan") || 1) * scalingFactor
                );

                let roundedColspans = scaledColspans.map((value) =>
                    Math.floor(value)
                );
                let remaining = 12 - roundedColspans.reduce((a, b) => a + b, 0);

                const decimals = scaledColspans
                    .map((value, idx) => ({
                        idx,
                        decimal: value - Math.floor(value),
                    }))
                    .sort((a, b) => b.decimal - a.decimal);

                for (let i = 0; i < remaining; i++) {
                    roundedColspans[decimals[i].idx]++;
                }

                // Устанавливаем скорректированные colspan
                cells.forEach((cell, idx) => {
                    writer.setAttribute("colspan", roundedColspans[idx], cell);
                });
            }
        } else {
            // Логика для распределения colspan равномерно
            const count = cells.length;
            let baseColspan = Math.floor(12 / count);
            let remaining = 12 - baseColspan * count;
            const colspans = cells.map(
                (cell, idx) => baseColspan + (idx < remaining ? 1 : 0)
            );
            cells.forEach((cell, idx) => {
                writer.setAttribute("colspan", colspans[idx], cell);
            });
        }

        // Устанавливаем flex на основе текущего colspan и rowspan
        cells.forEach((cell) => {
            const colspan =
                cell.getAttribute("colspan") || Math.floor(12 / cells.length);
            const rowspan = cell.getAttribute("rowspan") || 1;

            const viewElement = this.editor.editing.mapper.toViewElement(cell);
            if (viewElement) {
                this.editor.editing.view.change((viewWriter) => {
                    // Настраиваем flex на основе текущего colspan
                    viewWriter.setStyle("flex", `${colspan}`, viewElement);
                });
            }
        });
    }

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
            allowAttributes: ["colspan", "backgroundColor", "rowspan"],
        });

        editor.commands.add(
            "changeCellColor",
            new ChangeCellColorCommand(editor)
        );

        editor.commands.add("setFlex", new SetFlexCommand(editor));

        editor.commands.add(
            "deleteCellContent",
            new DeleteCellContentCommand(editor)
        );

        editor.commands.add("mergeCells", new MergeCellsCommand(editor));

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
                    this.updateFlexValues(gridRow, writer);
                    this._showUI();
                });
            });

            return button;
        });

        this._defineConverters();
        this._setupListeners();
    }

    // Создание формы
    _createFormView() {
        const editor = this.editor;
        const formView = new SimpleFormView(editor.locale);

        // Объединение ячеек
        this.listenTo(formView, "mergeCells", (evt, data) => {
            const direction = data.direction;

            if (["left", "right", "up", "down"].includes(direction)) {
                editor.execute("mergeCells", { direction });
            } else {
                alert(
                    "Неверное направление объединения. Используйте left, right, up или down."
                );
            }

            this._hideUI();
        });

        // Добавить колонку
        this.listenTo(formView, "addColumn", () => {
            const selection = editor.model.document.selection;
            const position = selection.getFirstPosition();
            const gridCell = position.findAncestor("gridCell");

            if (gridCell) {
                editor.model.change((writer) => {
                    const gridRow = gridCell.parent;
                    const newCell = writer.createElement("gridCell", {
                        colspan: 12, // Изначальное
                    });
                    writer.insert(newCell, gridCell, "after");

                    // Обновляем flex значения, что также скорректирует colspan
                    this.updateFlexValues(gridRow, writer);
                });
            }

            this._hideUI();
        });

        // Изменение flex значения
        this.listenTo(formView, "setFlex", () => {
            const selection = editor.model.document.selection;
            const position = selection.getFirstPosition();
            const gridCell = position.findAncestor("gridCell");

            if (gridCell) {
                const currentFlex = gridCell.getAttribute("colspan") || 1;
                const newFlexInput = prompt(
                    `Текущий flex: ${currentFlex}. Введите новое значение flex (максимум 12):`
                );

                const newFlex = parseInt(newFlexInput, 10);
                if (!isNaN(newFlex) && newFlex > 0 && newFlex <= 12) {
                    editor.execute("setFlex", {
                        cell: gridCell,
                        flex: newFlex,
                    });
                } else {
                    alert(
                        "Неверное значение flex. Пожалуйста, введите число от 1 до 12."
                    );
                }
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
                    this.updateFlexValues(newGridRow, writer);
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

        // При клике вне закрываем balloon
        clickOutsideHandler({
            emitter: formView,
            activator: () => this._balloon.visibleView === formView,
            contextElements: [this._balloon.view.element],
            callback: () => this._hideUI(),
        });

        return formView;
    }

    // Настройка слушателей
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

    // Определение позиции балуна
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
                const rowspan = modelElement.getAttribute("rowspan") || 1;
                const backgroundColor =
                    modelElement.getAttribute("backgroundColor") ||
                    "transparent";
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

        // Даункаст для атрибута colspan
        conversion.for("downcast").attributeToAttribute({
            model: "colspan",
            view: (modelAttributeValue) => ({
                key: "style",
                value: `flex: ${modelAttributeValue};`,
            }),
        });

        // Даункаст для атрибута rowspan
        conversion.for("downcast").attributeToAttribute({
            model: "rowspan",
        });
    }
}
