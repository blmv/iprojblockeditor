/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var LinkCommand = function(options) {
		ns.WysiwygEditor.BaseCommand.apply(this, [options]);
		ns.InputTextCommand.apply(this, [options]);
		var that = this;
		this.toolbar = this.options.toolbar;
		this.options.getCurrentValue = function() {
			return that.getLink();
		};
		this.options.textHandler = function(text) {
			if (text) {
				that.createLink(text.replace(/^(?!https?:\/\/)(.*)$/, 'http://$1'));
			} else {
				that.removeLink();
			}
		};
	};

	LinkCommand.prototype = Object.create(ns.InputTextCommand.prototype);

	$.extend(LinkCommand.prototype, Object.create(ns.WysiwygEditor.BaseCommand.prototype));

	$.extend(LinkCommand.prototype, {
		defaultOptions: Object.create(ns.InputTextCommand.prototype.defaultOptions),
		createLink: function(url) {
			this.editor.undoer.save();
			this.selectRange(this.editor.range);
			document.execCommand('createlink', false, url);
			this.editor.undoer.save();
			this.toolbar._updateEditorRange();
			this.fireStateChange(true);
		},

		removeLink: function() {
			this.editor.undoer.save();
			this.selectRange(this.editor.range);
			document.execCommand('unlink');
			this.editor.undoer.save();
			this.toolbar._updateEditorRange();
			this.fireStateChange(false);
		},

		getLink: function() {
			return this.getRangeLink(this.editor.range);
		},

		getRangeLink: function(range) {
			var $node = $(range.commonAncestorContainer);

			if ($node.is('a') || ($node = $node.closest('a')).length > 0) {
				return $node.attr('href');
			}
			return null;
		},

		isAppliedToRange: function(range) {
			return !!this.getRangeLink(range);
		},

		run: ns.InputTextCommand.prototype.run
	});

	ns.WysiwygEditor.LinkCommand = LinkCommand;
}(IprojBlockEditor, jQuery));
