
(function($, window) {
    function jQMustache(target, viewData) {
        this.$target = $(target);
        this.viewData = viewData;
        this.partials = {};
        this.promisesPool = [];//Partial loading promises container
        this.loadedCount = 0;//Loaded partials count
        var templateLocation = this.$target.attr('data-source');
        if (this.$target.attr('data-hide')) {
            this.$target.hide();
        }
        this.loaded = false;//Indicates wether the template (incl. partials) is fully loaded or not
        this.$target.on('template-loaded', this.render.bind(this));
        if (typeof(templateLocation) != 'undefined' && templateLocation.length > 0) {
            $.get(templateLocation).done(function(template) {
                if (this.$target.text().length > 0) {
                    this.template = template+this.$target.text();
                } else {
                    this.template = template;
                }
                Mustache.parse(this.template);
                this.loadPartials(this.template);
            }.bind(this));
        } else {
            this.template = $(target).text();
            Mustache.parse(this.template);
            this.loadPartials(this.template);
        }
    }

    jQMustache.prototype.loadPartials = function(template) {//Load eventuals mustache partials
        var RegPartials = new RegExp("\{\{>\\s*([^{}>]+)\\s*\}\}", 'g');
        var partials = RegPartials.exec(template);
        if (partials && partials.length > 0) {//If template partial contains sub-partials
            for (var i = 1;i < partials.length;i++) {
                this.promisesPool.push(
                    $.get(partials[i]+'.mustache').done(function(name, partial) {//Load found partial
                        this.partials[name] = partial;//Add loaded partial to the partials object
                        Mustache.parse(this.partials[name]);
                        this.loadedCount++;
                        this.loadPartials(partial);
                    }.bind(this, partials[i]))
                );
            }
        } else if (this.promisesPool.length == this.loadedCount) {//When all partials have been loaded
            this.$target.trigger('template-loaded');
        }
    };

    jQMustache.prototype.render = function() {//Renders loaded mustache template
        this.$target.trigger('template-rendered');
        this.$target.html(
            Mustache.render(this.template, this.viewData, this.partials)
        );
        this.$target.show();
    };

    $.fn.Mustache = function(data) {
        $(this).each(function() {//Loop on each tav navigation targeted element
            //One instance per target so it will act as a namespace
            if (typeof this.jQMustache == 'undefined') {
                this.jQMustache = new jQMustache(this, data);
            } else {
                this.jQMustache.viewData = data;
                this.jQMustache.render();
            }
        });
    };

    window.jQMustache = jQMustache;
})($, window);
