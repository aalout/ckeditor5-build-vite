import {
    Plugin,
    ButtonView,
    Collection,
    createDropdown,
    ViewModel,
} from "ckeditor5";
import { addListToDropdown } from "ckeditor5";

export default class HtmlInsertPluginDr extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;
        const buttonView = new ButtonView(editor.locale);
        buttonView.set({
            label: t("Вставить HTML"),
            tooltip: true,
        });
        buttonView.on("execute", () => {
            this._openDropdown();
        });

        editor.ui.componentFactory.add("htmlElement", buttonView);
        editor.ui.componentFactory.add("dropdown", createDropdown);
        const collection = new Collection();
        collection.add({
            type: "input",
            model: new ViewModel({
                label: "Элемент",
                name: "element",
            }),
        });
        collection.add({
            type: "input",
            model: new ViewModel({
                label: "Стили",
                name: "styles",
            }),
        });
        this._dropdownView = editor.ui.componentFactory.create("dropdown");
        this._dropdownView.buttonView.set({
            label: "Вставить HTML",
            withText: true,
        });
        addListToDropdown(this._dropdownView, collection);
        this._dropdownView.on("execute", (eventInfo) => {
            this._insertHtmlElement(eventInfo);
        });
    }

    _openDropdown() {
        this._dropdownView.isOpen = true;
    }

    _insertHtmlElement(eventInfo) {
        const elementType = eventInfo.item.model.get("element");
        const styles = eventInfo.item.model.get("styles");
        const htmlElement = `<${elementType} style="${styles}"></${elementType}>`;
        this.editor.model.change((writer) => {
            writer.insert(
                htmlElement,
                this.editor.model.document.selection.getFirstPosition()
            );
        });
    }
}
