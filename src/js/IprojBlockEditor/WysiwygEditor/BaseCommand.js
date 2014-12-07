/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';
	rangy.init();

	var BaseCommand = function(options) {
		ns.BaseCommand.apply(this, [options]);
		this.editor = this.options.editor;
	};

	BaseCommand.prototype = Object.create(ns.BaseCommand.prototype);

	$.extend(BaseCommand.prototype, {
		onInit: $.noop,
		onHtml: $.noop,

		isAppliedToRange: function(range) {
			return false;
		},

		isApplied: function() {
			return this.isAppliedToRange(this.editor.range);
		},

		run: function() {
			return this.runOnRange(this.editor.range);
		},

		runOnRange: function(range) {
			this.selectRange(range);
		},

		selectRange: function(range) {
			var sel = rangy.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
	});

	ns.WysiwygEditor.BaseCommand = BaseCommand;
}(IprojBlockEditor, jQuery));
