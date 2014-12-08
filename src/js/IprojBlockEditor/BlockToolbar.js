/*jslint browser: true */
/*global jQuery, IprojBlockEditor */

;(function(ns, $) {
	'use strict';

	var BlockToolbar = function(context, options) {
		ns.BaseToolbar.apply(this, [context, options]);
		this.editor = this.context.editor;
	};

	BlockToolbar.prototype = Object.create(ns.BaseToolbar.prototype);

	$.extend(BlockToolbar.prototype, {
		showForBlock: function(block) {
			this.$element.show();
			var t = block.$element.offset().top + block.$element.height();
			this.showOnPosition(undefined, t - this.$element.height());
		},

		hide: function() {
			this.$element.hide();
		}
	});

	ns.BlockToolbar = BlockToolbar;
}(IprojBlockEditor, jQuery));
