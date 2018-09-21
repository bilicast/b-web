'use strict';


var View = require('../../core/view');
var Url = require('../../util/util-url');
var Templates = {
    scope: require('./comment.hbs')
};

var CommentItem = View.extend({

    events: _.extend({}, View.prototype.events, {
        'appended': 'onAppended',
        'click .see_more': 'onClickMore',
        'click .link-fullscreen-popup': 'onClickThumb',
        'click .products_reviews_list_review__comments_link': 'onClickReply',
        'click .comments__new_comment_submit_button': 'onClickSubmit'
    }),

    onAppended: function () {
        var scrollHeight = this.$el.find('.review_message')[0].scrollHeight;
        if (scrollHeight > 57) {
            this.$el.find('.see_more').show();
        } else {
            this.$el.find('.see_more').hide();
        }
    },

    initialize: function (model) {
        this.model = model;
        return this;
    },

    render: function () {
        return Templates.scope(this.model);
    },

    onClickMore: function () {
        this.$el.find('.see_more').hide();
        this.$el.find('.review_message').css({'max-height': 'inherit'});
    },

    onClickThumb: function () {
        this.trigger('thumbSelected', this.model);
        return this;
    },

    onClickReply: function (event) {
        if (!!event) event.preventDefault();
        this.$el.find('.comments__new_name_input').val('');
        this.$el.find('.comments__new_comment_input').val('');
        if (this.$el.find('.comments').hasClass('hidden')) {
            this.$el.find('.comments').removeClass('hidden');
            this.trigger('replySelected', {target: this.$el.find('.comments__list'), parentPostId: this.model.postId});
        } else {
            this.$el.find('.comments').addClass('hidden');
        }

        return this;
    },

    onClickSubmit: function (event) {
        if (!!event) event.preventDefault();
        var name = this.$el.find('.comments__new_name_input').val();
        var text = this.$el.find('.comments__new_comment_input ').val();

        if ($.trim(name).length == 0 || $.trim(text).length == 0) {
            alert("用戶名稱和評論不能為空");
            return;
        }

        this.trigger('submitSelected', {
            target: this.$el.find('.comments__list'),
            parentPostId: this.model.postId,
            userName: name,
            text: text
        });

        this.$el.find('.comments__new_name_input').val('');
        this.$el.find('.comments__new_comment_input').val('');
    },
});

module.exports = CommentItem;