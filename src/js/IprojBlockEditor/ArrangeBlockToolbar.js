/*jslint browser: true */
/*global jQuery, IprojBlockEditor */

;(function(ns, $) {
	'use strict';

	var ArrangeBlockToolbar = function(context, options) {
		this.defaultOptions = $.extend(this.defaultOptions, {
			buttons: [
				{name: 'up', icon: 'up-big', command: 'IprojBlockEditor.CallMethodCommand', commandOptions: {method: 'blockUp', object: this}},
				{name: 'down', icon: 'down-big', command: 'IprojBlockEditor.CallMethodCommand', commandOptions: {method: 'blockDown', object: this}},
				{name: 'remove', icon: 'cancel', command: 'IprojBlockEditor.CallMethodCommand', commandOptions: {method: 'blockRemove', object: this}}
			]
		});
		ns.BlockToolbar.apply(this, [context, options]);
		this.$element.addClass(this.options.baseCssClass + '-arrange-block');
		this.$up = this.$element.find(this.options.baseCssClass + '-icon-up');
		this.$down = this.$element.find(this.options.baseCssClass + '-icon-down');
	};

	ArrangeBlockToolbar.prototype = Object.create(ns.BlockToolbar.prototype);

	$.extend(ArrangeBlockToolbar.prototype, {
		showForBlock: function(block) {
			ns.BlockToolbar.prototype.showForBlock.apply(this, [block]);

			var prev = this.editor.getPrevBlock(block), next = this.editor.getNextBlock(block);
			this.$up.toggle(!!prev);
			this.$down.toggle(!!next);
			this.$element.toggle(!!(prev || next));
		},

		blockHtml: function() {
			window.alert(this.editor.toHtml());
		},

		blockUp: function() {
			var block = this.editor.focusedBlock;
			if (!block) {
				return;
			}
			var prev = this.editor.getPrevBlock(block);
			if (prev) {
				prev.$element.insertAfter(block.$element);
				this.editor.focusOnBlock(block);
			}
		},

		blockDown: function() {
			var block = this.editor.focusedBlock;
			if (!block) {
				return;
			}
			var next = this.editor.getNextBlock(block);
			if (next) {
				next.$element.insertBefore(block.$element);
				this.editor.focusOnBlock(block);
			}
		},

		blockRemove: function() {
			var block = this.editor.focusedBlock;
			if (!block) {
				return;
			}
			block.remove();
			this.editor.focusOnBlock(null);
		}
	});

	ns.ArrangeBlockToolbar = ArrangeBlockToolbar;
}(IprojBlockEditor, jQuery));

