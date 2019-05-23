function american_society() {
    this.init()
}

american_society.prototype = {
    init() {
        d3.select("#plotter")
            .on("change", this.getDataToShow);

        d3.select("#profiler")
            .on("change", this.getDataToShow);

        d3.select("#year")
            .on("change", this.getDataToShow);



        this.getDataToShow();

    },
	
	getDataToShow() {
    	$('#stateID').val("")

        var attr = $('#plotter').val()
		var year = $('#year').val()

        get_map('/display_plots', attr, year);
    }
}


function get_map(url, attribute, year) {

    var state = $('#stateID').val()
    if(state!="") {
        queue()
            .defer(d3.csv, "/getDataPerState?state=" + state)
            .await(storeDataForAParticularState)
    }
    else{
        queue()
            .defer(d3.csv, "/getAggregateData")
            .await(aggregateDataStore)
    }
    $.getJSON($SCRIPT_ROOT + url, {
        attr: attribute
    }, function (result) {
        console.log(result)

        draw_usa_map(result, attribute, year);
    });

    queue()
        .defer(d3.csv,"/getDataPerYear?year=" + year)
		.await(storeDataForEveryAttribute);
}

function aggregateDataStore(error, data){
    var attr = $('#plotter').val()

    getStackedBarChart(data,attr)
}

function storeDataForAParticularState(error,data){
    console.log("In storeDataForAParticularState");
    console.log(data);
    var attr = $('#plotter').val()
	var profiler = $('#profiler').val()

    getStackedBarChart(data,attr)
	myParallel(data, type=2, profiler);

	var scData = [];
	data.forEach(function (d, i) {
		scData.push(
			{
				[""] : i,
				YEAR : d.YEAR,
				[profiler] : d[profiler],
				[attr + "_Ratio"] : d[attr + "_Ratio"]
			}
		)
	});

	ScatterPlot(scData, type=2);
}
function storeDataForEveryAttribute(error, data){
    console.log("error",error)
	console.log(data);
	
	var scData = [];
	var temp = $('#plotter').val() + "_Ratio";
	var profiler = $('#profiler').val()
	myParallel(data, type=1, profiler);

	data.forEach(function (d, i) {
		scData.push(
			{
				[""] : i,
				STATE : d.STATE,
				[profiler] : d[profiler],
				[temp] : d[temp]
			}
		)
	});

	ScatterPlot(scData, type=1);
}

function tooltipHtml(n, d, attr){	/* function to create html content string in tooltip div. */
	switch(attr){
		case "Sex": return "<h4>"+n+"</h4><table>"+
            "<tr><td >Sex Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+(d.Ratio)+"</td></tr>"+
            "<tr><td >Population </td><td>&nbsp;</td><td style='text-align: left'>"+(d.Population)+"</td></tr>"+
			"</table>";
		case "Race": return "<h4>"+n+"</h4><table>"+
            "<tr><td style='width: 100px'>Af-Am Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.AA_Ratio+"</td></tr>"+
			"<tr><td style='width: 100px'>Am-Ind Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.AI_Ratio+"</td></tr>"+
			"<tr><td style='width: 100px'>As-Pc Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.APAC_Ratio+"</td></tr>"+
			"<tr><td style='width: 100px'>White Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.W_Ratio+"</td></tr>"+
            "<tr><td style='width: 100px'>Population </td><td>&nbsp;</td><td style='text-align: left'>"+(d.Population)+"</td></tr>"+
			"</table>";
		case "Age": return "<h4>"+n+"</h4><table>"+
            "<tr><td style='width: 100px'>Af-Am Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.AA_Ratio+"</td></tr>"+
			"<tr><td style='width: 100px'>Am-Ind Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.AI_Ratio+"</td></tr>"+
			"<tr><td style='width: 100px'>As-Pc Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.APAC_Ratio+"</td></tr>"+
			"<tr><td style='width: 100px'>White Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.W_Ratio+"</td></tr>"+
            "<tr><td style='width: 100px'>Population </td><td>&nbsp;</td><td style='text-align: left'>"+(d.Population)+"</td></tr>"+
			"</table>";
		case "Native":
			return "<h4>"+n+"</h4><table>"+
            "<tr><td style='width: 100px'>Native Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.Native+"</td></tr>"+
			"<tr><td style='width: 100px'>Foreign Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.Foreign+"</td></tr>"+
            "<tr><td style='width: 100px'>Population </td><td>&nbsp;</td><td style='text-align: left'>"+(d.Population)+"</td></tr>"+
			"</table>";
		case "Urban":
			return "<h4>"+n+"</h4><table>"+
            "<tr><td style='width: 100px'>Urban Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.Urban+"</td></tr>"+
			"<tr><td style='width: 100px'>Suburban Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.Suburban+"</td></tr>"+
			"<tr><td style='width: 100px'>Rural Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.Rural+"</td></tr>"+
            "<tr><td style='width: 100px'>Population </td><td>&nbsp;</td><td style='text-align: left'>"+(d.Population)+"</td></tr>"+
			"</table>";
		case "Immigrant":
			return "<h4>"+n+"</h4><table>"+
            "<tr><td style='width: 100px'>Europe Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.Europe+"</td></tr>"+
			"<tr><td style='width: 100px'>Asia Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.Asia+"</td></tr>"+
			"<tr><td style='width: 100px'>Africa Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.Africa+"</td></tr>"+
			"<tr><td style='width: 100px'>Oceania Ratio </td><td>&nbsp;</td><td style='text-align: left'>"+d.Oceania+"</td></tr>"+
            "<tr><td style='width: 100px'>Americas </td><td>&nbsp;</td><td style='text-align: left'>"+(d.Americas)+"</td></tr>"+
			"<tr><td style='width: 100px'>Other </td><td>&nbsp;</td><td style='text-align: left'>"+(d.Other)+"</td></tr>"+
			"<tr><td style='width: 100px'>Population </td><td>&nbsp;</td><td style='text-align: left'>"+(d.Population)+"</td></tr>"+


			"</table>";

	}
}

function draw_usa_map(data, attr, year){
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
    var dataForStackedBarChart=[]
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
			sampleData[d] = getDataBasedonAttribute(attr,data[d],sampleData, Fips, year)
			testData.push(sampleData[d])
		});

	console.log("sampleData : ", sampleData)

    var selectedState = $('#stateID').val()
    if(selectedState!=""){
        $('#stateOrYear').text("State");
        $('#yearSpan').text(selectedState)
    }
	else{
	    $('#stateOrYear').text("Year");
	    $('#yearSpan').text($('#year').val())
    }

	$('#popSpan').text(fnum(totalPopulationOfUs[year]))
	if(attr =="Sex"){
		var temp = (totalMalePopulation[""+year]/totalFemalePopulation[""+year])*100
		$('#ratioSpan').text(temp.toFixed(2))
	}
	$('#ratioSpanLabel').text(attr +" Ratio")

	loadChloropethMap(testData, tooltipHtml,attr)
}



function getDataBasedonAttribute(attr, data, sample, Fips, year){
	var dict={}
	var low=Math.round(100*Math.random())
	switch(attr){
		case "Sex" : dict = getFormattedDataForSex(data,dict);
					sample = {
						State:data["STATE"],
						Fips:Fips[data["STATE"]],
						Ratio:dict[year] ,
                    	color:d3.interpolate("#ffffcc", "rgb(69, 173, 168)")(low/100),
                		Population:data["Total_Population_"+year]
					};
					return sample;
		case "Race": sample = {
						State:data["STATE"],
						Fips:Fips[data["STATE"]],
						AA_Ratio:(data["AA_Ratio_"+year]*100).toFixed(2) ,
						AI_Ratio:(data["AI_Ratio_"+year]*100).toFixed(2),
						APAC_Ratio:(data["APAC_Ratio_"+year]*100).toFixed(2) ,
						W_Ratio:(data["W_Ratio_"+year]*100).toFixed(2) ,
						color:d3.interpolate("#ffffcc", "rgb(69, 173, 168)")(low/100),
						Population:data["Total_Population_"+year]
					};
					return sample;
		case "Age": return {}
		case "Urban" :  sample={
						State:data["STATE"],
						Fips:Fips[data["STATE"]],
						color:d3.interpolate("#ffffcc", "rgb(69, 173, 168)")(low/100),
						Population:data["Total_Population_"+year],
						Urban:(data["Urban_Ratio_"+year]*100).toFixed(2) ,
						Suburban:(data["Suburban_Ratio_"+year]*100).toFixed(2),
						Rural:(data["Rural_Ratio_"+year]*100).toFixed(2)

					};
					return  sample;
		case "Native" : sample={
						State:data["STATE"],
						Fips:Fips[data["STATE"]],
						color:d3.interpolate("#ffffcc", "rgb(69, 173, 168)")(low/100),
						Population:data["Total_Population_"+year],
						Native:(data["Native_Ratio_"+year]*100).toFixed(2),
						Foreign:(data["Foreign_Ratio_"+year]*100).toFixed(2)
					};
					return  sample;

		case "Immigrant": sample={
						State:data["STATE"],
						Fips:Fips[data["STATE"]],
						color:d3.interpolate("#ffffcc", "rgb(69, 173, 168)")(low/100),
						Population:data["Total_Population_"+year],
						Europe:(data["Europe_Ratio_Foreign_"+year]*100).toFixed(2) ,
						Asia:(data["Asia_Ratio_Foreign_"+year]*100).toFixed(2),
						Africa:(data["Africa_Ratio_Foreign_"+year]*100).toFixed(2),
						Oceania:(data["Oceania_Ratio_Foreign_"+year]*100).toFixed(2),
						Americas:(data["Americas_Ratio_Foreign_"+year]*100).toFixed(2),
						Other:(data["Other_Ratio_Foreign_"+year]*100).toFixed(2)
					};
					return  sample;

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