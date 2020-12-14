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
            if(e.gerencia){
                validateNomGerencia = e.gerencia_info_general.toLowerCase() === nombreGerencia.toLowerCase();
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