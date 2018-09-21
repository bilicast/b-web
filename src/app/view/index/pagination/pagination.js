'use strict';

var View = require('../../../core/view');
var Templates = {
    scope: require('./pagination.hbs')
};

var $this;

var Pagination = View.extend({
    el: $('div.pagination'),

    events: _.extend({}, View.prototype.events, {
        'click a.pagination_button': 'onClickPagination'
    }),

    onClickPagination: function (event) {
        event.preventDefault();
        var index = 0;

        if ($(event.currentTarget).hasClass("pagination_button_prev")) {
            index = $this._current - 1;
        } else if ($(event.currentTarget).hasClass("pagination_button_next")) {
            index = $this._current + 1;

        } else if ($(event.currentTarget).hasClass("pagination_button_active")) {
            //nothing
        } else {
            index = $(event.currentTarget).attr('target-id');
        }

        // console.log(index);
        if (index > 0 && index <= $this._pageCount) {
            this.$el.trigger('paginationSelected', {
                index: index
            });
        }
        return this;
    },


    initialize: function (pageCount, current) {
        this._pageCount = pageCount || 1;
        this._current = current || 1;
        this._count = 4;

        $this = this;

        this.render();

        return this;
    },

    update: function (pageCount, current) {
        this._pageCount = pageCount || 1;
        this._current = current || 1;
        this.render();
    },

    render: function () {
        var template = '';
        var prevData = {
            active: false,
            isPrev: true,
            isNext: false,
            number: '<'
        };

        template += Templates.scope(prevData);

        var start = this._current > this._count - 1 ? this._current + this._count - 1 > this._pageCount ? this._current - (this._count - (this._pageCount - this._current)) : this._current - 2 : 1;
        var end = this._current + this._count - 1 > this._pageCount ? this._pageCount : start + this._count;
        for (; start <= end; start++) {
            var data = '';
            if (start == this._current) {
                data = {
                    active: true,
                    isPrev: false,
                    isNext: false,
                    number: start
                };
            } else {
                data = {
                    active: false,
                    isPrev: false,
                    isNext: false,
                    number: start
                };
            }
            template += Templates.scope(data);
        }

        var nextData = {
            active: false,
            isPrev: false,
            isNext: true,
            number: '>'
        };

        template += Templates.scope(nextData);

        this.$el
            .html(template).show();

        return this;
    }
});

module.exports = Pagination;
