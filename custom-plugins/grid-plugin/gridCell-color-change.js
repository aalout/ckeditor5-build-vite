import { Command } from "ckeditor5";

export default class ChangeCellColorCommand extends Command {
    execute({ value }) {
        const editor = this.editor;
        const model = editor.model;
        const selection = model.document.selection;
        const gridCell = selection.getFirstPosition().findAncestor("gridCell");

        model.change((writer) => {
            if (gridCell) {
                writer.setAttribute("backgroundColor", value, gridCell);
            }
        });
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const gridCell = selection.getFirstPosition().findAncestor("gridCell");

        this.isEnabled = !!gridCell;
    }
}
