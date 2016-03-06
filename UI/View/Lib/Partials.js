'use strict';

module.exports = Partials;

function Partials() {

}

Emitter(Partials.prototype);

Partials.prototype.renderAll = function() {
    $('[data-partial]').each(function(index, element) {
        var partialPath = $(element).attr('data-partial');
        if ($(element).attr('data-hide')) {
            $(element).hide();
        }
        if (partialPath.length > 0) {
            $.get(partialPath).done(function(template) {
                $(element).html(template);
                $(element).removeAttr('data-partial');
                $(element).removeAttr('data-hide');
                this.emit('partial-loaded', element, partialPath);
                $(element).trigger('partial-loaded');
                $(element).show();
            }.bind(this));
        }
    }.bind(this));
};
