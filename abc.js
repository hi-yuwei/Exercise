/**
 * Created by yuwei on 2017/3/10.
 */
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

    $.ajax({
        url: "${resource(file: '/secure/get-login-info.html')}", cache: false, success: function (data) {
            window.loginInfo = data;
            if (document.referrer.indexOf("isInvest") >= 0 && window.loginInfo.isLogin) {
                $("#bx-btn").click()
            }

            //判断是否显示红包
            if (window.loginInfo && window.loginInfo.isLogin) {
                // 从localStorage获取 investAmount
                setAmount();
                /*加载红包*/
                $.ajax({
                    url: "<%= createLinkLc(controller: 'invest', action: 'getVouchers', params: [borrowId: borrow.id,nowAmount:canInvest])%>",
                    success: function (data) {
                        for (var a = 0; a < data.length; a++) {
                            //加载红包
                            //异步加载克隆第一个事件
                            if (data[a].type == "cash" || data[a].type == "coupon") {
                                //普通红包
                                var opp = $(".myoption div").eq(0).clone(true)
                                    .attr("data-value", data[a].id)
                                    .attr("data-amount", data[a].amount)
                                    .attr("data-limit", +data[a].useLimitMoney)
                                    .attr("data-deploy", +data[a].voucherAmountDeploy)
                                    .html("<h3>" + data[a].amount + "元 " + data[a].name + "</h3>" + "<div class='myoptionCon'><p class='myoptionLess'>" + data[a].content + "</p>" + data[a].deadLine + "</div>");

                            } else {
                                //加息红包
                                var domHtml = "<h3>" + data[a].amount + "元 " + data[a].name;
                                if (data[a].interestDay) {
                                    domHtml += '(可加息' + data[a].interestDay + '天)</h3>';
                                }
                                domHtml += "<div class='myoptionCon'><p class='myoptionLess'>" + data[a].content + "</p>" + data[a].deadLine + "</div>";
                                if (data[a].effectiveMaxMoney) {
                                    domHtml += "<p>投资本金超过" + data[a].effectiveMaxMoney + "的部分不加息</p>";
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
                        $(".myoptionIn").each(function () {
                            if ($(this).attr("data-value") == p_id) {
                                copyAttributeToBox($(this));
                                ajaxCal($(this));
                            }
                        });
                    }
                });
            }
        }
    });
    var subBtn = $("#bx-btn"),
        defense = localStorage.getItem("defense");

    if (defense) {
        localStorage.removeItem("defense");
    }

    subBtn.on("click", function () {
        if (localStorage.getItem("defense")) {
            return false;
        }
    });

    //ajax提交表单
    $("#investForm").ajaxForm(function (status, form, json, options) {
        if (status) {
            localStorage.setItem("defense", "true");
            location.href = "<%=  createLinkWeb(controller: 'tradeOrdLog', action: 'add', params: [ct : Client.HTML5.value, objectKey : borrow.id, objectName : 'borrow'])%>&" + $("#investForm").serialize();
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


        if ("${borrow.isUseBonus}" == "false") {
            $.getJSON("${createLinkLc(controller: 'invest',action: 'getTotalIncome')}",
                {money: am.val(), bid:${borrow.id}},
                function (data) {
                    $(".yqsy").html(numFormatSpan(data.income));
                });
        } else {

            ajaxCal($(".select_box"))
        }

    });
    am.keyup()
    $("#voucherId").change(function () {
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
        location.href = "${createLinkWeb(controller: 'login',params: [isInvest:"
        is
        "])}";
    })

//模拟select option
    $(".select_box").click(function (event) {
        var myOptionList = $(".myoption .myoptionIn");
        if (myOptionList.length == 1) {
            //提示
            $(".noRed").css("display", "block")
            setTimeout(function () {
                $(".noRed").css("display", "none")
            }, 2000)

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
    var selfSelect = false
    $(".myoption .myoptionIn").click(function () {
        if ($(this).index() == 0) {
            $(".select_box").attr("data-limit", "0").attr("data-value", 0);
        }
        $(this).parent().siblings(".select_txt");
//先赋值
        copyAttributeToBox($(this));
//再计算收益
        ajaxCal($(this));
        selfSelect = true;
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
                if (data.dataset.type == "profit") {
                    if (data.dataset.limit == undefined) {
                        return
                    }
                    if (data.dataset.limit > data.dataset.effectiveMaxMoney) {
                        $("#amount").val(data.dataset.limit);
                    } else {
                        $("#amount").val(data.dataset.effectiveMaxMoney);
                    }
                } else {
                    if (data.dataset.deploy == 0) {
                        if (data.dataset.limit == undefined) {
                            return
                        }
                        if (data.dataset.limit != 0) {
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
        var preVal = am.val();
        var limit = parseInt(hongbao.attr("data-limit"));
        var type = hongbao.attr("data-type");
        var effectiveMaxMoney = parseInt(hongbao.attr("data-effectiveMaxMoney"));
        var canVote = ${canInvest};
        var sendData;
        //当未填写金额时自动填写红包限额
        isAutoinsert
        if (selfSelect || $("#voucherId").val() == "") {
            sendData = {money: investC, bid: "1111", voucherId: $("#voucherId").val()};
        }
        else {
            sendData = {money: investC, bid: "1111"};
            am.validationEngine('validate');
            $.getJSON("${createLinkLc(controller: 'invest',action: 'getTotalIncome')}", sendData,
                function (data) {
                    if (data.voucherId) {
                        copyAttributeToBox($('li[data-value="' + data.voucherId + '"]')[0])
                    } else {
                        $(".select_box")
                            .attr("data-value", 0)
                            .attr("data-amount", 0)
                            .attr("data-limit", 0)
                            .attr("data-interestRate", 0)
                            .attr("data-interestDay", 0)
                            .attr("data-effectiveMaxMoney", 0)
                            .attr("data-type", "")
                            .attr("data-deploy", 0);
                        $("#voucherId").val("");
                        $(".select_box").text("不使用红包");
                    }
                    $(".yqsy").html(numFormatSpan(data.income));
                });
        }
    };


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
    function setAmount() {
        if (localStorage.investAmount) {
            $('#amount').val(localStorage.investAmount);
            setTimeout(function () {
                $('#amount').keyup()
            }, 100)
        }
        localStorage.removeItem('investAmount');
    }