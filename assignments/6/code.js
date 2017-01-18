d3.select(window).on("resize", throttle);



var zoom = d3.behavior.zoom().scaleExtent([1, 250]).on("zoom", move);

var colorScale;

var width = document.getElementById('map').offsetWidth;
var height = width * 0.75;
var padding = 20;

var topo,projection,path,svg,g, population, starYear, endYear, risePopulation;

var graticule = d3.geo.graticule();

var tooltip = d3.select("#map").append("div").attr("class", "tooltip hidden");

setup(width,height);

var getPercentage = function(population, startYear, endYear){
  var percentage = {}
  for (var area in population) {
      rise = population[area][endYear] - population[area][startYear];
      rise = rise / population[area][endYear]  *100;
      var kom = {
        kommune : area,
        people  : rise
      };
      percentage[area] = kom;
  }
  return percentage;
}

function setup(width, height){
  projection = d3.geo.mercator()
    .scale( width / 0.045 / Math.PI)
    .center([11.761550903320312, 56.19933674574226])
    .translate([(width/2), (height/2)]);

  path = d3.geo.path().projection(projection);

  svg = d3.select("#map").append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom)
      //.on("click", click)
      .append("g");

  g = svg.append("g")
         .on("click", click);
}


d3.json("/data/mapData.json", function(error, world) {
  //console.log(world.objects)
  d3.json("/data/kommunerBefolking.geojson", function(error, peopleData) {
  var countries = topojson.feature(world, world.objects.kommuner).features;
  population = peopleData;
  //d3.min(data, function(d) { return d.value; }))
  risePopulation = getPercentage(population, 2008, 2012);
  startYear = 2008;
  endYear = 2009;
  // for (var kommune in population) {
  //   for (var year in population[kommune]) {
  //     if (population[kommune][year] < min){
  //       min = population[kommune][year]
  //     };
  //     if (population[kommune][year] > max){
  //       max = population[kommune][year]
  //     };
  //   }
  // }
  colorScale = d3.scale.linear().domain([-20, 0, 20]).range(['blue', 'white','red']);
  topo = countries;
  draw(topo);


  });
});
function draw(topo) {

  var country = g.selectAll(".country").data(topo);

  country.enter().insert("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("id", function(d,i) {return d.properties.KOMNAVN; })
      .attr("title", function(d,i) { return d.properties.KOMNAVN; })
      .style("fill", function(d, i) { console.log(risePopulation[d.properties.KOMNAVN])
          return colorScale(risePopulation[d.properties.KOMNAVN]['people']);
      });

  //offsets for tooltips
  var offsetL = document.getElementById('container').offsetLeft+20;
  var offsetT = document.getElementById('container').offsetTop+10;

  //tooltips
  country
    .on("mousemove", function(d,i) {

      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

      tooltip.classed("hidden", false)
             .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
             .html(d.properties.KOMNAVN + "<br>" + 
               risePopulation[d.properties.KOMNAVN]['people'].toFixed(2));

      })
      .on("mouseout",  function(d,i) {
          div.transition()		
                .duration(500)		
                .style("opacity", 0);	
//        tooltip.classed("hidden", true);
      });



         // add the legend now
        var legendFullHeight = height;
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

        var legscale = ["blue", "white","red"];

        var lcolorScale = d3.scale.linear()
            .domain(linspace(-10, 10, legscale))
            .range(legscale);


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

        var pct = linspace(0, 100, legscale.length).map(function(d) {
            return Math.round(d) + '%';
        });

        var colourPct = d3.zip(pct, legscale);

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
            .domain([-20,20])
            .range([legendHeight, 0]);

        var legendAxis = d3.svg.axis()
            .scale(legendScale)
            .orient("right")
            .tickValues(d3.range(-20, 21, 5));

        legendSvg.append("g")
            .attr("class", "legend axis")
            .attr("transform", "translate(" + legendWidth * 2/3 + ", 0)")
            .call(legendAxis);




  //EXAMPLE: adding some capitals from external CSV file
  // d3.csv("data/country-capitals.csv", function(err, capitals) {
  //
  //   capitals.forEach(function(i){
  //     addpoint(i.CapitalLongitude, i.CapitalLatitude, i.CapitalName );
  //   });
  //
  // });

}


function redraw() {
  width = document.getElementById('container').offsetWidth;
  height = width / 2;
  d3.select('svg').remove();
  setup(width,height);
  draw(topo);
}


function move() {

  var t = d3.event.translate;
  var s = d3.event.scale;
  zscale = s;
  var h = height/4;


  t[0] = Math.min(
    (width/height)  * (s - 1),
    Math.max( width * (1 - s), t[0] )
  );

  t[1] = Math.min(
    h * (s - 1) + h * s,
    Math.max(height  * (1 - s) - h * s, t[1])
  );

  zoom.translate(t);
  g.attr("transform", "translate(" + t + ")scale(" + s + ")");

  //adjust the country hover stroke width based on zoom level
  d3.selectAll(".country").style("stroke-width", 1.5 / s);

}



var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redraw();
    }, 200);
}


//geo translation on mouse click in map
function click() {
  var latlon = projection.invert(d3.mouse(this));
  console.log(latlon);
}


//function to add points and text to the map (used in plotting capitals)
function addpoint(lon,lat,text) {

  var gpoint = g.append("g").attr("class", "gpoint");
  var x = projection([lon,lat])[0];
  var y = projection([lon,lat])[1];

  gpoint.append("svg:circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("class","point")
        .attr("r", 1.5);

  //conditional in case a point has no associated text
  if(text.length>0){

    gpoint.append("text")
          .attr("x", x+2)
          .attr("y", y+2)
          .attr("class","text")
          .text(text);
  }

}

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


