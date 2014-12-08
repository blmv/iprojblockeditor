/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var EmbedBlock = function() {
		ns.BaseBlock.apply(this, []);
	};

	EmbedBlock.prototype = Object.create(ns.BaseBlock.prototype);

	$.extend(EmbedBlock.prototype, {
		init: function(editor, element, options) {
			ns.BaseBlock.prototype.init.apply(this, [editor, element, options]);

			this.toolbar = new EmbedBlock.Toolbar({block: this});
			this.editCommand = this.toolbar.getCommand('embed');

			if (this.isEmpty()) {
				this.editor.focusOnBlock(this);
				this.edit();
			}
		},

		onFocus: function() {
			this.toolbar.show();
		},

		onBlur: function() {
			this.toolbar.hide();
		},

		setHtml: function(html) {
			if (this.options.htmlFilter) {
				html = this.options.htmlFilter.apply(this, [html]);
			}

			this.$element.contents().not('.article-block-image-caption').remove();
			this.$element.prepend(html);
		},

		getEmbedHtml: function() {
			var $contents = this.$element.clone();
			$('.article-block-image-caption', $contents).remove();
			return $('<div>').html($contents.contents()).html();
		},

		edit: function() {
			this.editCommand.run();
		},

		isEmpty: function() {
			return this.$element.contents().length === 0;
		},

		removeEmptyTextBlocks: function() {
			var $el = $('.article-block-image-caption', this.$element);
			if ($el.length > 0 && $.trim($el.text()) === '') {
				$el.remove();
			}
		},

		toHtml: function() {
			this.removeEmptyTextBlocks();

			if (this.isEmpty()) {
				return '';
			}

			var $el = this.$element.clone();
			$el.find('[contentEditable]').removeAttr('contentEditable');
			$el.find('.iproj-editor-wysiwyg').removeClass('iproj-editor-wysiwyg');

			return $el
				.removeClass(this.editor.options.classFocusedBlock)
				.wrap('<div>').parent().html();
		}
	});

	ns.EmbedBlock = EmbedBlock;
}(IprojBlockEditor, jQuery));
