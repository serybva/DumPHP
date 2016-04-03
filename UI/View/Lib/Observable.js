(module||{}).exports = (function(window, exports) {

    function Observable(data, events) {
        this.events = events;
        if (typeof data == 'object') {
            this.wrapObject(data);
        } else if (typeof data != 'function') {
            Object.defineProperty(this, 'a', {
                get: function() {
                    return this._Observed_a;
                },
                set: function(value) {
                    if (typeof this._Observed_a != 'undefined') {//Assume this is not the first affectation
                        this.events.emit('value-changed', this._Observed_a, value);
                    }
                    this._Observed_a = value;
                }.bind(this)
            });
            this.a = data;
        }
    }

    Observable.prototype.set = function(prop, value) {
        if (typeof this['_Observed_'+prop] != 'undefined') {//Assume this is not the first affectation
            this.events.emit('value-changed', this['_Observed_'+prop], value);
        }
        this['_Observed_'+prop] = value;
    }

    Observable.prototype.wrapObject = function(object) {
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                if (typeof object[prop] != 'function') {
                    Object.defineProperty(this, prop, {
                        get: function() {
                            return this['_Observed_'+property];
                        }.bind(this),
                        set: (function(observable, prop) {
                                //Using a closure is mandatory to backup property name
                                //here, otherwise this is the last added prop that
                                //will be modified
                                return function(value) {
                                    this.set(prop, value);
                                }.bind(observable);
                        })(this, prop)
                    });
                    this[prop] = object[prop];
                }
            }
        }
    };

    Observable.prototype.on = function(event, callback) {
        this.events.on(event, callback);
    };

    /**
     * Returns given property value
     *
     * @method function
     * @author Sébastien Vray <sebastien@serybva.com>
     * @param  string prop Name of the property to return
     */
    Observable.prototype.get = function(prop) {
        if (typeof this['_Observed_'+prop] == 'undefined' && typeof this._Observed_a != 'undefined') {
            return this._Observed_a;
        } else if (typeof this['_Observed_'+prop] != 'undefined') {
            return this['_Observed_'+prop];
        }
        return null;
    };

    /**
     * Returns the watched var current value if variable is a scalar,
     * returns an object with the original properties name otherwise
     *
     * @method function
     * @author Sébastien Vray <sebastien@serybva.com>
     * @return object/primitive
     */
    Observable.prototype.originalProps = function() {
        var object = {};
        if (typeof this._Observed_a != 'undefined') {
            return this._Observed_a;
        }
        for (var prop in this) {
            prop = new String(prop);
            if (this.hasOwnProperty(prop) && prop.startsWith('_Observed_')) {
                object[prop.replace('_Observed_', '')] = this[prop];
            }
        }
        return object;
    };

    window.Observable = Observable;
    return Observable;
})(window)
