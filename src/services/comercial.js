/**
 * FUNCIONES DE FILTRADO.
*/

// Filtra por fecha en string.
export const filterConsumoTarifa = (data, unidad_negocio, fecha, producto, column) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de la unidad de negocio.
        var validateUnidadNegocio = false;
        //Validar la unidad de negocio. Pasando a minusculas todos los caracteres. 
        if(unidad_negocio !== 'all'){
            if(e.unidad_negocio){
                validateUnidadNegocio = e.unidad_negocio.toLowerCase() === unidad_negocio.toLowerCase();
            }
        }else{
            validateUnidadNegocio = true;
        }

        // Validar fecha.
        var validateFecha = e.fecha === fecha;


        var validateProducto = true;
        // Validate producto.
        if (producto !== null) {
            validateProducto = e.producto.toLowerCase() === producto.toLowerCase(); 
        }
        // Retorna data con validaciones.
        return (validateFecha && validateUnidadNegocio && validateProducto);
    });
    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b[column] || 0);
    }, 0);

    return sumData;
}

// Filtra por año. substrayendo los ulimos 4 digitos de la fecha.
// Limit es la cantidad de meses que se van a imprimir. por ejemplo, si vamos hasta agosto, mandamos 8. Para nivelar los datos.
export const filterConsumoAnio = (data, unidad_negocio, anio, producto, column, limit) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de la unidad de negocio.
        var validateUnidadNegocio = false;
        //Validar la unidad de negocio. Pasando a minusculas todos los caracteres. 
        if(unidad_negocio !== 'all'){
            if(e.unidad_negocio){
                validateUnidadNegocio = e.unidad_negocio.toLowerCase() === unidad_negocio.toLowerCase();
            }
        }else{
            validateUnidadNegocio = true;
        }

        // Validar anio.
        var anio_fecha = e.fecha.substring(6, 10);
        var validateAnio = anio_fecha == anio;

        var validateProducto = true;
        // Validate producto.
        if (producto !== null) {
            validateProducto = e.producto.toLowerCase() === producto.toLowerCase(); 
        }
        // Retorna data con validaciones.
        return (validateAnio && validateUnidadNegocio && validateProducto);
    });
    
    if(limit !== 12 && dataFilter.length === 12){
        var resta_limit = 12 - limit;
        for (let i = 0; i < resta_limit; i++) {
            dataFilter.pop();
        }
    }

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
    legend: {
        display: false
    },
    tooltips: {enabled: true},
    plugins: {
        datalabels: {
            color: '#365068',
            // align: 'top',
            padding: 0,
            rotation: -90,
            align: 'start',
            anchor: 'end',
            font: {
                size: 11,
            },
            labels: {
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
