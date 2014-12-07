/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var UndoCommand = function(options) {
		ns.BaseCommand.apply(this, [options]);
	};

	UndoCommand.prototype = Object.create(ns.BaseCommand.prototype);

	$.extend(UndoCommand.prototype, {
		run: function() {
			this.editor.undoer.undo();
		}
	});

	ns.UndoCommand = UndoCommand;
}(IprojBlockEditor.WysiwygEditor, jQuery));
