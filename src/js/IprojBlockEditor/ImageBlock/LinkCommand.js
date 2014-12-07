/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var LinkCommand = function(options) {
		ns.InputTextCommand.apply(this, [options]);
		this.block = this.options.block;
		var that = this;
		this.options.getCurrentValue = function() {
			return that.getLinkElement().attr('href');
		};
		this.options.textHandler = function(text) {
			if (text) {
				that.createLink(text.replace(/^(?!https?:\/\/)(.*)$/, 'http://$1'));
			} else {
				that.removeLink();
			}
		};
	};

	LinkCommand.prototype = Object.create(ns.InputTextCommand.prototype);

	$.extend(LinkCommand.prototype, {
		getLinkElement: function() {
			return this.block.$element.find('.article-block-image-link');
		},

		removeLink: function() {
			this.getLinkElement(this.block).children().unwrap();
			this.fireStateChange(false);
		},

		createLink: function(url) {
			var $a = $('<a>')
				.addClass('article-block-image-link')
				.attr('href', url);
			this.block.getImageContainer().find('img').wrap($a);
			this.fireStateChange(true);
		},

		isApplied: function() {
			return this.getLinkElement().length > 0;
		}
	});

	ns.ImageBlock.LinkCommand = LinkCommand;
}(IprojBlockEditor, jQuery));
