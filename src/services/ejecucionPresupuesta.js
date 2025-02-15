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
        if(nombreGerencia !== 'all'){
            var validateNomGerencia = e.nombre_gerencia.toLowerCase() === nombreGerencia.toLowerCase();
        }else{
            var validateNomGerencia = true;
        }
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
        // Los filtros excluyen disponibilidad inicial si esta false. Para excluirla se convierte en minusculas y con esto se valida.
        var validateNombreGrupo = e.nombre_grupo.toLowerCase() !== 'disponibilidad inicial';
        // Se valida el tipo simulando un Like de mysql con este query.
        var validateTipo = e.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            var validateNomGerencia = e.nombre_gerencia.toLowerCase() === nombreGerencia.toLowerCase();
        }else{
            var validateNomGerencia = true;
        }
        // Retorna data con validaciones.
        return (e.anio === anio && validateNombreGrupo && (e.clase === undefined || e.clase === '0') && validateNomGerencia && validateTipo && e.mes === mes);
    });

    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor || 0); 
    }, 0);
    return sumData;
}

// Calulos para obtener la grafica de Ingresos vs gastos..
export const filterNameGroup = (data, anio, tipo, nombreGerencia, mes, namegroup) => {
    const dataFilter = data.filter((e) => {
        // Los filtros excluyen disponibilidad inicial si esta false. Para excluirla se convierte en minusculas y con esto se valida.
        var validateNombreGrupo = e.nombre_grupo.toLowerCase() === namegroup.toLowerCase();
        // Se valida el tipo simulando un Like de mysql con este query.
        var validateTipo = e.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            var validateNomGerencia = e.nombre_gerencia.toLowerCase() === nombreGerencia.toLowerCase();
        }else{
            var validateNomGerencia = true;
        }
        // Retorna data con validaciones.
        return (e.anio === anio && validateNombreGrupo && (e.clase === undefined || e.clase === '0') && validateNomGerencia && validateTipo && e.mes === mes);
    });

    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor || 0); 
    }, 0);
    return sumData;
}

// Calulos para obtener la grafica de gastos por año.
export const filterMesesGroup = (data, anio, tipo, nombreGerencia, meses, inversion = false, operacion = false, funcionalidad = false, servicio = false) => {
    const dataFilter = data.filter((e) => {
        // Si el parametro inversion esta verdadero. El filtro nombre de grupo cambia, y trae toda la informacion de inversion.
        if (inversion) {
            var string = 'INVERSION';
            var validateNombreGrupo = e.nombre_grupo.toLowerCase().indexOf(string.toLowerCase()) > -1;
        }else if (operacion) {
            var string = 'OPERACIÓN';
            var validateNombreGrupo = e.nombre_grupo.toLowerCase().indexOf(string.toLowerCase()) > -1;
        }else if (funcionalidad) {
            var string = 'FUNCIONAMIENTO';
            var validateNombreGrupo = e.nombre_grupo.toLowerCase().indexOf(string.toLowerCase()) > -1;
        }else if (servicio) {
            var string = 'SERVICIO DE LA DEUDA';
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
        if(nombreGerencia !== 'all'){
            // var validateNomGerencia = e.nombre_gerencia.toLowerCase() === nombreGerencia.toLowerCase();
            var validateNomGerencia = e.nombre_gerencia.toLowerCase() === nombreGerencia.toLowerCase();
        }else{
            var validateNomGerencia = true;
        }
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
    legend: {
        display: false
    },
    layout: {
        padding: {
            top: 0,
            bottom: 15
        }
    },
    tooltips: {enabled: false},
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
        datalabels: {
            color: '#000',
            align: 'end',
            anchor: 'end',
            font: {
                size: 11,
              },
            offset: -70,
            padding: 0,
            labels: {
                title: {
                    horizontalAlign: 'left', 
                },
                value: {
                    color: '#000',
                }
            },
            formatter: function(value, context) {
                var currencyFormat = new Intl.NumberFormat('de-DE').format(value / 1000000000);
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
        display: false,
    },
    legend: {
        display: false
    },
    layout: {
        padding: {
            top: 55,
            bottom: 10
        }
    },
    tooltips: {enabled: true},
    plugins: {
        datalabels: {
            color: '#000',
            padding: 0,
            rotation: -90,
            align: 'start',
            anchor: 'end',
            font: {
                size: 11,
            },
            offset: -50,
            labels: {
                value: {
                    color: '#000',
                },
            },
            formatter: function(value, context) {
                var currencyFormat = new Intl.NumberFormat('de-DE').format(value / 1000000000);
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
    legend: {
        display: false
    },
    layout: {
        padding: {
            top: 5,
            bottom: 15
        }
    },
    tooltips: {enabled: false},
    plugins: {
        datalabels: {
            color: '#000',
            align: 'end',
            anchor: 'end',
            font: {
                size: 11,
              },
            offset: -50,
            padding: 0,
            labels: {
                title: {
                    horizontalAlign: 'center', 
                },
                value: {
                    color: '#000',
                }
            },
            formatter: function(value, context) {
                var currencyFormat = new Intl.NumberFormat('de-DE').format(value / 1000000000);
                return currencyFormat;
            }
        }
    }
}

export const optionsGastosDoughnut = {
    tooltips: {enabled: false},
    legend: {
        display: false
    },
    layout: {
        padding: {
            top: 15,
            bottom: 15
        }
    },
    responsive: true,
    plugins: {
        datalabels: {
            color: '#000',
            align: 'center',
            padding: 0,
            labels: {
                title: {
                    horizontalAlign: 'center', 
                },
                value: {
                    color: '#000',
                }
            },
            formatter: function(value, context) {
                return value + '%';
            }
        }
    }
}

export const optionsStacked = {
    scales: {
      yAxes: [
        {
          stacked: true,
          
          gridLines: {
            display:false
          },
          display: false,
        },
      ],
      xAxes: [
        {
          stacked: true,
          gridLines: {
            display:false
          },
         
          display: false,

        },
      ],
    },
    plugins: {
        datalabels: {
            color: '#000',
            align: 'center',
            padding: 0,
            labels: {
                title: {
                    horizontalAlign: 'center', 
                },
                value: {
                    color: '#000',
                }
            },
            formatter: function(value, context) {
                return value + '%';
            }
        }
    }
  }