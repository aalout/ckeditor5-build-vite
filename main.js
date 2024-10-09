import {
	ClassicEditor,
	AccessibilityHelp,
	Autoformat,
	AutoImage,
	Autosave,
	BlockQuote,
	Bold,
	CloudServices,
	Essentials,
	FullPage,
	GeneralHtmlSupport,
	Heading,
	HtmlComment,
	HtmlEmbed,
	ImageBlock,
	ImageCaption,
	ImageInline,
	ImageInsertViaUrl,
	Font,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	LinkImage,
	List,
	ListProperties,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	SelectAll,
	ShowBlocks,
	SourceEditing,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TextTransformation,
	TodoList,
	Underline,
	Widget,
	Undo, 
	Editor
} from 'ckeditor5';

import translations from 'ckeditor5/translations/ru.js';
// import ClassAttribute from './custom-plugins/class-attribute-plugin';
import SimpleBox from './custom-plugins/simple-box/simple-box';
// import HtmlInsertPluginDr from './custom-plugins/html-insert/html-insert-plugin';
import DivPlugin from './custom-plugins/html-insert/div-plugin';
// import ExtendHTMLSupport from './custom-plugins/html-support/extend-html-support';
// import Widget from './custom-plugins/widgets/widget-comment-plugin';
import ProductCardPlugin from './custom-plugins/product-test/product-test-plugin';
import GridPlugin from './custom-plugins/grid-plugin/grid-plugin';

import 'ckeditor5/ckeditor5.css';

import './style.css';

const htmlCode = '<div className={styles.main_div}><div className={styles.product_card}><div className={styles.product_card_flex_1}><p>Следует отметить, что реализация намеченных плановых заданий способствует подготовке и реализации модели развития. Учитывая ключевые сценарии поведения, высокое качество позиционных исследований требует от нас анализа инновационных методов управления процессами. Но новая модель организационной деятельности является качественно новой ступенью переосмысления внешнеэкономических политик.</p><div className={styles.logo}></div></div><div className={styles.bottom_div}><div className={styles.person_div}><div className={styles.person}></div>{props.content}</div><div className={styles.arrow}></div></div></div></div>'

const editorConfig = {
	toolbar: {
		items: [
			'undo',
			'redo',
			'|',
			'sourceEditing',
			'showBlocks',
			'|',
			'heading',
			'|',
			'bold',
			'italic',
			'underline',
			'|',
			'link',
			'mediaEmbed',
			'insertTable',
			'blockQuote',
			'htmlEmbed',
			'|',
			'bulletedList',
			'numberedList',
			'todoList',
			'outdent',
			'indent',
			'|',
			'контейнеры',
			'insertDiv',
			'InsertProductCardButton',
			'InsertGridRowButton',
			'|',
			'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
		],
		shouldNotGroupWhenFull: false
	},
	plugins: [
		AccessibilityHelp,
		// HtmlInsertPluginDr,
		// ExtendHTMLSupport,
		Autoformat,
		GridPlugin,
		// ClassAttribute,
		AutoImage,
		SimpleBox,
		Autosave,
		BlockQuote,
		Bold,
		DivPlugin,
		Widget,
		CloudServices,
		Essentials,
		FullPage,
		GeneralHtmlSupport,
		Heading,
		// WidgetPlugin,
		ProductCardPlugin,
		HtmlComment,
		Font,
		HtmlEmbed,
		ImageBlock,
		ImageCaption,
		ImageInline,
		ImageInsertViaUrl,
		ImageResize,
		ImageStyle,
		ImageTextAlternative,
		ImageToolbar,
		ImageUpload,
		Indent,
		IndentBlock,
		Italic,
		Link,
		LinkImage,
		List,
		ListProperties,
		MediaEmbed,
		Paragraph,
		PasteFromOffice,
		SelectAll,
		ShowBlocks,
		SourceEditing,
		Table,
		TableCaption,
		TableCellProperties,
		TableColumnResize,
		TableProperties,
		TableToolbar,
		TextTransformation,
		TodoList,
		Underline,
		Undo
	],
	heading: {
		options: [
			{
				model: 'paragraph',
				title: 'Paragraph',
				class: 'ck-heading_paragraph'
			},
			{
				model: 'heading1',
				view: 'h1',
				title: 'Heading 1',
				class: 'ck-heading_heading1'
			},
			{
				model: 'heading2',
				view: 'h2',
				title: 'Heading 2',
				class: 'ck-heading_heading2'
			},
			{
				model: 'heading3',
				view: 'h3',
				title: 'Heading 3',
				class: 'ck-heading_heading3'
			},
			{
				model: 'heading4',
				view: 'h4',
				title: 'Heading 4',
				class: 'ck-heading_heading4'
			},
			{
				model: 'heading5',
				view: 'h5',
				title: 'Heading 5',
				class: 'ck-heading_heading5'
			},
			{
				model: 'heading6',
				view: 'h6',
				title: 'Heading 6',
				class: 'ck-heading_heading6'
			}
		]
	},
	htmlSupport: {
		allow: [
			{
				name: /.*/,
				styles: true,
				attributes: true,
				classes: true
			}
		]
	},
	image: {
		toolbar: [
			'toggleImageCaption',
			'imageTextAlternative',
			'|',
			'imageStyle:inline',
			'imageStyle:wrapText',
			'imageStyle:breakText',
			'|',
			'resizeImage'
		]
	},
	initialData:
	`<div class="grid-row">
    <div class="grid-cell ck-editor__editable ck-editor__nested-editable" style="flex:12;" role="textbox" tabindex="-1" contenteditable="true" colspan="12">
        <div class="widget-container ck-editor__editable ck-editor__nested-editable" role="textbox" tabindex="-1" aria-label="product card widget" contenteditable="true">
            <div class="widget-container ck-editor__editable ck-editor__nested-editable" role="textbox" tabindex="-1" aria-label="product card widget" contenteditable="true">
                <div class="main_div">
                    <div class="product_card">
                        <div class="product_card_flex_1">
                            <p>
                                Задача организации, в особенности же постоянное информационно-пропагандистское обеспечение нашей деятельности требует определения и уточнения экономической целесообразности принимаемых решений! Идейные соображения высшего порядка, а также постоянный количественный рост и сфера нашей активности, в своём классическом представлении, допускает внедрение экономической целесообразности принимаемых решений. В частности, граница обучения кадров создаёт необходимость включения в производственный план целого ряда внеочередных мероприятий с учётом комплекса прогресса профессионального сообщества.
                            </p>
                            <div class="logo">
                                &nbsp;
                            </div>
                        </div>
                        <div class="bottom_div">
                            <div class="person_div">
                                <div class="person">
                                    &nbsp;
                                </div>
                                <p>
                                    Ваня Иванов
                                </p>
                            </div>
                            <div class="arrow">
                                &nbsp;
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="grid-cell ck-editor__editable ck-editor__nested-editable" style="flex:12;" role="textbox" tabindex="-1" contenteditable="true" colspan="12">
        <div class="widget-container ck-editor__editable ck-editor__nested-editable" role="textbox" tabindex="-1" aria-label="product card widget" contenteditable="true">
            <div class="widget-container ck-editor__editable ck-editor__nested-editable" role="textbox" tabindex="-1" aria-label="product card widget" contenteditable="true">
                <div class="main_div">
                    <div class="product_card">
                        <div class="product_card_flex_1">
                            <p>
                                Гойда
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="grid-cell ck-editor__editable ck-editor__nested-editable" style="flex:12;" role="textbox" tabindex="-1" contenteditable="true" colspan="12">
        <span style="background-color:hsl(180, 75%, 60%);font-family:'Courier New', Courier, monospace;"><strong>Здесь контент какой-то</strong></span><span style="background-color:hsl(180,75%,60%);font-family:'Courier New', Courier, monospace;"><strong>Здесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-тоЗдесь контент какой-то</strong></span>
    </div>
    <div class="grid-cell ck-editor__editable ck-editor__nested-editable" style="flex:12;" role="textbox" tabindex="-1" contenteditable="true" colspan="12">
        <div class="widget-container ck-editor__editable ck-editor__nested-editable" role="textbox" tabindex="-1" aria-label="product card widget" contenteditable="true">
            <div class="widget-container ck-editor__editable ck-editor__nested-editable" role="textbox" tabindex="-1" aria-label="product card widget" contenteditable="true">
                <div class="main_div">
                    <div class="product_card">
                        <div class="product_card_flex_1">
                            <p>
                                &nbsp;
                            </p>
                            <div class="logo">
                                &nbsp;
                            </div>
                        </div>
                        <div class="bottom_div">
                            <div class="person_div">
                                <p>
                                    Ваня Иванов
                                </p>
                            </div>
                            <div class="arrow">
                                &nbsp;
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="grid-cell ck-editor__editable ck-editor__nested-editable" style="flex:12;" role="textbox" tabindex="-1" contenteditable="true" colspan="12">
        <div class="widget-container ck-editor__editable ck-editor__nested-editable" role="textbox" tabindex="-1" aria-label="product card widget" contenteditable="true">
            <div class="widget-container ck-editor__editable ck-editor__nested-editable" role="textbox" tabindex="-1" aria-label="product card widget" contenteditable="true">
                <div class="main_div">
                    <div class="product_card">
                        <div class="product_card_flex_1">
                            <section class="simple-box">
                                <h1 class="simple-box-title">
                                    <span style="background-color:hsl(180, 75%, 60%);">аааакуакуаукаук</span>
                                </h1>
                                <div class="simple-box-description">
                                    <p>
                                        <span style="background-color:hsl(0, 0%, 0%);">ааааа</span>
                                    </p>
                                </div>
                            </section>
                            <p>
                                &nbsp;
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`,
		// '<html><head><title>Простая страница с инлайновыми стилями</title></head><body><div style="display: flex; justify-content: space-between; align-items: center; height: 100vh; background-color: #f2f2f2;"><div style="background-color: #4CAF50; padding: 20px; color: #fff;">Контент 1</div><div style="background-color: #3e8e41; padding: 20px; color: #fff;">Контент 2</div><div style="background-color: #2ecc71; padding: 20px; color: #fff;">Контент 3</div></div></body></html>',
	language: 'ru',
	link: {
		addTargetToExternalLinks: true,
		defaultProtocol: 'https://',
		decorators: {
			toggleDownloadable: {
				mode: 'manual',
				label: 'Downloadable',
				attributes: {
					download: 'file'
				}
			}
		}
	},
	list: {
		properties: {
			styles: true,
			startIndex: true,
			reversed: true
		}
	},
	placeholder: 'Type or paste your content here!',
	table: {
		contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
	},
	translations: [translations]
};

ClassicEditor.create(document.querySelector('#editor'), editorConfig);
