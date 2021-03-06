
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

//var allDays = {points : []}

var updatePoints = function(robberies, json1){
    for (var i = 0; i < json1.features.length; i++) {
        for (var j = 0; j < robberies.values.length ; j++) {
            if(robberies.values[j].key === json1.features[i].properties.district){
                json1.features[i].properties.value =
                    robberies.values[j].values;
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
        d3.select("#Monday").on('click', function(){
            updatePoints(robberiesByDay.Monday, json);
            d3.select("#uiDay").text("Showing: Monday");
            d3.select("#uiNumber").text(
                'Crimes: ' + robberiesByDay.Monday.points.length
            );
        });
        d3.select("#Tuesday").on('click', function(){
            updatePoints(robberiesByDay.Tuesday, json);
            d3.select("#uiDay").text("Showing: Tuesday");
            d3.select("#uiNumber").text(
                'Crimes: ' + robberiesByDay.Tuesday.points.length
            );
        });
        d3.select("#Wednesday").on('click', function(){
            updatePoints(robberiesByDay.Wednesday, json);
            d3.select("#uiDay").text("Showing: Wednesday");
            d3.select("#uiNumber").text(
                'Crimes: ' + robberiesByDay.Wednesday.points.length
            );
        });
        d3.select("#Thursday").on('click', function(){
            updatePoints(robberiesByDay.Thursday, json);
            d3.select("#uiDay").text("Showing: Thursday");
            d3.select("#uiNumber").text(
                'Crimes: ' + robberiesByDay.Thursday.points.length
            );
        });
        d3.select("#Friday").on('click', function(){
            updatePoints(robberiesByDay.Friday, json);
            d3.select("#uiDay").text("Showing: Friday");
            d3.select("#uiNumber").text(
                'Crimes: ' + robberiesByDay.Friday.points.length
            );
        });
        d3.select("#Saturday").on('click', function(){
            updatePoints(robberiesByDay.Saturday, json);
            d3.select("#uiDay").text("Showing: Saturday");
            d3.select("#uiNumber").text(
                'Crimes: ' + robberiesByDay.Saturday.points.length
            );
        });
        d3.select("#Sunday").on('click', function(){
            updatePoints(robberiesByDay.Sunday, json);
            d3.select("#uiDay").text("Showing: Sunday");
            d3.select("#uiNumber").text(
                'Crimes: ' + robberiesByDay.Sunday.points.length
            );
        });


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

           svg.append('text')
           .attr('id', "uiDay")
           .attr('x' ,  20)
           .attr('y' , h -50 )
           .text('Showing: Monday');

          svg.append('text')
          .attr('id', "uiNumber")
          .attr('x' ,  20)
          .attr('y' , h -20 )
          .text('Crimes: ' + robberiesByDay.Monday.points.length);



          var barData = [];
          var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          for (day in robberiesByDay){
              barData[barData.length] = robberiesByDay[day].points.length
          }

          var svgBar = d3.select("#bar").append('svg')
          .attr("width",w)
          .attr('height',h/2);
          var barXScale = d3.scale.ordinal()
          .domain(days)
          .rangeRoundBands([padding * 2, w - padding ], 0.2);
          var barxAxsis = d3.svg.axis().scale(barXScale).orient("bottom");
          svgBar.append('g')
          .attr('class', 'barxAxsis')
          .attr("transform", "translate(0, " + (h/2 - padding) + ")")
          .call(barxAxsis);

          var barYScale = d3.scale.linear().domain([1500, 3450]).range([h/2 - padding, padding]);
          var baryAxsis = d3.svg.axis().scale(barYScale).orient("left").ticks(3);
          svgBar.append('g')
          .attr('class', 'barxAxsis')
          .attr("transform", "translate(" + padding * 2 + ",0)")
          .call(baryAxsis);


          var barYScale = d3.scale.linear().domain([1500, 3450]).range([padding, h/2 - padding]);
          svgBar.selectAll("rect")
          .data(barData)
          .enter()
          .append('rect')
          .attr('x', function(d,i){
              return barXScale(days[i]);
          })
          .attr('y', function(d){
              return h/2 - padding - barYScale(d);
          })
          .attr('fill', 'rgb(0,0,0)')
          .attr("width", barXScale.rangeBand())
          .attr("height", function(d,i){
              return barYScale(d);
          });
        });


         // add the legend now
        var legendFullHeight = h;
        var legendFullWidth = 90;

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

        var whitered = ["white","red"];

        var lcolorScale = d3.scale.linear()
            .domain(linspace(0, 60, whitered.length))
            .range(whitered);


        // style points
        d3.selectAll('circle')
          .attr('fill', function(d) {
                return lcolorScale(d.z);
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

        var pct = linspace(0, 100, whitered.length).map(function(d) {
            return Math.round(d) + '%';
        });

        var colourPct = d3.zip(pct, whitered);

        colourPct.forEach(function(d) {
            gradient.append('stop')
                .attr('offset', d[0])
                .attr('stop-color', d[1])
                .attr('stop-opacity', 1);
        });

        legendSvg.append('rect')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('width', legendWidth * 2/3)
            .attr('height', legendHeight)
            .style('fill', 'url(#gradient)');

        // create a scale and axis for the legend
        var legendScale = d3.scale.linear()
            .domain([0, 600])
            .range([legendHeight, 0]);

        var legendAxis = d3.svg.axis()
            .scale(legendScale)
            .orient("right")
            .tickValues(d3.range(0, 601, 100));

        legendSvg.append("g")
            .attr("class", "legend axis")
            .attr("transform", "translate(" + legendWidth * 2/3 + ", 0)")
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
