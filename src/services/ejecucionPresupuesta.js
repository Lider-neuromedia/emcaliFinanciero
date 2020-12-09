export const optionsEjecucionAcum = {
    scales: { 
        xAxes: [{
            display: false,
            ticks: {
                beginAtZero: true,
            },
            gridLines: {
                display:false
            }
        }],
        yAxes: [{
            display: false,
            ticks: {
                beginAtZero: true,
            },
            gridLines: {
                display:false
            }
        }],
    },
    tooltips: {enabled: false},
    plugins: {
        datalabels: {
            color: '#365068',
            align: 'left',
            padding: 0,
            labels: {
                title: {
                    horizontalAlign: 'left', 
                },
                value: {
                    color: '#365068',
                }
            },
            formatter: function(value, context) {
                var currencyFormat = new Intl.NumberFormat('de-DE').format(value);
                return currencyFormat;
            }
        }
    }
}

export const optionsIngreVsGas = {
    scales: { 
        xAxes: [{
            ticks: {
                beginAtZero: true,
            },
            gridLines: {
                display:false
            }
        }],
        yAxes: [{
            display: false,
            ticks: {
                beginAtZero: true,
            },
            gridLines: {
                display:false
            }
        }],
    },
    title: {
        display: false
    },
    tooltips: {enabled: true},
    plugins: {
        datalabels: {
            color: '#365068',
            align: 'center',
            padding: 0,
            rotation: -90,
            labels: {
                value: {
                    color: '#365068',
                }
            },
            formatter: function(value, context) {
                var currencyFormat = new Intl.NumberFormat('de-DE').format(value);
                // if (currencyFormat.length >= 7) {
                //     return currencyFormat.substring(0, 11);
                // }else{
                //     return currencyFormat;
                // }
                return currencyFormat;
            }
        }
    }
}
