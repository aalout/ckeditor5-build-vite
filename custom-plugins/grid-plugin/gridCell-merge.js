import { Command } from "ckeditor5";

export default class MergeCellsCommand extends Command {
    execute(options) {
        const direction = options.direction;
        const model = this.editor.model;
        const selection = model.document.selection;
        const position = selection.getFirstPosition();
        const gridCell = position.findAncestor("gridCell");

        if (!gridCell) {
            return;
        }

        model.change((writer) => {
            const gridRow = gridCell.parent;
            const gridIndex = gridRow.getChildIndex(gridCell);

            switch (direction) {
                case "left":
                    if (gridIndex > 0) {
                        const leftCell = gridRow.getChild(gridIndex - 1);
                        this._mergeCells(writer, leftCell, gridCell);
                    }
                    break;
                case "right":
                    if (gridIndex < gridRow.childCount - 1) {
                        const rightCell = gridRow.getChild(gridIndex + 1);
                        this._mergeCells(writer, gridCell, rightCell);
                    }
                    break;
                case "up":
                    // Пока не работает
                    break;
                case "down":
                    // Пока не работает
                    break;
            }
        });
    }

    _mergeCells(writer, sourceCell, targetCell) {
        // Устанавливаем атрибут для объединенной ячейки
        writer.setAttribute("_isMerged", true, targetCell);

        // Получаем текущие colspan обоих ячеек
        const sourceColspan =
            sourceCell.getAttribute("colspan") ||
            12 / sourceCell.parent.childCount;
        const targetColspan =
            targetCell.getAttribute("colspan") ||
            12 / targetCell.parent.childCount;

        // Увеличиваем colspan целевой ячейки
        const newColspan = sourceColspan + targetColspan;
        writer.setAttribute("colspan", newColspan, targetCell);

        // Переносим содержимое из sourceCell в targetCell
        const sourceContent = Array.from(sourceCell.getChildren());
        for (const node of sourceContent) {
            writer.append(node, targetCell);
        }

        // Удаляем исходную ячейку
        writer.remove(sourceCell);
    }
}
