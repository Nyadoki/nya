(function($) {
    var	$window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $header = $('#header'),
        $footer = $('#footer'),
        $main = $('#main'),
        $main_articles = $main.children('article');

    breakpoints({
        xlarge:   [ '1281px',  '1680px' ],
        large:    [ '981px',   '1280px' ],
        medium:   [ '737px',   '980px'  ],
        small:    [ '481px',   '736px'  ],
        xsmall:   [ '361px',   '480px'  ],
        xxsmall:  [ null,      '360px'  ]
    });

    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    var $nav = $header.children('nav'),
        $nav_li = $nav.find('li');
    if ($nav_li.length % 2 == 0) {
        $nav.addClass('use-middle');
        $nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');
    }
})(jQuery);