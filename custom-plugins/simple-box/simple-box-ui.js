// simple-box-ui.js
import { Plugin, ButtonView } from "ckeditor5";
import SimpleBoxClassesDialog from "./simple-box-classes-dropdown";

export default class SimpleBoxUI extends Plugin {
    init() {
        console.log("ui init");

        const editor = this.editor;
        const t = editor.t;
        editor.ui.componentFactory.add("контейнеры", (locale) => {
            const command = editor.commands.get("insertSimpleBox");
            const buttonView = new ButtonView(locale);

            buttonView.set({
                label: t("контейнеры"),
                withText: true,
                tooltip: true,
            });

            buttonView
                .bind("isOn", "isEnabled")
                .to(command, "value", "isEnabled");
            this.listenTo(buttonView, "execute", () => {
                editor.execute("insertSimpleBox");
                buttonView.dropdown =
                    editor.ui.componentFactory.create("dropdown");
                buttonView.dropdown.add({
                    type: "button",
                    model: {
                        label: "Edit classes",
                        withText: true,
                    },
                    execute: () => {
                        const dialog = new SimpleBoxClassesDialog(
                            editor.locale,
                            editor.model
                        );
                        dialog.render();
                        dialog.show();
                    },
                });
            });
            return buttonView;
        });
    }
}
