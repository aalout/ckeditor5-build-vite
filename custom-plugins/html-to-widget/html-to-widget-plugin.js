import { Plugin, Command } from "ckeditor5";

export default class HtmlToWidgetPlugin extends Plugin {
    init() {
        const editor = this.editor;

        editor.commands.add(
            "insertHtmlWidget",
            new InsertHtmlWidgetCommand(editor)
        );
    }
}

class InsertHtmlWidgetCommand extends Command {
    constructor(editor) {
        super(editor);
    }

    execute(htmlCode) {
        htmlToWidget(this.editor, htmlCode);
    }
}
