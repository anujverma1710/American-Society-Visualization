function american_society() {
    this.init()
}

american_society.prototype = {
    init() {
        console.log("Helllooooooo")

        d3.select("#plotter")
            .on("change", this.getDataToShow);


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


    });
}


