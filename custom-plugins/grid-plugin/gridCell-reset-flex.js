import { Command } from "ckeditor5";

export default class ResetFlexCommand extends Command {
    execute({ row }) {
        const model = this.editor.model;

        model.change((writer) => {
            if (row) {
                const cells = Array.from(row.getChildren());
                cells.forEach((cell) => {
                    writer.setAttribute("colspan", 1, cell);
                });

                const numberOfCells = cells.length;
                const equalFlex = Math.floor(12 / numberOfCells);
                let remainingFlex = 12 - equalFlex * numberOfCells;

                cells.forEach((cell, index) => {
                    let newFlex = equalFlex;
                    if (remainingFlex > 0) {
                        newFlex += 1;
                        remainingFlex--;
                    }
                    writer.setAttribute("colspan", newFlex, cell);
                });

                // Обновляем стили flex и height
                cells.forEach((cell) => {
                    const colspan = cell.getAttribute("colspan") || 1;
                    const rowspan = cell.getAttribute("rowspan") || 1;

                    const viewElement =
                        this.editor.editing.mapper.toViewElement(cell);
                    if (viewElement) {
                        writer.setStyle("flex", `${colspan}`, viewElement);
                        writer.setStyle(
                            "height",
                            `${rowspan * 50}px`,
                            viewElement
                        );
                    }
                });
            }
        });
    }

    refresh() {
        const selection = this.editor.model.document.selection;
        const row = selection.getFirstPosition().findAncestor("gridRow");

        this.isEnabled = !!row;
    }
}
