/**
 * Created by yy on 2016/4/27.
 */
tabSth:function () {
    var count = 0;

    var trigger = $('.tab-nav').find('.nav-title'),
        tabBox = $('.J-tab-box');

    var tabCont = $('.tab-content').width();

    var tabLength = $('.tab-content').length;

    var statue = true;

    var timer = null;

    tabBox.css({width: tabCont * tabLength});

    function play() {
        timer = setInterval(function () {
            count++;
            if (count == tabLength) {
                count = 0;
            }
            trigger.removeClass('cur');
            trigger.eq(count).addClass('cur');
            tabBox.css({left: -tabCont * count});
        }, 7000)
    }

    play();
    console.log(trigger);
    tirgger.each(function(index){
        var _this = $(this);
        _this.mouseover(function () {
            clearInterval(timer);
            if (statue == true) {
                statue = false;
                setTimeout(function () {
                    statue = true;
                }, 100)
            }
            _this.addClass('cur').siblings().removeClass('cur');
            tabBox.css({left: -tabCont * $(this).index()});
        })
    })
    $.each(trigger, function (index) {
        var _this = $(this);
        _this.mouseover(function () {
            clearInterval(timer);
            if (statue == true) {
                statue = false;
                setTimeout(function () {
                    statue = true;
                }, 100)
            }
            _this.addClass('cur').siblings().removeClass('cur');
            tabBox.css({left: -tabCont * $(this).index()});
        })
    });
    $.each(trigger, function (index) {
        var _this = $(this);
        _this.mouseout(function () {
            count = $(this).index();
            play();
        })
    });

    tabBox.mouseover(function () {
        clearInterval(timer);
    });
    tabBox.mouseout(function () {
        play();
    })
}
,