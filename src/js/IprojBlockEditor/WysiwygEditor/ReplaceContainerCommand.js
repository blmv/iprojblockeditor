/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var ReplaceContainerCommand = function(editor, options) {
		ns.BaseCommand.apply(this, [editor, options]);
		this.tagName = this.options.tagName.toLowerCase();
		this.className = this.options.tagClass || '';
	};

	ReplaceContainerCommand.prototype = Object.create(ns.BaseCommand.prototype);
	$.extend(ReplaceContainerCommand.prototype, {
		selectionNodesWalk: function(editor, fn) {
			var result, ri, start, end, next, range;
			var getContainerNode = function(range, isStart) {
				var node = range[isStart ? 'startContainer' : 'endContainer'];
				if (node === editor.element) {
					if (isStart) {
						node = editor.element.childNodes[range.startOffset];
					} else {
						node = editor.element.childNodes[range.endOffset > 0 ? range.endOffset-1 : 0];
					}
					return node;
				}
				while (node.parentNode !== editor.element) {
					node = node.parentNode;
				}
				return node;
			};

			var ranges = rangy.getSelection().getAllRanges();
			ri = 0;
			while (range = ranges[ri++]) {
				start = getContainerNode(range, true);
				end = getContainerNode(range, false);

				while (start) {
					next = start.nextElementSibling;
					result = fn(start);
					if (result !== undefined) {
						return result;
					}
					if (start === end) {
						break;
					}
					start = next;
				}
			}
		},

		isAppliedToRange: function(range) {
			this.selectRange(range);
			return this.isAppliedToSelection();
		},

		runOnRange: function(range) {
			this.selectRange(range);
			return this.toggleOnSelection();
		},

		isAppliedToSelection: function() {
			var tagName = this.tagName;
			var className = this.className;
			if (rangy.getSelection().isCollapsed) {
				return false;
			}
			return this.selectionNodesWalk(this.editor, function(node) {
				if (!$(node).is(tagName) || (className && !$(node).hasClass(className))) {
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
			var className = this.className;
			var tagName = this.tagName;
			var apply = !this.isAppliedToSelection();
			var nodes = [];
			this.selectionNodesWalk(editor, function(node) {
				var $node = $(node), $newNode;
				if (apply) {
					if ($node.is(tagName)) {
						if (className) {
							$node.addClass(className);
						}
					} else {
						$newNode = $('<' + tagName + '/>');
						if (className) {
							$newNode.addClass(className);
						}
						if (node.nodeType === 3) {
							$newNode.text($node.text());
						} else {
							$newNode.html($node.html());
						}
						$node.replaceWith($newNode);
						$node = $newNode;
					}
				} else {
					if (node.tagName.toLowerCase() === 'p') {
						if (className) {
							$node.removeClass(className);
						}
					} else {
						$newNode = $('<p/>').html(node.innerHTML);
						$node.replaceWith($newNode);
						$node = $newNode;
					}
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

	ns.ReplaceContainerCommand = ReplaceContainerCommand;
}(IprojBlockEditor.WysiwygEditor, jQuery));
