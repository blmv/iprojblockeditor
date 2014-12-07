/*jslint browser: true */

;(function(ns, $) {
	'use strict';

	var Editor = function(options) {
		this.options = $.extend({}, this.defaultOptions, options);
		this.$element = $(this.options.element);
		this.focusedBlock = null;

		this.toolbars = [];

		this.init();
	};

	Editor.aliases = {
		'newblock': 'IprojBlockEditor.NewBlockToolbar',
		'arrangeblock': 'IprojBlockEditor.ArrangeBlockToolbar',
		'text': 'IprojBlockEditor.TextBlock',
		'embed': 'IprojBlockEditor.EmbedBlock',
		'image': 'IprojBlockEditor.ImageBlock',
		'articlecut': 'IprojBlockEditor.ArticlecutBlock'
	};

	Editor.resolveObjectName = function(name) {
		if (typeof name !== 'string') {
			return name;
		}

		if (Editor.aliases[name]) {
			name = Editor.aliases[name];
		}

		return Editor.parseDotNameToObject(name);
	};

	Editor.parseDotNameToObject = function(name, baseObject) {
		if (typeof name !== 'string') {
			return name;
		}

		if (baseObject === undefined) {
			baseObject = window;
		}
		var c = name.split('.'),
			n;

		var o = baseObject;
		while (n = c.shift()) {
			if (!o[n]) {
				throw 'Invalid object name ' + name;
			}
			o = o[n];
		}

		return o;
	};

	$.extend(Editor.prototype, {
		defaultOptions: {
			'dataPrefix': '__iproj_editor_',
			'classPrefix': 'iproj-editor',
			'classFocusedBlock': 'iproj-editor-block-focused',

			'toolbars': ['newblock', 'arrangeblock'],
			'toolbarOptions': {
				'newblock': {
					'blocks': ['text', 'embed', 'image', 'articlecut']
				}
			},
			'blockOptions': {
			}
		},
		init: function() {
			var that = this;

			this.$element
				.addClass(this.options.classPrefix)
				.children('.article-block').each(function() {
					var type = this.className.match(/article-block-(\S+)/)[1];
					that.initBlock(this, type, {});
				});

			this.options.toolbars.forEach(function(type) {
				var C = Editor.resolveObjectName(type);
				var tb = new C({editor: that}, that.options.toolbarOptions[type] || {});
				that.toolbars.push(tb);
			});

			if (this.isEmpty()) {
				this.addBlock('text', {focusOnEmpty: false});
			}
		},

		getNextBlock: function(block) {
			var $el = block.$element.next('.article-block');
			if ($el.length > 0) {
				return $el.data(this.options.dataPrefix + 'block');
			}
			return undefined;
		},

		getPrevBlock: function(block) {
			var $el = block.$element.prev('.article-block');
			if ($el.length > 0) {
				return $el.data(this.options.dataPrefix + 'block');
			}
			return undefined;
		},

		focusOnBlock: function(block) {
			if (this.focusedBlock) {
				this.focusedBlock.onBlur();
				this.focusedBlock.$element.removeClass(this.options.classFocusedBlock);
			}

			if (block) {
				this.toolbars.forEach(function(toolbar) {
					toolbar.showForBlock(block);
				});
				block.$element.addClass(this.options.classFocusedBlock);
				block.onFocus();
			} else {
				this.toolbars.forEach(function(toolbar) {
					toolbar.hide();
				});
			}

			this.focusedBlock = block;
		},

		removeEmptyBlocks: function() {
			var that = this;
			this.$element.children('.article-block').each(function() {
				var block = $(this).data(that.options.dataPrefix + 'block');
				if (block.isEmpty()) {
					if (block === that.focusedBlock) {
						var $prev = block.$element.prev('.article-block');
						that.focusOnBlock($prev.length > 0 ? $prev.data(that.options.dataPrefix + 'block') : null);
					}
					block.remove();
				}
			});
		},

		initBlock: function(element, type, options) {
			var typeClass = type.substr(0, 1).toUpperCase() + type.substr(1) + 'Block';

			var block = new Editor[typeClass]();

			var that = this;

			$(element)
				.data(this.options.dataPrefix + 'block', block)
				.on('mouseenter', function() {
					that.focusOnBlock(block);
				});

			block.init(this, element, $.extend(this.options.blockOptions[type] || {}, options));

			return block;
		},

		addBlock: function(type, options, afterElement) {
			var $el = $('<div class="article-block article-block-' + type + '">');
			if (afterElement) {
				$(afterElement).after($el);
			} else {
				this.$element.prepend($el);
			}

			this.initBlock($el.get(0), type, options);
		},

		isEmpty: function() {
			return this.$element.children('.article-block').length === 0;
		},

		toHtml: function() {
			var html = '';
			var that = this;
			this.$element.children('.article-block').each(function() {
				html += $(this).data(that.options.dataPrefix + 'block').toHtml();
			});
			return html;
		},
	});

	ns.IprojBlockEditor = Editor;
}(window, jQuery));
