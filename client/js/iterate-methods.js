newtonChart = null;
global_config = {
    chart_resolution: 100,
    init_func: 'x^2',
    init_func_range: {
        min: 0,
        max: 100
    },
    init_func_scope: {
        x: 1
    }

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
        valueDecimals: 1
    },
    xAxis: {
        allowDecimals: false
    },
    yAxis: {
        title: {
            text: null
        }
    },
    chart: {
        zoomType: "xy"
    }
};
newtonParams = {};


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
    var inputFunction = $('.newtonForm').find('#inputFunction').val();
    var inputGuess = parseFloat($('.newtonForm').find('#inputGuess').val());
    var inputIterations = $('.newtonForm').find('#inputIterations').val();
    var inputMin = parseFloat($('.newtonForm').find('#inputRangeLow').val());
    var inputMax = parseFloat($('.newtonForm').find('#inputRangeHi').val());
    //alert(inputGuess);
    var inputScope = {
        x: parseFloat(inputGuess)
    };

    newtonParams = {
        x0: inputGuess,
        func: inputFunction,
        scope: inputScope,
        iter: inputIterations,
        func_range: {
            min: inputMin,
            max: inputMax
        }
    };

    


}
initChart = function() {
    var init_xAxis = chart_config.xAxis;
    var init_yAxis = chart_config.yAxis;
    var init_series = chart_config.new_series;
    var init_tooltip = chart_config.tooltip;
    var init_chart = chart_config.chart;

    var init_data = dataFromFunc(global_config.init_func, global_config.init_func_scope, global_config.init_func_range);
    init_series.data = init_data;


    newtonChart = $('#newtonChart').highcharts({
        xAxis: init_xAxis,
        series: [
            init_series
        ],
        tooltip: init_tooltip,
        yAxis: init_yAxis,
        chart: init_chart
    });
    newtonChart = $('#newtonChart').highcharts();




}
constructNewtonChart = function() {
    newtonChart.destroy();

    var init_xAxis = chart_config.xAxis;
    var init_yAxis = chart_config.yAxis;
    var init_series = chart_config.new_series;
    var init_tooltip = chart_config.tooltip;
    var init_chart = chart_config.chart;

    var init_data = dataFromFunc(newtonParams.func, newtonParams.scope, newtonParams.func_range);
    init_series.data = init_data;

    newtonChart = $('#newtonChart').highcharts({
        xAxis: init_xAxis,
        series: [
            init_series
        ],
        tooltip: init_tooltip,
        yAxis: init_yAxis,
        chart: init_chart
    });
    newtonChart = $('#newtonChart').highcharts();

    x0 = createPointSeries(0, [newtonParams.x0, 0]); //Add First x0 guess
    newtonChart.addSeries(x0);

    Session.setDefault("currIter", 0); //The current iteration, x0, x1, etc
    Session.setDefault("currIterStep", 0); //The animation step within the iteration.
    Session.setDefault("currX",newtonParams.x0);


}
newtonAnimate = function(chart) {
    var stepsPerIter = 3;
    //the only state you need is your current x0, if all you care about is the iteration cycle
    //but if i want to know about which step im in the iteration cycle
    //Session.set("newtonAnimateStep") = 
    var currIter = Session.get("currIter");
    var currIterStep = Session.get("currIterStep");
    var currX = Session.get("currX");
    switch (currIterStep) {
        case 0: //create vertical line
        	var newY = math.eval(newtonParams.func,{x:currX})
        	chart.addSeries(createVertLineSeries(currIter,[[currX,0],[currX,newY]]))
        	Session.set("currIterStep", 1);
            break;
        case 1: //create create slope
         	var startY = math.eval(newtonParams.func,{x:currX})
         	var startX = currX;

         	deriv_startX = fprime(newtonParams.func,{x:currX});
         	var endX = currX - (startY / deriv_startX);
         	var endY = 0;

        	chart.addSeries(createVertLineSeries(currIter,[[startX,startY],[endX,endY]]))
        	Session.set("currIterStep", 2);       	

            break;
        case 2: //create new iter point, update iteration


            break;
        default:
            //log error??
            break;
    }


    

    // 
}
createPointSeries = function(xnum, point) {
    var x0 = chart_config.new_series;
    x0.data = [point];
    x0.name = 'x' + xnum;
    x0.enableMouseTracking = true;
    x0.type = 'scatter';
    x0.marker = {
        enabled: true
    };
    x0.showInLegend = true;
    x0.color = "#000";
    return x0;
}
createVertLineSeries = function(xnum, line) {
    var series = chart_config.new_series;
    series.data = line;
    series.name = 'x' + xnum + 'vert_line';
    series.enableMouseTracking = false;
    series.type = 'line';
    series.marker = {
        enabled: false
    };
    series.dashStyle = 'shortDash';
    series.showInLegend = false;
    series.color = "#000";
    return series;

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
    var dx = (range.max - range.min) / global_config.chart_resolution;
    var data = _.range(global_config.chart_resolution).map(function(num) {
        var new_x = range.min + num * dx;
        scope.x = new_x;
        new_y = math.eval(f, scope);

        return [new_x, new_y];
    });

    return data;

}
