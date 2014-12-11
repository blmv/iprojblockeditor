/*jslint browser: true */
/*global jQuery, IprojBlockEditor */

;(function(ns, $) {
	'use strict';

	var BaseToolbar = function(context, options) {
		this.hotkeys = {};
		this.context = context;
		this.options = $.extend(true, {}, this.defaultOptions, options);

		this.$element = $('<div class="' + this.options.baseCssClass+ '"><div class="' + this.options.baseCssClass+ '-inner"></div></div>').hide().appendTo('body');
		this.$buttons = this.$element.children();

		this._render();
	};

	BaseToolbar.prototype = {
		defaultOptions: {
			buttons: [],
			baseCssClass: 'iproj-editor-toolbar'
		},
		_createCommand: function(name, options) {
			var cmd;
			if (typeof name === 'object') {
				cmd = name;
			} else {
				var Cl;
				if (typeof name === 'function') {
					Cl = name;
				} else {
					if (name.substr(-7) !== 'Command') {
						throw 'Invalid command name ' + name;
					}
					Cl = ns.parseDotNameToObject(name);
				}
				cmd = new Cl(options);
			}
			return cmd;
		},

		_runCommand: function(cmd) {
			cmd.run();
		},

		getButton: function(name) {
			return $('.' + this.options.baseCssClass + '-button-' + name, this.$buttons);
		},

		getCommand: function(name) {
			return this.getButton(name).data('command');
		},

		addButton: function(button) {
			button = $.extend(true, {
				commandOptions: {},
				text: ''
			}, button);
			var cmd = this._createCommand(button.command, button.commandOptions);

			if (button.hotkey) {
				this.hotkeys[button.hotkey] = cmd;
			}

			if (button.name) {
				var cl = button.className || ('iproj-editor-icon-' + (button.icon ? button.icon : button.name));
				var $el = $('<i>', {
				  'class': this.options.baseCssClass + '-button ' + this.options.baseCssClass + '-button-' + button.name + ' ' + cl,
				  'title': button.text || button.name
				}).data('command', cmd).text(button.text).appendTo(this.$buttons);

				var that = this;

				$(cmd).on('stateChange', {$element: $el}, function(e, isActive) {
					that.updateButtonStatus(e.data.$element, isActive);
				});
			}
		},

		_render: function() {
			var that = this;
			this.options.buttons.forEach(function(button) {
				that.addButton(button);
			});

			this.$buttons.on('click', '.' + this.options.baseCssClass + '-button', function(e) {
				e.preventDefault();
				that._runCommand($(this).data('command'));
			});

			//$(this.editor.element).on('mouseup keyup', function() {
				//that.toggle();
			//});
		},

		onKeyPress: function(e) {
			if (!e.shiftKey && !e.altKey && (e.ctrlKey || e.metaKey)) {
				var cmd = this.hotkeys[String.fromCharCode(e.which).toLowerCase()];
				if (cmd) {
					e.preventDefault();
					this._runCommand(cmd);
				}
			}
		},

		updateButtonStatus: function($button, isActive) {
			$button.toggleClass('active', isActive);
		},

		updateAllButtonsStatus: function() {
			this.$buttons.find('.'+this.options.baseCssClass + '-button').each(function() {
				$(this).toggleClass('active', $(this).data('command').isApplied());
			});
		},

		showOnPosition: function(x, y) {
			var css = {};
			if (x !== undefined) {
				css.left = x;
			}
			if (y !== undefined) {
				css.top = y;
			}
			this.$element
				.css(css)
				.show();

			this.updateAllButtonsStatus();
			$(this).triggerHandler('show');
		},

		hide: function() {
			this.$element.hide();
			$(this).triggerHandler('hide');
		},

		destroy: function() {
			this.$element.remove();
		}
	};

	ns.BaseToolbar = BaseToolbar;
}(IprojBlockEditor, jQuery));
