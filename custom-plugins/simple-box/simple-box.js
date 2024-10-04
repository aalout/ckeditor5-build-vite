import SimpleBoxEditing from './simple-box-editor';
import SimpleBoxUI from './simple-box-ui';
import { Plugin } from 'ckeditor5';

export default class SimpleBox extends Plugin {
    static get requires() {
        return [ SimpleBoxEditing, SimpleBoxUI ];
    }
}
