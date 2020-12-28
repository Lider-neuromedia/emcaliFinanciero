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


// Calulos filtrar por mes por el tipo
export const filterColumnMesTipo = (data, anio, nombreGerencia, mes, tipo) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_ingreso){
                validateNomGerencia = e.gerencia_ingreso.toLowerCase() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }

        var validateTipo = false;
        if(e.tipo_costo_venta !== undefined){
            validateTipo = e.tipo_costo_venta.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }
        // var validateTipo = e.tipo_ingreso.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        // Retorna data con validaciones.
        return (e.anio_ingreso == anio && validateNomGerencia && e.mes_ingreso === mes && validateTipo);
    });
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_ingreso || 0);
    }, 0);
    return sumData;
}

// Calulos filtrar por mes por el tipo
export const filterColumnMesTipo2 = (data, anio, nombreGerencia, mes, tipo) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_costo_venta){
                validateNomGerencia = e.gerencia_costo_venta.toLowerCase() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }
        var validateTipo = false;
        if(e.tipo_costo_venta !== undefined){
            validateTipo = e.tipo_costo_venta.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }
        // Retorna data con validaciones.
        return (e.anio_costo_venta == anio && validateNomGerencia && e.mes_costo_venta === mes && validateTipo);
    });
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_costo_venta || 0);
    }, 0);
    return sumData;
}

export const filterColumnMesTipo3 = (data, anio, nombreGerencia, mes, tipo) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_gastos_oper){
                validateNomGerencia = e.gerencia_gastos_oper.toLowerCase() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }
        var validateTipo = false;
        if(e.tipo_gastos_oper !== undefined){
            validateTipo = e.tipo_gastos_oper.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }
        // Retorna data con validaciones.
        return (e.anio_gastos_oper == anio && validateNomGerencia && e.mes_gastos_oper === mes && validateTipo);
    });
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_gastos_oper || 0);
    }, 0);
    return sumData;
}

export const filterColumnMesTipo4 = (data, anio, nombreGerencia, mes, tipo) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_costo_venta){
                validateNomGerencia = e.gerencia_costo_venta.toLowerCase() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }
        var validateTipo = false;
        if(e.costo_venta !== undefined){
            validateTipo = e.costo_venta.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }
        console.log(e.costo_venta);
        // Retorna data con validaciones.
        return (e.anio_costo_venta == anio && validateNomGerencia && e.mes_costo_venta === mes && validateTipo);
    });
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_costo_venta || 0);
    }, 0);
    return sumData;
}

// Calulos filtrar por mes por el tipo
export const filterColumnMesTipoCostoVenta = (data, anio, nombreGerencia, mes, tipo, tipoCosto) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_costo_venta){
                validateNomGerencia = e.gerencia_costo_venta.toLowerCase() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }

        var validateTipo = false;
        if(e.tipo_costo_venta !== undefined){
            validateTipo = e.tipo_costo_venta.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }

        var validatetipoCosto = false;
        if(e.costo_venta !== undefined){
            validatetipoCosto = e.costo_venta.toLowerCase().indexOf(tipoCosto.toLowerCase()) > -1;
        }
        // Retorna data con validaciones.
        return (e.anio_costo_venta == anio && validateNomGerencia && e.mes_costo_venta === mes && validateTipo && validatetipoCosto);
    });
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_costo_venta || 0);
    }, 0);
    return sumData;
}

// Calulos filtrar por mes por el tipo
export const filterColumnMesTipoGastoOpera = (data, anio, nombreGerencia, mes, tipo, tipoGastoOper) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_gastos_oper){
                validateNomGerencia = e.gerencia_gastos_oper.toLowerCase() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }

        var validateTipo = false;
        if(e.tipo_gastos_oper !== undefined){
            validateTipo = e.tipo_gastos_oper.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }
        var validatetipoGastoOper = false;
        if(e.gastos_operacionales_oper !== undefined){
            validatetipoGastoOper = e.gastos_operacionales_oper.toLowerCase().indexOf(tipoGastoOper.toLowerCase()) > -1;
        }
        // Retorna data con validaciones.
        return (e.anio_gastos_oper == anio && validateNomGerencia && e.mes_gastos_oper === mes && validateTipo && validatetipoGastoOper);
    });
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_gastos_oper || 0);
    }, 0);
    return sumData;
}

// Calulos filtrar por mes por el tipo
export const filterColumnMesTipoIngreso = (data, anio, nombreGerencia, mes, tipo, tipoIngreso) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_ingreso){
                validateNomGerencia = e.gerencia_ingreso.toLowerCase() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }

        var validateTipo = false;
        if(e.tipo_ingreso !== undefined){
            validateTipo = e.tipo_ingreso.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }

        var validatetipoIngreso = false;
        if(e.ingreso !== undefined){
            validatetipoIngreso = e.ingreso.toLowerCase().indexOf(tipoIngreso.toLowerCase()) > -1;
        }
        // Retorna data con validaciones.
        return (e.anio_ingreso == anio && validateNomGerencia && e.mes_ingreso === mes && validateTipo && validatetipoIngreso);
    });
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_ingreso || 0);
    }, 0);
    return sumData;
}

// Calulos filtrar por mes por el tipo
export const filterColumnMesTipoIngreso2 = (data, anio, nombreGerencia, mes, tipo) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_ingreso){
                validateNomGerencia = e.gerencia_ingreso.toLowerCase() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }

        var validateTipo = false;
        if(e.tipo_ingreso !== undefined){
            validateTipo = e.tipo_ingreso.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }

        // Retorna data con validaciones.
        return (e.anio_ingreso == anio && validateNomGerencia && e.mes_ingreso === mes && validateTipo);
    });
    // console.log(dataFilter);
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_ingreso || 0);
    }, 0);
    return sumData;
}

// Calulos filtrar por mes por el tipo
export const filterColumnMesTipoGastosOper = (data, anio, nombreGerencia, mes, tipo) => {
    const dataFilter = data.filter((e) => {
        // creo validacion de nombre gerencia.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_gastos_oper){
                validateNomGerencia = e.gerencia_gastos_oper.toLowerCase() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }

        var validateTipo = false;
        if(e.tipo_gastos_oper !== undefined){
            validateTipo = e.tipo_gastos_oper.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }

        // Retorna data con validaciones.
        return (e.anio_gastos_oper == anio && validateNomGerencia && e.mes_gastos_oper === mes && validateTipo);
    });
    // console.log(dataFilter);
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_gastos_oper || 0);
    }, 0);
    return sumData;
}

// Calulos para obtener la grafica de Ingresos vs gastos..
export const filterMes = (data, anio, tipo, nombreGerencia, mes) => {
    const dataFilter = data.filter((e) => {

        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres.
        var validateNomGerencia = false;
        if(nombreGerencia !== 'all'){
            if(e.gerencia_ingreso){
                var validateNomGerencia = e.gerencia_ingreso.toLowerCase() === nombreGerencia.toLowerCase();
            }
        }else{
            var validateNomGerencia = true;
        }
        
        var validateTipo = false;
        if(e.tipo_ingreso !== undefined){
            validateTipo = e.tipo_ingreso.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }

        return (e.anio_ingreso === anio && validateNomGerencia && validateTipo && e.mes_ingreso === mes);
    });
    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_ingreso || 0);
    }, 0);
    return sumData;
}

// Calulos para obtener la grafica de Ingresos vs gastos..
export const filterMesGastosOper = (data, anio, tipo, nombreGerencia, mes) => {
    const dataFilter = data.filter((e) => {

        // var validateTipo = e.tipo_gastos_oper.toLowerCase() === tipo.toLowerCase();

        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres.
        if(nombreGerencia !== 'all'){
            var validateNomGerencia = e.gerencia_gastos_oper.toLowerCase() === nombreGerencia.toLowerCase();
        }else{
            var validateNomGerencia = true;
        }
        
        var validateTipo = false;
        if(e.tipo_gastos_oper !== undefined){
            validateTipo = e.tipo_gastos_oper.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }

        return (e.anio_gastos_oper === anio && validateNomGerencia && validateTipo && e.mes_gastos_oper === mes);
    });
    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_gastos_oper || 0);
    }, 0);
    return sumData;
}

// Calulos para obtener la grafica de Ingresos vs gastos..
export const filterMesCostos = (data, anio, tipo, nombreGerencia, mes) => {
    const dataFilter = data.filter((e) => {
        // var validateTipo = e.tipo_costo_venta.toLowerCase() === tipo.toLowerCase();
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres.
        var validateNomGerencia = false;
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
        if(nombreGerencia !== 'all'){
            if(e.gerencia_costo_venta){
                validateNomGerencia = e.gerencia_costo_venta.toLowerCase() === nombreGerencia.toLowerCase();
            }
        }else{
            validateNomGerencia = true;
        }

        var validateTipo = false;
        if(e.tipo_costo_venta !== undefined){
            validateTipo = e.tipo_costo_venta.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }
        
        return (e.anio_costo_venta === anio && validateNomGerencia && e.mes_costo_venta === mes && validateTipo);
    });

    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_costo_venta || 0);
    }, 0);
    return sumData;
}

export const filterMesAcum = (data, anio, tipo, nombreGerencia, mes) => {
    const dataFilter = data.filter((e) => {
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres.

        var validateNomGerencia = false;
        if(nombreGerencia !== 'all'){
            if(e.gerencia_ingreso){
                var validateNomGerencia = e.gerencia_ingreso.toLowerCase() === nombreGerencia.toLowerCase();
            }
        }else{
            var validateNomGerencia = true;
        }
        var validateTipo = false;
        if(e.tipo_ingreso !== undefined){
            validateTipo = e.tipo_ingreso.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }

        return (e.anio_ingreso === anio && validateTipo && validateNomGerencia && e.mes_ingreso === mes);
    }); 
    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_ingreso || 0);
    }, 0);
    return sumData;
}

export const filterMesAcumGastos = (data, anio, tipo, nombreGerencia, mes) => {
    const dataFilter = data.filter((e) => {

        // var validateTipo = e.tipo_gastos_oper.toLowerCase() === tipo.toLowerCase();
        //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres.
        if(nombreGerencia !== 'all'){
            var validateNomGerencia = e.gerencia_gastos_oper.toLowerCase() === nombreGerencia.toLowerCase();
        }else{
            var validateNomGerencia = true;
        }

        var validateTipo = false;
        if(e.tipo_gastos_oper !== undefined){
            validateTipo = e.tipo_gastos_oper.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
        }

        return (e.anio_gastos_oper === anio && validateNomGerencia && validateTipo && e.mes_gastos_oper === mes);
    });

    // Suma de todos los elementos en la columna valor que vengan en dataFilter.
    const sumData = dataFilter.reduce((a, b) => {
        return a + (b.valor_gastos_oper || 0);
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
            var validateNombreGrupo = true;
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

// Calulos para obtener la grafica de gastos por año.
export const filterIndicadores = (data, titulo) => {
    const dataFilter = data.filter((e) => {
        var validateTitulo = e.titulo.toLowerCase() === titulo.toLowerCase();
        return (validateTitulo);
    });
    return dataFilter;
}

export const optionsBarGroup = {
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


// Calulos filtrar por mes por el tipo
// export const filterColumnMesMes = (data, anio, nombreGerencia, mes, tipo) => {
//     const dataFilter = data.filter((e) => {
//         // creo validacion de nombre gerencia.
//         var validateNomGerencia = false;
//         //Validar el nombre de gerencia. Pasando a minusculas todos los caracteres. 
//         if(nombreGerencia !== 'all'){
//             if(e.gerencia_ingreso){
//                 validateNomGerencia = e.gerencia_ingreso.toLowerCase() === nombreGerencia.toLowerCase();
//             }
//         }else{
//             validateNomGerencia = true;
//         }
//         var validateTipo = e.tipo_ingreso.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
//         // Retorna data con validaciones.
//         return (e.anio_ingreso == anio && validateNomGerencia && e.mes_ingreso === mes && validateTipo);
//     });
//     const sumData = dataFilter.reduce((a, b) => {
//         return a + (b.valor_ingreso || 0);
//     }, 0);
//     return sumData;
// }

// Calulos para obtener la grafica de gastos por año.
// export const filterMesesGroup = (data, anio, tipo_ingreso, nombreGerencia, mes, reales = false, proyectados = false) => {
//     const dataFilter = data.filter((e) => {
//         console.log(e.tipo_ingreso);
//         // Si el parametro inversion esta verdadero. El filtro nombre de grupo cambia, y trae toda la informacion de inversion.
//         // if (reales) {
//         //     var string = 'INGRESOS REALES';
//         //     validateNombreGrupo = e.gerencia.toLowerCase() === nombreGerencia.toLowerCase();
//         // }else if (proyectados) {
//         //     var string = 'INGRESOS PROYECTADOS';
//         //     validateNombreGrupo = e.gerencia.toLowerCase() === nombreGerencia.toLowerCase();
//         // }
//         // if(nombreGerencia !== 'all'){
//         //     if(e.gerencia){
//         //         validateNomGerencia = e.gerencia.toLowerCase() === nombreGerencia.toLowerCase();
//         //     }
//         // }else{
//         //     validateNomGerencia = true;
//         // }
//         // var validateTipo = e.tipo_ingreso.toLowerCase().indexOf(tipo_ingreso.toLowerCase()) > -1;
//         // // Retorna data con validaciones.
//         // return (e.anio === anio && validateNomGerencia && e.mes === mes && validateTipo);
//     });
    
//     // Suma de todos los elementos en la columna valor que vengan en dataFilter.
//     const sumData = dataFilter.reduce((a, b) => {
//         return a + (b.valor || 0);
//     }, 0);
    
//     return sumData;
// }

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
    legend: {
        display: false
    },
    title: {
        display: false
    },
    layout: {
        padding: {
            bottom: 10
        }
    },
    tooltips: {enabled: false},
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
            // offset: -50,
            labels: {
                value: {
                    color: '#365068',
                }
            },
            formatter: function(value, context) {
                var currencyFormat = new Intl.NumberFormat('de-DE').format(value / 1000);
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
    legend: {
        display: false
    },
    layout: {
        padding: {
            bottom: 10
        }
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
    legend: {
        display: false
    },
    layout: {
        padding: {
            bottom: 10
        }
    },
    tooltips: {enabled: false},
    plugins: {
        datalabels: {
            font: {
                size: 11,
            },
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


export const optionsGastosDoughnut = {
    tooltips: {enabled: false},
    layout: {
        padding: {
            top: 10
        }
    },
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

export const optionsMeses = {
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
    layout: {
        padding: {
            bottom: 10,
            top: 50
        }
    },
    tooltips: {enabled: true},
    plugins: {
        datalabels: {
            color: '#365068',
            // align: 'center',
            rotation: -90,
            align: 'start',
            anchor: 'end',
            offset: -50,
            font: {
                size: 11,
            },
            labels: {
                value: {
                    color: '#365068',
                }
            },
            formatter: function(value, context) {
                var currencyFormat = new Intl.NumberFormat('de-DE').format(value / 1000);
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
    legend: {
        display: false
    },
    layout: {
        padding: {
            bottom: 10,
            top: 10
        }
    },
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
                var currencyFormat = new Intl.NumberFormat('de-DE').format(value / 1000);
                return currencyFormat;
            }
        }
    }
  }

  export const optionsStackedPorcentual = {
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

  export const optionsBarHorizontal = {
    scales: { 
        xAxes: [{
            display: false,
            ticks: {
                beginAtZero: true,
            },
            gridLines: {
                display:false,
            }
        }],
        yAxes: [{
            display: true,
            ticks: {
                beginAtZero: true,
                paddingTop: 5,
                paddingBottom: 5,
            },
            gridLines: {
                display:false,
                tickMarkLength: 10,
            },
        }],
    },
    tooltips: {enabled: false},
    title: {
        display: false
    },
    legend: {
        display: false
    },
    layout: {
        padding: {
            bottom: 10,
            right: 50,
            left: 50
        }
    },
    plugins: {
        datalabels: {
            color: '#365068',
            padding: 0,
            // rotation: -90,
            align: 'start',
            anchor: 'end',
            offset: -50,
            labels: {
                title: {
                    horizontalAlign: 'left', 
                    lineHeight: 1
                },
                value: {
                    color: '#365068',
                }
            },
            formatter: function(value, context) {
                var currencyFormat = new Intl.NumberFormat('de-DE').format(value / 1000);
                return currencyFormat;
            }
        }
    }
}

export const optionsLines = {
    scales: {
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
          lineTension: 0
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-2',
          lineTension: 0
        //   gridLines: {
        //     drawOnArea: true,
        //   },
        },
      ],
    },
    legend: {
        display: false
    },
    layout: {
        padding: {
            bottom: 10,
            top: 25,
            left: 0,
            right: 0
        }
    },
    elements: {
        line: {
            tension: 0 // disables bezier curves
        }
    },
    plugins: {
        datalabels: {
            // display: false,
            // id: 'y-axis-1',
            color: '#365068',
            padding: 0,
            lineTension: 0,
            // rotation: -90,
            align: 'end',
            anchor: 'end',
            // offset: -10,
            labels: {
                title: {
                    // horizontalAlign: 'left', 
                },
                value: {
                    color: '#365068',
                }
            },
            formatter: function(value, context) {
                var currencyFormat = new Intl.NumberFormat('de-DE').format(value / 1000);
                return currencyFormat;
            }
        },
        // datalabels: {
        //     id: 'y-axis-2',
        //     align: 'start',
        //     anchor: 'start',
        // }
    }
}