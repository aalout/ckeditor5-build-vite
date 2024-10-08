import { ButtonView, Plugin, toWidget, Widget } from 'ckeditor5';

export default class ProductCardPlugin extends Plugin {
    init() {
        const editor = this.editor;
        const htmlCode = '<div class="main_div"><div class="product_card"><div class="product_card_flex_1"><p>Следует отметить, что реализация намеченных плановых заданий способствует подготовке и реализации модели развития. Учитывая ключевые сценарии поведения, высокое качество позиционных исследований требует от нас анализа инновационных методов управления процессами. Но новая модель организационной деятельности является качественно новой ступенью переосмысления внешнеэкономических политик.</p><div class="logo"></div></div><div class="bottom_div"><div class="person_div"><div class="person"></div><p>Ваня Иванов</p></div><div class="arrow"></div></div></div></div>';

        editor.ui.componentFactory.add('InsertProductCardButton', locale => {
            const button = new InsertProductCardButton(locale);

            button.on('execute', () => {
                const viewFragment = editor.data.parse(htmlCode);
                const position = editor.model.document.selection.getFirstPosition() || editor.model.document.getRoot().getChild(0);

                editor.model.change(writer => {
                    const widget = writer.createElement('productCard');
                    writer.insert(widget, position);
                    writer.append(writer.createElement('paragraph', { content: viewFragment }), widget);
                });
            });

            return button;
        });

        this._defineConverters();
    }

    _defineConverters() {
        const editor = this.editor;

        editor.conversion.for('upcast').elementToElement({
            model: 'productCard',
            view: {
                name: 'div',
                classes: 'main_div'
            }
        });

        editor.conversion.for('downcast').elementToElement({
            model: 'productCard',
            view: {
                name: 'div',
                classes: 'main_div'
            }
        });

        editor.conversion.for('upcast').elementToElement({
            model: 'paragraph',
            view: {
                name: 'p'
            }
        });

        editor.conversion.for('downcast').elementToElement({
            model: 'paragraph',
            view: {
                name: 'p'
            }
        });
    }
}

class InsertProductCardButton extends ButtonView {
    constructor(locale) {
        super(locale);
        this.set({
            label: 'Вставить пример',
            withText: true,
            tooltip: true
        });
    }
}

class ProductCard extends Widget {
    constructor(editor, element) {
        super(editor, element);
    }
}