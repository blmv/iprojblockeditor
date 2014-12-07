/*jslint browser: true */
/*global jQuery, IprojBlockEditor */

;(function(ns, $) {
	'use strict';

	var NewBlockToolbar = function(context, options) {
		var buttons = [];
		var that = this;
		options.blocks.forEach(function(type) {
			buttons.push({name: type, command: ns.CallMethodCommand, commandOptions: {object: that, method: 'createBlock', methodArguments: [type]}});
		});
		options.buttons = buttons;
		ns.BlockToolbar.apply(this, [context, options]);
		this.$element.addClass(this.options.baseCssClass + '-new-block');
	};

	NewBlockToolbar.prototype = Object.create(ns.BlockToolbar.prototype);

	$.extend(NewBlockToolbar.prototype, {
		createBlock: function(type) {
			this.editor.removeEmptyBlocks();
			this.editor.addBlock(type, {}, this.editor.focusedBlock ? this.editor.focusedBlock.$element : undefined);
		}
	});

	ns.NewBlockToolbar = NewBlockToolbar;
}(IprojBlockEditor, jQuery));
