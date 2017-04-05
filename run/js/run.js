/**
 * Created by yy on 2016/3/31.
 */
(function ($) {
    $.fn.run = function (options) {
        options = $.extend({}, $.fn.run.options, options);
        var skewing, timer;
        $(options.cloneBox).append($(options.imgBox).html());   //克隆HTML
        var skewing = parseInt($(options.imgBox).css("left"));//偏移位置
        var imgWidth = $(options.imgBox + " li").width();   //单个图片宽度
        var imgLength = $(options.imgBox + " li").length;   //图片个数
        var imgMargin = parseInt($(options.imgBox + " li").eq(1).css("marginLeft"));  //外边距
        var sumWidth=imgWidth * imgLength + (imgLength - 1) * imgMargin;
        $(options.imgBox).width(sumWidth);    //设置Ul的中宽度
        $(options.cloneBox).css({"width":sumWidth,"left":sumWidth});

        //判断图片个数
        if (imgLength > options.imgNum) {
            //定时器
            function move() {
                return function () {
                    clearInterval(timer);
                    timer = setInterval(function () {
                        //当当前偏移位置小于等于5张图片时设置为起点，否则当前偏移位置加上它的宽度和外边距
                        skewing = skewing <= -imgWidth * (imgLength - options.imgNum) - (imgLength - options.imgNum) * imgMargin ? 0 : skewing -= (imgWidth + imgMargin);
                        $(options.imgBox).animate({"left": skewing}, options.changeBtnTime);
                    }, options.time);
                }
            }

            //左右切换
            $(options.changeBtn + " a").on("click", function () {
                if ($(this).index()) {
                    //右点击时：当当前偏移位置小于保留5张图的宽度时设置为0（回到起点），否则当前偏移位置加上它的宽度和外边距
                    skewing = skewing <= -imgWidth * (imgLength - options.imgNum) ? 0 : skewing - imgWidth - imgMargin
                } else {
                    //左点击时：当当前偏移位置大于或等于为0时设置到保留5张图的位置和他们的边距，否则当前偏移位置减去它的宽度和外边距
                    skewing = skewing >= 0 ? -imgWidth * (imgLength - options.imgNum) - imgMargin * (imgLength - options.imgNum) : skewing + imgWidth + imgMargin
                }
                $(options.imgBox).stop().animate({"left": skewing}, options.changeBtnTime);
            });
            //鼠标进入包裹图片区域
            $(options.imgBox).on("mouseover", function () {
                clearInterval(timer);
            });
            //鼠标进入包裹图片区域
            $(options.imgBox).on("mouseout", function () {
                clearInterval(timer)
                move()();
            });
            //鼠标进入点击区域
            $(options.changeBtn + " a").on("mouseover", function () {
                $(options.imgBox).trigger("mouseover");
            })
            //鼠标离开点击区域
            $(options.changeBtn + " a").on("mouseout", function () {
                $(options.imgBox).trigger("mouseout");
            })
            clearInterval(timer)
            move()();
        } else {
            $(options.changeBtn).css("display", "none");
        }

    };
    $.fn.run.options = {
        time: 2000,  //定时时间
        changeBtnTime: 500,  //切换时间
        imgBox: ".ui-cont",  //包裹图片盒子
        cloneBox:".clone",  //克隆的盒子
        changeBtn: ".btn",   //切换按钮
        imgNum: 5    //图片个数
    };
}(jQuery))