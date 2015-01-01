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
    },
    animationTime: 1000

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
        showInLegend: true




    },
    title: {
        text: 'Newtons Method'
    },
    subtitle: {
        text: ''
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>({point.x:.2f},{point.y:.2f})</b><br/>',
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
    //clear button foucus on click
    $(".btn").mouseup(function() {
        $(this).blur();
    })

};
getNewtonParams = function() {
    var inputFunction = $('.newtonForm').find('#inputFunction').val();
    var inputGuess = parseFloat($('.newtonForm').find('#inputGuess').val());
    var inputIterations = $('.newtonForm').find('#inputIterations').val();
    var inputMin = parseFloat($('.newtonForm').find('#inputRangeLow').val());
    var inputMax = parseFloat($('.newtonForm').find('#inputRangeHi').val());

    //need to perform validation......
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




};
initChart = function() {
    var copy_chart_config = $.extend(true, {}, chart_config);
    var init_xAxis = copy_chart_config.xAxis;
    var init_yAxis = copy_chart_config.yAxis;
    var init_series = copy_chart_config.new_series;
    var init_tooltip = copy_chart_config.tooltip;
    var init_chart = copy_chart_config.chart;
    var init_title = copy_chart_config.title;

    init_series.data = dataFromFunc(global_config.init_func, global_config.init_func_scope, global_config.init_func_range);


    newtonChart = $('#newtonChart').highcharts({
        xAxis: init_xAxis,
        series: [
            init_series
        ],
        tooltip: init_tooltip,
        yAxis: init_yAxis,
        chart: init_chart,
        title: init_title
    });
    newtonChart = $('#newtonChart').highcharts();




};
constructNewtonChart = function() {
    newtonChart.destroy();

    var copy_chart_config = $.extend(true, {}, chart_config);
    var init_xAxis = copy_chart_config.xAxis;
    var init_yAxis = copy_chart_config.yAxis;
    var init_series = copy_chart_config.new_series;
    var init_tooltip = copy_chart_config.tooltip;
    var init_chart = copy_chart_config.chart;
    var init_title = copy_chart_config.title;

    var init_data = dataFromFunc(newtonParams.func, newtonParams.scope, newtonParams.func_range);
    init_series.data = init_data;
    init_series.name = newtonParams.func;

    newtonChart = $('#newtonChart').highcharts({
        xAxis: init_xAxis,
        series: [
            init_series
        ],
        tooltip: init_tooltip,
        yAxis: init_yAxis,
        chart: init_chart,
        title: init_title
    });
    newtonChart = $('#newtonChart').highcharts();

    x0 = createPointSeries(0, [newtonParams.x0, 0]); //Add First x0 guess
    newtonChart.addSeries(x0);

    Session.set("currIter", 0); //The current iteration, x0, x1, etc
    Session.set("currIterStep", 0); //The animation step within the iteration.
    Session.set("currX", newtonParams.x0); //The value of x at the current iteration
    Session.set("nextX", newtonParams.x0); //The value of x at the next Iteration
    Session.set("newtonIsCreated", true);  //varaible to know if newton chart has been created.


};
newtonAnimate = function(chart) {
    var stepsPerIter = 3;
    //the only state you need is your current x0, if all you care about is the iteration cycle
    //but if i want to know about which step im in the iteration cycle
    //Session.set("newtonAnimateStep") = 
    var currIter = Session.get("currIter");
    var currIterStep = Session.get("currIterStep");
    var currX = Session.get("currX");

    //alert('newtonParams.iter ' + newtonParams.iter);
    if (currIter >= newtonParams.iter) {
        //alert('curr Iter >= newtonParams.iter');
        //return false; //reached our max iterations, return false to stop the animation.
        clearChartExcept(newtonChart, 2); //clear all the chart except the first two sereis, which are the fucntion and the initial guess

        Session.set("currIter", 0); //The current iteration, x0, x1, etc
        Session.set("currIterStep", 0); //The animation step within the iteration.
        Session.set("currX", newtonParams.x0); //The value of x at the current iteration
        Session.set("nextX", newtonParams.x0);
    	return true;
    }
    switch (currIterStep) {
        case 0: //create vertical line
            var newY = math.eval(newtonParams.func, {
                x: currX
            })
            chart.addSeries(createLineSeries(currIter, [
                [currX, 0],
                [currX, newY]
            ]))
            Session.set("currIterStep", 1);
            break;
        case 1: //create slope line
            var startY = math.eval(newtonParams.func, {
                x: currX
            })
            var startX = currX;

            deriv_startX = fprime(newtonParams.func, {
                x: currX
            });
            var endX = currX - (startY / deriv_startX);
            var endY = 0;

            chart.addSeries(createLineSeries(currIter, [
                [startX, startY],
                [endX, endY]
            ]))
            Session.set("currIterStep", 2);
            Session.set("nextX", endX);

            break;
        case 2: //create new iter point, update iteration
            var currX = Session.get('nextX');
            var currY = 0;

            currIter = Session.get('currIter') + 1;
            chart.addSeries(createPointSeries(currIter, [currX, currY]));

            Session.set('currX', currX);
            Session.set("currIterStep", 0);
            Session.set('currIter', currIter);
            break;

        default:
            //log error??
            break;
    }
    return true;

    // 
};
clearChartExcept = function(chart, num) {
    while (chart.series.length > num)
        chart.series[chart.series.length - 1].remove(true);
};
createPointSeries = function(xnum, point) {
    var x0 = $.extend(true, {}, chart_config.new_series);
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
};
createLineSeries = function(xnum, line) {
    var series = $.extend(true, {}, chart_config.new_series);
    series.data = line;
    series.name = 'x' + xnum + 'line';
    series.enableMouseTracking = false;
    series.type = 'line';
    series.marker = {
        enabled: false
    };
    series.dashStyle = 'shortDash';
    series.showInLegend = false;
    series.color = "#000";
    return series;

};

fprime = function(f, scope) {
    var dx = 1e-10 //smallest number possible in javascript while keeping precision. Going smaller just causing rounding errors.

    var scope2 = $.extend({}, scope); //second scope object, cloned form origonal
    scope2.x = scope2.x + dx; //add small increment in x
    var dy = math.eval(f, scope2) - math.eval(f, scope);
    var slope = dy / dx;
    return slope;

};
dataFromFunc = function(f, scope, range) {
    var dx = (range.max - range.min) / global_config.chart_resolution;
    var data = _.range(global_config.chart_resolution).map(function(num) {
        var new_x = range.min + num * dx;
        scope.x = new_x;
        new_y = math.eval(f, scope);

        return [new_x, new_y];
    });

    return data;

};
