'use strict';

var format = require('util').format;
var Format = require('../util/util-format');
var Url = require('../util/util-url');
var Time = require('../util/util-time');
var ModelCore = require('../core/model');
var $this = null;

var ModelPopup = ModelCore.extend({
    initialize: function (callback) {

        this._galleryChild = {
            items: [],
            parentPostId: 0,
            page: 0,
            pageSize: 20,
            process: false,
            enable: true,
        };

        this._postData = JSON.parse(this.getStorage("post"));
        console.log( this._postData);
        this._super.apply(this, arguments);
    },

    getPostData: function () {
        return this._postData;
    },

    requestGalleryChildReviews: function (callback) {
        var data = this._galleryChild;
        if (!data.process && data.enable) {
            data.process = true;

            var params = {
                page: data.page,
                pageSize: data.pageSize,
                parentPostId: data.parentPostId
            }
        }

        this.ajaxAPI(format('/v1/reviews/%s/children', params.parentPostId), params, _.bind(function (res) {
            data.items = _.each(res['postList'], function (item, index) {
                item['userName'] = Format.toEncode(item['userName']);
            });
            data.items = res['postList'];
            data.page = res.page;
            callback && callback();

            data.process = false;
            data.enable = true;
        }, this));

    },

    createReviewPost: function (params, callback) {
        this.ajaxAPI('/v1/reviews', params, _.bind(function (res, error) {
            if (!error) {
                res.userName = Format.toEncode(res.userName);
            }
            callback && callback(res, error);
        }, this), 'POST');
    },

    getGalleryChildItems: function () {
        return this._galleryChild.items;
    },
});

module.exports = function (callback) {
    if (!$this) $this = new ModelPopup(callback);
    return $this;
};