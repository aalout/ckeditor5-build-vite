import { Command } from "ckeditor5";

export default class SetFlexCommand extends Command {
    execute({ cell, flex }) {
        const model = this.editor.model;

        model.change((writer) => {
            const oldFlex = cell.getAttribute("colspan") || 1;
            const delta = oldFlex - flex;

            writer.setAttribute("colspan", flex, cell);

            // Обновляем значения flex с учётом delta
            const gridRow = cell.parent;
            if (gridRow) {
                const plugin = this.editor.plugins.get("GridPlugin");
                if (plugin) {
                    plugin.updateFlexValues(gridRow, writer, delta, cell);
                } else {
                    console.error('Плагин "GridPlugin" не загружен.');
                }
            }
        });
    }

    refresh() {
        const selection = this.editor.model.document.selection;
        const cell = selection.getFirstPosition().findAncestor("gridCell");

        this.isEnabled = !!cell;
    }
}
