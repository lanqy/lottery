// create by lanqy
var prizeObj = {};
var bRotate = false;

function _bindEvents() {
    $('#pointer').click(function (e) {
        e.preventDefault();
        _rotate();
    });

    setInterval(function () {
        var seconds = new Date().getSeconds();
        var sdegree = seconds * 6;
        var srotate = "rotate(" + sdegree + "deg)";

        $("#sec").css({
            "-moz-transform": srotate,
            "-webkit-transform": srotate
        });

    }, 200);

    $(document).on("click", "#confirm-btn", function (e) {
        _rotate();
    });

    $(document).on("click", "#confirm-btn01", function (e) {
        _rotate();
    });
    $(document).on("click", "#confirm-btn02", function (e) {
        _rotate();
    });

    $(document).on("click", "#confirm-btn03", function (e) {
        _rotate();
    });

}

function _rotate() {
    if (bRotate) {
        return;
    }
    _removeAnimateCls();
    getLottery();
}

function iDList() { // 奖品id 列表
    return [240, 241, 242, 243, 244, 245, 246, 247]
}

function _getAwardList() { // 奖品列表
    return [{
        "id": 240,
        "award_name": "一等奖",
        "award_money": 1.00,
        "award_angle": 0,
        "award_type": 25,
        "action_id": 25,
        "category": null
    }, {
        "id": 241,
        "award_name": "二等奖",
        "award_money": 5.00,
        "award_angle": 45,
        "award_type": 25,
        "action_id": 25,
        "category": null
    }, {
        "id": 242,
        "award_name": "三等奖",
        "award_money": 0.00,
        "award_angle": 90,
        "award_type": 25,
        "action_id": 25,
        "category": null
    }, {
        "id": 243,
        "award_name": "四等奖",
        "award_money": 0.00,
        "award_angle": 135,
        "award_type": 25,
        "action_id": 25,
        "category": null
    }, {
        "id": 244,
        "award_name": "五等奖",
        "award_money": 0.00,
        "award_angle": 180,
        "award_type": 25,
        "action_id": 25,
        "category": null
    }, {
        "id": 245,
        "award_name": "六等奖",
        "award_money": 75.00,
        "award_angle": 225,
        "award_type": 25,
        "action_id": 25,
        "category": null
    }, {
        "id": 246,
        "award_name": "谢谢参与",
        "award_money": 39.00,
        "award_angle": 270,
        "award_type": 25,
        "action_id": 25,
        "category": null
    }, {
        "id": 247,
        "award_name": "八等奖",
        "award_money": 26.00,
        "award_angle": 315,
        "award_type": 25,
        "action_id": 25,
        "category": null
    }];
}

function _initAwardList() { // 奖品列表

    var data = _getAwardList();

    var _arr = [],
        min,
        max,
        arr;
    var _data = data.slice(data.length - 8, data.length); // 截取后八个，需要后端排序好

    for (var i = 0; i < 8; i++) { // 8个
        arr = [];
        var obj = {};
        min = _data[i].award_angle + 5;
        max = _data[i].award_angle + 40;
        arr.push(min)
        arr.push(max);
        obj["angle"] = arr;
        obj["name"] = _data[i].award_name;
        obj["id"] = _data[i].id;
        _arr.push(obj);
    }
    prizeObj = _arr;
}

function getLottery() { // 抽奖 
    var data = _Winning();
    showByCode(data);
}

function _Winning() { // 后端返回奖品
    var randomNum = _random(0, 7); // 随机生成 0 - 7 的整数
    return {
        code: 0,
        awardId: iDList()[randomNum],
    }
}

function showByCode(data) { // 根据状态处理不同逻辑

    switch (data.code) {
        case 0: // 中奖
            var id = data.awardId;
            var o = getMM(id);
            var getPrize = (360 - _random(o.min, o.max));
            _starting(data, getPrize);
            updateStatus();
            break;
        default:
            showDialog({
                width: 600,
                height: 500,
                type: 5,
                el: $(".d-holder"),
                html: $("#text-tpl").html().replace(/\$text/, "系统出错！")
            });
            updateStatus();
            break;
    }
}

function updateStatus() {
    bRotate = !bRotate;
}

function showDialog(config) { // type 1未登录|3奖品次数用完|0中奖
    var el = config.el;
    el.dialog({
        title: 'Title',
        dragable: true,
        cache: false,
        width: config.width,
        height: config.height,
        onClose: function () {
            $(".layer-box").remove();
            _addAnimateCls();
        },
        onOpen: false,
        onConfirm: function () {

            $(".layer-box").remove();
        },
        onCannel: function () {},
        getContent: function () {
            el.find('.body-content').html(config.html);
            el.find('.footer').remove();
            el.find('.header').remove();
        }
    }).open(function () {
        if (config.type === 1) {
            refreshCode();
        }
        $("iframe").remove();
    });
}

function _removeAnimateCls() { //移除动画
    $("#rotate").removeClass("rotate-animate");
}

function _addAnimateCls() {
    $("#rotate").addClass("rotate-animate");
}

function getMM(id) { //获取随机角度
    for (var i = 0; i <= prizeObj.length; i++) {
        if (prizeObj[i]['id'] === id) {
            return {
                min: prizeObj[i]["angle"][0],
                max: prizeObj[i]["angle"][1]
            }
        }
    }
}

function _random(min, max) { // 随机生成一个区间的整数
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// function _rand(min, max) {
//     return Math.random() * (max - min) + min;
// };

// function getRandomItem(list, weight) {
//     var total_weight = weight.reduce(function (prev, cur, i, arr) {
//         return prev + cur;
//     });

//     var random_num = _rand(0, total_weight);
//     var weight_sum = 0;

//     for (var i = 0; i < list.length; i++) {
//         weight_sum += weight[i];
//         weight_sum = +weight_sum.toFixed(2);

//         if (random_num <= weight_sum) {
//             return list[i];
//         }
//     }
// };

// var list = ['javascript', 'php', 'ruby', 'python'];
// var weight = [0.5, 0.2, 0.2, 0.1];
// var random_item = getRandomItem(list, weight);

// console.log(random_item);

function _starting(data, angles) { // 转盘
    $('.rotate').stopRotate();
    $('.rotate').rotate({
        angle: 0,
        animateTo: angles + 1800,
        duration: 8000,
        callback: function () {
            bRotate = !bRotate;
            var name = getLotteryInfo(data);
            console.log(name);
                // showDialog({
                //     width: 900,
                //     height: 500,
                //     type: 0,
                //     count: data.count,
                //     el: $(".window-holder"),
                //     html: $("#time-over-tpl2").html().replace(/\$count/, data.count).replace(/\$awardName/, name)
                // });
        }
    });
}

function getLotteryInfo(data) { // 通过 id 获取奖品名称
    var id = data.awardId;
    for (var i = 0; i <= prizeObj.length; i++) {
        if (prizeObj[i]["id"] === id) {
            return prizeObj[i]["name"];
        }
    }
}


$(function () {
    _bindEvents();
    _initAwardList();
})
