/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var BlockMenuToolbar = function(context, options) {
		ns.BaseToolbar.apply(this, [context, options]);
		this.$element.addClass(this.options.baseCssClass + '-centered');
	};

	BlockMenuToolbar.prototype = Object.create(ns.BaseToolbar.prototype);

	$.extend(BlockMenuToolbar.prototype, {
		show: function() {
			var offset = this.block.$element.offset(),
				top = offset.top,
				left = offset.left + (this.block.$element.width() / 2);

			ns.BaseToolbar.prototype.showOnPosition.apply(this, [left, top - this.$element.height()]);
		}
	});

	ns.BlockMenuToolbar = BlockMenuToolbar;
}(IprojBlockEditor, jQuery));
