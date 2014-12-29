newtonChart = null;
global_config = 
{
	chart_resolution : 100,
	init_func : 'x^2',
	init_func_range : {min:0,max:100},
	init_func_scope : {x:1}

}
chart_config = {
    new_series: {
        data: [],
        name: global_config.init_func,
        enableMouseTracking: false,
        type: "line",
        dashStyle: "Solid",
        marker: {
            enabled: false
        },
        showInLegend: true,
        enableMouseTracking: false




    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>({point.x},{point.y})</b> ({point.change}%)<br/>',
        changeDecimals: 0,
        valueDecimals: 2
    },
    xAxis: {
        allowDecimals: false
    },
    yAxis: {
    	title: {
			text: null
    	}
    }

};



init = function() {
    //alert(math.round(math.e,3));
    $('#newtonForm').submit(function(event) {
        // prevent default browser behaviour
        //event.preventDefault();
        //do stuff with your form here      

    });
    initChart();


};
getNewtonParams = function() {
    var newtonParams = {};
    var inputFunction = $('.newtonForm').find('#inputFunction').val();
    var inputGuess = $('.newtonForm').find('#inputGuess').val();
    var inputIterations = $('.newtonForm').find('#inputIterations').val();
    //alert(inputGuess);
    var scope = {
        x: parseFloat(inputGuess)
    };

    newtonParams = {
        func: inputFunction,
        guess: inputGuess,
        iter: inputIterations
    };

    return newtonParams;


}
initChart = function() {
    var init_xAxis = chart_config.xAxis;
    var init_yAxis = chart_config.yAxis;
    var init_series = chart_config.new_series;
    var init_tooltip = chart_config.tooltip;


    var init_data = dataFromFunc(global_config.init_func,global_config.init_func_scope,global_config.init_func_range);
    init_series.data = init_data;


    newtonChart = $('#newtonChart').highcharts({
    	xAxis: init_xAxis,
    	series: [
    		init_series
    	],
    	tooltip: init_tooltip,
    	yAxis: init_yAxis
    });


}
constructNewtonChart = function(newtonParams) {





}

fprime = function(f, scope) {
    var dx = 1e-10 //smallest number possible in javascript while keeping precision. Going smaller just causing rounding errors.

    var scope2 = $.extend({}, scope); //second scope object, cloned form origonal
    scope2.x = scope2.x + dx; //add small increment in x
    var dy = math.eval(f, scope2) - math.eval(f, scope);
    var slope = dy / dx;
    return slope;

}
dataFromFunc = function(f, scope, range) {
	var dx = (range.max - range.min)/global_config.chart_resolution;
    var data = _.range(global_config.chart_resolution).map(function(num) {
		var new_x = range.min + num*dx;
		scope.x = new_x;
		new_y = math.eval(f,scope);

        return [new_x,new_y];
    });

    return data;

}
