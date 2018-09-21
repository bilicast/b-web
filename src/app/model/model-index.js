'use strict';

var format = require('util').format;
var Url = require('../util/util-url');
var Format = require('../util/util-format');
var ModelCore = require('../core/model');
var $this = null;

var ModelIndex = ModelCore.extend({
    initialize: function (callback) {
        this._gallery = {
            items: [],
            currentPage: 1,
            limit: 5,
            totalPage: 0,
            process: false,
            enable: true,
        }

        this._super.apply(this, arguments);
    },

    requestGalleryReviews: function (callback) {
        var data = this._gallery;
        if (!data.process && data.enable) {
            data.process = true;

            var params = {
                page: data.currentPage - 1,
                pageSize: data.limit
            }
        }

        this.ajaxAPI('/v1/reviews', params, _.bind(function (res) {
            data.items = res.postList;
            data.items = _.each(res['postList'], function (item, index) {
                item['createTime'] = Format.toDate(item['createTime']);
                item['userName'] = Format.toEncode(item['userName']);
                var star = '';
                if (item['score']) {
                    item['productAvgScore'] = Format.toDecimal(item['productAvgScore']);
                    for (var i = 0; i < item['score']; i++) {
                        star += '<span class="star"></span>';
                    }
                }
                item.star = star;
            });
            data.currentPage = res.page + 1;
            data.totalPage = res.totalPages;
            callback && callback();

            data.process = false;
            data.enable = true;
        }, this));

    },

    getGalleryCurrentItems: function () {
        return this._gallery.items;
    },

    getGalleryCurrentPage: function () {
        return this._gallery.currentPage;
    },

    getGalleryTotaltPage: function () {
        return this._gallery.totalPage;
    }
});

module.exports = function (callback) {
    if (!$this) $this = new ModelIndex(callback);
    return $this;
};