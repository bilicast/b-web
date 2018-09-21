(function ($) {

    resizeIndexIframe();
    addCommentPage();

    $(window).resize(function () {
        resizeIndexIframe();
    });

    function resizeIndexIframe() {
        var index = $("#reviews-index").contents().find("body").height() + 10;
        $("#reviews-index").height(index);

        var comment = $("#reviews-comment").contents().find("body").height() + 10;
        $("#reviews-comment").height(comment);

    }

    function addCommentPage() {
        var url = window.location.href;
        $('#reviews-comment').attr('src', 'https://review.arrr.tw/review/index.html?productUrl=' + encodeURIComponent(url));
    }


})(jQuery);