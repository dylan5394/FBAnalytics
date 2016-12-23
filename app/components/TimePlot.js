var React = require('react');

var ReactHighcharts = require('react-highcharts');

var config = {

	chart: {
		type:'scatter',
		zoomType:'xy'
	},
	title: {
		text:'Likes vs Time of Posting'
	},
	xAxis: {
        type: 'datetime',
        tickInterval: 1.0 * 3600 * 1000,
        dateTimeLabelFormats: {
            hour: '%l %p'
        },
		title: {
			enabled: true,
			text: 'Time of Posting'
		},
        startOnTick:false,
        endOnTick:false,
        //min: Date.UTC(1970,1,1),
        //max: Date.UTC(2016,12,14),
        minPadding: 0,
        labels: {

            formatter: function () {

                return ReactHighcharts.Highcharts.dateFormat('%l %p', this.value, false);
            }
        }
	},
	yAxis: {
            title: {
                text: '# of Likes'
            }
    },
    plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x:%l:%M %p}, {point.y} likes'
                }
            }
    },
    series: [{
            name: 'All-Time Posts',
            color: 'rgba(223, 83, 83, .5)',
            data: []
        }]
};

var TimePlot = React.createClass({

	render: function () {

        config.series[0].data = this.props.seriesData;
		return (
			<ReactHighcharts config={config}></ReactHighcharts>
		);
	}
});

module.exports = TimePlot;

