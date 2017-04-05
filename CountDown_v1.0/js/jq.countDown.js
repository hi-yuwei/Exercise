
function CountDown(startTime) {
    var timer,currentTime,serverTime,ms;
    var flg=true;
    serverTime=getServerTime(); //获取服务器当前时间
    ms=initialDate(startTime);  //初始化结束时间

    //计算时间
    var showTimer = function () {
        serverTime+=1000; //页面刷新后，获取当前服务器时间保存在全局变量中，每隔1000毫秒，全局变量中也同步减去1000毫秒
        currentTime = (ms - serverTime) / 1000;   //一共多少秒
        if (currentTime >0) {
            var hour = Math.floor(currentTime / 3600);
            var minute = Math.floor(currentTime % 3600 / 60);
            var second = Math.floor(currentTime % 3600 % 60);
            dispose(hour, ".countdown-hour li");
            dispose(minute, ".countdown-minute li");
            dispose(second, ".countdown-second li");
        }
        else{
            clearInterval(timer);
            dispose(0,".countdown-second li");
            $(".details1_timing_mark").hide();
            $(".buy").show();
        }
    };

    //处理DOM
    var dispose = function (time, element) {
        //小时部分会遇到很多位的问题
        if (time < 10) {    //时间是1位
            $(element).eq(0).text(0);
            $(element).eq(1).text(time);
        } else if(time < 100) { //时间是2位
            $(element).eq(0).text(Math.floor(time / 10));
            $(element).eq(1).text(time % 10);
        }else if(time <1000){  //时间是3位
            $(element).eq(0).text(Math.floor(time /100));
            $(element).eq(1).text(Math.floor(time % 100/10));
            $(element).eq(2).show().text(Math.floor(time%100%10));
        }else{ //时间是4位
            $(element).eq(0).text(Math.floor(time /1000));
            $(element).eq(1).text(Math.floor(time % 1000/100));
            $(element).eq(2).show().text(Math.floor(time%1000%100/10));
            $(element).eq(3).show().text(Math.floor(time%1000%100%10));
        }
    };

    //初始化日期格式
    function initialDate(time) {
        time = time.replace(new RegExp("-", "gm"), "/");
        return new Date(time).getTime();
    }

    //获得服务器当前时间
    function getServerTime() {
        var http_request;
        if (window.XMLHttpRequest) {
            http_request = new XMLHttpRequest();
        } else {
            http_request = new ActiveXObject('Microsoft.XMLHTTP');
        }
        http_request.open('HEAD',location.href + "?" + Math.random(1, 5),false);
        http_request.send(null);
        return new Date(http_request.getResponseHeader('Date')).getTime();
    }

    clearInterval(timer);
    timer = setInterval(showTimer, 1000);
}