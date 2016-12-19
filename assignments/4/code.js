d3.select(window).on('load', init);

var w = 500;
var h = 600;


var hands = [];
var currentHandIndex = 0;
var hand = []

var xScale;
var yScale;

var handCircles;
var handLines;
var handFigure;


var primaryColor   = "#4c6aff"
var secondaryColor = "#4cc3ff"
var complemColor   = "#ff884c"

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
    var svg = d3.select("#vis").append('svg').attr("width",w).attr('height',h);
    var my_data = d3.text("../../data/hands.csv", function(text){
        var data = d3.csv.parseRows(text).map(function(row) {
        return row.map(function(value) { return +value ;});
        });

        for (var i = 0; i < data.length; i++) {
            hands[i] = parseHand(data[i]);
        }

        xScale = d3.scale.linear()
        .domain([0, d3.max(hands, function(d){
            return d3.max(d, function(h){return h.x;})
        })])
        .range([0, w]);

        yScale = d3.scale.linear()
        .domain([0, d3.max(hands, function(d){
            return d3.max(d, function(h){return h.y;})
        })])
        .range([0, h]);

        hand = hands[currentHandIndex];

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
