/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $, w) {
	'use strict';

	var CreateTextBlockCommand = function(options) {
		ns.BaseCommand.apply(this, [options]);
		this.type = this.options.type;
		this.block = this.options.block;
		this.$element = this.block.$element;

		var $el = this.getTextBlock();
		if ($el.length > 0) {
			this.initTextBlock($el);
		}
	};

	CreateTextBlockCommand.prototype = Object.create(ns.BaseCommand.prototype);

	$.extend(CreateTextBlockCommand.prototype, {
		initTextBlock: function($el) {
			if (!$el.data('wysiwyg')) {
				$el.data('wysiwyg', new ns.WysiwygEditor({
					element: $el.get(0),
					'buttons': [
						{name: null, command: 'undo', hotkey: 'z'},
						{name: null, command: 'redo', hotkey: 'y'},
						{name: 'i', command: 'italic', hotkey: 'i'},
						{name: 'b', command: 'bold', hotkey: 'b'},
						{name: 'link', command: 'link'}
					],
					tags: {
						containers: ['p'],
						inline: ['b', 'i', 'a']
					}
				})).on('blur', function() {
					if ($.trim($(this).text()) === '') {
						$(this).data('wysiwyg').destroy();
						$(this).remove();
					}
				});
			}
		},

		getTextBlock: function() {
			return $('div.article-block-image-' + this.type, this.$element);
		},

		createTextBlock: function() {
			var cl = 'article-block-image-' + this.type;
			var $p;

			if (this.type === 'caption') {
				$p = this.$element;
			} else {
				$p = this.block.getImageContainer();
			}
			var $el = $('<div>').addClass(cl).appendTo($p);

			this.initTextBlock($el);

			$(this).triggerHandler('stateChange', [true]);

			return $el;
		},

		isApplied: function() {
			return this.getTextBlock().length > 0;
		},

		run: function() {
			var $el = this.getTextBlock();
			if ($el.length === 0) {
				$el = this.createTextBlock();
			}
			$el.focus();
		}
	});

	ns.ImageBlock.CreateTextBlockCommand = CreateTextBlockCommand;
}(IprojBlockEditor, jQuery, window));
