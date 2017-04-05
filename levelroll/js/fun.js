(function($){
    $.fn.tabChange=function(options){
        //传进来的配置替换默认配置
        options= $.extend({}, $.fn.tabChange.options,options);
        var liwidth,timer,ondivWidth,ondivLength,sumWidth,imgsbox,arr=[];

        //设置盒子宽度
        function setImgBoxWidth() {
            var imgWidth=$(options.imgBox).find("div").width(); //取一个图片的宽度
            $(options.imgBox).each(function (i) {

                //当前大盒子下div的width*div的个数+外边距的和
                //arr.push($(this).find("div").width() * $(this).find("div").length + ($(this).find("div").length - 1) * 20);
                //解决上面方法在网络慢的情况下，取值错误
                arr.push(imgWidth* $(this).find("div").length + ($(this).find("div").length - 1) * 20);
                $(this).width(arr[i]);  //设置每个栏目图片盒子的宽度
            });
            //设置大盒子的宽度
            $(".imgs-box").width(arr.reduce(function (x, y) {
                return x + y;
            }));
        }

        setImgBoxWidth();

        //自动执行
        var autoplay = (function () {
            play()();
        }());

        //核心
        function play() {
            //闭包
            return function () {
                clearInterval(timer);
                timer = null, sum = 0, ondivLeft = 0; //定时器
                liwidth = $(options.column).width();  //每个栏目的宽度

                ondivWidth = $(options.onImgWrap).width();  //当前图片的宽度
                ondivLength = $(options.onImgWrap).length;  //当前盒子图片的个数
                //sumWidth = ondivWidth * ondivLength + (ondivLength - 1) * 20; //包含图片的大盒子
                //$(".levelroll .levelroll-body .showImg").width(sumWidth);

                //定时器
                function setTime() {
                    timer = setInterval(function () {
                        //总是保留四个的宽度
                        sum = sum <= -ondivWidth * (ondivLength - 4) ? 0 : sum -= (ondivWidth + 20);
                        $(".levelroll .levelroll-body .showImg").animate({"left": sum}, 500);
                    }, 3000);
                }

                //定时器
                if (ondivLength > 4) {
                    $(".btn a").css("display", "block");
                    setTime();

                    //鼠标进入区域停止滚动
                    $(".levelroll .levelroll-body").on("mouseover", function () {
                        clearInterval(timer);
                        $(".levelroll .levelroll-body .showImg>div").on("mouseover", function () {
                            $(this).addClass('onspan').siblings('div').removeClass('onspan');
                        });
                        $(".levelroll .levelroll-body .showImg>div").on("mouseout", function () {
                            $(this).removeClass('onspan');
                        });
                    })

                    $(".levelroll .levelroll-body").on("mouseout", function () {
                        clearInterval(timer);
                        setTime();
                    })

                    //左右切换
                    $(".btn a").on("click", function () {
                        ondivLeft = parseInt($(".levelroll .levelroll-body .showImg").css("left"));   //偏移位置
                        if ($(this).index()) {
                            ondivLeft = ondivLeft <= -ondivWidth * (ondivLength - 4) ? 0 : ondivLeft - ondivWidth - 20
                        } else {
                            ondivLeft = ondivLeft === 0 ? -ondivWidth * (ondivLength - 4) - 20 * (ondivLength - 4) : ondivLeft + ondivWidth + 20
                        }

                        $(".levelroll .levelroll-body .showImg").stop().animate({"left": ondivLeft}, 500);
                    });
                }
                else {
                    $(".btn a").css("display", "none");
                }
            }

        }

        $(".levelroll .levelroll-head ul li").on("mouseover", function () {
            clearInterval(timer);
            var index = $(this).index();
            $(this).addClass('on').siblings('li').removeClass('on');
            //移动li下标
            $(options.onColumn).stop().animate({"left": liwidth * index + index * 30 + 30}, 500);
            //解决切换栏目大图区域回滚的bug
            //$(".imgs-box .cargo-img").eq(index).css("left","0");
            $(options.imgBox).eq(index).css("left","0");


            //计算栏目切换时，大图的偏移距离
            function add(x) {
                var sum = 0;
                for (var i = 0; i < x.length; i++) {
                    sum -= x[i];
                }
                return sum;
            }

            //大图区域的偏移位置，当0时默认是0,如果是1则偏移第一个图的宽度，如果是2偏移第一个图+第二个图的宽之和。
            var leftpy = index === 0 ? 0 : add(arr.slice(0, index));
            $(".imgs-box").stop().animate({"left": leftpy}, 500);
            $(".levelroll .levelroll-body .cargo-img").eq(index).addClass('showImg').siblings('div').removeClass('showImg');
            play()();

        });

    };
    //默认配置
    $.fn.tabChange.options={
        transTime:500,  //切换过渡时间
        timing:1000,    //定时器时间
        //arr:[], //存放图片内容盒子的长度
        column:".levelroll .levelroll-head ul li", //栏目
        onColumn:".levelroll .levelroll-head .licurrent",   //选中的栏目
        imgBox:".levelroll .levelroll-body .cargo-img", //所有盒子的类名
        onImgWrap:".levelroll .levelroll-body .showImg div",   //包裹图片的盒子
        onImgBox:".levelroll .levelroll-body .showImg", //选中的盒子
        changeBtn:".btn a"  //左右切换按钮
    }
}(jQuery))