// References
// Tooltip: http://bl.ocks.org/williaster/af5b855651ffe29bdca1
// Sc with Regression Line: https://bl.ocks.org/ctufts/298bfe4b11989960eeeecc9394e9f118
columnNames = [];
function ScatterPlot(data) {
    console.log("In ScatterPlot");
    columnNames = Object.keys(data[0]);
    columnNames.splice(0,1);
    console.log(columnNames);

    data.splice(8,1);
    data.splice(10,1);
    data.splice(1,1);

    document.getElementById("dualY-Scplot").innerHTML = "";
    var margin = {
        top: 20,
        right: 10,
        bottom: 30,
        left: 50
    },
    width = 750 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#dualY-Scplot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
        d[columnNames[1]] = +d[columnNames[1]];
        d[columnNames[2]] = +d[columnNames[2]];
    });

    var lineData = create_data(data);

    var line = d3.svg.line()
        .x(function(d) {
            return x(d.x);
        })
        .y(function(d) {
            return y(d.yhat);
        });

    x.domain(d3.extent(data, function(d) {
        return d[columnNames[1]];
    }));
    y.domain(d3.extent(data, function(d) {
        return d[columnNames[2]];
    }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(columnNames[1]);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(columnNames[2]);


    var tipMouseover = function(d) {
        var html  = d[columnNames[0]] + "<br/>" +
                    d[columnNames[1]] + "<br/>" +
                    d[columnNames[2]] + "<br/>";
        console.log(html);
        d3.select("#statetooltip").transition().duration(200).style("opacity", .9);
        d3.select("#statetooltip").html(html)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .style("z-index",1);

    };

    var tipMouseout = function(d) {
        d3.select("#statetooltip").transition()
            .duration(300)
            .style("opacity", 0);
    };

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) {
            return x(d[columnNames[1]]);
        })
        .attr("cy", function(d) {
            return y(d[columnNames[2]]);
        })
        .on("mouseover", tipMouseover)
        .on("mouseout", tipMouseout);

    svg.append("path")
        .datum(lineData)
        .attr("class", "line")
        .attr("d", line);

}

function create_data(data) {
    var x = [];
    var y = [];
    var n = data.length;
    var x_mean = 0;
    var y_mean = 0;
    var term1 = 0;
    var term2 = 0;
/*     var noise_factor = 100;
    var noise = 0;
    // create x and y values
    for (var i = 0; i < n; i++) {
        noise = noise_factor * Math.random();
        noise *= Math.round(Math.random()) == 1 ? 1 : -1;
        y.push(i / 5 + noise);
        x.push(i + 1);
        x_mean += x[i]
        y_mean += y[i]
    } */
    data.forEach(function (d) {
        x_mean += d[columnNames[1]];
        y_mean += d[columnNames[2]];
        x.push(d[columnNames[1]]);
        y.push(d[columnNames[2]])
    });
    // calculate mean x and y
    x_mean /= n;
    y_mean /= n;

    // calculate coefficients
    var xr = 0;
    var yr = 0;
    for (i = 0; i < x.length; i++) {
        xr = x[i] - x_mean;
        yr = y[i] - y_mean;
        term1 += xr * yr;
        term2 += xr * xr;

    }
    var b1 = term1 / term2;
    var b0 = y_mean - (b1 * x_mean);
    // perform regression 

    yhat = [];
    // fit line using coeffs
    for (i = 0; i < x.length; i++) {
        yhat.push(b0 + (x[i] * b1));
    }

    var returnData = [];
    for (i = 0; i < y.length; i++) {
        returnData.push({
            "yhat": yhat[i],
            "y": y[i],
            "x": x[i]
        })
    }
    return (returnData);
}