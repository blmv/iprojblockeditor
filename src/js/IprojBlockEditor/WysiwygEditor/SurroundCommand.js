/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';
	rangy.init();

	var SurroundCommand = function(options) {
		ns.BaseCommand.apply(this, [options]);

		this.tagName = options.tagName || 'span';
		this.tagAttributes = options.tagAttributes || {};

		this.fakeClass = 'rangy-' + this.tagName + (this.tagAttributes['class'] ? '-' + this.tagAttributes['class'] : '');
		this.cssApplier = rangy.createCssClassApplier(this.fakeClass, {
			elementTagName: this.tagName,
			elementAttributes: this.tagAttributes
		});
	};

	SurroundCommand.prototype = Object.create(ns.BaseCommand.prototype);

	$.extend(SurroundCommand.prototype, {
		isAppliedToRange: function(range) {
			var selector = this._tagretSelector();
			var nodes = range.getNodes([3], function(node) {
				return $(node).closest(selector).length === 0;
			});
			return nodes.length === 0;
		},

		_tagretSelector: function() {
			return this.tagName + (this.tagAttributes['class'] ? '.' + this.tagAttributes['class'] : '');
		},

		_setFakeClass: function(element) {
			var selector = this._tagretSelector();
			$(element).parentsUntil(this.editor.element).filter(selector).add($(selector, element)).addClass(this.fakeClass);
		},

		_removeFakeClass: function(element) {
			var fakeClass = this.fakeClass;
			$('.' + fakeClass, element).each(function() {
				$(this).removeClass(fakeClass);
				if (!this.className) {
					this.removeAttribute('class');
				}
			});
		},

		runOnRange: function(range) {
			this.editor.undoer.save();
			this._setFakeClass(range.commonAncestorContainer);
			var apply = !this.cssApplier.isAppliedToRange(range);
            if (apply) {
                this.cssApplier.applyToRange(range);
            } else {
                this.cssApplier.undoToRange(range);
            }
			this._removeFakeClass(this.editor.element);
			this.editor.undoer.save();
			this.selectRange(range);
			this.fireStateChange(apply);
		}
	});

	ns.SurroundCommand = SurroundCommand;
}(IprojBlockEditor.WysiwygEditor, jQuery));
