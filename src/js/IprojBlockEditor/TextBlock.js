/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var TextBlock = function() {
		ns.BaseBlock.apply(this, []);
	};

	TextBlock.prototype = Object.create(ns.BaseBlock.prototype);

	$.extend(TextBlock.prototype, {
		defaultOptions: {
			focusOnEmpty: true
		},
		init: function(editor, element, options) {
			ns.BaseBlock.prototype.init.apply(this, [editor, element, options]);

			var focus = this.options.focusOnEmpty && this.isEmpty();

			this.wysiwyg = new ns.WysiwygEditor($.extend({
				element: this.$element.get(0)
			}, options));

			if (focus) {
				this.editor.focusOnBlock(this);
				this.wysiwyg.focus();
			}
		},
		isEmpty: function() {
			return $.trim(this.$element.text()) === '';
		},
		toHtml: function() {
			if (this.isEmpty()) {
				return '';
			}
			return this.$element.clone()
				.removeAttr('contentEditable')
				.removeClass(this.editor.options.classFocusedBlock + ' iproj-editor-wysiwyg')
				.wrap('<div>').parent().html();
		},
		remove: function() {
			this.wysiwyg.destroy();
			ns.BaseBlock.prototype.remove.apply(this, []);
		}
	});

	ns.TextBlock = TextBlock;
}(IprojBlockEditor, jQuery));
