d3.select(window).on('load', init);

var w = 500;
var h = 600;

// Takes a hand object and returns a list of (x,y) pairs
function parseHand(hand){
    var points = [];
    for (var i = 0; i < hand.length / 2 ; i++) {
            points[i] = {'x' : hand[i] , 'y' : hand[i + 56 ]};
        }
        return points;
    }

function init() {

    var svg = d3.select("#vis").append('svg').attr("width",w).attr('height',h);
    var my_data = d3.text("../../data/hands.csv", function(text){

        var data = d3.csv.parseRows(text).map(function(row) {
            return row.map(function(value) {
                return +value;
            });
        });
        console.log(data[0]);
        // Draw hand:
        svg.selectAll('circle').data(parseHand(data[0])).enter().append('circle')
        .attr('width', '10').attr('height', '10')
        .attr('x', function(d){return d.x })
        .attr('y', function(d){return d.y });
    });

};
