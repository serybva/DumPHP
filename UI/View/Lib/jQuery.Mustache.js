
(function($, window) {

    function jQMustache(target, viewData) {
        this.$target = $(target);
        this.viewData = viewData;
        this.partials = {};
        var templateLocation = this.$target.attr('data-source');
        if (this.$target.attr('data-hide')) {
            this.$target.hide();
        }
        this.loaded = false;//Indicates wether the template (incl. partials) is fully loaded or not
        if (typeof(templateLocation) != 'undefined' && templateLocation.length > 0) {
            $.get(templateLocation).done(function(template) {
                if (this.$target.html().length > 0) {
                    this.template = template+this.$target.html();
                } else {
                    this.template = template;
                }
                this.loadPartials(this.template);
            }.bind(this));
        } else {
            this.template = $(target).html();
            this.loadPartials(this.template);
        }
    }

    jQMustache.prototype.loadPartials = function(template) {//Load eventuals mustache partials
        var RegPartials = new RegExp("\{\{>\\s*([^{}>]+)\\s*\}\}", 'g');
        var partials = RegPartials.exec(template);
        if (partials && partials.length > 0) {//If template partial contains sub-partials
            for (var i = 1;i < partials.length;i++) {
                $.get(partials[i]+'.mustache').done(function(name, partial) {//Load found partial
                    this.partials[name] = partial;//Add loaded partial to the partials object
                    this.loadPartials(partial);
                }.bind(this, partials[i]));
            }
        } else {
            this.loaded = true;
        }
    };

    jQMustache.prototype.render = function() {//Renders loaded mustache template
        if (this.loaded) {//If template was fully loaded

        } else {//Watch state otherwise

        }
    };

    jQMustache.prototype.render = function() {//Renders loaded mustache template
    };

    $.fn.Mustache = function(data) {
        $(this).each(function() {//Loop on each tav navigation targeted element
            //One instance per target so it will act as a namespace
            this.jQMustache = new jQMustache(this, data);
        });
    };

    window.jQMustache = jQMustache;
})($, window);
