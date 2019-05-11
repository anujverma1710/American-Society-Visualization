function american_society() {
    this.init()
}

american_society.prototype = {
    init() {
        console.log("Helllooooooo")

        d3.select("#plotter")
            .on("change", this.getDataToShow);

        d3.select("#year")
            .on("change", this.getDataToShow);

        this.getDataToShow();

    },
	getDataToShow() {
        var attr = $('#plotter').val()
		var year = $('#year').val()

        get_map('/display_plots', attr, year);
    }
}


function get_map(url, attribute) {

$.getJSON($SCRIPT_ROOT + url, {
        attr: attribute
    }, function (result) {
        console.log(result)

        draw_usa_map(result, attribute);
    });
}

function tooltipHtml(n, d, attr){	/* function to create html content string in tooltip div. */
	switch(attr){
		case "Sex": return "<h4>"+n+"</h4><table>"+
            "<tr><td>Sex Ratio </td><td>&nbsp;</td><td>"+(d.Ratio)+"</td></tr>"+
            "<tr><td>Population </td><td>&nbsp;</td><td>"+(d.Population)+"</td></tr>"+
			"</table>";
		case "Race": return "<h4>"+n+"</h4><table>"+
            "<tr><td style='width: 100px'>Af-Am Ratio </td><td>&nbsp;</td><td>"+d.AA_Ratio+"</td></tr>"+
			"<tr><td style='width: 100px'>Am-Ind Ratio </td><td>&nbsp;</td><td>"+d.AI_Ratio+"</td></tr>"+
			"<tr><td style='width: 100px'>As-Pc Ratio </td><td>&nbsp;</td><td>"+d.APAC_Ratio+"</td></tr>"+
			"<tr><td style='width: 100px'>White Ratio </td><td>&nbsp;</td><td>"+d.W_Ratio+"</td></tr>"+
            "<tr><td style='width: 100px'>Population </td><td>&nbsp;</td><td>"+(d.Population)+"</td></tr>"+
			"</table>";

	}
}

function draw_usa_map(data, attr){
    var sampleData ={};	/* Sample random data. */
	var Fips = {
			"Alabama": 1,
			"Alaska" :2,
			"Arizona":4,
			"Arkansas":5,
			"California":6,
			"Colorado":8,
			"Connecticut":9,
			"Delaware":10,
			"District Of Columbia":11,
			"Florida":12,
			"Georgia":13,
			"Hawaii":15,
			"Idaho":16,
			"Illinois":17,
			"Indiana":18,
			"Iowa":19,
			"Kansas":20,
			"Kentucky":21,
			"Louisiana":22,
			"Maine":23,
			"Maryland":24,
			"Massachusetts":25,
			"Michigan":26,
			"Minnesota":27,
			"Mississippi":28,
			"Missouri":29,
			"Montana":30,
			"Nebraska":31,
			"Nevada":32,
			"New Hampshire":33,
			"New Jersey":34,
			"New Mexico":35,
			"New York":36,
			"North Carolina":37,
			"North Dakota":38,
			"Ohio":39,
			"Oklahoma":40,
			"Oregon":41,
			"Pennsylvania":42,
			"Rhode Island":44,
			"South Carolina":45,
			"South Dakota":46,
			"Tennessee":47,
			"Texas":48,
			"Utah":49,
			"Vermont":50,
			"Virginia":51,
			"Washington":53,
			"West Virginia":54,
			"Wisconsin":55,
			"Wyoming":56
		};
	var testData = []
	var totalPopulationOfUs = {}
	var totalMalePopulation = {}
	var totalFemalePopulation = {}
	for(i=1820;i<=2010; i=i+10){
		totalPopulationOfUs[i]=0
		totalMalePopulation[i]=0
		totalFemalePopulation[i]=0
	}
	d3.select('#statesvg').remove();

	d3.select('.legends').remove();


	["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
	"ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
	"MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
	"CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
	"WI", "MO", "AR", "OK", "KS", "LS", "VA"]
		.forEach(function(d){

			for(i=1820;i<=2010;i=i+10){
				totalPopulationOfUs[i]=totalPopulationOfUs[i]+data[d]["Total_Population_"+i]
				if(attr =="Sex") {
					totalMalePopulation[i] = totalMalePopulation[i] + data[d]["Male_Ratio_" + i] * data[d]["Total_Population_" + i]
					totalFemalePopulation[i] = totalFemalePopulation[i] + data[d]["Female_Ratio_" + i] * data[d]["Total_Population_" + i]
				}
			}
			sampleData[d] = getDataBasedonAttribute(attr,data[d],sampleData, Fips)
			testData.push(sampleData[d])
		});

	console.log("sampleData : ", sampleData)

	$('#yearSpan').text($('#year').val())
	$('#popSpan').text(fnum(totalPopulationOfUs[2010]))
	if(attr =="Sex"){
		var temp = (totalMalePopulation["2010"]/totalFemalePopulation["2010"])*100
		$('#ratioSpan').text(temp.toFixed(2))
	}
	$('#ratioSpanLabel').text(attr +" Ratio")

	loadChloropethMap(testData, tooltipHtml,attr)
	/* draw states on id #statesvg */
	// uStates.draw("#statesvg", sampleData, tooltipHtml, attr);

	// d3.select(self.frameElement).style("height", "600px");
}



function getDataBasedonAttribute(attr, data, sample, Fips){
	var dict={}
	var low=Math.round(100*Math.random())
	switch(attr){
		case "Sex" : dict = getFormattedDataForSex(data,dict);
					sample = {
						State:data["STATE"],
						Fips:Fips[data["STATE"]],
						Ratio:dict[2010] ,
                    	color:d3.interpolate("#ffffcc", "rgb(69, 173, 168)")(low/100),
                		Population:data["Total_Population_2010"]
					};
					return sample;
		case "Race": sample = {
						State:data["STATE"],
						Fips:Fips[data["STATE"]],
						AA_Ratio:(data["AA_Ratio_1970"]*100).toFixed(2) ,
						AI_Ratio:(data["AI_Ratio_1970"]*100).toFixed(2),
						APAC_Ratio:(data["APAC_Ratio_1970"]*100).toFixed(2) ,
						W_Ratio:(data["W_Ratio_1970"]*100).toFixed(2) ,
						color:d3.interpolate("#ffffcc", "rgb(69, 173, 168)")(low/100),
						Population:data["Total_Population_1970"]
					};
					return sample;

	}



}

function getFormattedDataForSex(data, dict){

	for(i=1820; i<=2010; i=i+10){
		dict[i] = ((data["Male_Ratio_" + i] /data["Female_Ratio_" + i])*100).toFixed(2)
	}
	return dict;
}

function fnum(x) {
	if(isNaN(x)) return x;

	if(x < 9999) {
		return x;
	}

	if(x < 1000000) {
		return Math.round(x/1000) + "K";
	}
	if( x < 10000000) {
		return (x/1000000).toFixed(2) + "M";
	}

	if(x < 1000000000) {
		return Math.round((x/1000000)) + "M";
	}

	if(x < 1000000000000) {
		return Math.round((x/1000000000)) + "B";
	}

	return "1T+";
}