function american_society() {
    this.init()
}

american_society.prototype = {
    init() {
        console.log("Helllooooooo")

        d3.select("#plotter")
            .on("change", this.getDataToShow);
        this.getDataToShow();

        // d3.select("#plotter")
        //     .on("change", this.getDataToShow);
        // d3.select("#sampler")
        //     .on("change", this.getDataToShow);
        // d3.select("#screeCheck")
        //     .on("change", this.getDataToShow);
        // d3.select("#highestCheck")
        //     .on("change", this.getDataToShow);
    },
    getDataToShow() {
        console.log($('#plotter').val())
        var attr = $('#plotter').val()
        get_map('/display_plots', attr);
    }
}


function get_map(url, attribute) {

$.getJSON($SCRIPT_ROOT + url, {
        attr: attribute
    }, function (result) {
        console.log(result)

        draw_usa_map();
    });
}

function tooltipHtml(n, d){	/* function to create html content string in tooltip div. */
		return "<h4>"+n+"</h4><table>"+
			"<tr><td>Low</td><td>"+(d.low)+"</td></tr>"+
			"<tr><td>Average</td><td>"+(d.avg)+"</td></tr>"+
			"<tr><td>High</td><td>"+(d.high)+"</td></tr>"+
			"</table>";


function draw_usa_map(){
    var sampleData ={};	/* Sample random data. */
	["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
	"ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
	"MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
	"CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
	"WI", "MO", "AR", "OK", "KS", "LS", "VA"]
		.forEach(function(d){
			var low=Math.round(100*Math.random()),
				mid=Math.round(100*Math.random()),
				high=Math.round(100*Math.random());
			sampleData[d]={low:d3.min([low,mid,high]), high:d3.max([low,mid,high]),
					avg:Math.round((low+mid+high)/3), color:d3.interpolate("#ffffcc", "rgb(69, 173, 168)")(low/100)};
		});

	/* draw states on id #statesvg */
	uStates.draw("#statesvg", sampleData, tooltipHtml);

	d3.select(self.frameElement).style("height", "600px");
}


