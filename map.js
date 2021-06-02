var mp =function(data){
    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let sectorWiseData = {};
    let sectorDataWhole = {};
    let sectorTotalCap = [{ sector: "test", parent: "" }];

    var dispatch = d3.dispatch("sectorClicked");
    dispatch.on('sectorClicked', function (sector) {
        bargraph(d3, sectorWiseData[sector], sector);
    })
    sectorDataWhole = data;

        sectorWiseData = data.reduce((sectorData, currentRow) => {
            if (!sectorData || (!(sectorData.hasOwnProperty(currentRow.Sector)))) {
                sectorData[currentRow.Sector] = [{ name: currentRow.Name, market_cap: parseInt(currentRow["Market Cap"]) || 0 }];
            } else {
                sectorData[currentRow.Sector].push({ name: currentRow.Name, market_cap: parseInt(currentRow["Market Cap"]) || 0 });
            }
            return sectorData;
        }, {});

        for (const sector in sectorWiseData) {
            sectorTotalCap.push({
                sector, parent: 'test', cap: sectorWiseData[sector].reduce((acc, currCompany) => {
                    acc += currCompany.market_cap;
                    return acc;
                }, 0)
            });
        }

        var svg = d3.select("#treemap")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var root = d3.stratify()
            .id(function (d) { return d.sector; })
            .parentId(function (d) { return d.parent; })
            (sectorTotalCap);
        root.sum(function (d) { return +d.cap })

        d3.treemap()
            .size([width, height])
            .padding(4)
            (root)

        svg
            .selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr("data-toggle", "modal")
            .attr("data-target", "#exampleModalScrollable")
            .on("mouseenter", function (d) {
                d3.select(this)
                    .attr("stroke", "white")
                    .transition()
                    .duration(200)
                    .style("fill", "#81a2d4")
                    .style("cursor", "pointer")
                    .attr("stroke-width", 1);
            })
            .on("mouseleave", function (d) {
                d3.select(this).transition()
                    .duration(200)
                    .style("fill", "#3d4c63")
                    .attr("stroke", "black")
            })
            .on('click', (e) => {
                dispatch._.sectorClicked[0].value(e.id);
            })
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .style("fill", "#3d4c63");

        svg
            .selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", function (d) { return d.x0 + 10 })    // +10 to adjust position (more right)
            .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
            .text(function (d) { return d.data.sector})
            .attr("font-size", "9px")
            .attr("fill", "white")
            .style("text-shadow", "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000")
            .attr("font-weight", "900")
}