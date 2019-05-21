function getStackedBarChart(result, attribute) {
    console.log("In stacked bar chart")
    var data = []
    console.log("Result : ", result);

    data = getFormattedDataForStackedBar(result,attribute)

    d3.select('#stackedBarID').remove()
    var margin = {top: 20, right: 160, bottom: 35, left: 70};
    var width = 870 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;
    var svg = d3.select("#stackedBarChart")
        .append("svg").attr("id", "stackedBarID")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parse = d3.time.format("%Y").parse;

    var sections =[]
    sections = getSectionedAttributes(attribute);
    console.log("Data", data, "Sections", sections);
    debugger;

// Transpose the data into layers
    var dataset = d3.layout.stack()(sections[0].map(function (fruit) {
        console.log(fruit);
        return data.map(function (d) {
            return {x: parse(d.year), y: +d[fruit]};
        });
    }));

    console.log("dataset : ",dataset);

    debugger;
// Set x, y and colors
    var x = d3.scale.ordinal()
        .domain(dataset[0].map(function (d) {
            return d.x;
        }))
        .rangeRoundBands([10, width - 10], 0.02);
    var y = d3.scale.linear()
        .domain([0, d3.max(dataset, function (d) {
            return d3.max(d, function (d) {
                return d.y0 + d.y;
            });
        })])
        .range([height, 0]);
    var colors = ["#b33040", "#d25c4d", "#f2b447", "#d9d574","#ffcccc"];

    // var colors = d3.scale.category10();
// Define and draw axes
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5)
        .tickSize(-width, 0, 0)
        .tickFormat(function (d) {
            return d
        });
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%Y"));
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
// Create groups for each series, rects for each segment
    var groups = svg.selectAll("g.cost")
        .data(dataset)
        .enter().append("g")
        .attr("class", "cost")
        .style("fill", function (d, i) {

            debugger;
            return colors[i];
        });
    var rect = groups.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x(d.x);
        })
        .attr("y", function (d) {
            return y(d.y0 + d.y);
        })
        .attr("height", function (d) {
            return y(d.y0) - y(d.y0 + d.y);
        })
        .attr("width", x.rangeBand())
        .on("mouseover", function (d) {

            var html = "<span>" + d.y+"</span>"
            d3.select("#statetooltip").transition().duration(200).style("opacity", .9).style("width", "100px");

            d3.select("#statetooltip").html(html)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .style("z-index",1);
        })
        .on("mouseout", function () {
            d3.select("#statetooltip").transition()
            .duration(300)
                .style("width", "200px")
            .style("opacity", 0);
        });


    colors = colors.slice(0,sections[0].length)
// Draw legend
    var legend = svg.selectAll(".legend")
        .data(colors)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(30," + i * 19 + ")";
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d, i) {
            return colors.slice()[i];
        });

    legend.append("text")
        .attr("x", width + 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d, i) {
                return getLabelsBasedOnAttribute(attribute,i);
        });
// Prep the tooltip bits, initial display is hidden
    var tooltip = d3.select('#statetooltip')

}

function getLabelsBasedOnAttribute(attr, i){
    if(attr == "Sex"){
        switch(i){
            case 0 : return "Female";
            case 1 : return "Male";
        }
    }
    else if(attr == "Race"){
        switch (i) {
                case 0:
                    return "AI";
                case 1:
                    return "APAC";
                case 2:
                    return "Africa";
                case 3:
                    return "Americas";
                case 4:
                    return "Asia"
            }
    }
    else if(attr == "Native"){
        switch (i) {
                case 0:
                    return "Native";
                case 1:
                    return "Foreign";
            }
    }
    else if(attr == "Immigrant"){
        switch (i) {
                case 0:
                    return "Europe";
                case 1:
                    return "Asia";
                case 2:
                    return "Africa";
                case 3:
                    return "Oceania";
                case 4:
                    return "Americas"

            }
    }
    else if(attr == "Urban"){
        switch (i) {
                case 0:
                    return "Urban";
                case 1:
                    return "Suburban";
                case 2:
                    return "Rural";
            }
    }
}
function getFormattedDataForStackedBar(result, attribute){

    var formattedData = []

    switch(attribute){
        case "Sex" :

            result.forEach(function(d){
                formattedData.push({

                year : d.YEAR,
                female : d.Female,
                male:d.Male
            })})
            return formattedData
        case "Race" :
            result.forEach(function (d) {
                formattedData.push(
                    {
                        year :d.YEAR,
                        AI : d.AI,
                        APAC : d.APAC,
                        Africa: d.Africa,
                        Americas: d.Americas,
                        Asia : d.Asia
                    }
                )
            })

            return formattedData

        case "Native" :
            result.forEach(function (d) {
                formattedData.push(
                    {
                        year :d.YEAR,
                        Native : d.Native,
                        Foreign : d.Foreign,
                    }
                )
            })

            return formattedData

        case "Urban" :
            result.forEach(function (d) {
                formattedData.push(
                    {
                        year :d.YEAR,
                        Urban : d.Urban,
                        Suburban : d.Suburban,
                        Rural : d.Rural

                    }
                )
            })

            return formattedData

        case "Immigrant" :
            result.forEach(function (d) {
                formattedData.push(
                    {
                        year :d.YEAR,
                        Europe : d.Europe,
                        Asia : d.Asia,
                        Africa : d.Africa,
                        Oceania : d.Oceania,
                        Americas : d.Americas
                    }
                )
            })

            return formattedData
    }
}

function getSectionedAttributes(attr){

    var arr = []

    switch (attr) {

        case "Sex" : arr.push(["female","male"])
                        return arr;
        case "Race" : arr.push(["AI","APAC","Africa","Americas","Asia"])
                        return arr;
        case "Native" : arr.push(["Native","Foreign"])
                        return arr;
        case "Urban" : arr.push(["Urban","Suburban","Rural"])
                        return arr;
        case "Immigrant" : arr.push(["Europe","Asia","Africa","Oceania","Americas","Other"])
                        return arr;

    }

}