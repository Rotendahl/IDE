d3.select(window).on("resize", throttle);

// Constants
var zoom = d3.behavior.zoom().scaleExtent([1, 250]).on("zoom", move);
var colorScale;
var width = document.getElementById('map').offsetWidth;
var height = width * 0.75;
var graticule = d3.geo.graticule();
var tooltip = d3.select("#map").append("div").attr("class", "tooltip")
.style("opacity", 0);
var colors = ['#7ABFE1', '#F6A548','#E30813'];
var coloScale;
var minVal, maxVal;

// Top level variables
var topo, projection, path, svg, g, population, starYear, endYear;
var throttleTimer, risePopulation;

// legend
var legendFullHeight = height;
var legendFullWidth = 90;
var legendMargin = { top: 20, bottom: 20, left: -40, right: 0 };

// use same margins as main plot
var legendWidth  = legendFullWidth - legendMargin.left - legendMargin.right;
var legendHeight = legendFullHeight - legendMargin.top - legendMargin.bottom;


var legendSvg = d3.select('#legend-svg')
    .attr('width', legendFullWidth + 50)
    .attr('height', legendFullHeight)
    .append('g')
    .attr('transform', 'translate(' + legendMargin.left + ',' +
    legendMargin.top + ')');



setup(width,height);

d3.json("../../data/mapData.json", function(error, denmark) {
d3.json("../../data/kommunerBefolking.geojson", function(error, peopleByRegion) {
    var kommuner = topojson.feature(denmark, denmark.objects.kommuner).features;
    population = peopleByRegion;
    startYear = 2007;
    endYear = 2010;
    topo = kommuner;
    risePopulation = getPercentage(population, startYear, endYear);
    pops = []
    for (var key in risePopulation) {
       var obj = risePopulation[key];
       pops.push(obj['people']);

    }
    pops.push(0);
    minVal = d3.min(pops);
    maxVal = d3.max(pops);
    colorScale = d3.scale.linear().domain([minVal, 0, maxVal])
                 .range(colors);
    draw(topo);
});});


// Helper functions
function setup(width, height){
    projection = d3.geo.mercator()
    .scale( width / 0.045 / Math.PI)
    .center([11.761550903320312, 56.19933674574226])
    .translate([(width/2), (height/2)]);

    path = d3.geo.path().projection(projection);

    svg = d3.select("#map").append("svg").attr("width", width)
    .attr("height", height).call(zoom).append("g");

    g = svg.append("g");
}


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

var updateData = function(startYear, endYear){
    risePopulation = getPercentage(population, startYear, endYear);
    pops = []
    for (var key in risePopulation) {
       var obj = risePopulation[key];
       pops.push(obj['people']);

    }
    pops.push(0);
    minVal = d3.min(pops);
    maxVal = d3.max(pops);
    colorScale = d3.scale.linear().domain([minVal, 0, maxVal])
                 .range(colors);
    draw(topo);
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

    t[0] = Math.min((width/height)  * (s - 1),Math.max( width * (1 - s), t[0]));
    t[1] = Math.min(h * (s - 1) + h * s,Math.max(height * (1 - s) - h * s, t[1]));

    zoom.translate(t);
    g.attr("transform", "translate(" + t + ")scale(" + s + ")");
    d3.selectAll(".country").style("stroke-width", 1.5 / s);
}


function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redraw();
    }, 200);
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

// MADEST OF FUNCTIONS
function plus(theNumber)
{
    if(theNumber > 0){
        return "+" + theNumber;
    }else{
        return theNumber.toString();
    }
}

function round5up(x)
{
    return Math.ceil(x/5)*5;
}

function round5down(x)
{
    return Math.floor(x/5)*5;
}

d3.select('#slider').call(d3.slider().axis(true).min(2006).max(2015)
.step(1).value([2007, 2010])
.on("slide", function(evt, value) {
    if(value[0] < value[1]){
        startYear = value[0];
        endYear   = value[1];
    }
    else{
        startYear = value[1];
        endYear   = value[0];
    }
    d3.select('#range').text(startYear + "-" + endYear);
    updateData(startYear, endYear);
}));



function draw(topo) {
    var kommuner = g.selectAll(".kommuner").data(topo);

     //console.log(slide.value())
    kommuner.enter().insert("path")
    .attr("class", "kommune")
    .attr("d", path)
    .attr("id", function(d,i) {return d.properties.KOMNAVN; })
    .attr("title", function(d,i) { return d.properties.KOMNAVN; })
    .style("fill", function(d, i) {
          return colorScale(risePopulation[d.properties.KOMNAVN]['people']);
    });

    //Offsets for tooltips
    var offsetL = document.getElementById('container').offsetLeft+20;
    var offsetT = document.getElementById('container').offsetTop-40;

    //tooltips
    kommuner.on("mousemove", function(d,i) {
        var mouse = d3.mouse(svg.node()).map(function(d) {return parseInt(d);});
        tooltip.classed("hidden", false).attr("style",
            "left:"+(mouse[0])+"px;top:"+(mouse[1] + offsetT)+"px")
         .html(d.properties.KOMNAVN + "<br>" +
             plus(risePopulation[d.properties.KOMNAVN]['people'].toFixed(2)) +
             " %");
    })
    .on("mouseout",  function(d,i) {tooltip.style("opacity", 0);});

    legendSvg.selectAll('*').remove();

    // append gradient bar
    var gradient = legendSvg.append('defs')
        .append('linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%') // bottom
        .attr('y1', '100%')
        .attr('x2', '0%') // to top
        .attr('y2', '0%')
        .attr('spreadMethod', 'pad');

    var pct = linspace(0, 100, colors.length).map(function(d) {
        return Math.round(d) + '%';
    });

    var colourPct = d3.zip(pct, colors);

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
        .domain([round5down(minVal),round5up(maxVal)])
        .range([legendHeight, 0]);

    var legendAxis = d3.svg.axis()
        .scale(legendScale)
        .orient("right")
        .tickFormat(function(d) { return d + "%"; })
        .tickValues(d3.range(round5down(minVal), round5up(maxVal) + 1, 5));

    legendSvg.append("g")
        .attr("class", "legend axis")
        .attr("transform", "translate(" + legendWidth * 2/3 + ", 0)")
        .call(legendAxis);
}
