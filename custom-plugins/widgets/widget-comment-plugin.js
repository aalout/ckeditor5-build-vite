import {
    Plugin,
    ButtonView,
    toWidget,
    Widget,
    toWidgetEditable,
} from "ckeditor5";

export default class WidgetPlugin extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        const editor = this.editor;

        editor.model.schema.register("productCard", {
            isObject: true,
            allowWhere: "$block",
        });

        editor.conversion.for("upcast").elementToElement({
            model: "productCard",
            view: {
                name: "div",
                classes: "product-card",
            },
        });

        editor.conversion.for("dataDowncast").elementToElement({
            model: "productCard",
            view: {
                name: "div",
                classes: "product-card",
            },
        });

        editor.conversion.for("editingDowncast").elementToElement({
            model: "productCard",
            view: (modelElement, { writer: viewWriter }) => {
                const div = viewWriter.createContainerElement("div", {
                    class: "product-card",
                    attributes: {
                        "data-cke-ignore-events": "true",
                    },
                });

                const button = viewWriter.createContainerElement("button", {
                    class: "product-button",
                });
                writer.appendText("+", button);

                const productCard = viewWriter.createContainerElement("div", {
                    class: "product-card",
                });

                const productCardFlex1 = viewWriter.createContainerElement(
                    "div",
                    {
                        class: "product-card-flex-1",
                    }
                );

                const paragraph = viewWriter.createContainerElement("p");
                writer.appendText(
                    "Следует отметить, что реализация намеченных плановых заданий способствует подготовке и реализации модели развития. Учитывая ключевые сценарии поведения, высокое качество позиционных исследований требует от нас анализа инновационных методов управления процессами. Но новая модель организационной деятельности является качественно новой ступенью переосмысления внешнеэкономических политик.",
                    paragraph
                );

                const logo = viewWriter.createContainerElement("div", {
                    class: "logo",
                });

                viewWriter.append(paragraph, productCardFlex1);
                viewWriter.append(logo, productCardFlex1);

                const bottomDiv = viewWriter.createContainerElement("div", {
                    class: "bottom-div",
                });

                const personDiv = viewWriter.createContainerElement("div", {
                    class: "person-div",
                });

                const person = viewWriter.createContainerElement("div", {
                    class: "person",
                });

                const content = viewWriter.createEditableElement("div", {
                    class: "content",
                });

                viewWriter.append(person, personDiv);
                viewWriter.append(content, personDiv);

                const arrow = viewWriter.createContainerElement("div", {
                    class: "arrow",
                });

                viewWriter.append(personDiv, bottomDiv);
                viewWriter.append(arrow, bottomDiv);
                viewWriter.append(productCardFlex1, productCard);
                viewWriter.append(bottomDiv, productCard);
                viewWriter.append(button, div);
                viewWriter.append(productCard, div);

                return toWidget(div, viewWriter, {
                    label: "product card widget",
                });
            },
        });

        // Add a button to the toolbar.
        editor.ui.componentFactory.add("insertProductCard", (locale) => {
            const view = new ButtonView(locale);

            view.set({
                label: "Insert Product Card",
                withText: true,
                tooltip: true,
            });

            view.on("execute", () => {
                editor.model.change((writer) => {
                    // Create the product card element.
                    const productCard = writer.createElement("productCard");

                    // Create the title element.
                    const productCardTitle =
                        writer.createElement("productCardTitle");
                    writer.appendText(
                        "Следует отметить, что реализация намеченных плановых заданий способствует подготовке и реализации модели развития.",
                        productCardTitle
                    );

                    // Create the description element.
                    const productCardDescription = writer.createElement(
                        "productCardDescription"
                    );
                    writer.appendText(
                        "Учитывая ключевые сценарии поведения, высокое качество позиционных исследований требует от нас анализа инновационных методов управления процессами.",
                        productCardDescription
                    );

                    // Insert the product card element at the current selection position.
                    writer.append(productCardTitle, productCard);
                    writer.append(productCardDescription, productCard);
                    editor.model.insertContent(productCard);

                    // Put the selection on the inserted element.
                    writer.setSelection(productCard, "on");
                });
            });

            return view;
        });
    }
}
