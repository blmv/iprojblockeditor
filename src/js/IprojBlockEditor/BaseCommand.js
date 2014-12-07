/*jslint browser: true */
/*global jQuery, IprojBlockEditor */

;(function(ns, $) {
	'use strict';

	var BaseCommand = function(options) {
		this.options = $.extend({}, this.defaultOptions, options);
	};

	BaseCommand.prototype = {
		defaultOptions: {},
		onInit: $.noop,

		fireStateChange: function(state) {
			$(this).trigger('stateChange', [state]);
		},

		isApplied: function() {
			return false;
		},

		run: function(context) {
		}
	};

	ns.BaseCommand = BaseCommand;
}(IprojBlockEditor, jQuery));
