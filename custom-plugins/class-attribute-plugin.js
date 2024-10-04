import { Plugin } from 'ckeditor5';

export default class ClassAttribute extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('addClass', {
      button: 'addClass',
      tooltip: 'Add class',
      icon: 'addClass'
    });

    editor.commands.add('addClass', {
      execute: (editor, className) => {
        const selection = editor.model.document.selection;
        const element = selection.getSelectedElement();

        if (element) {
          element.addClass(className);
        }
      }
    });
  }
}