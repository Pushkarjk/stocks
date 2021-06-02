var bargraph = function (d3, data = [], sector) {



    let svgElement = document.getElementById('lineGr');
    let sectorName = document.getElementById("sectorName").innerHTML = sector;


    if (data.length === 0) {
        sectorName = document.getElementById("sectorName").innerHTML = sector + ": DATA NOT AVAILABLE";
    }

    if (svgElement) {
        svgElement.remove();
    }

    console.log(data)

    var margin = { top: 20, right: 30, bottom: 40, left: 250 },
        width = 600 - margin.left - margin.right,
        height = Math.min(1000, data.length * 50) - margin.top - margin.bottom;

    var svg = d3.select("#bargraph")
        .append("svg")
        .attr("id", "lineGr")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => {
            return d.market_cap;
        })])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(function (d) { return d / 1000000 > 1000 ? d / 1000000000 + " B" : d / 1000000 + " M" }))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    var y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(function (d) { return d.name; }))
        .padding(.1);
    svg.append("g")
        .call(d3.axisLeft(y))

    svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", function (d) { return y(d.name); })
        .attr("width", function (d) { return x(d.market_cap); })
        .attr("height", y.bandwidth())
        .attr("fill", "#19aade")

};
