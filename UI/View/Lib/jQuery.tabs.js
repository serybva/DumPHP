
/*
* Simple jQuery plugin to display tab navigation on targeted element.
*
*
* Inspired by http://red-team-design.com/google-play-minimal-tabs-with-css3-jquery/
*
* Author Sébastien Vray <sebastien@serybva.com>
*
*
*
*
*
*/
(function($, window) {

    function Tabs(target, options) {
        options = options || {};
        this.$target = $(target);
        this.$buttons = this.$target.find('[data-target]');
        this.hideAll();
        if (this.$buttons.filter('[data-on]').length === 0) {
            $(this.$buttons.filter(':first-child').attr('data-target')).show().addClass('on');
            this.$buttons.filter(':first-child').addClass('on');
        }
        this.$buttons.each(function(index, button) {
            $button = $(button);
            $button.on('click', function(e) {
                this.$buttons.filter('[data-on]').removeProp('data-on');
                this.hideAll();
                this.$buttons.removeClass('on');
                $(e.currentTarget).addClass('on');
                this.$target.find($(e.currentTarget).attr('data-target')).fadeIn().removeClass('on').addClass('on');
            }.bind(this));
        }.bind(this));
    }

    Tabs.prototype.hash = function() {
        this.$buttons.each(function(index, button) {
            $button = $(button);
            hash = parseInt(Math.random() * Math.pow(10, 18));
            while (this.$buttons.filter('[data-hash="'+hash+'"]').length > 0) {
                hash = parseInt(Math.random() * Math.pow(10, 18));
            }
            $button.attr('data-hash', hash);
        }.bind(this));
    }

    Tabs.prototype.hideAll = function() {
        if (typeof(this.$buttons) !== 'undefined') {
            this.$buttons.each(function(index, button) {
                $button = $(button);
                if (!$button.prop('data-on')) {
                    this.$target.find($button.attr('data-target')).hide();
                } else {
                    $button.removeClass('on').addClass('on');
                }
            }.bind(this));
        }
    }

    $.fn.tabs = function(options) {
        $(this).each(function() {//Loop on each tav navigation targeted element
            //One instance per target so it will act as a namespace
            new Tabs(this, options);
        });
    };

    window.jQueryTabs = Tabs;
})($, window);
