'use strict';


var View = require('../../../core/view');
var Url = require('../../../util/util-url');
var Templates = {
    scope: require('./gallery.hbs')
};
var GalleryItem = View.extend({

    events: _.extend({}, View.prototype.events, {
        'appended': 'onAppended',
        'click .photo_review_thumbnail': 'onClickReview',
        'click .reviews_index_gallery_review_review_product': 'onClickProduct',
    }),

    onAppended: function () {
    },

    initialize: function (model) {
        this.model = model;
        return this;
    },

    render: function () {
        return Templates.scope(this.model);
    },

    onClickReview: function (event) {
        this.trigger('reviewSelected', this.model);
        return this;
    },

    onClickProduct: function (event) {
        var targetUrl = $(event.currentTarget).attr('data-url');
        Url.open(targetUrl, '_self');
        return this;
    }

});

module.exports = GalleryItem;