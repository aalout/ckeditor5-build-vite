import { GeneralHtmlSupport, Plugin } from "ckeditor5";

export default class ExtendHTMLSupport extends Plugin {
    static get requires() {
        return [ GeneralHtmlSupport ];
    }

    init() {
        const dataFilter = this.editor.plugins.get( 'DataFilter' );
        const dataSchema = this.editor.plugins.get( 'DataSchema' );
        dataSchema.registerInlineElement( {
            view: 'element-inline',
            model: 'myElementInline'
        } );

        dataFilter.allowElement( 'element-inline' );
        dataFilter.allowAttributes( { name: 'element-inline', attributes: { 'data-foo': false }, classes: [ 'foo' ] } );

        dataSchema.registerBlockElement( {
            view: 'element-block',
            model: 'myElementBlock',
            modelSchema: {
                inheritAllFrom: '$block'
            }
        } );

        dataFilter.allowElement( 'element-block' );
    }
}
