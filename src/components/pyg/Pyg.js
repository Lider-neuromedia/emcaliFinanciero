import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { Breadcrumbs, Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Header from '../menu/Header';
import { Redirect } from 'react-router-dom';
import services from '../../services';
import {loadServerExcel} from '../../services';
import {filterColumnMes, optionsIngresosOper, optionsGroupBar} from '../../services/pyg';
import { Bar  } from 'react-chartjs-2';
import "chartjs-plugin-datalabels";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        background: '#f2f5f9',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 290,
    },
    heightSmall: {
        height: 185
    },
    heightAuto : {
        height: 'auto'
    }
}));


// Items que iran en el header.
export const itemsHeader = (changeFilter) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Typography color="textPrimary" className="txt-breadcrumb">PyG</Typography>
            </Breadcrumbs>
            <ButtonGroup variant="text" color="default" aria-label="text default button group">
                <Button style={{ padding: '0 2em' }} onClick={changeFilter('all')}>Todos</Button>
                <Button style={{ padding: '0 2em' }} onClick={changeFilter('telco')}>TELCO</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('uenaa')}>UENAA</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('uene')}>UENE</Button>
            </ButtonGroup>
        </div>
    );
}

export default function Pyg() {

    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'all'});
    const [ingresosOpera, setIngresosOpera] = useState({ anio_ant : 0, anio_act : 0});
    const [costosVenta, setCostosVenta] = useState({ anio_ant : 0, anio_act : 0});
    const [gastosOper, setGastosOper] = useState({ anio_ant : 0, anio_act : 0});
    const [ebitda, setEbitda] = useState({ anio_ant : 0, anio_act : 0});
    const [utilidadNeta, setUtilidadNeta] = useState({ anio_ant : 0, anio_act : 0});
    const [ebitdaGerencia, setEbitdaGerencia] = useState({ uene : 0, uenaa : 0, telco : 0});
    const [utilidadGerencia, setUtilidadGerencia] = useState({ uene : 0, uenaa : 0, telco : 0});
    const [ebitdaMesesAnioAnt, setEbitdaMesesAnioAnt] = useState([]);
    const [ebitdaMesesAnioAct, setEbitdaMesesAnioAct] = useState([]);
    const [utilidadMesesAnioAnt, setUtilidadMesesAnioAnt] = useState([]);
    const [utilidadMesesAnioAct, setUtilidadMesesAnioAct] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hook de React.
    useEffect(() => {
        loadDataExcel();
    }, []);

    // Hace la petición de carga que trae la informacion del excel desde el backend.
    const loadDataExcel = () => {
        // Carga del excel.
        loadServerExcel('http://127.0.0.1:8000/api/download-template/pyg', function (data, err) {
            setDataExcel(data.data);
            loadCharts(data.data);
        });
    }

    const restaElementoAnt = (data) => {
        var newElements = [];
        data.forEach( (element, index) => {
            if (index === 0) {
                newElements.push(element);
            }else{
                var operation = element - data[index - 1];
                newElements.push(operation);
            }
        });
        return newElements;
    }

    const loadCharts = (data, nombre_gerencia = filters.nombre_gerencia) => {
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'];
        
        // Grafica #1
        var ingresos_oper_anio_ant = filterColumnMes(data, 2019, nombre_gerencia, 'Septiembre', 'ingresos_operacionales');
        var ingresos_oper_anio_act = filterColumnMes(data, 2020, nombre_gerencia, 'Septiembre', 'ingresos_operacionales');

        // Grafica 2
        var costos_vta_anio_ant = filterColumnMes(data, 2019, nombre_gerencia, 'Septiembre', 'costos_venta');
        var costos_vta_anio_act = filterColumnMes(data, 2020, nombre_gerencia, 'Septiembre', 'costos_venta');
        
        // Grafica 3
        var gastos_op_anio_ant = filterColumnMes(data, 2019, nombre_gerencia, 'Septiembre', 'gastos_operacionales');
        var gastos_op_anio_act = filterColumnMes(data, 2020, nombre_gerencia, 'Septiembre', 'gastos_operacionales');
            
        // Grafica 4
        var ebitda_anio_ant = filterColumnMes(data, 2019, nombre_gerencia, 'Septiembre', 'ebitda');
        var ebitda_anio_act = filterColumnMes(data, 2020, nombre_gerencia, 'Septiembre', 'ebitda');
            
        // Grafica 5
        var utilidad_anio_ant = filterColumnMes(data, 2019, nombre_gerencia, 'Septiembre', 'utilidad_neta');
        var utilidad_anio_act = filterColumnMes(data, 2020, nombre_gerencia, 'Septiembre', 'utilidad_neta');
            
        // Grafica 6
        var ebitda_gerencia_uene = filterColumnMes(data, 2020, 'uene', 'Septiembre', 'ebitda');
        var ebitda_gerencia_uenaa = filterColumnMes(data, 2020, 'uenaa', 'Septiembre', 'ebitda');
        var ebitda_gerencia_telco = filterColumnMes(data, 2020, 'telco', 'Septiembre', 'ebitda');
    
        // Grafica 7 -  utilidad neta por gerencia.
        var utilidad_gerencia_uene = filterColumnMes(data, 2020, 'uene', 'Septiembre', 'utilidad_neta');
        var utilidad_gerencia_uenaa = filterColumnMes(data, 2020, 'uenaa', 'Septiembre', 'utilidad_neta');
        var utilidad_gerencia_telco = filterColumnMes(data, 2020, 'telco', 'Septiembre', 'utilidad_neta');
    
        // Grafica 8 -  ebitda x mes.
        var ebitda_mes_anio_ant = [];
        var ebitda_mes_anio_act = [];

        meses.forEach( mes => {
            var ebitda = filterColumnMes(data, 2019, nombre_gerencia, mes, 'ebitda');
            ebitda_mes_anio_ant.push(ebitda);
        });
        meses.forEach( mes => {
            var ebitda = filterColumnMes(data, 2020, nombre_gerencia, mes, 'ebitda');
            ebitda_mes_anio_act.push(ebitda)
        });
        var substraction_ebitda_anio_ant = restaElementoAnt(ebitda_mes_anio_ant);
        var substraction_ebitda_anio_act = restaElementoAnt(ebitda_mes_anio_act);
    
        // Grafica 9 -  utilidad x mes.
        var utilidad_mes_anio_ant = [];
        var utilidad_mes_anio_act = [];

        meses.forEach( mes => {
            var utilidad = filterColumnMes(data, 2019, nombre_gerencia, mes, 'utilidad_neta');
            utilidad_mes_anio_ant.push(utilidad);
        });
        meses.forEach( mes => {
            var utilidad = filterColumnMes(data, 2020, nombre_gerencia, mes, 'utilidad_neta');
            utilidad_mes_anio_act.push(utilidad);
        });
        var substraction_utilidad_anio_ant = restaElementoAnt(utilidad_mes_anio_ant);
        var substraction_utilidad_anio_act = restaElementoAnt(utilidad_mes_anio_act);
       
        // Cambiar estados. 
        // Grafica #1
        setIngresosOpera({
            anio_ant : ingresos_oper_anio_ant,
            anio_act : ingresos_oper_anio_act
        });

        // Grafica #2
        setCostosVenta({
            anio_ant : costos_vta_anio_ant,
            anio_act : costos_vta_anio_act
        });

        // Grafica #3
        setGastosOper({
            anio_ant : gastos_op_anio_ant,
            anio_act : gastos_op_anio_act
        });
        
        // Grafica #4
        setEbitda({
            anio_ant : ebitda_anio_ant,
            anio_act : ebitda_anio_act
        });
        
        // Grafica #5
        setUtilidadNeta({
            anio_ant : utilidad_anio_ant,
            anio_act : utilidad_anio_act
        });
        
        // Grafica #6
        setEbitdaGerencia({
            uene : ebitda_gerencia_uene,
            uenaa : ebitda_gerencia_uenaa,
            telco : ebitda_gerencia_telco
        });
        
        // Grafica #7 
        setUtilidadGerencia({
            uene : utilidad_gerencia_uene,
            uenaa : utilidad_gerencia_uenaa,
            telco : utilidad_gerencia_telco
        });
        
        // Grafica #8 
        setEbitdaMesesAnioAnt(substraction_ebitda_anio_ant);
        setEbitdaMesesAnioAct(substraction_ebitda_anio_act);
        
        // Grafica #9
        setUtilidadMesesAnioAnt(substraction_utilidad_anio_ant);
        setUtilidadMesesAnioAct(substraction_utilidad_anio_act);

        // Al final desactivamos loading.
        setLoading(false);

    }

    // Cambiar los filtros en base a nombre gerencia.
    const changeFilterNomGerencia = (value)  => (event) => {
        setFilters({nombre_gerencia : value});
        // Inicializacion del loading.
        setLoading(true);
        loadCharts(dataExcel, value);
    }
    
    /* 
        DATA - GRAFICOS.
    */

    // Grafica #1 - Ingresos operacionales
    const dataIngresosOper = {
    labels: ['', ''],
    datasets: [
        {
        label: 'Ingresos operacionales',
        data: [ingresosOpera.anio_ant, ingresosOpera.anio_act],
        backgroundColor: [
            '#F8AA27',
            '#94DEA9',
        ],
        borderColor: [
            '#F8AA27',
            '#94DEA9',
        ],
        borderWidth: 1,
        },
    ],
    }

    // Grafica #2 - Costos de venta
    const dataCostosVnta = {
    labels: ['', ''],
    datasets: [
        {
        label: 'Costos de venta',
        data: [costosVenta.anio_ant, costosVenta.anio_act],
        backgroundColor: [
            '#F8AA27',
            '#94DEA9',
        ],
        borderColor: [
            '#F8AA27',
            '#94DEA9',
        ],
        borderWidth: 1,
        },
    ],
    }

    // Grafica #3 - gastos operacionales
    const dataGastosOpe = {
    labels: ['', ''],
    datasets: [
        {
        label: 'Gastos operacionales',
        data: [gastosOper.anio_ant, gastosOper.anio_act],
        backgroundColor: [
            '#F8AA27',
            '#94DEA9',
        ],
        borderColor: [
            '#F8AA27',
            '#94DEA9',
        ],
        borderWidth: 1,
        },
    ],
    }

    // Grafica #4 - ebitda
    const dataEbitda = {
    labels: ['', ''],
    datasets: [
        {
        label: 'Ebitda',
        data: [ebitda.anio_ant, ebitda.anio_act],
        backgroundColor: [
            '#F8AA27',
            '#94DEA9',
        ],
        borderColor: [
            '#F8AA27',
            '#94DEA9',
        ],
        borderWidth: 1,
        },
    ],
    }

    // Grafica #5 - utilidad neta acumulada
    const dataUtilidad = {
    labels: ['', ''],
    datasets: [
        {
        label: 'Utilidad neta',
        data: [utilidadNeta.anio_ant, utilidadNeta.anio_act],
        backgroundColor: [
            '#F8AA27',
            '#94DEA9',
        ],
        borderColor: [
            '#F8AA27',
            '#94DEA9',
        ],
        borderWidth: 1,
        },
    ],
    }

    // Grafica #6 - Ebitda utilidad
    const dataEbitdaGerencia = {
    labels: ['', '', ''],
    datasets: [
        {
        label: 'Ebitda gerencia',
        data: [ebitdaGerencia.uene, ebitdaGerencia.uenaa, ebitdaGerencia.telco],
        backgroundColor: [
            '#F8AA27',
            '#94DEA9',
            '#507FF2'
        ],
        borderColor: [
            '#F8AA27',
            '#94DEA9',
            '#507FF2'
        ],
        borderWidth: 1,
        },
    ],
    }

    // Grafica #7 - Utilidad neta x gerencia
    const dataUtilidadGerencia = {
    labels: ['', '', ''],
    datasets: [
        {
        label: 'Utilidad gerencia',
        data: [utilidadGerencia.uene, utilidadGerencia.uenaa, utilidadGerencia.telco],
        backgroundColor: [
            '#F8AA27',
            '#94DEA9',
            '#507FF2'
        ],
        borderColor: [
            '#F8AA27',
            '#94DEA9',
            '#507FF2'
        ],
        borderWidth: 1,
        },
    ],
    }
    
    // Grafica #8 - Ebitda x meses
    const dataEbitdaMeses = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: '2019',
            data: ebitdaMesesAnioAnt,
            backgroundColor: '#507FF2',
          },
          {
            label: '2020',
            data: ebitdaMesesAnioAct,
            backgroundColor: '#FFB12E',
          },
        ],
    }
    
    // Grafica #9 - Utilidad x meses
    const dataUtilidadMeses = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: '2019',
            data: utilidadMesesAnioAnt,
            backgroundColor: '#507FF2',
          },
          {
            label: '2020',
            data: utilidadMesesAnioAct,
            backgroundColor: '#FFB12E',
          },
        ],
    }

    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            <div className={classes.root}>
                <Header active={'pyg'} itemsHeader={() => itemsHeader(changeFilterNomGerencia)}  />
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12} md={2} lg={2}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Paper className={classes.heightAuto} style={{padding: 10}}>
                                        {(loading) ? 
                                            <div>
                                                <Skeleton variant="rect" width={'100%'} height={200} />
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                </div>
                                            </div>
                                         :
                                         <div>
                                            <Bar data={dataIngresosOper} height={350} options={optionsIngresosOper} />
                                            <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#F8AA27'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#94DEA9'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                         </div>
                                        }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Paper className={classes.heightAuto} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={200} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                            <div>
                                                <Bar data={dataCostosVnta} height={350} options={optionsIngresosOper} />
                                                <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#F8AA27'}}></span>
                                                        <p>2019</p>
                                                    </div>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#94DEA9'}}></span>
                                                        <p>2020</p>
                                                    </div>
                                                </div>
                                            </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Paper className={classes.heightAuto} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={200} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                            <div>
                                                <Bar data={dataGastosOpe} height={350} options={optionsIngresosOper} />
                                                <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#F8AA27'}}></span>
                                                        <p>2019</p>
                                                    </div>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#94DEA9'}}></span>
                                                        <p>2020</p>
                                                    </div>
                                                </div>
                                            </div>
                                            }
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} md={10} lg={10}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={2} lg={2}>
                                        <Paper className={fixedHeightPaper} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={200} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                                <div>
                                                    <Bar data={dataEbitda} height={600} options={optionsIngresosOper} />
                                                    <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#F8AA27'}}></span>
                                                            <p>2019</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#94DEA9'}}></span>
                                                            <p>2020</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={2} lg={2}>
                                        <Paper className={fixedHeightPaper} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={200} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                                <div>
                                                    <Bar data={dataEbitdaGerencia} height={600} options={optionsIngresosOper} />
                                                    <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#F8AA27'}}></span>
                                                            <p>2019</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#94DEA9'}}></span>
                                                            <p>2020</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={8} lg={8}>
                                        <Paper className={fixedHeightPaper} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={250} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                                <div>
                                                    <Bar data={dataEbitdaMeses} height={120} options={optionsGroupBar} />
                                                    <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#507FF2'}}></span>
                                                            <p>2019</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#F8AA27'}}></span>
                                                            <p>2020</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={2} lg={2}>
                                        <Paper className={fixedHeightPaper} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={200} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                                <div>
                                                    <Bar data={dataUtilidad} height={600} options={optionsIngresosOper} />
                                                    <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#F8AA27'}}></span>
                                                            <p>2019</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#94DEA9'}}></span>
                                                            <p>2020</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={2} lg={2}>
                                        <Paper className={fixedHeightPaper} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={200} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                                <div>
                                                    <Bar data={dataUtilidadGerencia} height={600} options={optionsIngresosOper} />
                                                    <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#F8AA27'}}></span>
                                                            <p>UENE</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#F8AA27'}}></span>
                                                            <p>UENAA</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#94DEA9'}}></span>
                                                            <p>TELCO</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={8} lg={8}>
                                        <Paper className={fixedHeightPaper} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={250} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                                <div>
                                                    <Bar data={dataUtilidadMeses} height={120} options={optionsGroupBar} />
                                                    <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#507FF2'}}></span>
                                                            <p>2019</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#F8AA27'}}></span>
                                                            <p>2020</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>

    );
}