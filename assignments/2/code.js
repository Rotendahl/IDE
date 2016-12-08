d3.select(window).on('load', init);

var w = 500;
var uiOffSet = 100;
var h = 500;
var svg;
var svg1;
var numButtons = 5;

var generateBarChart = function(data){
        // // Clear screen
        // svg.append('rect').attr('width', w).
        //     attr('height', h).attr('x', "0").attr('y', 0).
        //     attr('fill', '#e8e8e8').attr("stroke", "#009cff");


        var barWidth = w / data.length;
        var curX = -barWidth;
        var midY = h / 2;
        var maxVal = 0;
        for (var i = 0; i < data.length; i++) {
            Math.abs(data[i][1]) > maxVal ?
            maxVal = Math.abs(data[i][1]): 1;
        }
        var normConst = Math.floor(h  / maxVal) /2;

        svg.selectAll('rect').data(data).enter().append('rect').
            attr('width', barWidth).attr("class", "update").
            attr('height', function(d){ return Math.abs(d[1])* normConst;}).
            attr('x', function(d){ curX += barWidth ; return curX; }).
            attr('y', function(d){
                var positive = d[1] < 0 ? false : true;
                if (positive) {
                    return y = midY - Math.abs(d[1])* normConst;
                } else {
                    return y = midY;
                }

            }).
            attr('fill', '#ff6300');
        // zero line;
        svg.append('rect').attr('width', w).
            attr('height', 2).attr('x', "0").attr('y', midY-1).
            attr('fill', '#009cff');
}


function init() {

    svg = d3.select("#graph1").append('svg').attr("width",w).attr('height',h + uiOffSet);
    var my_data = d3.csv("../../data/weather1.csv", function(data){

    dataset = data;


    // button 1. quarter
    svg.append('rect').attr('width', 98).
    attr('height', 40).attr('x', 1).attr('y', 510).attr('rx', 20).attr('ry', 20).
    attr("stroke", "black").
    attr('fill', '#FF924D')
    svg.append('text').text(function(d){return "1. Quarter";}).
    attr("width", 50).attr("height", 70).attr("x", 2).attr("y", 535).on("click", function(d){
        var dataTemp = [];
         for (var i = 0; i < dataset.length; i++) {
             if(typeof(parseFloat(dataset[i].YEAR)) === "number"    &&
                typeof(parseFloat(dataset[i][" JAN"])) === "number" &&
                typeof(parseFloat(dataset[i][" FEB"])) === "number" &&
                typeof(parseFloat(dataset[i][" MAR"])) === "number"){
                    var temperature =  0.0
                    temperature += parseFloat(dataset[i][" JAN"]);
                    temperature += parseFloat(dataset[i][" FEB"]);
                    temperature += parseFloat(dataset[i][" MAR"]);
                    temperature = temperature / 3.0;
                    dataTemp[dataTemp.length] = [dataset[i].YEAR, temperature];
             }
         }
         generateBarChart(dataTemp)
    });


    // 2. quarter
    svg.append('rect').attr('width', 98).
    attr('height', 40).attr('x', 101).attr('y', 510).attr('rx', 20).attr('ry', 20).
    attr("stroke", "black").
    attr('fill', '#ff8233')
    svg.append('text').text(function(d){return "2. Quarter";}).
    attr("width", 60).attr("height", 70).attr("x", 102).attr("y", 535).on("click", function(d){
        var dataTemp = [];
         for (var i = 0; i < dataset.length; i++) {
             if(typeof(parseFloat(dataset[i].YEAR)) === "number"    &&
                typeof(parseFloat(dataset[i][" APR"])) === "number" &&
                typeof(parseFloat(dataset[i][" MAY"])) === "number" &&
                typeof(parseFloat(dataset[i][" JUN"])) === "number"){
                    var temperature =  0.0
                    temperature += parseFloat(dataset[i][" APR"]);
                    temperature += parseFloat(dataset[i][" MAY"]);
                    temperature += parseFloat(dataset[i][" JUN"]);
                    temperature = temperature / 3.0;
                    dataTemp[dataTemp.length] = [dataset[i].YEAR, temperature];
             }
         }
         generateBarChart(dataTemp)
    });

    // 3. quarter
    svg.append('rect').attr('width', 98).
    attr('height', 40).attr('x', 201).attr('y', 510).attr('rx', 20).attr('ry', 20).
    attr("stroke", "black").
    attr('fill', '#ff731a')
    svg.append('text').text(function(d){return "3. Quarter";}).
    attr("width", 60).attr("height", 70).attr("x", 203).attr("y", 535).on("click", function(d){
        var dataTemp = [];
         for (var i = 0; i < dataset.length; i++) {
             if(typeof(parseFloat(dataset[i].YEAR)) === "number"    &&
                typeof(parseFloat(dataset[i][" OCT"])) === "number" &&
                typeof(parseFloat(dataset[i][" NOV"])) === "number" &&
                typeof(parseFloat(dataset[i][" DEC"])) === "number"){
                    var temperature =  0.0
                    temperature += parseFloat(dataset[i][" OCT"]);
                    temperature += parseFloat(dataset[i][" NOV"]);
                    temperature += parseFloat(dataset[i][" DEC"]);
                    temperature = temperature / 3.0;
                    dataTemp[dataTemp.length] = [dataset[i].YEAR, temperature];
             }
         }
         generateBarChart(dataTemp)
    });

    // 4. quarter
    svg.append('rect').attr('width', 98).
    attr('height', 40).attr('x', 301).attr('y', 510).attr('rx', 20).attr('ry', 20).
    attr("stroke", "black").
    attr('fill', '#ff6300')
    svg.append('text').text(function(d){return "4. Quarter";}).
    attr("width", 60).attr("height", 70).attr("x", 303).attr("y", 535).on("click", function(d){
        var dataTemp = [];
         for (var i = 0; i < dataset.length; i++) {
             if(typeof(parseFloat(dataset[i].YEAR)) === "number"    &&
                typeof(parseFloat(dataset[i][" JUL"])) === "number" &&
                typeof(parseFloat(dataset[i][" AUG"])) === "number" &&
                typeof(parseFloat(dataset[i][" SEP"])) === "number"){
                    var temperature =  0.0
                    temperature += parseFloat(dataset[i][" JUL"]);
                    temperature += parseFloat(dataset[i][" AUG"]);
                    temperature += parseFloat(dataset[i][" SEP"]);
                    temperature = temperature / 3.0;
                    dataTemp[dataTemp.length] = [dataset[i].YEAR, temperature];
             }
         }
         generateBarChart(dataTemp)
    });

    // Yearly
    svg.append('rect').attr('width', 98).
    attr('height', 40).attr('x', 401).attr('y', 510).attr('rx', 20).attr('ry', 20).
    attr("stroke", "black").
    attr('fill', '#ff6300')
    svg.append('text').text(function(d){return "Yearly";}).
    attr("width", 60).attr("height", 70).attr("x", 420).attr("y", 535).on("click", function(d){
        var dataTemp = [];
         for (var i = 0; i < dataset.length; i++) {
             if(typeof(parseFloat(dataset[i].YEAR)) === "number"    &&
                typeof(parseFloat(dataset[i][" JAN"])) === "number" &&
                typeof(parseFloat(dataset[i][" FEB"])) === "number" &&
                typeof(parseFloat(dataset[i][" MAR"])) === "number" &&
                typeof(parseFloat(dataset[i][" APR"])) === "number" &&
                typeof(parseFloat(dataset[i][" MAY"])) === "number" &&
                typeof(parseFloat(dataset[i][" JUN"])) === "number" &&
                typeof(parseFloat(dataset[i][" JUL"])) === "number" &&
                typeof(parseFloat(dataset[i][" AUG"])) === "number" &&
                typeof(parseFloat(dataset[i][" SEP"])) === "number" &&
                typeof(parseFloat(dataset[i][" OCT"])) === "number" &&
                typeof(parseFloat(dataset[i][" NOV"])) === "number" &&
                typeof(parseFloat(dataset[i][" DEC"])) === "number"){
                    var temperature =  0.0
                    temperature += parseFloat(dataset[i][" JAN"]);
                    temperature += parseFloat(dataset[i][" FEB"]);
                    temperature += parseFloat(dataset[i][" MAR"]);
                    temperature += parseFloat(dataset[i][" APR"]);
                    temperature += parseFloat(dataset[i][" MAY"]);
                    temperature += parseFloat(dataset[i][" JUN"]);
                    temperature += parseFloat(dataset[i][" JUL"]);
                    temperature += parseFloat(dataset[i][" AUG"]);
                    temperature += parseFloat(dataset[i][" SEP"]);
                    temperature += parseFloat(dataset[i][" OCT"]);
                    temperature += parseFloat(dataset[i][" NOV"]);
                    temperature += parseFloat(dataset[i][" DEC"]);
                    temperature = temperature / 12.0;
                    dataTemp[dataTemp.length] = [dataset[i].YEAR, temperature];
             }
         }
         generateBarChart(dataTemp)


    });

    // // Below is code from https://github.com/jay3dec/MultiLineChart_D3/blob/master/index.html
    //     var q1 = [];
    //     var q2 = [];
    //     var q3 = [];
    //     var q4 = [];
    //      for (var i = 0; i < dataset.length; i++) {
    //          if(typeof(parseFloat(dataset[i].YEAR)) === "number"    &&
    //             typeof(parseFloat(dataset[i][" JAN"])) === "number" &&
    //             typeof(parseFloat(dataset[i][" FEB"])) === "number" &&
    //             typeof(parseFloat(dataset[i][" MAR"])) === "number" &&
    //             typeof(parseFloat(dataset[i][" APR"])) === "number" &&
    //             typeof(parseFloat(dataset[i][" MAY"])) === "number" &&
    //             typeof(parseFloat(dataset[i][" JUN"])) === "number" &&
    //             typeof(parseFloat(dataset[i][" JUL"])) === "number" &&
    //             typeof(parseFloat(dataset[i][" AUG"])) === "number" &&
    //             typeof(parseFloat(dataset[i][" SEP"])) === "number" &&
    //             typeof(parseFloat(dataset[i][" OCT"])) === "number" &&
    //             typeof(parseFloat(dataset[i][" NOV"])) === "number" &&
    //             typeof(parseFloat(dataset[i][" DEC"])) === "number"){
    //                 var temperature1 =  0.0;
    //                 var temperature2 =  0.0;
    //                 var temperature3 =  0.0;
    //                 var temperature4 =  0.0;
    //                 temperature1 += parseFloat(dataset[i][" JAN"]);
    //                 temperature1 += parseFloat(dataset[i][" FEB"]);
    //                 temperature1 += parseFloat(dataset[i][" MAR"]);
    //                 temperature2 += parseFloat(dataset[i][" APR"]);
    //                 temperature2 += parseFloat(dataset[i][" MAY"]);
    //                 temperature2 += parseFloat(dataset[i][" JUN"]);
    //                 temperature3 += parseFloat(dataset[i][" JUL"]);
    //                 temperature3 += parseFloat(dataset[i][" AUG"]);
    //                 temperature3 += parseFloat(dataset[i][" SEP"]);
    //                 temperature4 += parseFloat(dataset[i][" OCT"]);
    //                 temperature4 += parseFloat(dataset[i][" NOV"]);
    //                 temperature4 += parseFloat(dataset[i][" DEC"]);
    //
    //                 q1[q1.length] = {"x": dataset[i].YEAR, "y" : temperature1/3.0 };
    //                 q2[q2.length] = {"x": dataset[i].YEAR, "y" : temperature1/3.0 };
    //                 q3[q3.length] = {"x": dataset[i].YEAR, "y" : temperature1/3.0 };
    //                 q4[q4.length] = {"x": dataset[i].YEAR, "y" : temperature1/3.0 };
    //          }
    //      }
    //      d3.select('#visualisation'),
    //      WIDTH = 1000,
    //      HEIGHT = 500,
    //      MARGINS = {
    //          top: 20,
    //          right: 20,
    //          bottom: 20,
    //          left: 50
    //      },
    //      xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).
    //      domain([d3.min(q1, function(d) {return d.x;}), d3.max(q3, function(d) {
    //          return d.x;})]),
    //     yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).
    //     domain([d3.min(q1, function(d) { return d.y;}), d3.max(q3, function(d) {
    //         return d.y;})]),
    //
    //     xAxis = d3.svg.axis().scale(xRange).tickSize(5).tickSubdivide(true),
    //     yAxis = d3.svg.axis().scale(yRange).tickSize(5).orient('left')
    //             .tickSubdivide(true);
    //
    //     vis.append('svg:g').attr('class', 'x axis')
    //     .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
    //     .call(xAxis);
    //
    //     vis.append('svg:g').attr('class', 'y axis')
    //     .attr('transform', 'translate(' + (MARGINS.left) + ',0)').call(yAxis);

    });
}
