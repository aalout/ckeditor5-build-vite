import { Plugin } from 'ckeditor5';
import { toWidget, toWidgetEditable } from 'ckeditor5';
import { Widget } from 'ckeditor5';
import { ButtonView } from 'ckeditor5';
import { WidgetResize } from 'ckeditor5';

export default class DivPlugin extends Plugin {
    static get requires() {
        return [ Widget, WidgetResize ];
    }

    init() {
        const editor = this.editor;

        editor.model.schema.register( 'resizableDiv', {
            isObject: true,
            allowWhere: '$block',
            allowAttributes: [ 'style' ]
        } );

        editor.conversion.for( 'upcast' ).elementToElement( {
            model: ( viewElement, { writer: modelWriter } ) => {
                return modelWriter.createElement( 'resizableDiv', {
                    style: viewElement.getAttribute( 'style' )
                } );
            },
            view: {
                name: 'div',
                classes: 'resizable'
            }
        } );

        editor.conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'resizableDiv',
            view: ( modelElement, { writer: viewWriter } ) => {
                const style = modelElement.getAttribute( 'style' );
                return viewWriter.createContainerElement( 'div', {
                    style: style
                } );
            }
        } );

        editor.plugins.get('WidgetResize').on('resizeEnd', (event, data) => {
            const modelElement = data.modelElement;
            const viewElement = data.viewElement;
            const width = viewElement.getStyle('width');
            const height = viewElement.getStyle('height');
            editor.model.change(writer => {
                writer.setAttribute('style', `width: ${width}; height: ${height}; border: 1px solid black;`, modelElement);
            });
        });

        editor.conversion.for('editingDowncast').elementToElement({
            model: 'resizableDiv',
            view: (modelElement, { writer: viewWriter }) => {
                const style = modelElement.getAttribute('style');
                const div = viewWriter.createContainerElement('div', {
                    style: style,
                    class: 'ck-widget'
                });
        
                const widget = toWidget( div, viewWriter );
        
                editor.plugins.get( 'WidgetResize' ).attachTo( {
                    unit: 'px',
                    modelElement: modelElement,
                    viewElement: widget,
                    editor,
                    getResizeHost: () => editor.editing.view.domConverter.mapViewToDom( editor.editing.mapper.toViewElement( modelElement ) ),
                    getHandleHost: ( domElement ) => domElement,
                    isCentered: () => false,
                } );
        
                return widget;
            }
        } );


        editor.commands.add( 'resizeDiv', {
            execute: ( { modelElement, newSize } ) => {
                console.log('Model element:', modelElement);
                console.log('New size:', newSize);
                editor.model.change( writer => {
                    const currentStyle = modelElement.getAttribute( 'style' ) || '';
                    const updatedStyle = `width: ${newSize.width}px; height: ${newSize.height}px; border: 1px solid black;`;
                    console.log(newSize.width, newSize.height)
                    writer.setAttribute( 'style', updatedStyle, modelElement );
                } );
            }
        } );

        editor.ui.componentFactory.add( 'insertDiv', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Insert Div',
                tooltip: true
            } );

            view.on( 'execute', () => {
                editor.model.change( writer => {
                    const resizableDiv = writer.createElement( 'resizableDiv', {
                        style: 'border: 1px solid black; width: 50px; height: 50px;'
                    } );
                    editor.model.insertContent( resizableDiv, editor.model.document.selection );
                } );
            } );

            return view;
        } );
    }
}