import {
    ButtonView,
    Plugin,
    toWidget,
    Widget,
    toWidgetEditable,
} from "ckeditor5";

export default class ProductCardPlugin extends Plugin {
    init() {
        const editor = this.editor;

        // Добавляем кнопку для запуска плагина
        editor.ui.componentFactory.add("InsertProductCardButton", (locale) => {
            const button = new InsertProductCardButton(locale);

            button.on("execute", () => {
                // Переменная с кодом, которая в будущем будет передаваться с бека и будет динамической
                const htmlCode = `
                            <div class="product_card">
                                <div class="product_card_flex_1">
                                    <p>Задача организации, в особенности же постоянное информационно-пропагандистское обеспечение нашей деятельности требует определения и уточнения экономической целесообразности принимаемых решений! Идейные соображения высшего порядка, а также постоянный количественный рост и сфера нашей активности, в своём классическом представлении, допускает внедрение экономической целесообразности принимаемых решений. В частности, граница обучения кадров создаёт необходимость включения в производственный план целого ряда внеочередных мероприятий с учётом комплекса прогресса профессионального сообщества.</p>
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

                // Парсим из хтмл в представление модели
                const viewFragment = editor.data.parse(htmlCode);
                const position =
                    editor.model.document.selection.getFirstPosition();

                editor.model.change((writer) => {
                    const element = writer.createElement("productCard");
                    editor.model.insertContent(element, position);
                    writer.append(viewFragment, element);
                });
            });

            return button;
        });

        this._defineSchema();
        this._defineConverters();
    }

    // Регистрируем элемент в схеме модели как блок + разрешаем использование productCard внутри грида
    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register("productCard", {
            isObject: true,
            allowWhere: "$block",
            allowContentOf: "$root",
            allowIn: "gridCell",
        });
    }

    // Конвертеры в модель и из нее
    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for("upcast").elementToElement({
            model: "productCard",
            view: {
                name: "div",
                classes: "widget-container",
            },
        });

        conversion.for("downcast").elementToElement({
            model: "productCard",
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createContainerElement("section", {
                    class: "widget-container",
                });
                return toWidget(div, viewWriter, {
                    label: "product card widget",
                });
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
