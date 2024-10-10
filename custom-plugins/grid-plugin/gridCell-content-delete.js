import { Command } from "ckeditor5";

export default class DeleteCellContentCommand extends Command {
    execute() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const gridCell = selection.getFirstPosition().findAncestor("gridCell");

        if (gridCell) {
            model.change((writer) => {
                writer.remove(writer.createRangeIn(gridCell));
            });
        }
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const gridCell = selection.getFirstPosition().findAncestor("gridCell");

        this.isEnabled = !!gridCell;
    }
}
