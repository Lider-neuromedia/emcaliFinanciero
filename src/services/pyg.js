/**
 * FUNCIONES DE FILTRADO.
 */

// Calulos filtrar por mes los ingresos..
export const filterColumnMes = (data, anio, nombreGerencia, mes, column) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia){
                validateNomGerencia = e.gerencia.toLowerCase() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }
        // Retorna data con validaciones.
        return (e.anio == anio && validateNomGerencia && e.mes === mes);
    });
    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b[column] || 0); 
    }, 0);

    return sumData;
}


/**
 * OPCIONES PARA GRAFICOS
 */
export const optionsIngresosOper = {
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
    title: {
        display: false
    },
    tooltips: {enabled: false},
    plugins: {
        datalabels: {
            color: '#365068',
            align: 'top',
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


export const optionsGroupBar = {
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
            align: 'top',
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