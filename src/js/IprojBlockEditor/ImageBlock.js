/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, w) {
	'use strict';

	var ImageBlock = function() {};

	ImageBlock.prototype = Object.create(ns.BaseBlock.prototype);

	$.extend(ImageBlock.prototype, {
		init: function(editor, element, options) {
			ns.BaseBlock.prototype.init.apply(this, [editor, element, options]);

			this.toolbar = new ImageBlock.Toolbar({block: this});
			this.editCommand = this.toolbar.getCommand('image');

			this.textBlockTypes = ['top-text', 'bottom-text', 'caption'];

			var that = this;

			if (this.isEmpty()) {
				this.editor.focusOnBlock(this);
				this.edit();
			}
		},

		getImageContainer: function() {
			var $container = $('div.article-block-image-container', this.$element);
			if ($container.length === 0) {
				$container = $('<div>').addClass('article-block-image-container').appendTo(this.$element);
			}
			return $container;
		},

		onFocus: function() {
			if (!this.isEmpty()) {
				this.toolbar.show();
			}
		},

		onBlur: function() {
			this.toolbar.hide();
		},

		removeEmptyTextBlocks: function() {
			var that = this;
			this.textBlockTypes.forEach(function(t) {
				var $el = that.getTextBlock(t);
				if ($.trim($el.text()) === '') {
					$el.remove();
				}
			});
		},

		insertImage: function(source) {
			var $container = this.getImageContainer();

			var $img = $('<img>').attr('src', source);
			var $old = $container.find('img');
			if ($old.length > 0) {
				$old.replaceWith($img);
			} else {
				$container.append($img);
			}

			this.toolbar.show();
		},

		edit: function() {
			this.editCommand.run();
		},

		isEmpty: function() {
			return $('img', this.$element).length === 0;
		},

		toHtml: function() {
			this.removeEmptyTextBlocks();
			if (this.isEmpty()) {
				return '';
			}

			var $el = this.$element.clone();
			$el.find('[contentEditable]').removeAttr('contentEditable');
			$el.find('.iproj-editor-wysiwyg').removeClass('iproj-editor-wysiwyg');
			$el.find('input').remove();
			return $el
				.removeClass(this.editor.options.classFocusedBlock)
				.wrap('<div>').parent().html();
		}
	});

	ns.ImageBlock = ImageBlock;
}(IprojBlockEditor, jQuery));
