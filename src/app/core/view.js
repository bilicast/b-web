'use strict';

var Backbone = require('backbone');
var Handlebars = require('../lib/handlebars');

var View = Backbone.View.extend({

    _appened: false,

    events: {
    },

    setElement: function (element) {

        var res = Backbone.View.prototype.setElement.call(this, element);

        try {
            if (!this._appened) {
                this._appened = true;
                _.delay(_.bind(function () {
                    this.$el.trigger('appended');
                }, this), 1);
            }
        } catch (e) {
        }

        return res;
    }
});

module.exports = View;
