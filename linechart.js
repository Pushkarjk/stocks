var linechart = function(svg,data) {
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { console.log(d.Sector); return d.Sector;})
    .entries(data);

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return (d.Year < 2020) ? d.Year : 2020}))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(10));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.Price; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(5));

  // color palette
  var res = sumstat.map(function(d){ return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999','#916AA3', '#174009', '#cc37c0'])

  // Draw the line
  svg.selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x((d.Year < 2020) ? d.Year : 2020); })
            .y(function(d) { return y(+d.Price); })
            (d.values)
        })
    .on("click", function(d) {
        console.log(d)
        })

}

