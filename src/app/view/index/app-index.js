global.jQuery = global.$ = require('jquery');
global._ = require('underscore');

var View = require('../../core/view');
var Model = require('../../model/model-index');
var GalleryItem = require('./gallery/gallery');
var Pagination = require('./pagination/pagination');
var Templates = {
    scope: require('./popup/page.hbs')
};

var $this;
var pagination;

$(function () {
    var Index = View.extend({
        el: $('.reviews_gallery'),

        events: {
            'paginationSelected .pagination': 'onSelectPagination',
        },

        initialize: function () {
            $this = this;
            this._model = new Model();
            this.$el.find('.reviews_index_reviews').css('max-width', $(window).width());
            this.render();
            return this;
        },

        render: function () {
            this.renderGallery(1);
        },

        iframeLoaded: function () {
            var iframe = $(window.parent.document).find("#reviews-index");
            if (iframe) {
                var height = $(document).height() + 30;
                iframe.height(height);
            }
        },

        renderGallery: function (current) {
            this._model._gallery.currentPage = current;

            this._model.requestGalleryReviews(_.bind(function () {
                var tags = '';
                var items = [];

                _.each(this._model.getGalleryCurrentItems(), _.bind(function (item, index) {

                    var galleryItem = new GalleryItem(item);
                    galleryItem.on('reviewSelected', _.bind(this.onSelectReview, this));
                    items.push(galleryItem);

                    tags += galleryItem.render();
                }, this));

                this.$el.find('.reviews_index_reviews').html(tags);

                _.each(items, _.bind(function (gallery) {
                    gallery.setElement(this.$el.find('.reviews_index_reviews').find('li[data-gallery-id=' + gallery.model.postId + ']'));
                }, this));

                this.renderFooter();
                this.iframeLoaded();
            }, this));

            return this;
        },

        onSelectReview: function (data) {
            this._model.setStorage("post", JSON.stringify(data));
            /*var url = "/popup/?iframe_id=fullscreen-popup";
             this.$el.remove('#fullscreen-popup');
             this.$el
             .append(Templates.scope({url: url}));*/
            var iframe = $(window.parent.document).find("#fullscreen-popup");
            if (iframe) {
                $(iframe).attr('src', 'https://review.aikaa.tw/popup/?iframe_id=fullscreen-popup');
                $(iframe).css({'display': 'block', 'z-index': '99999999'});
            }
        },

        onSelectPagination: function (event, data) {
            this.renderGallery(data.index);
        },

        closePopup: function () {
            this.$el.remove('#fullscreen-popup');
        },

        renderFooter: function () {
            var currentPage = this._model.getGalleryCurrentPage();
            var totalpage = this._model.getGalleryTotaltPage();

            if (!this.pagination) {
                this.pagination = new Pagination(totalpage, currentPage);
            } else {
                this.pagination.update(totalpage, currentPage);
            }

        },

    });
    new Index();
});