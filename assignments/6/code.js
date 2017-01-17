var width = 660,
    height = 660,
    scale0 = (width - 1) / 1 / Math.PI;

var projection = d3.geo.mercator();

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
  //width  = document.getElementById('map').offsetWidth;
  // height = document.getElementById('map').offsetHeight;
  if (error) throw error;
  console.log(danmark)
  g.append("path")
      .datum({type: "Sphere"})
      .attr("class", "sphere")
      .attr("d", path);

  g.append("path")
      .datum(topojson.merge(danmark, danmark.objects.kommuner.geometries))
      .attr("class", "land")
      .attr("d", path);

  g.append("path")
      .datum(topojson.mesh(danmark, danmark.objects.kommuner, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
});

function zoomed() {
  projection
      .translate(zoom.translate())
      .scale(zoom.scale());

  g.selectAll("path")
      .attr("d", path);
}

d3.select(self.frameElement).style("height", height + "px");
