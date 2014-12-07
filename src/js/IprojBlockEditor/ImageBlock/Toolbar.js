/*jslint browser: true */
/*global IprojBlockEditor, jQuery */

;(function(ns, $) {
	'use strict';

	var Toolbar = function(context, options) {
		this.block = context.block;
		ns.BlockMenuToolbar.apply(this, [context, options]);

		this.addButton({name: 'wide', icon: 'resize-horizontal', command: ns.ImageBlock.WideBlockClassCommand, commandOptions: {$blockElement: context.block.$element}});
		this.addButton({name: 'top-text', icon: 'image-text-top', command: ns.ImageBlock.CreateTextBlockCommand, commandOptions: {block: context.block, type: 'top-text'}});
		this.addButton({name: 'bottom-text', icon: 'image-text-bottom', command: ns.ImageBlock.CreateTextBlockCommand, commandOptions: {block: context.block, type: 'bottom-text'}});
		this.addButton({name: 'caption', icon: 'image-caption', command: ns.ImageBlock.CreateTextBlockCommand, commandOptions: {block: context.block, type: 'caption'}});
		this.addButton({name: 'link', command: ns.ImageBlock.LinkCommand, commandOptions: {block: context.block, toolbar: this}});
		this.addButton({name: 'image', command: ns.SelectFileCommand, commandOptions: {
			$toolbarContainer: this.$buttons,
			inputAttributes: {
				accept: 'image/*'
			},
			fileHandler: function(file) {
				context.block.insertImage(file);
			}
		}});

	};

	Toolbar.prototype = Object.create(ns.BlockMenuToolbar.prototype);

	ns.ImageBlock.Toolbar = Toolbar;
}(IprojBlockEditor, jQuery));
