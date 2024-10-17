import { ButtonView, Plugin, toWidget, toWidgetEditable } from "ckeditor5";

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");
const button5 = document.getElementById("button5");

const buttons = [button1, button2, button3, button4, button5];

button1.addEventListener("click", () => {
    updateHtmlCode(htmlCode1);
    highlightButton(button1);
});

button2.addEventListener("click", () => {
    updateHtmlCode(htmlCode2);
    highlightButton(button2);
});

button3.addEventListener("click", () => {
    updateHtmlCode(htmlCode3);
    highlightButton(button3);
});

button4.addEventListener("click", () => {
    updateHtmlCode(htmlCode4);
    highlightButton(button4);
});

button5.addEventListener("click", () => {
    updateHtmlCode(htmlCode5);
    highlightButton(button5);
});

function highlightButton(selectedButton) {
    buttons.forEach((button) => {
        if (button === selectedButton) {
            button.classList.add("selected");
        } else {
            button.classList.remove("selected");
        }
    });
}

let htmlCode = "";

function updateHtmlCode(newCode) {
    htmlCode = newCode;
}

const htmlCode1 = `
<div class="product_card">
    <div class="product_card_content">
        <p>Задача организации, в особенности же постоянное информационно-пропагандистское обеспечение нашей деятельности требует определения и уточнения экономической целесообразности принимаемых решений!</p>
        <div class="logo"></div>
    </div>
    <div class="bottom_div">
        <div class="person_div">
            <div class="person"></div>
            <p>Ваня Иванов</p>
        </div>
        <div class="arrow"></div>
    </div>
</div>`;

const htmlCode2 = `...`;
const htmlCode3 = `...`;
const htmlCode4 = `...`;
const htmlCode5 = `...`;

export default class ProductCardPlugin extends Plugin {
    init() {
        const editor = this.editor;

        // Добавляем кнопку для вставки виджета
        editor.ui.componentFactory.add("InsertProductCardButton", (locale) => {
            const button = new InsertProductCardButton(locale);

            button.on("execute", () => {
                // Парсим HTML в представление модели
                const viewFragment = editor.data.processor.toView(htmlCode);
                const modelFragment = editor.data.toModel(viewFragment);

                editor.model.change((writer) => {
                    const insertPosition =
                        editor.model.document.selection.getFirstPosition();
                    editor.model.insertContent(modelFragment, insertPosition);
                });
            });

            return button;
        });

        this._defineSchema();
        this._defineConverters();
    }

    // Регистрируем элементы в схеме модели
    _defineSchema() {
        const schema = this.editor.model.schema;

        // Регистрация элемента productCard как объекта
        schema.register("productCard", {
            isObject: true,
            allowWhere: "$block",
            allowContentOf: "$block",
            allowIn: "gridCell",
        });

        // Регистрация элемента productCardContent как вложенного редактируемого блока внутри productCard
        schema.register("productCardContent", {
            isLimit: true,
            allowWhere: "inside productCard",
            allowContentOf: "$block", // Это позволяет содержать параграфы и другие блоковые элементы
        });

        // Дополнительная регистрация встроенных элементов, если необходимо
        schema.extend("paragraph", {
            allowIn: "productCardContent",
        });
    }

    // Конвертеры в модель и из нее
    _defineConverters() {
        const conversion = this.editor.conversion;

        // Конвертер для создания виджета productCard из модели
        conversion.for("downcast").elementToElement({
            model: "productCard",
            view: (modelElement, { writer: viewWriter }) => {
                console.log("Downcast productCard");
                const div = viewWriter.createContainerElement("div", {
                    class: "product_card",
                });

                return toWidget(div, viewWriter, {
                    label: "product card widget",
                });
            },
        });

        // Конвертер для создания редактируемой области внутри productCard
        conversion.for("downcast").elementToElement({
            model: "productCardContent",
            view: (modelElement, { writer: viewWriter }) => {
                console.log("Downcast productCardContent");
                const div = viewWriter.createEditableElement("div", {
                    class: "product_card_content",
                });

                return toWidgetEditable(div, viewWriter);
            },
        });

        // Апкаст для productCard
        conversion.for("upcast").elementToElement({
            model: "productCard",
            view: {
                name: "div",
                classes: "product_card",
            },
        });

        // Апкаст для содержимого внутри productCard
        conversion.for("upcast").elementToElement({
            model: "productCardContent",
            view: {
                name: "div",
                classes: "product_card_content",
            },
        });
    }
}

class InsertProductCardButton extends ButtonView {
    constructor(locale) {
        super(locale);
        this.set({
            label: "Вставить пример",
            withText: true,
            tooltip: true,
        });
    }
}
