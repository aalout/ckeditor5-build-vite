export default function htmlToWidget(editor, htmlCode) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlCode, "text/html");
    const element = doc.body.firstChild;

    const widget = editor.model.schema.register("customWidget", {
        isObject: true,
        allowWhere: "$block",
        allowAttributes: ["htmlContent"],
    });

    editor.model.change((writer) => {
        const widgetElement = writer.createElement("customWidget", {
            htmlContent: element.outerHTML,
        });

        editor.model.insertContent(
            widgetElement,
            editor.model.document.selection
        );
    });
}
