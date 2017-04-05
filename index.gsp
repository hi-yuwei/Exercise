    <%--
      Created by IntelliJ IDEA.
      User: hmc
      Date: 2016/4/20
      Time: 13:06
    --%>

        <%@ page
                import="com.yunbeigroup.bxjr.usercenter.constant.Client; com.yunbeigroup.bxjr.member.MemberBank; com.yunbeigroup.bxjr.member.MemberMoney; com.yunbeigroup.bxjr.support.grails.Current; com.yunbeigroup.bxjr.borrow.BorrowInvest; com.yunbeigroup.bxjr.borrow.BorrowAuth; com.yunbeigroup.bxjr.borrow.BorrowInfo; com.yunbeigroup.bxjr.voucher.Voucher; com.yunbeigroup.bxjr.borrow.Borrow"
                contentType="text/html;charset=UTF-8" %>
        <html>
        <head>
        <title>${borrow.title}</title>
        <meta name="keywords" content="立即投资"/>
        <meta name="description" content=""/>
        <meta name="layout" content="mcenter"/>
        <g:set var="borrow" value="${borrow as Borrow}"/>
        <link rel="stylesheet" href="${resource(file: 'assets/mobile/css/reset.css')}?v=${g.version()}"/>
        <link rel="stylesheet" href="${resource(file: 'assets/mobile/css/index.css')}?v=${g.version()}"/>
        <style>
        body { background: #edf0f3; }
        .footer { display: none; }
        .noRed{ display: none; padding: 10px 30px;position: absolute;top: 50%;left: 50%;background-color: #3f3f3f;color:
        #fff;border-radius: 5px;-webkit-border-radius: 5px;transform:translateX(-50%);-webkit-transform:translateX(-50%)
        }
        </style>
        </head>

        <body data-url="${historyBackUrl}">
        <section class="detailToDo">
        <div class="productDetail moduleTab">
        <g:set var="canInvest"
               value="${borrow.status == Borrow.STATUS.PROCESS.value ? borrow.amount - borrow.alreadyAmount : 0}"/>
        <div class="list clearfix">
        <table class="listInfo">
        <tr>
        <td>
        ${formatNumber(number: borrow.loanRate, format: "###,###.##")}<span><g:if
            test="${borrow.realSubsidyRate}">
        +${formatNumber(number: borrow.realSubsidyRate, format: "###,###.##")}</g:if></span>
        </td>
        <td>
        <span>借款年利率</span>

        <p>%</p>
        </td>
        </tr>
        </table>

        <div class="clearfix reward">
        <div class="fl">
        <g:if test="${borrow.rewardRate}">
            <font class="award exclusive">再奖${formatNumber(number: borrow.rewardRate, format: '###,###.##')}%</font>
        </g:if>
        <g:if test="${borrow.isExclusiveApp}">
            <font class="app exclusive">APP专享</font>
        </g:if>
        <g:if test="${borrow.isLimitBeginner}">
            <font class="other exclusive">新手专享</font>
        </g:if>
        <font class="other exclusive">多重保障</font>
        </div>

        <div class="fr">借款期限：${borrow.cycle}${g.getEnumValue(enum: Borrow.CYCLE_TYPE,name: borrow.cycleType)}</div>
        </div>
        </div>
        </div>
        </section>
        <section class="info">
        <div class="parts">
        <a href="${createLinkLc(controller: 'invest', action: 'datum', id: borrow.id)}?redirect=${historyBackUrl}"
        class="m_phone clearfix">
        <i></i>
        <span class="fl">项目详情</span>
        <span class="fr">完善的信息披露</span>
        </a>
        <a href="//m.bxjr.com/topic/security/" class="m_phone clearfix">
        <i></i>
        <span class="fl">安全保障</span>
        <span class="fr">10大安全保障</span>
        </a>
        <g:if test="${(borrow.status in [Borrow.STATUS.PROCESS.value]) }">
            <a href="${createLinkLc(controller: 'invest', action: 'recordList', id: borrow.id)}
            ?redirect=${historyBackUrl}" class="m_phone clearfix"><i></i><span class="fl">投资记录</span><span
            class="fr">${all}人已投资</span></a>
        </g:if>
        </div>
        </section>
        <section class="fm <g:if
            test="${borrow.status != com.yunbeigroup.bxjr.borrow.Borrow.STATUS.PROCESS.value}">sellOut</g:if>">
        <g:if test="${borrow.status != com.yunbeigroup.bxjr.borrow.Borrow.STATUS.PROCESS.value}"><img class="sellOut"
            src="${resource(file: 'assets/mobile/images/sell_out.png')}"
            alt=""/>
        </g:if>
        <g:if test="${borrow.isExclusiveApp}">
            <a class="appImg" href="//m.bxjr.com/topic/app/">
            <div>
            <p>APP<span>专属</span>加息标</p>
            <span>扫描或点击二维码，进入APP投资</span>
            <img src="${resource(file: 'assets/mobile/images/center/app.png')}"/>
            </div>
            </a>
        </g:if>
        <g:else>
            <form action="${createLinkLc(controller: 'invest', action: 'check', id: params.id)}" id="investForm"
            method="post" autocomplete="off">
            <input type="hidden" name="parentUrl" value="${historyBackUrl}"/>
            <div class="detailMain clearfix">
            <ul>
            <li class="canVote clearfix">
            <div class="fl">
            <span>可投金额(元)</span>
            <p class="fontRed">${canInvest}</p>

            </div>

            <div class="gain fr">
            <span>预期收益(元)</span>
            <p class="yqsy fontRed">0.00</p>
            </div>
            </li>

            <g:if test="${borrow.classify != com.yunbeigroup.bxjr.borrow.Borrow.CLASSIFY.EXPERIENCE.value}">
                <li class="clearfix amountCont">
                <input type="number" name="amount" id="amount"
                align="center" ${borrow.status != com.yunbeigroup.bxjr.borrow.Borrow.STATUS.PROCESS.value ? 'disabled="disabled"' : ''}
                class="details1mar10 validate[required,custom[integer],minDiy[${borrow.getMinInvestAmount()}
                ],maxDiy[${borrow.amount - borrow.alreadyAmount}],funcCall[validSum]]"
                onkeyup="this.value = this.value.replace(/\D/g, '')"
                data-max="${borrow.amount - borrow.alreadyAmount}"
                data-min="${borrow.getMinInvestAmount()}"
                placeholder="起投金额${borrow.getMinInvestAmount()}元"/>
                </li>
            </g:if>
            <g:else>
                <input type="hidden" name="amount" id="amount">
            </g:else>
            <li class="mod_select clearfix">
            <div class="clearfix">
            <g:if test="${borrow.isUseBonus == true && borrow.status == Borrow.STATUS.PROCESS.value}">
                <div class="select_box" data-limit="0" data-value="0">
                <i class="select_box_i" style="display:none">当前红包不能全额使用</i>
                <span class="select_txt">不使用红包</span>

                <div class="selet_open fr"></div>
                <input name="voucherId" value="" type="hidden" id="voucherId">

                <div class="layerOption">
                <div class="layerShade"></div>

                <div class="myoption">
                <div class="myoptionIn"><p>不使用红包</p></div>
                </div>
                </div>
                </div>
            </g:if>
            <g:else>
                <input id="voucherId" type="hidden" value="0">
            </g:else>
            </div>
            </li>
            </ul>
            </div>

            <div class="blueBgBtn">
            <button
            <g:if
                    test="${borrow.status != com.yunbeigroup.bxjr.borrow.Borrow.STATUS.PROCESS.value || borrow.isExclusiveApp}">
                disabled="disabled"
            </g:if>
            id="bx-btn" type="submit"
            class="bx-btn">${borrow.status != com.yunbeigroup.bxjr.borrow.Borrow.STATUS.PROCESS.value?"${getEnumValue(enum: Borrow.STATUS, name: borrow.status)}":"确定投资"}
            </button>
            </div>
            </form>
        </g:else>
        </section>

        <p class="chinaTaiping"><img src="${resource(file: 'assets/mobile/images/center/chinaTaipin.png')}
        "/>中国太平财险保障账户资金安全</p>
        %{--微信弹出框 开始--}%
        <div class="layer-wxInvest-succeed layer-Invest-succeed" style="display: none;">
        <h2>投资成功</h2>
        <img src="${resource(file: 'assets/mobile/images/succeed-img.png')}"/>
        <p class="succeed-txt"><strong>关注宝象金融服务号</strong><br/><span>投资管理更方便！</span></p>
        <div class="succeed-btn">
        <a href="javascript:;" class="js-succeed-closed">就不去</a>
        <a href="//mp.weixin.qq.com/s?__biz=MzA4NjQ2ODU4OA==&mid=503309517&idx=1&sn=887a71596a1d71c00889309f744b797a"
        class="btn-f-blue">去关注</a>
        </div>
        </div>
        %{--微信弹出框 结束--}%

        %{--h5弹出框 开始--}%
        <div class="layer-h5Invest-succeed layer-Invest-succeed" style="display: none;">
        <h2>宝象金融</h2>
        <img src="${resource(file: 'assets/mobile/images/succeed-img.png')}"/>
        <p class="succeed-txt">恭喜您，投资成功!</p>
        <div class="succeed-btn">
        <a href="javascript:;" class="js-succeed-closed btn-f-blue">确定</a>
        </div>

        </div>
        %{--h5弹出框 结束--}%
        <div class="noRed">您没有可使用红包</div>
        <g:javascript>
            /*是否可使用代金券*/
            function validSum() {
            var i = parseInt($("#amount").val());
            var limit = $("#voucherId").find("option:selected").attr("data-limit")
            if (i < parseInt(limit)) {
            return "不符合代金券使用条件"
            }
            }

            $(function () {
            var kt = ${canInvest}; //可投金额
            var p_id = localStorage && localStorage.getItem("packet_id");

            $.ajax({url:"${resource(file: '/secure/get-login-info.html')}",cache:false,success:function (data) {
            window.loginInfo = data;
            if (document.referrer.indexOf("isInvest") >= 0 && window.loginInfo.isLogin) {
            $("#bx-btn").click()
            }

            <g:if test="${(borrow.status in [Borrow.STATUS.DONE.value, Borrow.STATUS.SUCCESS.value, Borrow.STATUS.REPAYMENT.value, Borrow.STATUS.FAILURE.value]) }">
                if (window.loginInfo && window.loginInfo.isLogin) {
                $.ajax({
                url: "<%= createLinkLc(controller: 'invest', action: 'isHaveInvest')%>",
                data: {
                borrowId:${borrow.id}
                },
                success: function (data) {
                $('.info').find('a').last().css({"border-bottom":"1px solid #dedede"});
                if (data.isHaveInvest) {
                $('.parts').append('<a href="${createLinkLc(controller: 'invest', action: 'recordList', id: borrow.id)}
                ?redirect=${historyBackUrl}" class="m_phone clearfix"><i></i><span class="fl">投资记录</span><span
                class="fr">${all}人已投资</span></a>');
                }
                else if (data.isBrisk) {
                $('.info').css({"height":"80px"});
                $('.info').find('a').last().css({"border-bottom":"0"});
                }else{
                $('.info').css({"height":"80px"});
                $('.info').find('a').last().css({"border-bottom":"0"});
                }
                }

                });
                }
            </g:if>
            //判断是否显示红包
            if (window.loginInfo && window.loginInfo.isLogin) {
            // 从localStorage获取 investAmount
            setAmount();
            /*加载红包*/
            $.ajax({
            url:
            "<%= createLinkLc(controller: 'invest', action: 'getVouchers', params: [borrowId: borrow.id,nowAmount:canInvest])%>
            ",
            success: function (data) {
            for (var a = 0; a < data.length; a++) {
            //加载红包
            //异步加载克隆第一个事件
            if(data[a].type=="cash"||data[a].type=="coupon"){
            //普通红包
            var opp = $(".myoption div").eq(0).clone(true)
            .attr("data-value", data[a].id)
            .attr("data-amount", data[a].amount)
            .attr("data-limit", +data[a].useLimitMoney)
            .attr("data-deploy", +data[a].voucherAmountDeploy)
            .html("<h3>" + data[a].amount + "元 " + data[a].name + "</h3>" + "<div class='myoptionCon'><p
            class='myoptionLess'>" + data[a].content + "</p>" + data[a].deadLine + "</div>");

            }else{
            //加息红包
            var domHtml="<h3>" + data[a].amount + "元 " + data[a].name;
            if(data[a].interestDay){
            domHtml+='(可加息'+data[a].interestDay+'天)</h3>';
            }
            domHtml+="<div class='myoptionCon'><p class='myoptionLess'>" + data[a].content + "</p>" + data[a].deadLine +
            "</div>";
            if(data[a].effectiveMaxMoney){
            domHtml+="<p>投资本金超过"+data[a].effectiveMaxMoney+"的部分不加息</p>";
            }
            var opp = $(".myoption div").eq(0).clone(true)
            .attr("data-value", data[a].id)
            .attr("data-amount", data[a].amount)
            .attr("data-limit", +data[a].useLimitMoney)
            .attr("data-deploy", +data[a].voucherAmountDeploy)
            .html(domHtml);
            }

            if (data[a].deadLine == "有效期：&#10;最后1天") {
            opp.attr("title", "最后1天！最后1天！最后1天！重要事情说3遍。");
            }
            $(".myoption").append(opp);
            }
            <g:if test="${Borrow.CLASSIFY.EXPERIENCE.value.equals(borrow.classify)}">
                if (data.length <= 0) {
                $("#bx-btn").attr("disabled", "disabled").html("体验金专享");
                }

            </g:if>
            $(".myoptionIn").each(function () {
            if ($(this).attr("data-value") == p_id) {
            copyAttributeToBox($(this));
            ajaxCal($(this));
            }
            });
            }
            });
            }
            }});
            <g:set var="banks" value="${s.getMemberBank() as List<com.yunbeigroup.bxjr.member.MemberBank>}"/>
            var subBtn = $("#bx-btn"),
            defense = localStorage.getItem("defense");

            if(defense){
            localStorage.removeItem("defense");
            }

            subBtn.on("click", function(){
            if(localStorage.getItem("defense")){
            return false;
            }
            });

            //ajax提交表单
            $("#investForm").ajaxForm(function (status, form, json, options) {
            if (status) {
            localStorage.setItem("defense", "true");
            location.href =
            "<%=  createLinkWeb(controller: 'tradeOrdLog', action: 'add', params: [ct : Client.HTML5.value, objectKey : borrow.id, objectName : 'borrow'])%>
            &" + $("#investForm").serialize();
            }
            }, {
            onBeforeAjaxFormValidation: function () {
            if (!window.loginInfo || !window.loginInfo.isLogin) {
            layer.hConfirm("您还没有登录，马上去登录？", function (status) {
            if (status) {
            localStorage.setItem("investAmount", $("#amount").val())
            location.href = "${createLinkWeb(controller: 'login')}";
            }
            });
            return false;
            }
            <g:if test="${!banks && Borrow.CLASSIFY.EXPERIENCE.value.equals(borrow.classify)}">
                if ($("#voucherId").val() == "") {
                layer.hAlert("必须选择一个红包才能投资！", 2);
                return false;
                }
            </g:if>
            }, addPromptClass: 'formError-center'
            });

            function setZero() {
            $(".yqsy").html(numFormatSpan(0))
            }

            if (!String.prototype.trim) {
            String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
            };
            }
            var isAutoinsert = true, am = $("#amount"), info = $(".info");
            /*
            am.focus(function () {
            info.addClass("curr");
            })
            am.blur(function () {
            info.removeClass("curr");
            })
            */
            am.keyup(function () {
            if (!$(this).val()) {
            setZero();
            return;
            }

            if (isNaN($(this).val()) || $(this).val().indexOf(".") != -1) {
            $(this).val($(this).data("value"));
            return;
            }

            var investC = parseInt($(this).val());
            $(this).val($(this).val().trim() == "" || !$(this).val().trim() ? "0" : investC);
            if (investC > kt) {
            $(this).val(kt);
            investC = kt;
            }

            if (!isNaN(investC)) {
            $(this).data("value", investC);
            }
            isAutoinsert = false;

            var availableVoucher = 0;// 可用代金券张数
            var maxVoucher = 0;//最大可投金额

            // 禁用不可用的代金券
            %{--$(".myoption .myoptionIn:not(:eq(0))").each(function () {--}%
            %{--<g:if test="${borrow.isUseBonus!=false}">--}%
            %{--if (investC >= parseInt($(this).attr("data-limit"))) {--}%
            %{--if (parseInt($(this).attr("data-limit")) > maxVoucher) {--}%
            %{--/*选中红包*/--}%
            %{--copyAttributeToBox($(this));--}%
            %{--maxVoucher = parseInt($(this).attr("data-limit"));--}%
            %{--}--}%

            %{--availableVoucher++;--}%
            %{--}--}%
            %{--</g:if>--}%
            %{--});--}%

            %{--if (availableVoucher <= 0) {--}%
            %{--//初始化用的--}%
            %{--$(".select_box").attr("data-limit", "0").attr("data-value", 0);--}%
            %{--//先赋值--}%
            %{--copyAttributeToBox($(this).text("不使用红包"));--}%
            %{--//再计算收益--}%
            %{--ajaxCal($(this));--}%
            %{--$(".myoptionIn").eq(0).attr("data-value", 0);--}%
            %{--}--}%
            if ("${borrow.isUseBonus}" == "false") {
            $.getJSON("${createLinkLc(controller: 'invest',action: 'getTotalIncome')}",
            {money: am.val(), bid:${borrow.id}},
            function (data) {
            $(".yqsy").html(numFormatSpan(data.income));
            });
            } else {
            // $("#voucherId").change();
            // $(".myoption .myoptionIn").click()
            ajaxCal($(".select_box"))
            }

            });
            am.keyup()
            $("#voucherId").change(function () {
            <g:if test="${Borrow.CLASSIFY.EXPERIENCE.value.equals(borrow.classify)}">
                var investC = $(this).find("option:selected").attr("data-amount");
                am.val(investC);
            </g:if>
            <g:else>
                var investC = am.val();
            </g:else>
            var preVal = am.val();
            if (isAutoinsert || investC == "" || isNaN(investC)) {
            var limit = $(this).find("option:selected").attr("data-limit");
            if (limit == undefined) {
            return
            }
            am.val(limit);
            investC = am.val();
            }
            am.validationEngine('validate');
            $.getJSON("${createLinkLc(controller: 'invest',action: 'getTotalIncome')}",
            {money: investC, bid:${borrow.id}, voucherId: $("#voucherId").val()},
            function (data) {
            $(".yqsy").html(numFormatSpan(data.income) + "<em>元</em>");
            });
            });
            $(".show").click(function () {
            location.href = "${createLinkWeb(controller: 'login',params: [isInvest:"is"])}";
            })

            //模拟select option
            $(".select_box").click(function (event) {
            var myOptionList = $(".myoption .myoptionIn");
            if(myOptionList.length==1){
            //提示
            $(".noRed").css("display","block")
            setTimeout(function(){
            $(".noRed").css("display","none")
            },2000)

            return
            }
            $(".layerShade").toggle();
            event.stopPropagation();
            $(this).find(".myoption").toggle();
            $(".myoptionIn").each(function () {
            if ($(this).attr("data-value") == $(".select_box").attr("data-value")) {
            $(this).addClass("on").siblings().removeClass("on");
            return false;
            } else {
            $(".myoptionIn").eq(0).addClass("on").siblings().removeClass("on");
            }
            });
            });
            $(document).click(function (event) {
            console.log(1333)
            var eo = $(event.target);
            if ($(".select_box").is(":visible") && eo.attr("class") != "myoption" && !eo.parent(".myoption").length)
            $('.myoption').hide();
            $('.layerShade').hide();
            });
            /*赋值给文本框*/
            var selfSelect=false
            $(".myoption .myoptionIn").click(function () {
            if ($(this).index() == 0) {
            $(".select_box").attr("data-limit", "0").attr("data-value", 0);
            }
            $(this).parent().siblings(".select_txt");
            //先赋值
            copyAttributeToBox($(this));
            //再计算收益
            ajaxCal($(this));
            selfSelect=true;
            })


            /*copy属性到$(".select_box"),并且对$("#voucherId")赋值*/
            function copyAttributeToBox(obj) {
            var _this = obj;
            $(".select_box")
            .attr("data-value", _this.attr("data-value"))
            .attr("data-amount", _this.attr("data-amount"))
            .attr("data-limit", _this.attr("data-limit"))
            .attr("data-deploy", _this.attr("data-deploy"));

            if (_this.text() == "不使用红包") {
            $(".select_txt").text(_this.text());
            $(".select_box_i").hide();
            } else {
            $(".select_txt").text(_this.children("h3").text());
            if (isAutoinsert || investC == "" || isNaN(investC)) {
            if(data.dataset.type == "profit"){
            if (data.dataset.limit == undefined) {
            return
            }
            if(data.dataset.limit > data.dataset.effectiveMaxMoney){
            $("#amount").val(data.dataset.limit);
            }else{
            $("#amount").val(data.dataset.effectiveMaxMoney);
            }
            }else{
            if (data.dataset.deploy == 0) {
            if (data.dataset.limit == undefined) {
            return
            }
            if(data.dataset.limit!=0){
            $("#amount").val(data.dataset.limit);
            }
            } else {
            if (data.dataset.amount == undefined) {
            return
            }
            if ((data.dataset.amount * 100 / data.dataset.deploy) > data.dataset.limit) {
            maxLimit = Math.ceil(data.dataset.amount * 100 / data.dataset.deploy);
            } else {
            maxLimit = data.dataset.limit
            }
            if (maxLimit > canVote) {
            layer.tips("当前红包不能全额使用", $("#js-red-packet"), {tips: [4, '#f90']});
            }
            maxLimit = maxLimit > canVote ? canVote : maxLimit;
            $("#amount").val(maxLimit);
            }
            }
            }

            var deploy = _this.attr("data-deploy");
            var amount = _this.attr("data-amount");
            var canVote = ${canInvest};
            var maxLimit = amount * 100 / deploy;
            if (deploy != 0) {
            if (maxLimit > canVote) {
            $(".select_box_i").show();
            }
            } else {
            $(".select_box_i").hide();
            }
            }
            $("#voucherId").val(_this.attr("data-value"))
            }

            /*异步计算收益*/
            function ajaxCal(objects) {
            <g:if test="${Borrow.CLASSIFY.EXPERIENCE.value.equals(borrow.classify)}">
                var investC = objects.attr("data-limit");
                am.val(investC);
            </g:if>
            <g:else>
                var investC = am.val();
            </g:else>
            var preVal = am.val();
            %{--if (isAutoinsert || investC == "" || isNaN(investC)) {--}%
            %{--var deploy = objects.attr("data-deploy");--}%
            %{--if (deploy == 0) {--}%
            %{--var limit = objects.attr("data-limit");--}%
            %{--if (limit == undefined) {--}%
            %{--return--}%
            %{--}--}%
            %{--am.val(limit);--}%
            %{--} else {--}%
            %{--var amount = objects.attr("data-amount");--}%
            %{--if (amount == undefined) {--}%
            %{--return--}%
            %{--}--}%
            %{--var maxLimit = amount * 100 / deploy;--}%
            %{--var canVote = ${canInvest};--}%
            %{--if (maxLimit > canVote) {--}%
            %{--$(".select_box_i").show();--}%
            %{--} else {--}%
            %{--$(".select_box_i").hide();--}%
            %{--}--}%
            %{--maxLimit = maxLimit > canVote ? canVote : maxLimit;--}%
            %{--am.val(maxLimit);--}%
            %{--}--}%

            %{--investC = am.val();--}%
            %{--}--}%
            var limit = parseInt(hongbao.attr("data-limit"));
            var type = hongbao.attr("data-type");
            var effectiveMaxMoney = parseInt(hongbao.attr("data-effectiveMaxMoney"));
            var canVote = ${canInvest};
            var sendData;
            //当未填写金额时自动填写红包限额
            isAutoinsert
            if(selfSelect|| $("#voucherId").val()==""){
            sendData={money: investC, bid:"1111", voucherId: $("#voucherId").val()}
            }else{
            sendData={money: investC, bid:"1111"}
            am.validationEngine('validate');
            $.getJSON("${createLinkLc(controller: 'invest',action: 'getTotalIncome')}",
            sendData,
            function (data) {
            if(data.voucherId){
            copyAttributeToBox($('li[data-value="'+data.voucherId+'"]')[0])
            }else{
            $(".select_box")
            .attr("data-value", 0)
            .attr("data-amount", 0)
            .attr("data-limit", 0)
            .attr("data-interestRate", 0)
            .attr("data-interestDay", 0)
            .attr("data-effectiveMaxMoney", 0)
            .attr("data-type", "")
            .attr("data-deploy", 0);
            $("#voucherId").val("")
            $(".select_box").text("不使用红包");
            }
            $(".yqsy").html(numFormatSpan(data.income));
            });
            }
            });


            function numFormat(num) {
            var arr = num.toFixed(2).toString().split(".");
            if (!arr[1]) {
            arr[1] = '00';
            }
            if (arr[1].length == 1) {
            arr[1] += 0;
            }
            if (arr[1].length > 2) {
            arr[1] = arr[1].substring(0, 2);
            }
            if (!arr[0] || isNaN(arr[0])) {
            arr[0] = '0';
            }
            return arr[0] + "." + arr[1];
            }
            // 数字格式化方法
            function numFormatSpan(num) {
            var arr = numFormat(num).toString().split(".");
            return arr[0] + "." + arr[1];
            }

            // 取localStorage中的投资金额
            function setAmount () {
            if(localStorage.investAmount) {
            $('#amount').val(localStorage.investAmount);
            setTimeout(function () {
            $('#amount').keyup()
            }, 100)
            }
            localStorage.removeItem('investAmount');
            }
        </g:javascript>

        </body>
        </html>