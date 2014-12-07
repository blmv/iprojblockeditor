/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var Undoer = function(editor) {
		this.editor = editor;

		var element = editor.element;

		this.stack = new Undo.Stack();

		this.lastValue = element.innerHTML;

		this.EditCommand = Undo.Command.extend({
			constructor: function (oldValue, newValue) {
				this.oldValue = oldValue;
				this.newValue = newValue;
			},
			execute: $.noop,
			undo: function () {
				element.innerHTML = this.oldValue;
			},
			redo: function () {
				element.innerHTML = this.newValue;
			}
		});
	};

	Undoer.prototype = {
		save: function() {
			var value = this.editor.element.innerHTML;
			if (this.lastValue !== value) {
				this.stack.execute(new this.EditCommand(this.lastValue, value));
				this.lastValue = value;
			}
		},
		undo: function() {
			if (this.stack.canUndo()) {
				this.stack.undo();
			}
		},
		redo: function() {
			if (this.stack.canRedo()) {
				this.stack.redo();
			}
		}
	};

	ns.WysiwygEditor.Undoer = Undoer;
}(IprojBlockEditor, jQuery));
