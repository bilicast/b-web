global.jQuery = global.$ = require('jquery');
global._ = require('underscore');
require('lrz');

var Url = require('url').parse(window.location.href, true);
var View = require('../../core/view');
var Model = require('../../model/model-review');
var Pagination = require('../index/pagination/pagination')
var CommentItem = require('./comment');
var Templates = {
    preview: require('./uploadImage.hbs'),
    page: require('../index/popup/page.hbs'),
    reply: require('../popup/reply.hbs'),
};
var $this;
var pagination;

$(function () {
    var Popup = View.extend({
        el: $('.reviews'),

        events: {
            'click .review_form_add_image_container': 'openImage',
            'change input.review-image-file': 'changeImage',
            'click .image_field__remove_preview_text': 'onClickRemove',
            'click .review_form_submit': 'onClickSubmit',
            'click a#sort_time': 'onClickTime',
            'click a#sort_score': 'onClickScore',
            'change .review_form__select_rating': 'onStarSelected',
            'paginationSelected .pagination': 'onSelectPagination',
        },

        initialize: function () {
            $this = this;

            this.article = {
                userName: null,
                postDepth: 0,
                isClientTempPhoto: false,
                tempImageUrl: null,
                text: ''
            };

            this._model = new Model(_.bind(function () {
                this.render();

            }, this));

            return this;
        },

        render: function () {
            var productUrl = Url.query['productUrl'];
            var originalProductId = Url.query['originalProductId'];
            this._model._gallery.productUrl = productUrl;
            this._model._gallery.originalProductId = originalProductId;
            this.renderComments(1);
        },

        iframeLoaded: function () {
            var iframe = $(window.parent.document).find("#reviews-comment");
            if (iframe) {
                var height = $(document).height() + 30;
                iframe.height(height);
            }
        },

        onClickTime: function (event) {
            if (!!event) event.preventDefault();
            this.$el.find('.products_reviews_header__sort_type strong').html('最新');
            this._model._gallery.currentPage = 1;
            this._model._gallery.sort = 'TIME';
            this.renderComments(1);
        },

        onClickScore: function (event) {
            if (!!event) event.preventDefault();
            this.$el.find('.products_reviews_header__sort_type strong').html('評分');
            this._model._gallery.currentPage = 1;
            this._model._gallery.sort = 'SCORE';
            this.renderComments(1);
        },

        onSelectPagination: function (event, data) {
            this.renderComments(data.index);
        },

        renderComments: function (current) {
            this.iframeLoaded();
            this._model._gallery.currentPage = current;

            this._model.requestReviewsList(_.bind(function () {
                var tags = '';
                var items = [];


                var productInfo = this._model.getProductInfo();
                this.$el.find('#score1').html(productInfo.score1Count);
                this.$el.find('#score2').html(productInfo.score2Count);
                this.$el.find('#score3').html(productInfo.score3Count);
                this.$el.find('#score4').html(productInfo.score4Count);
                this.$el.find('#score5').html(productInfo.score5Count);
                this.$el.find('#percentile1').css({width: productInfo.percentile1});
                this.$el.find('#percentile2').css({width: productInfo.percentile2});
                this.$el.find('#percentile3').css({width: productInfo.percentile3});
                this.$el.find('#percentile4').css({width: productInfo.percentile4});
                this.$el.find('#percentile5').css({width: productInfo.percentile5});

                this.$el.find('.reviews-count').html(productInfo.productReviewCount);
                this.$el.find('.score_summary__reviews_count').html(productInfo.productReviewCount + ' 評論');
                this.$el.find('.score_summary__average').html(productInfo.productAvgScore);


                if (this._model.getReviewCurrentItems()) {
                    _.each(this._model.getReviewCurrentItems(), _.bind(function (item, index) {

                        var comment = new CommentItem(item);
                        comment.on('thumbSelected', _.bind(this.onSelectThumb, this));
                        comment.on('replySelected', _.bind(this.onSelectedReply, this));
                        comment.on('submitSelected', _.bind(this.onSelectedSubmit, this));
                        items.push(comment);

                        tags += comment.render();
                    }, this));

                    this.$el.find('.reviews-product').html(tags);

                    _.each(items, _.bind(function (comment) {
                        comment.setElement(this.$el.find('.reviews-product').find('li[data-comment-id=' + comment.model.postId + ']'));
                    }, this));

                    this.renderFooter();
                } else {
                    this.$el.find('.widget_reviews__message--no_data').show();
                }
                this.iframeLoaded();
            }, this));

            return this;
        },

        openImage: function (event) {
            this.$('input.review-image-file').trigger('click');
        },

        changeImage: function (event) {
            var reader = new FileReader();
            reader.onload = _.bind(function () {
                var file = event.target.files[0];
                var quality = 1;
                if (file.size > 1 * 1024 * 1024) {
                    quality = 0.7;
                }
                var width = 720;

                if (file.type == 'image/gif') {
                    $this.renderPreview(reader.result);
                    $this.article.isClientTempPhoto = true;
                    $this.article.tempImageUrl = reader.result;
                } else {
                    lrz(file, {width: width, quality: quality})
                        .then(function (rst) {
                            $this.renderPreview(rst.base64);
                            $this.article.isClientTempPhoto = true;
                            $this.article.tempImageUrl = rst.base64;
                        })
                        .catch(function (err) {
                            Popup.alert({
                                title: 'error',
                                description: 'Please upload again...',
                                showTitle: true
                            });
                        });
                }
            }, this);
            reader.readAsDataURL(event.target.files[0]);
        },

        renderPreview: function (code) {
            this.$el.find(".image_fields_container").html(Templates.preview({code: code}));
            this.$el.find(".review_form__input_photos").show();
            this.iframeLoaded();
        },

        onClickRemove: function () {
            this.$el.find(".image_fields_container").html('');
            this.$el.find(".review_form__input_photos").hide();
            this.article.isClientTempPhoto = false;
            this.article.tempImageUrl = '';
            this.iframeLoaded();
        },

        clearSubmitData: function () {
            $('.review_new_name_input').val('');
            $('.review_form_message ').val('');
            this.$el.find(".image_fields_container").html('');
            this.$el.find(".review_form__input_photos").hide();
            this.article.isClientTempPhoto = false;
            this.article.tempImageUrl = '';
        },

        onClickSubmit: function () {
            var name = $('.review_new_name_input').val();
            var text = $('.review_form_message ').val();
            var score = $(".review_form__select_rating").find("option:selected").val();

            if ($.trim(name).length == 0 || $.trim(text).length == 0) {
                alert("用戶名稱和評論不能為空");
                return;
            }
            var params = {
                userName: name,
                isClientTempPhoto: this.article.isClientTempPhoto,
                tempImageUrl: this.article.tempImageUrl,
                postDepth: '0',
                text: text,
                productUrl: this._model._gallery.productUrl,
                originalProductId: this._model._gallery.originalProductId,
                score: score
            }

            this._model.createReviewPost(params, _.bind(function (data, error) {
                if (!error) {
                    this._model._gallery.sort = 'TIME';
                    this.renderComments(1);
                }
            }, this));

            this.clearSubmitData();
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

        onSelectThumb: function (data) {
            this._model.setStorage("post", JSON.stringify(data));
            //fullscreen-popup
            var iframe = $(window.parent.document).find("#fullscreen-popup");
            if (iframe) {
                $(iframe).attr('src', 'https://review.aikaa.tw/popup/?iframe_id=fullscreen-popup');
                $(iframe).css({'display': 'block', 'z-index': '99999999'});
            }

            /*var url = "/popup/?iframe_id=fullscreen-popup";
             this.$el
             .find('.popup_container').html(Templates.page({url: url}));*/
        },

        onSelectedReply: function (data) {
            var params = {
                page: 0,
                pageSize: 20,
                parentPostId: data.parentPostId,

            };

            this._model.requestCommentChildList(params, _.bind(function (res) {
                var tags = '';
                var items = [];
                _.each(res, _.bind(function (item, index) {

                    var child = Templates.reply(item);
                    items.push(child);
                    tags += child;
                }, this));

                $(data.target).html(tags);
                this.iframeLoaded();
            }, this));

            return this;
        },

        onSelectedSubmit: function (data) {
            var params = {
                userName: data.userName,
                parentPostId: data.parentPostId,
                postDepth: '1',
                text: data.text,
                productUrl: this._model._gallery.productUrl,
                originalProductId: this._model._gallery.originalProductId,
            }

            this._model.createReviewPost(params, _.bind(function (res, error) {
                if (!error) {
                    $(data.target).append(Templates.reply(res));
                    this.iframeLoaded();
                }
            }, this));
        },

        onStarSelected: function () {
            var star = this.$el.find('#review_score').val();
            var html = '';
            for (var i = 0; i < star; i++) {
                html += '<span class="star"></span>';
            }

            html += '<span class="text">' + this.$el.find('#review_score').find("option:selected").text() + '</span>';
            this.$el.find('.select2-chosen .item').html(html);
        }

    });
    new Popup();
});