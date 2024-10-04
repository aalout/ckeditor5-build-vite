import { Command } from "ckeditor5";

export default class EditSimpleBoxClassesCommand extends Command {
    execute() {
        const editor = this.editor;
        const model = editor.model;
        const selection = model.document.selection;
        const simpleBox = selection.getFirstPosition().findAncestor('simpleBox');

        if (simpleBox) {
            const classes = simpleBox.getAttribute('class');
            editor.ui.componentFactory.create('simpleBoxClassesDialog', {
                classes: classes
            }).then(dialog => {
                dialog.on('submit', () => {
                    const newClasses = dialog.getClasses();
                    model.change(writer => {
                        writer.setAttribute('class', newClasses, simpleBox); 
                    });
                });
            });
        }
    }
}
