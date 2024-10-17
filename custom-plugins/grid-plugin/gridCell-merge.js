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
                    const previousRow = gridRow.previousSibling;
                    if (previousRow) {
                        const targetCell = this._findAlignedCell(
                            previousRow,
                            gridCell,
                            writer
                        );
                        if (targetCell) {
                            this._mergeCells(
                                writer,
                                targetCell,
                                gridCell,
                                true
                            );
                        }
                    }
                    break;
                case "down":
                    const nextRow = gridRow.nextSibling;
                    if (nextRow) {
                        const targetCell = this._findAlignedCell(
                            nextRow,
                            gridCell,
                            writer
                        );
                        if (targetCell) {
                            this._mergeCells(
                                writer,
                                gridCell,
                                targetCell,
                                true
                            );
                        }
                    }
                    break;
            }
        });
    }

    _findAlignedCell(row, cell, writer) {
        const gridPlugin = this.editor.plugins.get("GridPlugin");
        if (!gridPlugin) {
            console.error("GridPlugin не найден.");
            return null;
        }

        const cells = Array.from(row.getChildren());
        let currentIndex = 0;

        for (let i = 0; i < cells.length; i++) {
            const currentCell = cells[i];
            const colspan = currentCell.getAttribute("colspan") || 1;
            if (
                currentIndex <= row.getChildIndex(cell) &&
                currentIndex + colspan > row.getChildIndex(cell)
            ) {
                return currentCell;
            }
            currentIndex += colspan;
        }

        return null;
    }

    _mergeCells(writer, sourceCell, targetCell, isVertical = false) {
        if (isVertical) {
            // Установка атрибута rowspan
            const sourceRowspan = sourceCell.getAttribute("rowspan") || 1;
            const targetRowspan = targetCell.getAttribute("rowspan") || 1;
            let newRowspan = sourceRowspan + targetRowspan;

            if (newRowspan > 12) {
                newRowspan = 12;
            }

            writer.setAttribute("rowspan", newRowspan, targetCell);

            // Перенос содержимого из sourceCell в targetCell
            const sourceContent = Array.from(sourceCell.getChildren());
            for (const node of sourceContent) {
                writer.append(node, targetCell);
            }

            // Удаление исходной ячейки
            writer.remove(sourceCell);

            // Обновление flex-значений
            const gridRow = targetCell.parent;
            const gridPlugin = this.editor.plugins.get("GridPlugin");
            if (gridPlugin) {
                gridPlugin.updateFlexValues(gridRow, writer);
            } else {
                console.error("GridPlugin не найден.");
            }
        } else {
            // Объединение горизонтальных ячеек
            writer.setAttribute("_isMerged", true, targetCell);

            const sourceColspan =
                sourceCell.getAttribute("colspan") ||
                Math.floor(12 / sourceCell.parent.childCount);
            const targetColspan =
                targetCell.getAttribute("colspan") ||
                Math.floor(12 / targetCell.parent.childCount);

            let newColspan = sourceColspan + targetColspan;

            if (newColspan > 12) {
                newColspan = 12;
            }
            writer.setAttribute("colspan", newColspan, targetCell);

            const sourceContent = Array.from(sourceCell.getChildren());
            for (const node of sourceContent) {
                writer.append(node, targetCell);
            }

            writer.remove(sourceCell);

            const gridRow = targetCell.parent;
            const gridPlugin = this.editor.plugins.get("GridPlugin");
            if (gridPlugin) {
                gridPlugin.updateFlexValues(gridRow, writer);
            } else {
                console.error("GridPlugin не найден.");
            }
        }
    }
}
