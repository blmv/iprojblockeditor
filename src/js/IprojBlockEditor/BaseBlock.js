/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var BaseBlock = function() {
	};

	BaseBlock.prototype = {
		defaultOptions: {},

		init: function(editor, element, options) {
			this.editor = editor;
			this.options = $.extend(true, {}, this.defaultOptions, options);
			this.$element = $(element);
		},

		onFocus: $.noop,

		onBlur: $.noop,

		isEmpty: function() {
			return this.$element.children().length === 0;
		},

		remove: function() {
			this.$element.remove();
		},

		toHtml: function() {
			if (this.isEmpty()) {
				return '';
			}
			return this.$element.clone()
				.removeClass(this.editor.options.classFocusedBlock)
				.wrap('<div>').parent().html();
		}
	};

	ns.BaseBlock = BaseBlock;
}(IprojBlockEditor, jQuery));

