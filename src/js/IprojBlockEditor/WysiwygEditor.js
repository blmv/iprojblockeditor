/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	rangy.init();

	var WysiwygEditor = function(options) {
		this.options = $.extend({}, this.defaultOptions, options);

		this.element = this.options.element;

		this.range = null;
		this.isFocused = false;

		this.element.contentEditable = true;
		$(this.element).addClass('iproj-editor-wysiwyg');

		if ($(this.element).text() === '' && this.options.tags.containers.indexOf('p') !== -1 && !this.options.inline) {
			$(this.element).html('<p><br/></p>');
		}
		if (this.options.inline) {
			$(this.editor.element).on('keydown', function(e) {
				if (e.which === 13) {
					e.preventDefault();
					return false;
				}
			});
		}

		this.cleaner = new WysiwygEditor.Cleaner(this.element, this.options.tags.containers, this.options.tags.inline);

		this.undoer = new WysiwygEditor.Undoer(this);

		this.bindEvents();

		this.toolbar = new WysiwygEditor.Toolbar({editor: this}, {
			'buttons': this.options.buttons
		});
	};

	WysiwygEditor.prototype = {
		defaultOptions: {
			element: null,
			buttons: [
				{name: null, command: 'undo', hotkey: 'z'},
				{name: null, command: 'redo', hotkey: 'y'},
				{name: 'italic', command: 'italic', hotkey: 'i'},
				{name: 'bold', command: 'bold', hotkey: 'b'},
				{name: 'h1', text: 'H1', command: 'h1'},
				{name: 'h2', text: 'H2', command: 'h2'},
				{name: 'h3', text: 'H3', command: 'h3'},
				{name: 'link', command: 'link'},
			],
			tags: {
				containers: ['p', 'h1', 'h2', 'h3'],
				inline: ['b', 'i', 'a', 'br']
			}
		},
		getHtml: function() {
			this.cleaner.clean();
			var clone = $(this.element).clone()[0];
			return clone.innerHTML;
		},

		setHtml: function(html) {
			this.element.innerHTML = html;
		},

		bindEvents: function() {
			var timer;
			var that = this;
			$(this.element).on({
				keyup: function(e) {
					if (e.ctrlKey || e.shiftKey || e.metaKey) {
						e.preventDefault();
						return false;
					}

					clearTimeout(timer);
					timer = setTimeout(function () {
						that.undoer.save();
					}, 250);
				},
				paste: function(e) {
					e.preventDefault();

					var text;
					if (e.originalEvent.clipboardData) {
						text = e.originalEvent.clipboardData.getData('text/plain');
					} else if (w.clipboardData) { //IE
						text = w.clipboardData.getData('Text');
					} else {
						text = window.prompt('');
					}
					text = text.replace(/\n/g, '<br/>');
					document.execCommand('insertHtml', false, text);
					that.cleaner.clean();
				}
			});
		},

		destroy: function() {
			this.toolbar.destroy();
			this.cleaner.clean();
			this.element.contentEditable = false;
			$(this.element).removeClass('iproj-editor-wysiwyg');
			if ($.trim($(this.element).text()) === '') {
				$(this.element).html('');
			}
		}
	};

	ns.WysiwygEditor = WysiwygEditor;
}(IprojBlockEditor, jQuery));
