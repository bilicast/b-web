global.jQuery = global.$ = require('jquery');
global._ = require('underscore');

var Url = require('url').parse(window.location.href, true);
var View = require('../../core/view');
var Model = require('../../model/model-popup');
var Templates = {
    product: require('./product.hbs'),
    comment: require('./comment.hbs'),
    reply: require('./reply.hbs'),
    thumbnail: require('./thumbnail.hbs'),
    popup: require('./popup-review.hbs')
};

var $this;

$(function () {
    var Popup = View.extend({
        el: $('.photo_review_popup'),

        events: {
            'click .comments__new_comment_submit_button': 'onSelectSubmit',
            'click .sprites-circle-close-button': 'onSelectClose',
            'click .review_top__show_review_detail': 'onSelectDetail',
            'click .topbar_close_button': 'onSelectDetailClose'
        },

        initialize: function () {
            $this = this;

            this.$el.find("#photo-popup-content").css({"height": this.$el.find(".fullscreen_popup").height() - 140});
            this.$el.find('#photo-popup-container').show();
            this._model = new Model(_.bind(function () {
                console.log("initialize");
                this.render();

            }, this));

            return this;
        },

        render: function () {
            this.$el.find("#message-container").css({"height": this.$el.find("#review-contents-container").height() - 120});
            console.log("render: ");
            console.log("render: " + this._model._postData);
            console.log("render: " + this._model.getPostData());
            var data = this._model.getPostData();
            this._model._galleryChild.parentPostId = data.postId;
            this.$el.find(".show_photo_review__photos_container").html(Templates.thumbnail(data));
            this.$el.find(".show_photo_review__info_container").html(Templates.product(data));
            this.$el.find(".show_photo_review__all_messages").html(Templates.comment(data));
            this.$el.find("#review-photo-popup-review-summary").html(Templates.popup(data));
            this.renderChildGallery();
        },

        renderChildGallery: function () {
            this._model.requestGalleryChildReviews(_.bind(function () {
                var tags = '';
                var items = [];

                _.each(this._model.getGalleryChildItems(), _.bind(function (item, index) {

                    var child = Templates.reply(item);
                    items.push(child);

                    tags += child;
                }, this));

                this.$el.find('.comments__list').html(tags);
            }, this));

            return this;
        },

        onSelectSubmit: function () {

            var name = $('.comments__new_name_input').val();
            var text = $('.comments__new_comment_input ').val();

            if ($.trim(name).length == 0 || $.trim(text).length == 0) {
                alert("用戶名稱和評論不能為空");
                return;
            }
            var params = {
                userName: name,
                parentPostId: this._model.getPostData().postId,
                postDepth: '1',
                text: text,
                productUrl: this._model.getPostData().productUrl,
                originalProductId: this._model.getPostData().originalProductId
            }

            this._model.createReviewPost(params, _.bind(function (data, error) {
                if (!error) {
                    this.$el.find('.comments__list').append(Templates.reply(data));
                    $('.comments__new_name_input').val('');
                    $('.comments__new_comment_input ').val('');
                }
            }, this));
        },

        onSelectClose: function () {
            window.parent.$('body').find('#fullscreen-popup').attr('src', '');
            window.parent.$('body').find('#fullscreen-popup').css('display', 'none');
        },

        onSelectDetail: function () {
            this.$el.find('.show_photo_review__review_contents_container').show();
            this.$el.find('.fullscreen_popup__close').hide();
        },

        onSelectDetailClose: function () {
            this.$el.find('.show_photo_review__review_contents_container').hide();
            this.$el.find('.fullscreen_popup__close').show();
        }

    });
    new Popup();
});