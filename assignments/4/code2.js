d3.select(window).on('load', init);

var w = 500;
var h = 600;
var padding = 20;

    
/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 



function init() {

    var svg = d3.select("#vis").append('svg').attr("width",w).attr('height',h);
    var my_data = d3.text("../../data/hands_pca.csv", function(text){


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
            .range([0, w]);


        var sy = d3.scale.linear()
            .domain([minY,maxY])
            .range([h,0]);

        svg.selectAll('circle')
            .data(data)
          .enter().append('circle')
            .attr('r', '5')
            .attr('cx', function(d){return sx(d[0]); })
            .attr('cy', function(d){return sy(d[1]); })
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
            })
            .on("click", lol function)
            };
 
  });

}
