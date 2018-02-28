
(function () {
    //smoothscroll
    var scroll = new SmoothScroll('a[href*="#"]');

    //jarallax
    $('.jarallax').jarallax({
        speed: 0.5
    });
    //navbar menu collapse, click link
    function collapse() {
        $('.navbar-toggler').trigger('click');
    };
    function menuCollapse() {
        if ($('.navbar-toggler').css('display') != 'none') {
            $('.nav-link').not(".dropdown-toggle").on('click', collapse);
        }
    };
    menuCollapse();
    //navbar background, initial hide
    function check() {
        var cur = $(window).scrollTop();
        if (cur < 10) {
            $('#mainNav').addClass('topped');
        } else {
            $('#mainNav').removeClass('topped');
        }
    };
    check();
	$(window).on('scroll', check);
    //welcome background
    var a = $('#welcome');
    $('#games').coinslider({
        width: a.width(),
        height: a.height(),
        effect: 'rain',
		delay:5000,
		sDelay:50,
        navigation: false,
        showNavigationPrevNext: false,
        showNavigationButtons: false
    });
    //calendar
    $('.calendar .day').eq(new Date().getDay()).addClass('today');
    //google map, using staticmaps api solely as check to see if able to contact google maps
    $.ajax({
        type: "GET",
        url: "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyA6n9TddgFAZoDo0VxS7Dat9yjAk4vaUkg&q=place_id:ChIJ6bdT8S4z3YAR_pFGWkNROco&size=1x1",
        timeout: "500",
        cache: false,
        success: function (data) {
            $('iframe').show();
        },
        error: function (textStatus, errorThrown) {
            $('iframe').hide();
        }
    });
})();