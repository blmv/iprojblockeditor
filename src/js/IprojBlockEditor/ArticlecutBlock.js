/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var ArticlecutBlock = function() {
		ns.BaseBlock.apply(this, []);
	};

	ArticlecutBlock.prototype = Object.create(ns.BaseBlock.prototype);

	$.extend(ArticlecutBlock.prototype, {
		isEmpty: function() {
			return false;
		}
	});

	ns.ArticlecutBlock = ArticlecutBlock;
}(IprojBlockEditor, jQuery));
