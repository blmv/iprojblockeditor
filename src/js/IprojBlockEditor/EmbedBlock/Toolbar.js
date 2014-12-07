/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var Toolbar = function(context, options) {
		this.block = context.block;
		ns.BlockMenuToolbar.apply(this, [context, options]);

		var that = this;
		this.addButton({name: 'caption', icon: 'image-caption', command: ns.ImageBlock.CreateTextBlockCommand, commandOptions: {block: context.block, type: 'caption'}});
		this.addButton({name: 'embed', command: ns.InputTextCommand, commandOptions: {
			toolbar: this,
			multiline: true,
			getCurrentValue: function() {
				return that.block.getEmbedHtml();
			},
			textHandler: function(text) {
				that.block.setHtml(text);
			}
		}});

	};

	Toolbar.prototype = Object.create(ns.BlockMenuToolbar.prototype);

	ns.EmbedBlock.Toolbar = Toolbar;
}(IprojBlockEditor, jQuery));
