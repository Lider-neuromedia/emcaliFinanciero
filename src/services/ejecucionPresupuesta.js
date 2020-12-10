/**
 * FUNCIONES DE FILTRADO.
 */

// Calulos para obtener la grafica de ejecución acumulada.
export const filterBasic = (data, anio, tipo, nombreGerencia) => {
    const dataFilter = data.filter((e) => {
        // Los filtros excluyen disponibilidad inicial. Para excluirla se convierte en minusculas y con esto se valida.
        var validateNombreGrupo = e.nombre_grupo.toLowerCase() !== 'disponibilidad inicial';
        // Se valida el tipo simulando un Like de mysql con este query.
        var validateTipo = e.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        var validateNomGerencia = e.nombre_gerencia.toLowerCase() === nombreGerencia.toLowerCase();
        // Retorna data con validaciones.
        return (e.anio === anio && validateNombreGrupo && (e.clase === undefined || e.clase === '0') && validateNomGerencia && validateTipo );
    });

    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor || 0);
    }, 0);

    return sumData;
}

// Calulos para obtener la grafica de Ingresos vs gastos..
export const filterMes = (data, anio, tipo, nombreGerencia, mes) => {
    const dataFilter = data.filter((e) => {
        // Los filtros excluyen disponibilidad inicial. Para excluirla se convierte en minusculas y con esto se valida.
        var validateNombreGrupo = e.nombre_grupo.toLowerCase() !== 'disponibilidad inicial';
        // Se valida el tipo simulando un Like de mysql con este query.
        var validateTipo = e.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        var validateNomGerencia = e.nombre_gerencia.toLowerCase() === nombreGerencia.toLowerCase();
        // Retorna data con validaciones.
        return (e.anio === anio && validateNombreGrupo && (e.clase === undefined || e.clase === '0') && validateNomGerencia && validateTipo && e.mes === mes );
    });

    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor || 0); 
    }, 0);
    
     
    return sumData;
}

// Calulos para obtener la grafica de gastos por año.
export const filterMesesGroup = (data, anio, tipo, nombreGerencia, meses, inversion = false) => {
    const dataFilter = data.filter((e) => {
        // Si el parametro inversion esta verdadero. El filtro nombre de grupo cambia, y trae toda la informacion de inversion.
        if (inversion) {
            var string = 'INVERSION';
            var validateNombreGrupo = e.nombre_grupo.toLowerCase().indexOf(string.toLowerCase()) > -1;
        }else{
            // Los filtros excluyen disponibilidad inicial. Para excluirla se convierte en minusculas y con esto se valida.
            var validateNombreGrupo = e.nombre_grupo.toLowerCase() !== 'disponibilidad inicial';
        }
        // Se valida el tipo simulando un Like de mysql con este query.
        var validateTipo = e.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        // se busca que el mes de la data este presente en el array recibido.
        var validateMeses = (meses.indexOf(e.mes) !== -1);
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        var validateNomGerencia = e.nombre_gerencia.toLowerCase() === nombreGerencia.toLowerCase();
        // Retorna data con validaciones.
        return (e.anio === anio && validateNombreGrupo && (e.clase === undefined || e.clase === '0') && validateNomGerencia && validateTipo && validateMeses);
    });
    
    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor || 0);
    }, 0);
    
    return sumData;
}
 
 /**
  * OPCIONES PARA GRAFICOS
  */
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

export const optionsGastos = {
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
            align: 'center',
            padding: 0,
            labels: {
                title: {
                    horizontalAlign: 'center', 
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

export const optionsGastosDoughnut = {
    tooltips: {enabled: false},
    plugins: {
        datalabels: {
            color: '#365068',
            align: 'center',
            padding: 0,
            labels: {
                title: {
                    horizontalAlign: 'center', 
                },
                value: {
                    color: '#365068',
                }
            },
            formatter: function(value, context) {
                return value + '%';
            }
        }
    }
}