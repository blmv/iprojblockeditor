/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var WideBlockClassCommand = function(options) {
		ns.BaseCommand.apply(this, [options]);
		this.$element = this.options.$blockElement;
	};

	WideBlockClassCommand.prototype = Object.create(ns.BaseCommand.prototype);

	$.extend(WideBlockClassCommand.prototype, {
		isApplied: function() {
			return this.$element.hasClass('article-block-image-wide');
		},

		run: function(block) {
			this.$element.toggleClass('article-block-image-wide');
			this.fireStateChange(this.$element.hasClass('article-block-image-wide'));
		}
	});

	ns.ImageBlock.WideBlockClassCommand = WideBlockClassCommand;
}(IprojBlockEditor, jQuery));
