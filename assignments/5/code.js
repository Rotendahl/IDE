
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

var colorScale = d3.scale.linear();

var mergedData = []

var pointGroup;

var json;

var robberiesByDay = {
    'Monday'    : {points :[]},
    'Tuesday'   : {points :[]},
    'Wednesday' : {points :[]},
    'Thursday'  : {points :[]},
    'Friday'    : {points :[]},
    'Saturday'  : {points :[]},
    'Sunday'    : {points :[]}
};


var updatePoints = function(robberies, json1){
    console.log(robberies);
    for (var i = 0; i < json1.features.length; i++) {
        for (var j = 0; j < robberies.values.length ; j++) {
            if(robberies.values[j].key === json1.features[i].properties.district){
                json1.features[i].properties.value =
                    robberies.values[j].values;
                    console.log("HERHEHREHEHREHHR");
                break;
            }
        }
    }
    districts.selectAll("path")
    .data(json1.features)
    .attr("d", path)
    .style("fill", function(d){
        if(d.properties.value){
            return colorScale(d.properties.value);
        }
        else{
            return "grey";
        }
    } );
    pointGroup.selectAll('circle').data(robberies.points)
    .transition()
    .duration(0)
    .attr('cx', function(d){return projection([d.X, d.Y])[0];})
    .attr('cy', function(d){return projection([d.X, d.Y])[1];})
}



function init() {

    w = document.getElementById('map').offsetWidth - padding;
    var svg = d3.select("#map").append('svg').attr("width",w).attr('height',h);
    districts = svg.append('g').attr("id", "districts");
    var districtsData = d3.json("../../data/districts.geojson", function(json){
        json = json;
        d3.select("#knap").on('click', function(){
            updatePoints(robberiesByDay.Friday, json);
        })
        var b = path.bounds( json );
        var s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h);
        var t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];
        // Update the projection
        projection.scale(s).translate(t);

        var crimeData = d3.csv("../../data/robberies.csv", function(csv_data) {
            // Crime per weekday
            for (var i = 0; i < csv_data.length; i++) {
                if(robberiesByDay[csv_data[i].DayOfWeek]){
                    robberiesByDay[csv_data[i].DayOfWeek].points.push(csv_data[i]);
                }
            }

            for (day in robberiesByDay){
                robberiesByDay[day].values =
                    d3.nest()
                    .key(function(d) {return d.PdDistrict; })
                    .rollup(function(leaves) { return leaves.length; })
                    .entries(robberiesByDay[day].points);
            }

            var min = d3.min(robberiesByDay.Monday.values, function (d){ return d.values});
            var max = d3.max(robberiesByDay.Monday.values, function (d){ return d.values});

            for (day in robberiesByDay){
                tempMin = d3.min(robberiesByDay[day].values, function (d){ return d.values});
                tempMax = d3.max(robberiesByDay[day].values, function (d){ return d.values});

                min = min < tempMin ? min : tempMin;
                max = max > tempMax ? max : tempMax;
            }

            colorScale.domain([0, max])
            .range(['white', 'red']);
            for (var i = 0; i < json.features.length; i++) {
                for (var j = 0; j < robberiesByDay.Monday.values.length ; j++) {
                    if(robberiesByDay.Monday.values[j].key === json.features[i].properties.district){
                        json.features[i].properties.value =
                            robberiesByDay.Monday.values[j].values;
                        break;
                    }
                }
            }
            districts.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function(d){
                if(d.properties.value){
                    return colorScale(d.properties.value);
                }
                else{
                    return "grey";
                }
            } );

            pointGroup = svg.append('g').attr("id", "pointGroup");
            pointGroup.selectAll("circle")
           .data(robberiesByDay.Monday.points)
           .enter()
           .append("circle")
           .attr("cx", function(d) {
                   return projection([d.X, d.Y])[0];
           })
           .attr("cy", function(d) {
                   return projection([d.X, d.Y])[1];
           })
           .attr("r", 3)
           .style("fill", "black")
           .style("opacity", 0.75);
        });

         // add the legend now
        var legendFullHeight = h;
        var legendFullWidth = 50;

        var legendMargin = { top: 20, bottom: 20, left: 5, right: 20 };

        // use same margins as main plot
        var legendWidth = legendFullWidth - legendMargin.left - legendMargin.right;
        var legendHeight = legendFullHeight - legendMargin.top - legendMargin.bottom;

        w = document.getElementById('map').offsetWidth - padding;
        var legendSvg = d3.select('#legend-svg')
            .attr('width', legendFullWidth)
            .attr('height', legendFullHeight)
            .append('g')
            .attr('transform', 'translate(' + legendMargin.left + ',' +
            legendMargin.top + ')');

        var scale = ["white","red"];

        var colorScale = d3.scale.linear()
            .domain(linspace(0, 20, scale.length))
            .range(scale);


        // style points
        d3.selectAll('circle')
          .attr('fill', function(d) {
                return colorScale(d.z);
          });

        // append gradient bar
        var gradient = legendSvg.append('defs')
            .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%') // bottom
            .attr('y1', '100%')
            .attr('x2', '0%') // to top
            .attr('y2', '0%')
            .attr('spreadMethod', 'pad');

        var pct = linspace(0, 100, scale.length).map(function(d) {
            return Math.round(d) + '%';
        });

        var colourPct = d3.zip(pct, scale);

        colourPct.forEach(function(d) {
            gradient.append('stop')
                .attr('offset', d[0])
                .attr('stop-color', d[1])
                .attr('stop-opacity', 1);
        });

        legendSvg.append('rect')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', 'url(#gradient)');

        // create a scale and axis for the legend
        var legendScale = d3.scale.linear()
            .domain([0, 20])
            .range([legendHeight, 0]);

        var legendAxis = d3.svg.axis()
            .scale(legendScale)
            .orient("right")
            .tickValues(d3.range(0, 20))
            .tickFormat(d3.format("d"));

        legendSvg.append("g")
            .attr("class", "legend axis")
            .attr("transform", "translate(" + legendWidth + ", 0)")
            .call(legendAxis);   
    
    });

    function linspace(start, end, n) {
        var out = [];
        var delta = (end - start) / (n - 1);

        var i = 0;
        while(i < (n - 1)) {
            out.push(start + (i * delta));
            i++;
        }

        out.push(end);
        return out;
    }
};
