import { Plugin, ButtonView, toWidgetEditable } from 'ckeditor5';

export default class GridPlugin extends Plugin {
  init() {
    const editor = this.editor;

    editor.model.schema.register('gridRow', {
      isObject: true,
      allowWhere: '$block'
    });

    editor.model.schema.register('gridCell', {
      isLimit: true,
      allowIn: 'gridRow',
      allowContentOf: '$block',
      allowAttributes: ['colspan']
    });

    editor.ui.componentFactory.add('insertGridRowButton', locale => {
      const button = new ButtonView(locale);

      button.set({
        label: 'Insert Grid Row',
        withText: true
      });

      button.on('execute', () => {
        editor.model.change(writer => {
          const gridRow = writer.createElement('gridRow');
          const gridCell = writer.createElement('gridCell', { colspan: 12 });
          writer.append(gridCell, gridRow);
          editor.model.insertContent(gridRow, editor.model.document.selection.getFirstPosition());
        });
      });

      return button;
    });

    this._defineConverters();
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for('upcast').elementToElement({
      model: 'gridRow',
      view: {
        name: 'div',
        classes: 'grid-row'
      }
    });

    conversion.for('downcast').elementToElement({
      model: 'gridRow',
      view: (modelElement, { writer: viewWriter }) => {
        return viewWriter.createContainerElement('div', { class: 'grid-row' });
      }
    });

    conversion.for('upcast').elementToElement({
      model: 'gridCell',
      view: {
        name: 'div',
        classes: 'grid-cell'
      }
    });

    conversion.for('downcast').elementToElement({
      model: 'gridCell',
      view: (modelElement, { writer: viewWriter }) => {
        const colspan = modelElement.getAttribute('colspan') || 1;
        const div = viewWriter.createEditableElement('div', {
          class: 'grid-cell',
          style: `flex: ${colspan}`
        });
        return toWidgetEditable(div, viewWriter);
      }
    });
  }
}