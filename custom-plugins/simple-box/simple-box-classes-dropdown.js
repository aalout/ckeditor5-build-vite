import { DialogView } from 'ckeditor5';

export default class SimpleBoxClassesDialog extends DialogView {
    constructor(locale, editor) {
        super(locale);

        this.editor = editor;

        this.set('title', 'Редактировать классы');
        this.set('className', 'simple-box-classes-dialog');

        this.createForm();
    }

    createForm() {
        const form = this.formView = this.createFormView();

        this.classesInput = this._createClassesInput();
        form.add(this.classesInput);
    }

    _createClassesInput() {
        const input = new InputView(this.locale);

        input.set('label', 'Классы');
        input.extendTemplate({
            attributes: {
                class: 'simple-box-classes-input'
            }
        });

        return input;
    }

    getClasses() {
        return this.classesInput.fieldView.element.value;
    }
}