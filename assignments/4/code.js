d3.select(window).on('load', init);

var w;
console.log(w)
var h = 700;
var padding = 20;

var hands = [];
var currentHandIndex = 0;
var hand = []

var xScale;
var yScale;

var handCircles;
var handLines;
var handFigure;
var pointGroup;


var primaryColor   = "#4c6aff";
var secondaryColor = "#4cc3ff";
var complemColor   = "#ff884c";

var lineWidth = 3;
var cirleRad  = 4;

// Takes a hand object and returns a list of (x,y) pairs
function parseHand(hand){
    var points = [];
    for (var i = 0; i < hand.length / 2 ; i++) {
            points[i] = {'x' : parseFloat(hand[i]) ,
                         'y' : parseFloat(hand[i + 56 ])
                     };
        }
        return points;
    }

function init() {
    w = document.getElementById('handViz').offsetWidth;
    var svg = d3.select("#handViz").append('svg').attr("width",w).attr('height',h);
    var my_data = d3.text("../../data/hands.csv", function(text){
        var data = d3.csv.parseRows(text).map(function(row) {
        return row.map(function(value) { return +value ;});
        });

        for (var i = 0; i < data.length; i++) {
            hands[i] = parseHand(data[i]);
        }

        var xMin = d3.min(hands, function(d){return d3.min(d, function(h){
            return h.x;})});
        var xMax = d3.max(hands, function(d){return d3.max(d, function(h){
            return h.x;})});

        xScale = d3.scale.linear()


        .domain([xMin, xMax])
        .range([0, w / 2]);

        yScale = d3.scale.linear()
        .domain([0.10, d3.max(hands, function(d){
            return d3.max(d, function(h){return h.y;})
        })])
        .range([0, h]);

        hand = hands[currentHandIndex];

        svg.append('line')
        .attr('x1', w/2)
        .attr('x2', w/2)
        .attr('y1', 0)
        .attr('y2', h)
        .attr('stroke-width', 2)
        .attr('stroke', complemColor)

        handFigure = svg.append('g').attr("id", "handFigure");

        handLines = handFigure.append('g').attr("id", "handLines");
        handLines.selectAll('line').data(hand).enter().append('line')
        .attr('x1', function(d, i){
            if(i > 0){
                return xScale(hands[currentHandIndex][i-1].x);
            }
            else{
                return xScale(d.x);
            }
        })
        .attr('y1', function(d, i){
            if(i > 0){
                return yScale(hands[currentHandIndex][i-1].y);
            }
            else{
                return yScale(d.y);
            }
        })
        .attr('x2', function(d){ return xScale(d.x)})
        .attr('y2', function(d){ return yScale(d.y)})
        .attr('stroke', secondaryColor)
        .attr('stroke-width', lineWidth);

        handCircles = handFigure.append('g').attr("id", "handCircles");
        handCircles.selectAll('circle').data(hand).enter().append('circle')
        .attr('r', cirleRad)
        .attr('cx', function(d){return xScale(d.x); })
        .attr('cy', function(d){return yScale(d.y); })
        .attr("fill", primaryColor);


    });


    var my_data1 = d3.text("../../data/hands_pca.csv", function(text){
        var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

        var data = d3.csv.parseRows(text).map(function(row) {
            return row.map(function(value) {
                return +value;
            });
        });


        data = d3.transpose(data);

        data = data.slice(0,40);

        var minX= d3.min(data[0], function(d) {
                  return +d;} );
        var maxX= d3.max(data[0], function(d) {
                  return +d;} );
        var minY= d3.min(data[1], function(d) {
                  return +d;} );
        var maxY= d3.max(data[1], function(d) {
                  return +d;} );
        console.log(minX);
        console.log(maxX);
        console.log(minY);
        console.log(maxY);


        var sx = d3.scale.linear()
            .domain([minX,maxX])
            .range([w/2, w]);

        var sy = d3.scale.linear()
            .domain([minY,maxY])
            .range([h,0]);


        pointGroup = svg.append('g').attr("id", "pointGroup");

        pointGroup.selectAll('circle')
            .data(data)
          .enter().append('circle')
            .attr('r', '5')
            .attr('cx', function(d){ return sx(d[0]); })
            .attr('cy', function(d){ return sy(d[1]); })
            .style("fill", "red")
            .on("mouseover", function(d) {
              div.transition()
                  .duration(200)
                  .style("opacity", .9);
              div .html("(" + d3.round(d[0],2) + ", " + d3.round(d[1],2) + ")")
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
              div.transition()
                  .duration(500)
                  .style("opacity", 0);
            });

    });


    d3.select('h6').on('click', function(){
        currentHandIndex = Math.floor(Math.random()*hands.length)
        console.log("Current Index: "  + currentHandIndex);
        hand = hands[currentHandIndex];

        handLines.selectAll('line').data(hand)
        .transition()
        .duration(500)
        .ease("elastic")
        .each("start", function(){
            d3.select(this)
            .attr('stroke-width', lineWidth * 2)
            .attr("stroke", complemColor);})
            .attr('x1', function(d, i){
                if(i > 0){
                    return xScale(hands[currentHandIndex][i-1].x);
                }
                else{
                    return xScale(d.x);
                }
                })
            .attr('y1', function(d, i){
                if(i > 0){
                    return yScale(hands[currentHandIndex][i-1].y);
                }
                else{
                    return yScale(d.y);
                }
            })
            .attr('x2', function(d){ return xScale(d.x)})
            .attr('y2', function(d){ return yScale(d.y)
        })
        .each('end', function(){
            d3.select(this)
            .transition()
            .duration(100)
            .attr('stroke-width', lineWidth)
            .attr('stroke', secondaryColor)}
        );

        handCircles.selectAll('circle').data(hand)
        .transition()
        .duration(500)
        .ease("elastic")
        .each("start", function(){d3.select(this)
                .attr('r', cirleRad*2)
                .attr("fill", complemColor);})
        .attr('cx', function(d){return xScale(d.x); })
        .attr('cy', function(d){return yScale(d.y); })
        .each('end', function(){
            d3.select(this)
            .transition()
            .duration(100)
            .attr('fill', secondaryColor)
            .attr('r', '3')
            });
    });
};
