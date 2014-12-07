/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var RedoCommand = function(options) {
		ns.BaseCommand.apply(this, [options]);
	};

	RedoCommand.prototype = Object.create(ns.BaseCommand.prototype);

	$.extend(RedoCommand.prototype, {
		run: function() {
			this.editor.undoer.redo();
		}
	});

	ns.RedoCommand = RedoCommand;
}(IprojBlockEditor.WysiwygEditor, jQuery));

