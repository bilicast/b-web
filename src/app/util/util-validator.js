'use strict';

var UtilValidator = {
    isMobile: function () {
        return !!window.navigator.userAgent.match(/iPhone|iPod|iPad|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson|LG|SAMSUNG|Samsung/i) ? true : false;
    },

    isIOS: function () {
        return !!window.navigator.userAgent.match(/iPhone|iPod|iPad/) ? true : false;
    },

    getIOSVersion: function () {
        var ua = window.navigator.userAgent;
        var version = -1;

        if (ua.match(/iP(hone|od|ad)/)) {
            version = parseFloat(String(ua.match(/[0-9]_[0-9]/)).split('_')[0] + '.' + String(ua.match(/[0-9]_[0-9]/)).split('_')[1]);
        }

        return version;
    },

    getChromeVersion: function () {
        return window.navigator.appVersion.match(/Chrome\/\d+.\d+/)[0].split('/')[1];
    },

    getPlatform: function () {
        var type = '';
        var pf = String(navigator.platform).toLowerCase();

        if (!!~pf.indexOf('macintel')) {
            type = 'mac';
        } else if (!!~pf.indexOf('linux i686') || !!~pf.indexOf('linux armv7l')) {
            type = 'linux';
        }

        return type;
    },

    getBrowser: function () {
        var type = '';
        var ua = String(navigator.userAgent).toLowerCase();

        if (!!~ua.indexOf('chrome')) {
            type = 'chrome';
        } else if (!!~ua.indexOf('safari') || !!~ua.indexOf('applewebkit/5')) {
            type = 'safari';
        } else if (!!~ua.indexOf('firefox')) {
            type = 'firefox';
        } else if (!!~ua.indexOf('opera')) {
            type = 'opera';
        } else {
            type = 'msie';
        }

        return type;
    }
};

module.exports = UtilValidator;