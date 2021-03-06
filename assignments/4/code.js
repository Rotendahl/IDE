d3.select(window).on('load', init);

var w;
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
var points = [];


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


var updateHand = function(){
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
}

function init() {
    w = document.getElementById('handViz').offsetWidth - padding;
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

    d3.select("#rightPoint").on('mouseover', function(){
        currentHandIndex = 35;
        hand = hands[currentHandIndex];
        updateHand();
    })

    d3.select("#leftPoint").on('mouseover', function(){
        currentHandIndex = 30;
        hand = hands[currentHandIndex];
        updateHand();
    })

    d3.select("#lowleft").on('mouseover', function(){
        currentHandIndex = 39;
        hand = hands[currentHandIndex];
        updateHand();
    })

    d3.select("#top").on('mouseover', function(){
        currentHandIndex = 37;
        hand = hands[currentHandIndex];
        updateHand();
    })

    d3.select("#mid").on('mouseover', function(){
        currentHandIndex = 7;
        hand = hands[currentHandIndex];
        updateHand();
    })



    var my_data1 = d3.text("../../data/hands_pca.csv", function(text){
        var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

        var data = d3.csv.parseRows(text).map(function(row) {
            return row.map(function(value) {
                return +value;
            });
        });



        for (var i = 0; i < data.length; i++) {
            points[i] =  {'x' : data[i][0], 'y' : data[i][1]}
        }

        var minX= d3.min(points, function(d) {return +d.x;});
        var maxX= d3.max(points, function(d) {return +d.x;});
        var minY= d3.min(points, function(d) {return +d.y;});
        var maxY= d3.max(points, function(d) {return +d.y});


        var sx = d3.scale.linear()
            .domain([minX,maxX])
            .range([w/2 + padding, w - padding]);

        var sy = d3.scale.linear()
            .domain([minY,maxY])
            .range([h-  padding,0 + padding])
            ;

        console.log(sx(-0.48998377) + " og " + w/2)

        pointGroup = svg.append('g').attr("id", "pointGroup");
        pointGroup.selectAll('circle')
            .data(points)
          .enter().append('circle')
            .attr('r', '5')
            .attr('cx', function(d){ return sx(d.x); })
            .attr('cy', function(d){ return sy(d.y); })
            .style("fill", primaryColor)
            .on("mouseover", function(d, i ) {
                currentHandIndex = i;
                hand = hands[currentHandIndex];
                updateHand();

              div.transition()
                  .duration(200)
                  .style("opacity", .9);
              div .html("(" + d3.round(d.x,2) + ", " + d3.round(d.y,2) + ")"+
                        "<br>Hand number: " + i)
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");

            })
            .on("mouseout", function(d) {
              div.transition()
                  .duration(500)
                  .style("opacity", 0);
            })
    });
};
