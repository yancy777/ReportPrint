
 var response = function(){
        // 画布的宽高
    var CANVAS_WID = 1280;
    var CANVAS_HEI = 640;

    // 两圆半径差值
    var THE_DIFFERENCE = 120;
    // 大半圆与小半圆半径
    var RADIUS_R = (CANVAS_WID - 160) / 2;
    var RADIUS_r = RADIUS_R - THE_DIFFERENCE;

    // 本次成绩与上次成绩进度条半径
    var SOURCE_DIFFERENCE = 60;
    var THIS_SOURCE_R = RADIUS_r - SOURCE_DIFFERENCE / 2;
    var LAST_SOURCE_R = THIS_SOURCE_R - SOURCE_DIFFERENCE;

    // 成绩取值区间 a:区间下限 b:区间刻度值
    var sourceSection = [{a:0, b:19}, {a:20, b:8}, {a:28, b:4}, {a:32, b:9}];

    /*
      等级划分
      根据等级划分数量来自动绘制扇形评分区域线数量
      防止日后修改等级数量与分数
      */
    const grade = ["0分", "20分", "28分", "32分", "40分"];
    const source = ["需努力", "合格", "良好", "优秀"];


    /*
    画出按照等级划分的线
     */
    var drawLineByGrade = function(cxt) {

        // 等级的数量计算出每个等级对应的角度
        var angle = 180 / (grade.length - 1);

        cxt.fillStyle = "black";
        cxt.font = '48px Arial';
        cxt.textBaseline = "bottom";

        // 从最上方定义的等级数组取出值，并且按照值的数量划线
        for (var i = 0;i < grade.length;i++){

            // 左右两侧文字样式单独设置 不然会跑偏
            if (i === 0){
                cxt.textAlign = "left";
            }else if (i === grade.length - 1){
                cxt.textAlign = "right";
            }else {
                cxt.textAlign = "center";
            }

            cxt.globalAlpha = 0.5;

            cxt.beginPath();
            cxt.moveTo(CANVAS_WID / 2, CANVAS_HEI - 1);

            var x = (CANVAS_WID / 2) - RADIUS_R * Math.cos(Math.PI / 180 * (i*angle));
            var y = CANVAS_HEI - Math.abs(RADIUS_R * Math.sin(Math.PI / 180 * (i*angle)));

            // 根据角度计算点的坐标
            cxt.lineTo(x, y);
            cxt.closePath();
            cxt.stroke();

            cxt.beginPath();
            cxt.font = 'blod 48px Arial';
            cxt.fillStyle = "black";
            cxt.globalAlpha = 1;
            cxt.save();
            cxt.translate(x, y);
            cxt.rotate((-90 + i * angle) * Math.PI / 180);
            cxt.fillText(grade[i], 0, 0);
            cxt.restore();
            cxt.closePath();
        }
    };

    /*
    画背景的线条
    底线 + 大半圆 + 内半圆 + 等级线（10分。。。）
     */
    var drawArcAndLine = function(cxt) {

        cxt.fillStyle = "black";
        cxt.lineWidth = 8;
        cxt.strokeStyle = "#a0a0a0";

        // 底部直线
        cxt.beginPath();
        cxt.moveTo(0, CANVAS_HEI);
        cxt.lineTo(CANVAS_WID, CANVAS_HEI);

        // 大半圆
        cxt.arc(CANVAS_WID / 2, CANVAS_HEI, RADIUS_R, 0, 2*Math.PI, true);

        // 内半圆
        cxt.arc(CANVAS_WID / 2, CANVAS_HEI, RADIUS_r, 0, 2*Math.PI, true);
        cxt.closePath();
        cxt.stroke();

        // 画出等级划分的线
        drawLineByGrade(cxt);
    };



    /*
    画进度条
     */
    var drawProgress = function(cxt, lastSource, thisSource) {

        var thisPosition;
        if (thisSource < 20){
            thisPosition = 0;
        }else if (thisSource >= 20 && thisSource <= 27){
            thisPosition = 1;
        }else if (thisSource >= 28 && thisSource <= 31){
            thisPosition = 2;
        }else if (thisSource > 31){
            thisPosition = 3;
        }else {
            thisPosition = 3;
        }

        var lastPosition;
        if (lastSource < 20){
            lastPosition = 0;
        }else if (lastSource >= 20 && lastSource <= 27){
            lastPosition = 1;
        }else if (lastSource >= 28 && lastSource <= 31){
            lastPosition = 2;
        }else if (lastSource > 31 && lastSource <= 40){
            lastPosition = 3;
        }else {
            lastPosition = 3;
        }

        var angle = 180 / (grade.length - 1);

        // 具体等级文字角度
        var angleSource = angle / 2;

        // 画出具体等级文字
        for (var j = 0;j < grade.length - 1;j++){

            var xSource = (CANVAS_WID / 2) - (RADIUS_R - THE_DIFFERENCE / 2) * Math.cos(Math.PI / 180 * (j*angle + angleSource));
            var ySource = CANVAS_HEI - Math.abs((RADIUS_R - THE_DIFFERENCE / 2) * Math.sin(Math.PI / 180 * (j*angle + angleSource)));

            cxt.beginPath();
            cxt.font = '44px Arial';
            cxt.textBaseline = "middle";
            cxt.textAlign = "center";

            // 根据成绩 设置区间文字颜色
            if (j === thisPosition){
                cxt.fillStyle = "#ff6600";
            }else {
                cxt.fillStyle = "black";
            }

            cxt.save();
            cxt.translate(xSource, ySource);
            cxt.rotate((-(angle + angleSource) + j * angle) * Math.PI / 180);
            cxt.fillText(source[j], 0, 0);
            cxt.restore();
            cxt.closePath();
        }

        // 进度条底部颜色条
        cxt.lineWidth = SOURCE_DIFFERENCE;
        cxt.beginPath();
        cxt.strokeStyle = "#fcf6f7";
        cxt.arc(CANVAS_WID / 2, CANVAS_HEI - 1, THIS_SOURCE_R, Math.PI, Math.PI + 2*Math.PI);
        cxt.stroke();
        cxt.closePath();

        cxt.beginPath();
        cxt.strokeStyle = "#f6f6f6";
        cxt.arc(CANVAS_WID / 2, CANVAS_HEI - 1, LAST_SOURCE_R, Math.PI, Math.PI + 2*Math.PI);
        cxt.stroke();
        cxt.closePath();

        // 画本次成绩进度条
        var progress = Math.PI + Math.PI * ((thisPosition * angle)
            + angle * (thisSource - sourceSection[thisPosition].a) / sourceSection[thisPosition].b) / 180;
        cxt.beginPath();
        cxt.lineWidth = SOURCE_DIFFERENCE;
        cxt.strokeStyle = "#ff6600";
        cxt.arc(CANVAS_WID / 2, CANVAS_HEI - 1, THIS_SOURCE_R, Math.PI, progress);
        console.log("当前区域：" + thisPosition);
        cxt.stroke();
        cxt.closePath();

        // 本次成绩两侧文字
        cxt.beginPath();
        cxt.fillStyle = "black";
        cxt.font = '44px Arial';
        cxt.textBaseline = "middle";
        cxt.textAlign = "left";
        var thisX = (CANVAS_WID / 2) - THIS_SOURCE_R * Math.cos(progress - Math.PI);
        var thisY = CANVAS_HEI - Math.abs(THIS_SOURCE_R * Math.sin(progress - Math.PI));
        cxt.save();
        cxt.translate(thisX, thisY);
        cxt.rotate(-1.5 * Math.PI + progress);
        cxt.fillText("本次", 0, 0);
        cxt.restore();
        cxt.closePath();

        cxt.beginPath();
        cxt.fillStyle = "#FFF";
        cxt.textAlign = "right";
        cxt.textBaseline = "middle";
        cxt.save();
        cxt.translate(thisX, thisY);
        cxt.rotate(-1.5 * Math.PI + progress);
        cxt.fillText(thisSource, 0, 0);
        cxt.restore();
        cxt.closePath();


        if (lastSource > 0){

            // 画上次成绩进度条
            var lastPro = Math.PI + Math.PI * ((lastPosition * angle) +
                angle * (lastSource - sourceSection[lastPosition].a) / sourceSection[lastPosition].b) / 180;
            cxt.beginPath();
            cxt.lineWidth = SOURCE_DIFFERENCE;
            cxt.strokeStyle = "#d2d2d2";
            cxt.arc(CANVAS_WID / 2, CANVAS_HEI - 1, LAST_SOURCE_R, Math.PI, lastPro);
            cxt.stroke();
            cxt.closePath();

            // 画出两侧文字
            cxt.font = '44px Arial';
            cxt.textAlign = "left";
            cxt.fillStyle = "black";
            cxt.textBaseline = "middle";
            var thisX = (CANVAS_WID / 2) - LAST_SOURCE_R * Math.cos(lastPro - Math.PI);
            var thisY = CANVAS_HEI - Math.abs(LAST_SOURCE_R * Math.sin(lastPro - Math.PI));
            cxt.save();
            cxt.translate(thisX, thisY);
            cxt.rotate(-1.5 * Math.PI + lastPro);
            cxt.fillText("上次", 0, 0);
            cxt.restore();
            cxt.closePath();

            cxt.beginPath();
            cxt.fillStyle = "#FFF";
            cxt.textAlign = "right";
            cxt.textBaseline = "middle";
            cxt.save();
            cxt.translate(thisX, thisY);
            cxt.rotate(-1.5 * Math.PI + lastPro);
            cxt.fillText(lastSource, 0, 0);
            cxt.restore();
            cxt.closePath();
        }else {
            cxt.beginPath();
            cxt.lineWidth = SOURCE_DIFFERENCE;
            cxt.strokeStyle = "#d2d2d2";
            cxt.arc(CANVAS_WID / 2, CANVAS_HEI - 1, LAST_SOURCE_R, 0, 0);
            cxt.stroke();
            cxt.closePath();
        }
    };
    var canvasContent = function (lastetResult,thisResult,canvasId) {
        //alert("参数传进来了");
        var canvas = document.getElementById(canvasId);
        var context = canvas.getContext("2d");

        canvas.width = CANVAS_WID;
        canvas.height = CANVAS_HEI;

        // 画进度条 上次 + 这次 分数
        drawProgress(context, lastetResult, thisResult);

        // 画背景的线条
        drawArcAndLine(context);
    };


    return {
        GenerentCanvas:function(lastetResult,thisResult,canvasId){
            canvasContent(lastetResult,thisResult,canvasId);
        }
    }
}();




