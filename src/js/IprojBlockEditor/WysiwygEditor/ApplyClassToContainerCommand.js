/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var ApplyClassToContainerCommand = function(editor, options) {
		ns.BaseCommand.apply(this, [editor, options]);
	};

	ApplyClassToContainerCommand.prototype = Object.create(ns.BaseCommand.prototype);
	$.extend(ApplyClassToContainerCommand.prototype, {
		defaultOptions: {
			'className': null,
			'conflictClassNames': ''
		},
		selectionNodesWalk: ns.ReplaceContainerCommand.prototype.selectionNodesWalk,
		isAppliedToRange: ns.ReplaceContainerCommand.prototype.isAppliedToRange,
		runOnRange: ns.ReplaceContainerCommand.prototype.runOnRange,
		isAppliedToSelection: function() {
			if (rangy.getSelection().isCollapsed) {
				return false;
			}
			var className = this.options.className;
			return this.selectionNodesWalk(this.editor, function(node) {
				if (!$(node).hasClass(className)) {
					return false;
				}
			}) === undefined;
		},

		toggleOnSelection: function() {
			if (rangy.getSelection().isCollapsed) {
				return false;
			}
			var editor = this.editor;
			editor.undoer.save();

			var className = this.options.className;
			var conflictClassNames = this.options.conflictClassNames;
			var apply = !this.isAppliedToSelection();
			var nodes = [];
			this.selectionNodesWalk(editor, function(node) {
				var $node = $(node);
				if (apply) {
					$node.addClass(className).removeClass(conflictClassNames);
				} else {
					$node.removeClass(className);
				}
				nodes.push($node[0]);
			});

			var sel = rangy.getSelection();
			sel.removeAllRanges();
			if (nodes.length > 0) {
				var r = rangy.createRange(), n = nodes.length;
				r.setStartBefore(nodes[0]);
				r.setEndAfter(nodes[n-1]);
				sel.addRange(r);
				this.editor.range = sel.getRangeAt(0);
			}

			editor.undoer.save();
			this.fireStateChange(apply);
		}
	});

	ns.ApplyClassToContainerCommand = ApplyClassToContainerCommand;
}(IprojBlockEditor.WysiwygEditor, jQuery));
