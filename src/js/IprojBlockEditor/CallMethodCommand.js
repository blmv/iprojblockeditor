/*jslint browser: true */
/*global jQuery, IprojBlockEditor */

;(function(ns, $) {
	'use strict';

	var CallMethodCommand = function(options) {
		ns.BaseCommand.apply(this, [options]);
	};

	CallMethodCommand.prototype = Object.create(ns.BaseCommand.prototype);

	$.extend(CallMethodCommand.prototype, {
		run: function(context) {
			this.options.object[this.options.method].apply(this.options.object, this.options.methodArguments || []);
		}
	});

	ns.CallMethodCommand = CallMethodCommand;
}(IprojBlockEditor, jQuery));
