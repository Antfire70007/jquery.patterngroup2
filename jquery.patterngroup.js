(function ($) {
	var currentIndex = 0;
	var _container;
	var itemArray = [];
	function createItem(appendItem) {
		var subItem = $('<div>');
		subItem.append(appendItem);
		subItem.addClass('item');
		return subItem;
	}
	function createRemoveBtn() {
		var removeBtn = $('<div>');
		var icon = $('<div>');
		icon.addClass('delIcon');
		removeBtn.addClass('item');
		removeBtn.append(icon);
		removeBtn.attr('data-idx', currentIndex);
		return removeBtn;
	}
	function calcTotalHeight(item) {
		var height = 0;
		item.children().each(function (idx, data) {
			height += $(data).outerHeight();
		});
		return height;
	}

	function createContainer() {
		var container = $('<div>');
		container.addClass('container').attr('data-role', 'Container');
		var idx = 0;
		var lastItem = $('div[data-role="Container"]').last();
		if (lastItem && typeof lastItem.attr('data-idx') != 'undefined') {
			var index = parseInt(lastItem.attr('data-idx'));
			if (!isNaN(index)) {
				idx = index + 1;
			}
		}
		container.attr('data-idx', idx);

		return container;
	}

	function _add(settings) {
		var container = createContainer();
		var subItem = createItem(settings.pattern);
		container.append(subItem);
		if (settings.showCloseButton) {
			var removeBtn = createRemoveBtn();
			container.append(removeBtn);
		} else {
		}
		var idx = container.attr('data-idx');
		if (settings.target == '') {
			$(_container).append(container);
		} else {
			$(_container).children(settings.target).append(container);
		}
		var margin_top = (removeBtn.parent().outerHeight() - calcTotalHeight(removeBtn)) * 0.5 + 'px';
		removeBtn.css({
			'margin-top' : margin_top
		});
		currentIndex++;
		removeBtn.on('click', 'div', function () {
			var idx = container.attr('data-idx');
			console.log(idx);
			_del(idx);
		});
		$(_container).trigger('added', {
			item : $($(container[0]).children()[0]).children(),
			index : idx
		});
		console.log(itemArray);	
		itemArray.push({index:idx,item:$($(container[0]).children()[0]).children()});
		$.fn.PatternGroup.params.items.push({index:idx,item:$($(container[0]).children()[0]).children()});
		return container;
	}
	function _del(idx) {

		
		for (var i in $.fn.PatternGroup.params.items) {
			if ($.fn.PatternGroup.params.items[i].index == idx) {
				console.log($.fn.PatternGroup.params.items[i].item.parents('.container'));
				$.fn.PatternGroup.params.items[i].item.parents('.container').remove();
				$.fn.PatternGroup.params.items.splice(i, 1);
				return;
			}
		}
	}
	
	var _settings = {};
	$.fn.PatternGroup = function () {
		var args = arguments;
		var defaults = {
			pattern : '<div><input type="text"/></div>',
			target : '',
			index : -1,
			initLength:1,
			maxLength:10,
			showCloseButton : true,
			getData:function(){return $.fn.PatternGroup.params.items;}
		}
		var options = {};
		if (args.length == 0) {
			_settings = $.extend({}, defaults, options);
		}
		if (typeof args[0] === 'object') {
			options = args[0];
			_settings = $.extend({}, defaults, options);
		}
		return this.each(function () {
			_container = this;
		
			if (typeof args[0] === 'string') {
				if (args[0] == 'add') {
					$(this).bind('added', function () {
						return false;
					});
					//var item = _add(_settings);
					return _add(_settings);
				}
				if (args[0] == 'delete') {
					if (!isNaN(parseInt(args[1]))) {
						_del(parseInt(args[1]));
					}
				}
				if(args[0]=='getdata')
				{
					return $.fn.PatternGroup.params.items;
				}
			}
			else
			{
			//	console.log(options);
				if(options.initLength>0)
				{
					for(var i = 0;i<_settings.initLength&&_settings.initLength<=_settings.maxLength;i++)
					{
						_add(_settings);
					}
				}
			}
		});
	}
	$.fn.PatternGroup.params = {
		items:[]
		};
})(jQuery);
