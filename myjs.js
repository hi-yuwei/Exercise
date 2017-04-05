/**
 * Created by yy on 2016/6/15.
 */
var run = {
    donfun: function () {
        this.play();
    },
    play: function () {
        var num = 1;
        var showBox = $('.list-box'), about = $('.Works-list'), next = $('.next'), prev = $('.prev');
        var liL = showBox.children().length, aboutL = about.children().length;
        $('.cunt').html(liL);
        $('.current').html(num);
        showBox.append(showBox.html());
        about.append(about.html());
        var liWidth = showBox.children().outerWidth(true), aboutWidth = about.children().outerWidth(true);
        var liLength = showBox.children().length, aboutLength = about.children().length;
        var Left = -liWidth * liL;
        var aboutLeft = -aboutWidth * aboutL;
        showBox.css({'width': liWidth * liLength, 'left': Left});
        about.css({'width': aboutWidth * aboutLength, 'left': aboutLeft});


        next.on('click', function () {
            if (!showBox.is(':animated')) {
                Left -= liWidth;
                showBox.animate({'left': Left}, 500, function () {
                    if (Left === (1 - liLength) * liWidth) {
                        Left = -liWidth * (liL - 1);
                        showBox.css('left', Left);
                    }
                })
                num++;
                if (num > liL) {
                    num = 1;
                }
                $('.current').html(num);
            }
            if (!about.is(':animated')) {
                aboutLeft -= aboutWidth;
                about.animate({'left': aboutLeft}, 500, function () {
                    if (aboutLeft === (1 - aboutLength) * aboutWidth) {
                        aboutLeft = -aboutWidth * (aboutL - 1);
                        about.css('left', aboutLeft);
                    }
                })
            }
        })

        prev.on('click', function () {
            if (!showBox.is(':animated')) {
                Left += liWidth;
                showBox.animate({'left': Left}, 500, function () {
                    if (Left === 0) {
                        Left = -liWidth * liL;
                        showBox.css('left', Left);
                    }
                })
                num--;
                if (num < 1) {
                    num = liL;
                }
                $('.current').html(num);
            }
            if (!about.is(':animated')) {
                aboutLeft += aboutWidth;
                about.animate({'left': aboutLeft}, 500, function () {
                    if (aboutLeft === 0) {
                        aboutLeft = -aboutWidth * aboutL;
                        about.css('left', aboutLeft);
                    }
                })
            }
        })


    }
}