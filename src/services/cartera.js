/**
 * FUNCIONES DE FILTRADO.
 */

// Calulos filtrar por mes los ingresos..
export const filterColumnMes = (data, nombreGerencia, mes, column) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_info_general){
                var gerencia_info_general = e.gerencia_info_general.toLowerCase();
                validateNomGerencia = gerencia_info_general.trim() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }
        // Retorna data con validaciones.
        return (validateNomGerencia && e.mes_info_general === mes);
    });
    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b[column] || 0); 
    }, 0);

    return sumData;
}

// Calulos filtro para estratos..
export const filterEstrato = (data, nombreGerencia, estadoResidencial, anio, mes, column) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_estrato){
                var gerencia_estrato = e.gerencia_estrato.toLowerCase();
                validateNomGerencia = gerencia_estrato.trim() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }

        // Validar el estado residencial o el estrato.
        var validateEstadoResi = false;
        if (e.estado_residencial_estrato) {
            validateEstadoResi = e.estado_residencial_estrato.toLowerCase() === estadoResidencial.toLowerCase();
        }

        // Retorna data con validaciones.
        return (anio === e.anio_estrato && validateNomGerencia && e.mes_estrato === mes && validateEstadoResi);
    });
    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b[column] || 0); 
    }, 0);

    return sumData;
}

// Calulos filtro para segmentos..
export const filterSegmento = (data, nombreGerencia, segmento, mes, column) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_segmento){
                var gerencia_segmento = e.gerencia_segmento.toLowerCase();
                validateNomGerencia = gerencia_segmento.trim() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }

        // Validar el estado residencial o el estrato.
        var validateSegmento = false;
        if (e.segmento) {
            validateSegmento = e.segmento.toLowerCase().trim() === segmento.toLowerCase().trim();
        }

        // Retorna data con validaciones.
        return (validateNomGerencia && e.mes_segmento === mes && validateSegmento);
    });
    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b[column] || 0); 
    }, 0);

    return sumData;
}

// Calulos filtro para cartera..
export const filterEdadCartera = (data, nombreGerencia, edadCartera, mes, column) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_cartera){
                var gerencia_cartera = e.gerencia_cartera.toLowerCase();
                validateNomGerencia = gerencia_cartera.trim() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }

        // Validar el estado residencial o el estrato.
        var validateCartera = false;
        if (e.edad_carterera) {
            validateCartera = e.edad_carterera.toLowerCase().trim() === edadCartera.toLowerCase().trim();
        }

        // Retorna data con validaciones.
        return (validateNomGerencia && e.mes_cartera === mes && validateCartera);
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
export const optionsInforGeneral = {
    scales: {
        yAxes: [{
            type: 'linear',
            display: false,
            position: 'left',
            id: 'y-axis-1',
            ticks: {
                beginAtZero: true,
            },
        },
        {
            type: 'linear',
            display: false,
            position: 'right',
            id: 'y-axis-2',
            ticks: {
                beginAtZero: true,
            },
            gridLines: {
                drawOnArea: false,
            },
        },
        ],
    },
}



export const optionsGroupBarHorizontal = {
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
            display: true,
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
            align: 'right',
            padding: 0,
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