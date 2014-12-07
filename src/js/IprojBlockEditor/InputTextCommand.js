/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var InputTextCommand = function(options) {
		ns.BaseCommand.apply(this, [options]);

		var that = this;
		if (this.options.multiline) {
			this.options.activeToolbarClass += ' ' + this.options.activeToolbarClass + '-multiline';
		}
		this.$input = $(this.options.multiline ? '<textarea placeholder="Ctrl-Enter to save">' : '<input type="text">')
			.addClass(this.options.cssClass)
			.attr(this.options.attributes)
			.on('keydown', function(e) {
				if (e.which === 13 &&
					(!$(this).is('textarea') || (!e.shiftKey && !e.altKey && (e.ctrlKey || e.metaKey)))
				) { //enter
					e.preventDefault();

					var value = $.trim(this.value);
					that.options.textHandler(value);

					that.hideInput();
				} else if (e.which === 27) {
					e.preventDefault();
					that.hideInput();
				}
			})
			.appendTo(this.options.toolbar.$buttons);
		$(this.options.toolbar).on('hide', function(e) {
			that.hideInput();
		});
	};

	InputTextCommand.prototype = Object.create(ns.BaseCommand.prototype);

	$.extend(InputTextCommand.prototype, {
		defaultOptions: {
			toolbar: null,
			textHandler: $.noop,
			getCurrentValue: $.noop,
			multiline: false,
			cssClass: 'iproj-editor-toolbar-text-input',
			activeToolbarClass: 'iproj-editor-toolbar-text-input-active',
			attributes: {}
		},

		run: function() {
			this.showInput();
		},

		hideInput: function() {
			this.options.toolbar.$element.removeClass(this.options.activeToolbarClass);
			this.$input.hide();
		},

		showInput: function() {
			this.options.toolbar.$element.addClass(this.options.activeToolbarClass);
			this.$input.show().focus();
			var val = this.options.getCurrentValue();
			if (val) {
				this.$input.val(val);
			}
		}
	});

	ns.InputTextCommand = InputTextCommand;
}(IprojBlockEditor, jQuery));
