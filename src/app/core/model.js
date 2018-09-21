'use strict';

require('jquery.cookie');

var format = require('util').format;
var Url = require('../util/util-url');
var Class = require('../util/util-class');

var ModelCore = Class.extend({
    initialize: function (callback) {
        this._channel = null;
        this._hello = null;

        this.requestHello(callback);
    },

    requestHello: function (callback) {
        if (!this.getStorage('HELLO')) {
            this.ajaxAPI('/v1/hello', null, _.bind(function (res) {
                this.setHello('Hello');

                callback && callback();
            }, this));
        } else {
            this.setHello(JSON.parse(this.getStorage('HELLO')));

            _.delay(function () {
                callback && callback()
            }, 1);
        }
    },

    ajaxAPI: function (url, params, callback, method) {
        $.support.cors = true;

        var _params = params || {};
        var _method = method || 'GET';

        return $.ajax({
            url: this.getDomain() + url,
            headers: {
                'X-REVIEW-CHANNEL': this.getChannel(),
                'X-REVIEW-TOKEN': this.getUserToken()
            },
            dataType: 'json',
            method: _method,
            data: (_method == 'GET') ? _params : JSON.stringify(_params),
            traditional: true,
            crossDomain: true,
            contentType: 'application/json; charset=UTF-8'
        }).always(function (res) {
            var isError = (!!res.responseJSON) ? true : false;
            callback && callback((isError) ? res.responseJSON : res, isError);
        });
    },

    loadScript: function (src, callback) {
        var script = document.createElement('script');

        document.getElementsByTagName('head')[0].appendChild(script);

        script.type = 'text/javascript';
        script.onload = callback;
        script.src = src;
    },

    getStorage: function (key) {
        return window.localStorage[key] || $.cookie(key) || null;
    },

    setStorage: function (key, value) {
        try {
            window.localStorage[key] = value;
        } catch (e) {
            $.cookie(key, value, {expires: 7, path: '/'});
        }
    },

    getDomain: function () {
        return 'https://review.aikaa.tw/';
    },


    getChannel: function () {
        return 'MWEB';
    },

    setHello: function (value) {
        this._hello = 'Hello';

        !this.getStorage('HELLO') && this.setStorage('HELLO', JSON.stringify(value));
    },

    getHello: function () {
        return this._hello || null;
    },

    getCDNUrl: function () {
        return '';
    },

    setUserToken: function (value) {
        this.setStorage('USER_TOKEN', value);
    },

    getUserToken: function () {
        return this.getStorage('USER_TOKEN') || '';
    }
});

module.exports = ModelCore;
