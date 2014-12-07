/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var SelectFileCommand = function(options) {
		ns.BaseCommand.apply(this, [options]);
		var that = this;
		this.$input = $('<input type="file">')
			.addClass(this.options.inputCssClass)
			.attr(this.options.inputAttributes)
			.change(function(e) {
				var file = this.files[0];

				var reader = new FileReader();
				reader.onload = function(e) {
					that.options.fileHandler(e.target.result);
				};
				reader.readAsDataURL(file);

			});
		this.$input.appendTo(this.options.$toolbarContainer);
	};

	SelectFileCommand.prototype = Object.create(ns.BaseCommand.prototype);

	$.extend(SelectFileCommand.prototype, {
		defaultOptions: {
			$toolbarContainer: null,
			fileHandler: $.noop,
			inputCssClass: 'iproj-editor-toolbar-file-input',
			inputAttributes: {}
		},

		run: function() {
			this.$input.trigger('click');
		}
	});

	ns.SelectFileCommand = SelectFileCommand;
}(IprojBlockEditor, jQuery));
