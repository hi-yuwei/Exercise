/**
 * Created by yy on 2016/1/20.
 */
(function($){
    $.fn.link=function(options){
        var defaults={
            element:"",
            list:{
                "/web/lc/invest/list.html":"baoxiang://APPProjectList", //我要投资
                "//m.bxjr.com/center/message/index":"baoxiang://APPMessage",    //消息界面
                "//m.bxjr.com/center/invite/index":"baoxiang://APPInviteFriendPage",    //好友邀请
                "//m.bxjr.com/center/invest/receipt-plan":"baoxiang://APPCalendarPayBack",  //回款
                "/center/home/index":"baoxiang://APPTopUp", //充值界面
                "//m.bxjr.com/center/money/statistics":"baoxiang://APPMyWealth", //我的财富
                "//m.bxjr.com/center/invest/index":"baoxiang://APPMyInvestingRecord"    //投资记录
            }
        };

        var opts= $.extend(defaults,options);

        $(defaults.elements).each(function(){
            if(defaults.list[""+$(this).attr('href')+""]){

            }else{
                $(this).attr("href",defaults.list[""+$(this).attr('href')+""]);
            }
        });
    };
})(jQuery);