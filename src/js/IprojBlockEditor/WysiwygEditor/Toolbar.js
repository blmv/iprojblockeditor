/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var Toolbar = function(context, options) {
		var commandShortcuts = {
			'bold': {command: 'IprojBlockEditor.WysiwygEditor.SurroundCommand', commandOptions: {tagName: 'b'}},
			'italic': {command: 'IprojBlockEditor.WysiwygEditor.SurroundCommand', commandOptions: {tagName: 'i'}},
			'link': {command: 'IprojBlockEditor.WysiwygEditor.LinkCommand', commandOptions: {toolbar: this}},
			'p': {command: 'IprojBlockEditor.WysiwygEditor.ReplaceContainerCommand', commandOptions: {tagName: 'p'}},
			'h1': {command: 'IprojBlockEditor.WysiwygEditor.ReplaceContainerCommand', commandOptions: {tagName: 'h1'}},
			'h2': {command: 'IprojBlockEditor.WysiwygEditor.ReplaceContainerCommand', commandOptions: {tagName: 'h2'}},
			'h3': {command: 'IprojBlockEditor.WysiwygEditor.ReplaceContainerCommand', commandOptions: {tagName: 'h3'}},
			'h4': {command: 'IprojBlockEditor.WysiwygEditor.ReplaceContainerCommand', commandOptions: {tagName: 'h4'}},
			'h5': {command: 'IprojBlockEditor.WysiwygEditor.ReplaceContainerCommand', commandOptions: {tagName: 'h5'}},
			'h6': {command: 'IprojBlockEditor.WysiwygEditor.ReplaceContainerCommand', commandOptions: {tagName: 'h6'}},
			'big': {command: 'IprojBlockEditor.WysiwygEditor.ReplaceContainerCommand', commandOptions: {tagName: 'p', tagClass: 'big'}},
			'class': {command: 'IprojBlockEditor.WysiwygEditor.ApplyClassToContainerCommand'},
			'undo': {command: 'IprojBlockEditor.WysiwygEditor.UndoCommand'},
			'redo': {command: 'IprojBlockEditor.WysiwygEditor.RedoCommand'}
		};

		options.buttons.forEach(function(button) {
			if (commandShortcuts[button.command]) {
				$.extend(button, commandShortcuts[button.command]);
			}
			button.commandOptions = button.commandOptions || {};
			button.commandOptions.editor = context.editor;
		});

		ns.BaseToolbar.apply(this, [context, options]);
		this.$element.addClass(this.options.baseCssClass + '-centered');

		this.editor = context.editor;
		var that = this;
		$(this.editor.element).on('keydown', function(e) {
			that.onKeyPress(e);
		}).on('mouseup keyup', function() {
			that.toggle();
		});
	};

	Toolbar.prototype = Object.create(ns.BaseToolbar.prototype);

	$.extend(Toolbar.prototype, {
		_updateEditorRange: function() {
			var sel = rangy.getSelection();
			if (!sel.isCollapsed && sel.rangeCount > 0 && $(sel.getRangeAt(0).startContainer).closest(this.editor.element).length > 0) {
				this.editor.range = sel.getRangeAt(0);
				return true;
			}
			return false;
		},

		toggle: function() {
			if (this._updateEditorRange()) {
				this.showForRange(this.editor.range);
			} else {
				this.hide();
			}
		},

		showForRange: function(range) {
			var offset = range.nativeRange.getBoundingClientRect(),
				scrollTop = $(window).scrollTop(),
				scrollLeft = $(window).scrollLeft(),
				top = offset.top + scrollTop - 10,
				left = offset.left + scrollLeft + (offset.width / 2);

			if (top < this.$element.height()) {
				top = offset.bottom + scrollTop + 10;
				this.$element
					.addClass('iproj-editor-toolbar-bottom')
					.removeClass('iproj-editor-toolbar-top');
			} else {
				top -= this.$element.height();
				this.$element
					.removeClass('iproj-editor-toolbar-bottom')
					.addClass('iproj-editor-toolbar-top');
			}

			this.showOnPosition(Math.max(left, 0), top);
		}
	});

	ns.WysiwygEditor.Toolbar = Toolbar;
}(IprojBlockEditor, jQuery));
