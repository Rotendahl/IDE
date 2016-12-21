d3.select(window).on('load', init);

var w;
var h = 700;
var padding = 20;

var xScale;
var yScale;

var primaryColor   = "#4c6aff";
var secondaryColor = "#4cc3ff";
var complemColor   = "#ff884c";

var districts;

var projection = d3.geo.albersUsa().translate([0, 0]).scale(1);

var path = d3.geo.path().projection(projection);

//
// var colorScale = d3.scale.linear().domain([0,10]).interpolate(d3.interpolateHcl)
//       .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);



function init() {
    w = document.getElementById('map').offsetWidth - padding;
    var svg = d3.select("#map").append('svg').attr("width",w).attr('height',h);
    districts = svg.append('g').attr("id", "districts");
    var districtsData = d3.json("../../data/districts.geojson", function(json){
        var b = path.bounds( json );
        var s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h);
        var t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

        // Update the projection
        projection.scale(s).translate(t);

        svg.append("rect")
        .attr("x", w - 100)
        .attr("y", 100)
        .attr("heigt", 100)
        .attr("width", 100);


        districts.selectAll("path")
               .data(json.features)
               .enter()
               .append("path")
               .attr("d", path)
               .style("fill", "steelblue");
           });

    };
