var linechart = function(svg1,data,sectorName) {
  
  if(sectorName == ''){
    var svg5 = d3.select("#linechart")
    svg5.selectAll("path").remove();
    svg5.selectAll("axisBottom").remove();
    // d3.selectAll(".y.axis").selectAll(".tick").selectAll("line").remove();
  }

  dataTemp = data;
  data = data.filter(function(d){ return d.Sector == sectorName })  

  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Sector == sectorName;})
    .entries(data);

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain(d3.extent(dataTemp, function(d) { return (d.Year < 2020) ? d.Year : 2020}))
    .range([ 0, width ]);
  svg1.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(10));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(dataTemp, function(d) { return +d.Price; })])
    .range([ height, 0 ]);
  svg1.append("g")
    .call(d3.axisLeft(y).ticks(5));

  // color palette
  var res = sumstat.map(function(d){ return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999','#916AA3', '#174009', '#cc37c0'])

  // Draw the line
  svg1.selectAll(".line")
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

