/*
 * MultiSelect v0.9.12
 * Copyright (c) 2012 Louis Cuny
 *
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details.
 */

!function ($) {

    "use strict";


    class MultiSelect {

        constructor(select, options) {
            this.$select = $(select);
            this.options = options;

            this.$newSelect = $('<div/>', {'class': "new_select"});
            this.$selectableContainer = $('<div/>', {'class': 'SELECT-selectable'});
            this.$selectionContainer = $('<div/>', {'class': 'SELECT-selection'});
            this.$selectableUl = $('<ul/>', {'class': "SELECT-list", 'tabindex': '-1'});
            this.$selectionUl = $('<ul/>', {'class': "SELECT-list", 'tabindex': '-1'});
            this.scrollTo = 0;
            this.elemsSelector = 'li:visible:not(.SELECT-optgroup-label,.SELECT-optgroup-container,.' + options.disabledClass + ')';

        }

        //core de start
        init() {
            var SELECT = this.$select;
            var $_this = this;

            if (SELECT.next('.new_select').length === 0) {
                this.create_new_select();
                
                this.activeMouse();
               this.activeKeyboard();
               this.activeClick();
               
                SELECT.on('focus', function () {
                    $_this.$selectableUl.focus();
                });


            }

            var selectedValues = SELECT.find('option:selected').map(function () {
                return $(this).val()
            }).get();
            this.select(selectedValues, 'init');

            if (typeof this.options.afterInit === 'function') {
                $_this.options.afterInit.call(this, this.$newSelect);
            }
        }


        create_new_select() {
            var SELECT = this.$select;


            //SELECT.css({position: 'absolute', top: '10px'});
            SELECT.attr('id', (SELECT.attr('id') ? SELECT.attr('id') : Math.ceil(Math.random() * 1000) + 'idRandomMultiselect'));
            this.$newSelect.attr('id', 'SELECT-' + SELECT.attr('id')).addClass(this.options.cssClass);

            SELECT.find('option').each((index, item) => {
            
                this.generateLisFromOption(item);  // option de select  initiale de select 
            });

            this.$selectionUl.find('.SELECT-optgroup-label').hide();
             this.generateHeaderContainerFooter();
            SELECT.after(this.$newSelect);

        }
        
        generateLisFromOption(option, index, $newSelect) {
            var $_this = this,SELECT = this.$select,attributes = "",$option = $(option);
             
            for (var cpt = 0; cpt < option.attributes.length; cpt++) {
                var attr = option.attributes[cpt];
                   
                if (attr.name !== 'value' && attr.name !== 'disabled') {
                    attributes += attr.name + '="' + attr.value + '" ';
                    
                }
            }
            
            var selectableLi = $('<li ' + attributes + '><span>' + this.escapeHTML($option.text()) + '</span></li>'),
                    selectedLi = selectableLi.clone(),
                    value = $option.val(),
                    elementId = this.sanitize(value);



            selectableLi
                    .data('SELECT-value', value)
                    .addClass('SELECT-elem-selectable')
                    .attr('id', elementId + '-selectable');

            selectedLi
                    .data('SELECT-value', value)
                    .addClass('SELECT-elem-selection')
                    .attr('id', elementId + '-selection')
                    .hide();
            
            if ($option.prop('disabled') || SELECT.prop('disabled')) {
                selectedLi.addClass($_this.options.disabledClass);
                selectableLi.addClass($_this.options.disabledClass);
            }

            var $optgroup = $option.parent('optgroup');

//            if ($optgroup.length > 0) {
//                var optgroupLabel = $optgroup.attr('label'),
//                        optgroupId = $_this.sanitize(optgroupLabel),
//                        $selectableOptgroup = $_this.$selectableUl.find('#optgroup-selectable-' + optgroupId),
//                        $selectionOptgroup = $_this.$selectionUl.find('#optgroup-selection-' + optgroupId);
//
//                if ($selectableOptgroup.length === 0) {
//                    var optgroupContainerTpl = '<li class="SELECT-optgroup-container"></li>',
//                            optgroupTpl = '<ul class="SELECT-optgroup"><li class="SELECT-optgroup-label"><span>' + optgroupLabel + '</span></li></ul>';
//
//                    $selectableOptgroup = $(optgroupContainerTpl);
//                    $selectionOptgroup = $(optgroupContainerTpl);
//                    $selectableOptgroup.attr('id', 'optgroup-selectable-' + optgroupId);
//                    $selectionOptgroup.attr('id', 'optgroup-selection-' + optgroupId);
//                    $selectableOptgroup.append($(optgroupTpl));
//                    $selectionOptgroup.append($(optgroupTpl));
//                    if ($_this.options.selectableOptgroup) {
//                        $selectableOptgroup.find('.SELECT-optgroup-label').on('click', function () {
//                            var values = $optgroup.children(':not(:selected, :disabled)').map(function () {
//                                return $(this).val();
//                            }).get();
//                            $_this.select(values);
//                        });
//                        $selectionOptgroup.find('.SELECT-optgroup-label').on('click', function () {
//                            var values = $optgroup.children(':selected:not(:disabled)').map(function () {
//                                return $(this).val();
//                            }).get();
//                            $_this.deselect(values);
//                        });
//                    }
//                    $_this.$selectableUl.append($selectableOptgroup);
//                    $_this.$selectionUl.append($selectionOptgroup);
//                }
//                index = index === undefined ? $selectableOptgroup.find('ul').children().length : index + 1;
//                selectableLi.insertAt(index, $selectableOptgroup.children());
//                selectedLi.insertAt(index, $selectionOptgroup.children());
//            } else
//            {
                index = index === undefined ? $_this.$selectableUl.children().length : index;

                selectableLi.insertAt(index, $_this.$selectableUl);
                selectedLi.insertAt(index, $_this.$selectionUl);
//            }
        }
        
        generateHeaderContainerFooter(){
           if (this.options.selectableHeader) {
                this.$selectableContainer.append(this.options.selectableHeader);
            }
            this.$selectableContainer.append(this.$selectableUl);
            if (this.options.selectableFooter) {
                this.$selectableContainer.append(this.options.selectableFooter);
            }

            if (this.options.selectionHeader) {
                this.$selectionContainer.append(this.options.selectionHeader);
            }
            this.$selectionContainer.append(this.$selectionUl);
            
            if (this.options.selectionFooter) {
                this.$selectionContainer.append(this.options.selectionFooter);
            }

            this.$newSelect.append(this.$selectableContainer);
            this.$newSelect.append(this.$selectionContainer); 
        }
        
        
        
        
        
        
        
        
        select(value, method) {

            if (typeof value === 'string') {
                value = [value];

            }

            var $_this = this,
                    SELECT = this.$select,
                    msIds = $.map(value, function (val) {
                        return($_this.sanitize(val));
                    }),
                    selectables = this.$selectableUl.find('#' + msIds.join('-selectable, #') + '-selectable').filter(':not(.' + $_this.options.disabledClass + ')'),
                    selections = this.$selectionUl.find('#' + msIds.join('-selection, #') + '-selection').filter(':not(.' + $_this.options.disabledClass + ')'),
                    options = SELECT.find('option:not(:disabled)').filter(function () {
                return($.inArray(this.value, value) > -1);
            });

            if (method === 'init') {
                selectables = this.$selectableUl.find('#' + msIds.join('-selectable, #') + '-selectable'),
                        selections = this.$selectionUl.find('#' + msIds.join('-selection, #') + '-selection');
            }

            if (selectables.length > 0) {
                selectables.addClass('SELECT-selected').hide();
                selections.addClass('SELECT-selected').show();

                options.prop('selected', true);

                $_this.$newSelect.find($_this.elemsSelector).removeClass('SELECT-hover');

//                var selectableOptgroups = $_this.$selectableUl.children('.SELECT-optgroup-container');
//                if (selectableOptgroups.length > 0) {
//                    selectableOptgroups.each(function () {
//                        var selectablesLi = $(this).find('.SELECT-elem-selectable');
//                        if (selectablesLi.length === selectablesLi.filter('.SELECT-selected').length) {
//                            $(this).find('.SELECT-optgroup-label').hide();
//                        }
//                    });
//
//                    var selectionOptgroups = $_this.$selectionUl.children('.SELECT-optgroup-container');
//                    selectionOptgroups.each(function () {
//                        var selectionsLi = $(this).find('.SELECT-elem-selection');
//                        if (selectionsLi.filter('.SELECT-selected').length > 0) {
//                            $(this).find('.SELECT-optgroup-label').show();
//                        }
//                    });
//                } else {
                    if ($_this.options.keepOrder && method !== 'init') {
                        var selectionLiLast = $_this.$selectionUl.find('.SELECT-selected');
                        if ((selectionLiLast.length > 1) && (selectionLiLast.last().get(0) != selections.get(0))) {
                            selections.insertAfter(selectionLiLast.last());
                        }
                    }
//                }
                if (method !== 'init') {
                    SELECT.trigger('change');
                    if (typeof $_this.options.afterSelect === 'function') {
                        $_this.options.afterSelect.call(this, value);
                    }
                }
            }
        }
        
        sanitize(value) {
            // string to nombre
            var hash = 0, ascii;
            if (value.length == 0)
                return 0;
            
            for (var i = 0; i < value.length; i++) {
                
                ascii = value.charCodeAt(i);
                hash = ((hash << 5) - hash) + ascii;
                hash |= 0; // Convert to 32bit integer
            }

            return hash;
        }

        addOption(options) {
            var $_this = this;

            if (options.value !== undefined && options.value !== null) {
                options = [options];
            }
            $.each(options, function (index, option) {
                if (option.value !== undefined && option.value !== null &&
                        $_this.$select.find("option[value='" + option.value + "']").length === 0) {
                    var $option = $('<option value="' + option.value + '">' + option.text + '</option>'),
                            $newSelect = option.nested === undefined ? $_this.$select : $("optgroup[label='" + option.nested + "']"),
                            index = parseInt((typeof option.index === 'undefined' ? $newSelect.children().length : option.index));

                    if (option.optionClass) {
                        $option.addClass(option.optionClass);
                    }

                    if (option.disabled) {
                        $option.prop('disabled', true);
                    }

                    $option.insertAt(index, $newSelect);
                    $_this.generateLisFromOption($option.get(0), index, option.nested);
                }
            });
        }

        escapeHTML(text) { /// <h1>awa</h1> to &lt;h1&gt;awa&lt;/h1&gt;
            return $("<div>").text(text).html();
        }

        moveHighlight($list, direction) {
            var $elems = $list.find(this.elemsSelector),
                    $currElem = $elems.filter('.SELECT-hover'),
                    $nextElem = null,
                    elemHeight = $elems.first().outerHeight(),
                    containerHeight = $list.height(),
                    containerSelector = '#' + this.$newSelect.prop('id');

            $elems.removeClass('SELECT-hover');
            if (direction === 1) { // DOWN

                $nextElem = $currElem.nextAll(this.elemsSelector).first();
                if ($nextElem.length === 0) {
                    var $optgroupUl = $currElem.parent();

                    if ($optgroupUl.hasClass('SELECT-optgroup')) {
                        var $optgroupLi = $optgroupUl.parent(),
                                $nextOptgroupLi = $optgroupLi.next(':visible');

                        if ($nextOptgroupLi.length > 0) {
                            $nextElem = $nextOptgroupLi.find(this.elemsSelector).first();
                        } else {
                            $nextElem = $elems.first();
                        }
                    } else {
                        $nextElem = $elems.first();
                    }
                }
            } else if (direction === -1) { // UP

                $nextElem = $currElem.prevAll(this.elemsSelector).first();
                if ($nextElem.length === 0) {
                    var $optgroupUl = $currElem.parent();

                    if ($optgroupUl.hasClass('SELECT-optgroup')) {
                        var $optgroupLi = $optgroupUl.parent(),
                                $prevOptgroupLi = $optgroupLi.prev(':visible');

                        if ($prevOptgroupLi.length > 0) {
                            $nextElem = $prevOptgroupLi.find(this.elemsSelector).last();
                        } else {
                            $nextElem = $elems.last();
                        }
                    } else {
                        $nextElem = $elems.last();
                    }
                }
            }
            if ($nextElem.length > 0) {
                $nextElem.addClass('SELECT-hover');
                var scrollTo = $list.scrollTop() + $nextElem.position().top -
                        containerHeight / 2 + elemHeight / 2;

                $list.scrollTop(scrollTo);
            }
        }

        selectHighlighted($list) {
            var $elems = $list.find(this.elemsSelector),
                    $highlightedElem = $elems.filter('.SELECT-hover').first();

            if ($highlightedElem.length > 0) {
                if ($list.parent().hasClass('SELECT-selectable')) {
                    this.select($highlightedElem.data('SELECT-value'));
                } else {
                    this.deselect($highlightedElem.data('SELECT-value'));
                }
                $elems.removeClass('SELECT-hover');
            }
        }

        switchList($list) {
            $list.blur();
            this.$newSelect.find(this.elemsSelector).removeClass('SELECT-hover');
            if ($list.parent().hasClass('SELECT-selectable')) {
                this.$selectionUl.focus();
            } else {
                this.$selectableUl.focus();
            }
        }

        refresh() {
            this.destroy();
            this.$select.multiSelect(this.options);
        }

        destroy() {
            $("#SELECT-" + this.$select.attr("id")).remove();
            this.$select.off('focus');
            this.$select.css('position', '').css('left', '');
            this.$select.removeData('multiselect');
        }

        deselect(value) {
            if (typeof value === 'string') {
                value = [value];
            }

            var $_this = this,
                    SELECT = this.$select,
                    msIds = $.map(value, function (val) {
                        return($_this.sanitize(val));
                    }),
                    selectables = this.$selectableUl.find('#' + msIds.join('-selectable, #') + '-selectable'),
                    selections = this.$selectionUl.find('#' + msIds.join('-selection, #') + '-selection').filter('.SELECT-selected').filter(':not(.' + $_this.options.disabledClass + ')'),
                    options = SELECT.find('option').filter(function () {
                return($.inArray(this.value, value) > -1);
            });

            if (selections.length > 0) {
                selectables.removeClass('SELECT-selected').show();
                selections.removeClass('SELECT-selected').hide();
                options.prop('selected', false);

                $_this.$newSelect.find($_this.elemsSelector).removeClass('SELECT-hover');

                var selectableOptgroups = $_this.$selectableUl.children('.SELECT-optgroup-container');
//                if (selectableOptgroups.length > 0) {
//                    selectableOptgroups.each(function () {
//                        var selectablesLi = $(this).find('.SELECT-elem-selectable');
//                        if (selectablesLi.filter(':not(.SELECT-selected)').length > 0) {
//                            $(this).find('.SELECT-optgroup-label').show();
//                        }
//                    });
//
//                    var selectionOptgroups = $_this.$selectionUl.children('.SELECT-optgroup-container');
//                    selectionOptgroups.each(function () {
//                        var selectionsLi = $(this).find('.SELECT-elem-selection');
//                        if (selectionsLi.filter('.SELECT-selected').length === 0) {
//                            $(this).find('.SELECT-optgroup-label').hide();
//                        }
//                    });
//                }
                SELECT.trigger('change');
                if (typeof $_this.options.afterDeselect === 'function') {
                    $_this.options.afterDeselect.call(this, value);
                }
            }
        }

        select_all() {
            var SELECT = this.$select,
                    values = SELECT.val();

            SELECT.find('option:not(":disabled")').prop('selected', true);
            this.$selectableUl.find('.SELECT-elem-selectable').filter(':not(.' + this.options.disabledClass + ')').addClass('SELECT-selected').hide();
            this.$selectionUl.find('.SELECT-optgroup-label').show();
            this.$selectableUl.find('.SELECT-optgroup-label').hide();
            this.$selectionUl.find('.SELECT-elem-selection').filter(':not(.' + this.options.disabledClass + ')').addClass('SELECT-selected').show();
            this.$selectionUl.focus();
            SELECT.trigger('change');
            if (typeof this.options.afterSelect === 'function') {
                var selectedValues = $.grep(SELECT.val(), function (item) {
                    return $.inArray(item, values) < 0;
                });
                this.options.afterSelect.call(this, selectedValues);
            }
        }

        deselect_all() {
            var SELECT = this.$select,
                    values = SELECT.val();

            SELECT.find('option').prop('selected', false);
            this.$selectableUl.find('.SELECT-elem-selectable').removeClass('SELECT-selected').show();
            this.$selectionUl.find('.SELECT-optgroup-label').hide();
            this.$selectableUl.find('.SELECT-optgroup-label').show();
            this.$selectionUl.find('.SELECT-elem-selection').removeClass('SELECT-selected').hide();
            this.$selectableUl.focus();
            SELECT.trigger('change');
            if (typeof this.options.afterDeselect === 'function') {
                this.options.afterDeselect.call(this, values);
            }
        }
        
        
        //event list
        activeClick() {
            var $_this = this;
            var action = this.options.dblClick ? 'dblclick' : 'click';

            this.$selectableUl.on(action, '.SELECT-elem-selectable', function () {
                $_this.select($(this).data('SELECT-value'));
            });
            this.$selectionUl.on(action, '.SELECT-elem-selection', function () {
                $_this.deselect($(this).data('SELECT-value'));
            });

        }
        activeMouse() {
            var elemsSelector = this.elemsSelector;

            this.$newSelect.on('mouseenter', elemsSelector, function () {
                $(this).parents('.new_select').find(elemsSelector).removeClass('SELECT-hover');
                $(this).addClass('SELECT-hover');
            });

            this.$newSelect.on('mouseleave', elemsSelector, function () {
                $(this).parents('.new_select').find(elemsSelector).removeClass('SELECT-hover');
            });
        }
        activeKeyboard() {
            var $_this = this;

            this.$selectionUl.on('focus', function () {
                $(this).addClass('SELECT-focus');
            })
                    .on('blur', function () {
                        $(this).removeClass('SELECT-focus');
                    })
                    .on('keydown', function (e) {
                        switch (e.which) {
                            case 40:
                            case 38:
                                e.preventDefault();
                                e.stopPropagation();
                                $_this.moveHighlight($(this), (e.which === 38) ? -1 : 1);
                                return;
                            case 37:
                            case 39:
                                e.preventDefault();
                                e.stopPropagation();
                                $_this.switchList($_this.$selectionUl);
                                return;
                            case 9:
                                if ($_this.$select.is('[tabindex]')) {
                                    e.preventDefault();
                                    var tabindex = parseInt($_this.$select.attr('tabindex'), 10);
                                    tabindex = (e.shiftKey) ? tabindex - 1 : tabindex + 1;
                                    $('[tabindex="' + (tabindex) + '"]').focus();
                                    return;
                                } else {
                                    if (e.shiftKey) {
                                        $_this.$select.trigger('focus');
                                    }
                                }
                        }
                        if ($.inArray(e.which, $_this.options.keySelect) > -1) {
                            e.preventDefault();
                            e.stopPropagation();
                            $_this.selectHighlighted($_this.$selectionUl);
                            return;
                        }
                    });
                    
            this.$selectableUl.on('focus', function () {
                $(this).addClass('SELECT-focus');
            })
                    .on('blur', function () {
                        $(this).removeClass('SELECT-focus');
                    })
                    .on('keydown', function (e) {
                        switch (e.which) {
                            case 40:
                            case 38:
                                e.preventDefault();
                                e.stopPropagation();
                                $_this.moveHighlight($(this), (e.which === 38) ? -1 : 1);
                                return;
                            case 37:
                            case 39:
                                e.preventDefault();
                                e.stopPropagation();
                                $_this.switchList($_this.$selectableUl);
                                return;
                            case 9:
                                if ($_this.$select.is('[tabindex]')) {
                                    e.preventDefault();
                                    var tabindex = parseInt($_this.$select.attr('tabindex'), 10);
                                    tabindex = (e.shiftKey) ? tabindex - 1 : tabindex + 1;
                                    $('[tabindex="' + (tabindex) + '"]').focus();
                                    return;
                                } else {
                                    if (e.shiftKey) {
                                        $_this.$select.trigger('focus');
                                    }
                                }
                        }
                        if ($.inArray(e.which, $_this.options.keySelect) > -1) {
                            e.preventDefault();
                            e.stopPropagation();
                            $_this.selectHighlighted($_this.$selectableUl);
                            return;
                        }
                    });        
        }

    }


    /* MULTISELECT PLUGIN DEFINITION
     * ======================= */

    $.fn.multiSelect = function (option, args) {


        return this.each(function () {
            var $this = $(this),
                    options = $.extend(
                            {},
                            {
                                keySelect: [32],
                                selectableOptgroup: false,
                                disabledClass: 'disabled',
                                dblClick: false,
                                keepOrder: false,
                                cssClass: ''
                            },
                            $this.data(),
                            typeof option === 'object' && option   //// console.log(false|true && 'wassim')
                            ),
                    OB_MultiSelect = $(this).data('multiselect');

            if (!OB_MultiSelect) {
                OB_MultiSelect = new MultiSelect(this, options)
                $(this).data('multiselect', (OB_MultiSelect))
            }

            if (typeof option === 'string') {
                OB_MultiSelect[option](args);
            } else {
                OB_MultiSelect.init();
            }
        });
    };



    $.fn.multiSelect.Constructor = MultiSelect;

    $.fn.insertAt = function (index, $parent) {
        return this.each(function () {
            if (index === 0) {
                $parent.prepend(this);
            } else {
                $parent.children().eq(index - 1).after(this);
            }
        });
    };

}(window.jQuery);
