var React = require('react');
var ReactHighcharts = require('react-highcharts');

var config = {

	title: {
            text: 'Likes Per YEAR/MONTH/WEEK/DAY',
            x: -20 //center
        },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        title: {
            text: 'Likes'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: [{
        name: 'Last 12 Months',
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
    }]
};

var PeriodicalLine = React.createClass({

	render: function () {

		return (
			<ReactHighcharts config={config}></ReactHighcharts>
		);
	}
});

module.exports = PeriodicalLine;