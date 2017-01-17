

var width = 660,
    height = 960,
    scale0 = (width - 1) / 1 / Math.PI;

var projection = d3.geo.mercator()
  .scale(1)
  .translate([0,0]);

var zoom = d3.behavior.zoom()
    .translate([-730, height / 0.1])
    .scale(scale0 * 25)
    .on("zoom", zoomed);

var path = d3.geo.path()
    .projection(projection);



var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g");

var g = svg.append("g");

svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height);

svg.call(zoom).call(zoom.event);

d3.json("../../data/kommunertopo.json", function(error, danmark) {
    if (error) throw error;
    d3.json("../../data/kommunerBefolking.geojson", function(error, people) {
        if (error) throw error;
  //width  = document.getElementById('map').offsetWidth;
  // height = document.getElementById('map').offsetHeight;
  console.log(danmark)
  g.append("path")
      .datum({type: "Sphere"})
      .attr("class", "sphere")
      .style('fill', '#A3CCFF')
      .attr("d", path);

  var featureCollection = topojson.feature(danmark, danmark.objects.kommuner);
  var b = d3.geo.bounds(featureCollection),
      s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

      //console.log("HERE")
    var geo = topojson.merge(danmark, danmark.objects.kommuner.geometries);

//    console.log("geo")
    console.log(danmark.objects.kommuner.geometries)

  g.append("path")
      .datum(geo)
      .attr("class", "land")
      .style('fill', function(d){return "#FFEBAF"})
      .attr("d", path);

  g.append("path")
      .datum(topojson.mesh(danmark, danmark.objects.kommuner, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
});
});

function zoomed() {
  projection
      .translate(zoom.translate())
      .scale(zoom.scale());

  g.selectAll("path")
      .attr("d", path);
}

