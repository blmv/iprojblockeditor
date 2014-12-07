/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var Cleaner = function(editorElement, containers, inline, map) {
		this.editorElement = editorElement;
		this.containers = containers;
		this.inline = inline;
		this.map = map;

		this.containerSelector = containers.join(',');
		this.paragraphTag = containers.indexOf('p') !== -1 ? 'p' : false;
		this.inlineSelector = inline.join(',');

		var cleaner = this;

		this.disableDOMSubtreeModified = false;

		$(this.editorElement).on('DOMNodeInserted', function() {
			if (cleaner.disableDOMSubtreeModified) {
				return;
			}
			cleaner.disableDOMSubtreeModified = true;
			cleaner.clean();
			cleaner.disableDOMSubtreeModified = false;
		});
	};

	Cleaner.prototype = {
		unwrapNodeContents: function(node) {
			$(node).replaceWith($(node).html());
		},
		isContainerNode: function(node) {
			return $(node).is(this.containerSelector);
		},
		isInlineNode: function(node) {
			return node.nodeType === 3 || $(node).is(this.inlineSelector);
		},
		isFocusedNode: function(node) {
			var sel = window.getSelection();
			if (sel.isCollapsed && sel.rangeCount === 1) {
				var r = sel.getRangeAt(0);
				if (r.collapsed) {
					var focusedNode = r.commonAncestorContainer;
					while (focusedNode) {
						if (focusedNode === node) {
							return true;
						}
						if (focusedNode.parentNode === this.editorElement) {
							break;
						}
						focusedNode = focusedNode.parentNode;
					}
				}
			}
			return false;
		},

		focusNode: function(node) {
			var range = document.createRange();
			range.selectNodeContents(node);
			range.collapse(false);

			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		},

		clean: function() {
			var that = this, i, node;

			$('*', this.editorElement).not(this.containerSelector).not(this.inlineSelector).each(function() {
				that.unwrapNodeContents(this);
			});

			for (i = 0; node = this.editorElement.childNodes[i++]; ) {
				this.cleanNode(node);
			}
		},

		cleanNode: function(node) {
			if (!this.paragraphTag && !this.isInlineNode(node)) {
				this.unwrapNodeContents(node);
				return;
			}
			var $newNode;
			var isFocusedNode = this.isFocusedNode(node);
			$(node).removeAttr('style');
			if (this.isContainerNode(node)) {
				if (node.parentNode !== this.editorElement) {
					this.unwrapNodeContents(node);
				}
			} else if (!this.isInlineNode(node)) {
				if (node.parentNode === this.editorElement) {
					$newNode = $('<'+this.paragraphTag+'/>');
					$(node).wrap($newNode);
				} else if (node.nodeType !== 3) {
					this.unwrapNodeContents(node);
				}
			} else if (node.parentNode === this.editorElement) {
				if (node.nodeType === 3 && $.trim(node.textContent) === '') {
					node.parentNode.removeChild(node);
				} else {
					$newNode = $('<'+this.paragraphTag+'/>');
					$(node).wrap($newNode);
				}
			}

			if ($newNode && isFocusedNode) {
				this.focusNode($newNode.get(0));
			}
		}
	};

	ns.WysiwygEditor.Cleaner = Cleaner;
}(IprojBlockEditor, jQuery));
