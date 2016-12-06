d3.select(window).on('load', init);

function init() {
var my_data = [1,2,3,4,5,6,7,8,9,10];
    d3.select("#list").selectAll('li').data(my_data).
    enter().append("li").text(
        function (d) {return "Dette er punkt: " + d;}
    );

    d3.select("#bars").selectAll('div').data(my_data).enter().append("div").
    style("width", "10px").style("display", "inline-block").
    style("background-color", "red").style(
        "height", function(d) {return "" + (d * 10);}
    );

    var w = 500;
    var h = 300;
    var data = [[100, 237, 4], [217, 132, 5], [160, 110, 7], [106, 123, 8]];
    var svg = d3.select("#circle").append('svg').attr("width",w).attr('height',h)

    svg.selectAll('circle').data(data).enter().append('circle').attr('cx',
    function(d){ return "" + d[0];}).attr('cy',function(d){ return "" + d[1];}).
    attr('r',function(d){ return "" + d[2];}).attr('style',function(d){
        return "fill : rgb(" + d[2] *10 +", " +  d[2] *50  +", " + d[2] + ")" ;})
}
