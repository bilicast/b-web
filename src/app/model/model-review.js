'use strict';

var format = require('util').format;
var Url = require('../util/util-url');
var Format = require('../util/util-format');
var ModelCore = require('../core/model');
var $this = null;

var ModelReview = ModelCore.extend({
    initialize: function (callback) {
        $this = this;
        this._gallery = {
            productUrl: '',
            originalProductId: null,
            sort: 'TIME',
            items: [],
            currentPage: 1,
            limit: 20,
            totalPage: 0,
            process: false,
            enable: true,
        },

            this._product = {
                score1Count: '(0)',
                score2Count: '(0)',
                score3Count: '(0)',
                score4Count: '(0)',
                score5Count: '(0)',
                percentile1: '0%',
                percentile2: '0%',
                percentile3: '0%',
                percentile4: '0%',
                percentile5: '0%',
                productReviewCount: 0,
                productAvgScore: 0
            }

        this._super.apply(this, arguments);
    },

    requestReviewsList: function (callback) {
        var data = this._gallery;
        if (!data.process && data.enable) {
            data.process = true;

            var params = {
                page: data.currentPage - 1,
                pageSize: data.limit,
                productUrl: data.productUrl,
                originalProductId: data.originalProductId,
                sort: data.sort
            }
        }

        this.ajaxAPI('/v1/reviews', params, _.bind(function (res) {
            this._product.productReviewCount = res.productReviewCount;
            this._product.productAvgScore = Format.toDecimal(res.productAvgScore);
            this._product.score1Count = Format.toScore(res.score1Count);
            this._product.score2Count = Format.toScore(res.score2Count);
            this._product.score3Count = Format.toScore(res.score3Count);
            this._product.score4Count = Format.toScore(res.score4Count);
            this._product.score5Count = Format.toScore(res.score5Count);
            this._product.percentile1 = Format.toPercent(res.score1Count, res.score1Count, res.score2Count, res.score3Count, res.score4Count, res.score5Count);
            this._product.percentile2 = Format.toPercent(res.score2Count, res.score1Count, res.score2Count, res.score3Count, res.score4Count, res.score5Count);
            this._product.percentile3 = Format.toPercent(res.score3Count, res.score1Count, res.score2Count, res.score3Count, res.score4Count, res.score5Count);
            this._product.percentile4 = Format.toPercent(res.score4Count, res.score1Count, res.score2Count, res.score3Count, res.score4Count, res.score5Count);
            this._product.percentile5 = Format.toPercent(res.score5Count, res.score1Count, res.score2Count, res.score3Count, res.score4Count, res.score5Count);
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

    requestCommentChildList: function (params, callback) {
        this.ajaxAPI(format('/v1/reviews/%s/children', params.parentPostId), params, _.bind(function (res) {
            var postList = _.each(res['postList'], function (item, index) {
                item['userName'] = Format.toEncode(item['userName']);
            });
            callback && callback(postList);
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


    getReviewCurrentItems: function () {
        return this._gallery.items;
    },

    getProductInfo: function () {
        return this._product;
    },

    getGalleryCurrentPage: function () {
        return this._gallery.currentPage;
    },

    getGalleryTotaltPage: function () {
        return this._gallery.totalPage;
    }
});

module.exports = function (callback) {
    if (!$this) $this = new ModelReview(callback);
    return $this;
};