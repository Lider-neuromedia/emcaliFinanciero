import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { Breadcrumbs, Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Header from '../menu/Header';
import {Redirect} from 'react-router-dom';
import services from '../../services';
import {optionsIngreVsGas, optionsEjecucionAcum, optionsGastos, optionsGastosDoughnut,
    filterBasic, filterMes, filterMesesGroup} from '../../services/ejecucionPresupuesta';
import {loadServerExcel} from '../../services';
import { HorizontalBar, Bar, Doughnut  } from 'react-chartjs-2';
import "chartjs-plugin-datalabels";


// Estilos
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
        justifyContent: 'space-around'
    },
    fixedHeight: {
        // height: 'auto',
        height: 240,
    },
    textBreadCrumbs: {
        color: '#365068'
    }
}));


// Items que iran en el header.
export const itemsHeader = (changeFilter) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Typography color="textPrimary" className="txt-breadcrumb">Ejecución Presupuestal</Typography>
            </Breadcrumbs>
            <ButtonGroup variant="text" color="default" aria-label="text default button group">
                <Button style={{ padding: '0 2em' }} onClick={changeFilter('corporativo')}>Corporativo</Button>
                <Button style={{ padding: '0 2em' }} onClick={changeFilter('telco')}>TELCO</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('uenaa')}>UENAA</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('uene')}>UENE</Button>
            </ButtonGroup>
        </div>
    );
}

export default function EjecucionPresupuestal() {

    // Styles
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    // Estados.
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'uene'});
    const [ejecucionAcumulada, setEjecucionAcumulada] = useState({ingresos : 0, gastos : 0});
    const [ingresosVs, setIngresosVs] = useState([]);
    const [gastosVs, setGastosVs] = useState([]);
    const [ingresosReca, setIngresosReca] = useState([]);
    const [ingresosProye, setIngresosProye] = useState([]);
    const [ingresosAnioAnt, setIngresosAnioAnt] = useState({recaudadosAnt : 0, proyectados : 0, recaudadosAct: 0});
    const [gastos, setGastos] = useState({proyectados : 0, comprometidos : 0, causados: 0});
    const [gastosDoughnut, setGastosDoughnut] = useState({valueOne : 0, valueTwo : 0});
    const [inversion, setInversion] = useState({proyectados : 0, comprometidos : 0, causados: 0});
    const [inversionDoughnut, setInversionDoughnut] = useState({valueOne : 0, valueTwo : 0});
    const [gastosProyectados, setGastosProyectados] = useState([]);
    const [gastosCausados, setGastosCausados] = useState([]);
    const [gastosComprometidos, setGastosComprometidos] = useState([]);

    const [loading, setLoading] = useState(true);
    

    // Hook de React.
    useEffect(() => {
        loadDataExcel();
    }, []);

    // Hace la petición de carga que trae la informacion del excel desde el backend.
    const loadDataExcel = () => {
        // Carga del excel.
        loadServerExcel('http://127.0.0.1:8000/api/download-template', function (data, err) {
            setDataExcel(data.data);
            loadCharts(data.data);
        });
    }

    // Cargar las graficas.
    const loadCharts = (data, nombre_gerencia = filters.nombre_gerencia) => {
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'];
        var dataGastos = [];
        var dataIngresos = [];
        var dataIngresosProye = [];
        var dataIngresosReca = [];
        var dataGastosCausados = [];
        var dataGastosProyectados = [];
        var dataGastosComprom = [];

        // Grafica # 1 - Ejecucion acumulada.
        var gastos_causados = filterBasic(data, 2020, 'Gastos Causados', nombre_gerencia);
        var ingresos_recaudados = filterBasic(data, 2020, 'Ingresos Recaudados', nombre_gerencia);

        // Grafica # 2 - Ingresos vs Gastos.
        meses.forEach(mes => {
            var gastos = filterMes(data, 2020, 'Gastos Causados', nombre_gerencia, mes);
            var ingresos = filterMes(data, 2020, 'Ingresos Recaudados', nombre_gerencia, mes);

            dataGastos.push(gastos);
            dataIngresos.push(ingresos);
        });

        // Grafica # 3 - Ingresos.
        meses.forEach(mes => {
            var proyectados = filterMes(data, 2020, 'Ingresos Proyectados', nombre_gerencia, mes);
            var recaudados = filterMes(data, 2020, 'Ingresos Recaudados', nombre_gerencia, mes);

            dataIngresosProye.push(proyectados);
            dataIngresosReca.push(recaudados);
        });
        
        // Grafica # 4 - Ingresos año anterior vs año actual.
        var recaudados_anio_anterior = filterMesesGroup(data, 2019, 'Ingresos Recaudados', nombre_gerencia, meses);
        var proyectados_anio_act = filterMesesGroup(data, 2020, 'Ingresos Proyectados', nombre_gerencia, meses);
        var recaudados_anio_act = filterMesesGroup(data, 2020, 'Ingresos Recaudados', nombre_gerencia, meses);
        
        // Grafica # 5 - Gastos Causados, Comprometidos, Proyectados.
        var gastos_causados_5 = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, meses);
        var gastos_comprometidos = filterMesesGroup(data, 2020, 'Gastos Comprometidos', nombre_gerencia, meses);
        var gastos_proyectados = filterMesesGroup(data, 2020, 'Gastos Proyectados', nombre_gerencia, meses);

        // Grafica # 6 - Vs entre comprometidos y proyectados & causados y comprometidos.
        var gastosComproVsProy = Math.round((gastos_comprometidos / gastos_proyectados) * 100, -1);
        var gastosCausVsComp = Math.round((gastos_causados_5 / gastos_comprometidos) * 100, -1);
        
        // Grafica # 7 - Inversion.
        var inv_causados = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, meses, true);
        var inv_comprometidos = filterMesesGroup(data, 2020, 'Gastos Comprometidos', nombre_gerencia, meses, true);
        var inv_proyectados = filterMesesGroup(data, 2020, 'Gastos Proyectados', nombre_gerencia, meses, true);
        
        // Grafica # 8 inversion - Vs entre comprometidos y proyectados & causados y comprometidos.
        var inversionComproVsProy = Math.round((inv_comprometidos / inv_proyectados) * 100, -1);
        var inversionCausVsComp = Math.round((inv_causados / inv_comprometidos) * 100, -1);
        
        // Grafica # 9 - Gastos meses.
        meses.forEach(mes => {
            var mes_causados = filterMes(data, 2020, 'Gastos Causados', nombre_gerencia, mes);
            var mes_comprometidos = filterMes(data, 2020, 'Gastos Comprometidos', nombre_gerencia, mes);
            var mes_proyectados = filterMes(data, 2020, 'Gastos Proyectados', nombre_gerencia, mes);
            dataGastosCausados.push(mes_causados);
            dataGastosComprom.push(mes_comprometidos);
            dataGastosProyectados.push(mes_proyectados);
        });

        // Cambiar estados.
        setGastos({
            proyectados : gastos_proyectados, 
            comprometidos : gastos_comprometidos, 
            causados: gastos_causados_5
        });

        setInversion({
            proyectados : inv_proyectados, 
            comprometidos : inv_comprometidos, 
            causados: inv_causados
        });
        
        setGastosDoughnut({valueOne : gastosComproVsProy, valueTwo : gastosCausVsComp})
        setInversionDoughnut({valueOne : inversionComproVsProy, valueTwo : inversionCausVsComp})

        setIngresosAnioAnt({
            recaudadosAnt : recaudados_anio_anterior, 
            proyectados : proyectados_anio_act, 
            recaudadosAct: recaudados_anio_act
        });

        setEjecucionAcumulada({ingresos: ingresos_recaudados, gastos : gastos_causados});
        
        setGastosProyectados(dataGastosProyectados);
        setGastosComprometidos(dataGastosComprom);
        setGastosCausados(dataGastosCausados);

        setIngresosVs(dataIngresos);
        setGastosVs(dataGastos);
        setIngresosProye(dataIngresosProye);
        setIngresosReca(dataIngresosReca);

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

    // Grafica #1
    const dataEjecucionAcumulada = {
        labels: ['', ''],
        datasets: [{
            label: 'Ejecución acumulada',
            data: [ejecucionAcumulada.ingresos, ejecucionAcumulada.gastos],
            backgroundColor: [
                '#F8AA27',
                '#94DEA9',
            ],
            borderColor: [
                '#F8AA27',
                '#94DEA9',
            ],
            borderWidth: 1
        }]
    };
    
    // Grafica #2
    const dataIngreVsGas = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: 'Ingresos',
            data: ingresosVs,
            backgroundColor: '#507FF2',
          },
          {
            label: 'Gastos',
            data: gastosVs,
            backgroundColor: '#FFB12E',
          },
        ],
    }
    
    // Grafica #3
    const dataIngresos = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: 'Ing. proyectados',
            data: ingresosProye,
            backgroundColor: '#507FF2',
          },
          {
            label: 'Ing. recaudados',
            data: ingresosReca,
            backgroundColor: '#FFB12E',
          },
        ],
    }
    
    // Grafica #4
    const dataIngresosAnios = {
        labels: ['', '', ''],
        datasets: [{
            label: 'Ingresos',
            data: [ingresosAnioAnt.recaudadosAnt, ingresosAnioAnt.proyectados, ingresosAnioAnt.recaudadosAct],
            backgroundColor: [
                '#507FF2',
                '#FFB12E',
                '#507FF2',
            ],
            borderColor: [
                '#507FF2',
                '#FFB12E',
                '#507FF2',
            ],
            borderWidth: 1
        }]
    };
    
    // Grafica #5
    const dataGastos = {
        labels: ['', '', ''],
        datasets: [{
            label: 'Gastos',
            data: [gastos.proyectados, gastos.comprometidos, gastos.causados],
            backgroundColor: [
                '#507FF2',
                '#FFB12E',
                '#8064A2',
            ],
            borderColor: [
                '#507FF2',
                '#FFB12E',
                '#8064A2',
            ],
            borderWidth: 1
        }]
    };

    // Grafica #6
    const dataGastosDoughnut = {
        labels: ['', ''],
        datasets: [
          {
            label: '',
            data: [gastosDoughnut.valueOne, gastosDoughnut.valueTwo],
            backgroundColor: [
                '#8064A2',
                '#FFB12E',
            ],
            borderColor: [
                '#8064A2',
                '#FFB12E',
            ],
            borderWidth: 1,
          },
        ],
    }
    
    // Grafica #7
    const dataInversion = {
        labels: ['', '', ''],
        datasets: [{
            label: 'Inversion',
            data: [inversion.proyectados, inversion.comprometidos, inversion.causados],
            backgroundColor: [
                '#507FF2',
                '#FFB12E',
                '#8064A2',
            ],
            borderColor: [
                '#507FF2',
                '#FFB12E',
                '#8064A2',
            ],
            borderWidth: 1
        }]
    };

    // Grafica #8
    const dataInversionDoughnut = {
        labels: ['', ''],
        datasets: [
          {
            label: '',
            data: [inversionDoughnut.valueOne, inversionDoughnut.valueTwo],
            backgroundColor: [
                '#8064A2',
                '#FFB12E',
            ],
            borderColor: [
                '#8064A2',
                '#FFB12E',
            ],
            borderWidth: 1,
          },
        ],
    }

    // Grafica #9
    const dataGastosMeses = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: 'Proyectados',
            data: gastosProyectados,
            backgroundColor: '#507FF2',
          },
          {
            label: 'Comprometidos',
            data: gastosComprometidos,
            backgroundColor: '#FFB12E',
          },
          {
            label: 'Causados',
            data: gastosCausados,
            backgroundColor: '#FFB12E',
          },
        ],
    }

    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            <div className={classes.root}>
                <Header active={'ejecucion_pres'} itemsHeader={() => itemsHeader(changeFilterNomGerencia)} />
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12} md={4} lg={4}>
                                <Paper className={fixedHeightPaper}>
                                    {(loading) ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={150} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <HorizontalBar  data={dataEjecucionAcumulada} options={optionsEjecucionAcum}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#F8AA27'}}></span>
                                                    <p>Ingresos recaudados</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#94DEA9'}}></span>
                                                    <p>Gastos recaudados</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <Paper className={fixedHeightPaper}>
                                    {(loading) ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={150} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <Bar  data={dataIngreVsGas} options={optionsIngreVsGas}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#507FF2'}}></span>
                                                    <p>Ingresos recaudados</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FFB12E'}}></span>
                                                    <p>Gastos recaudados</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <Paper className={fixedHeightPaper}>
                                    {(loading) ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={150} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <Bar  data={dataIngresos} options={optionsIngreVsGas}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#507FF2'}}></span>
                                                    <p>Ingresos proyectados</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FFB12E'}}></span>
                                                    <p>Ingresos recaudados</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Paper>
                            </Grid>

                            {/* Charts */}
                            <Grid item xs={12} md={4} lg={4}>
                                <Paper className={fixedHeightPaper}>
                                    {
                                        loading ? 
                                            <div>
                                                <Skeleton variant="rect" width={'100%'} height={150} />
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                </div>
                                            </div>
                                        :
                                            <div>
                                                <HorizontalBar  data={dataIngresosAnios} options={optionsEjecucionAcum}/>
                                                <div className="containerLabelsCharts">
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#507FF2'}}></span>
                                                        <p>Ingresos recaudados</p>
                                                    </div>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#FFB12E'}}></span>
                                                        <p>Ingresos proyectados</p>
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={8} lg={8}>
                                <Paper className={fixedHeightPaper}>
                                    {(loading) ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={150} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <Bar  data={dataGastosMeses} options={optionsIngreVsGas}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#507FF2'}}></span>
                                                    <p>Ingresos recaudados</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FFB12E'}}></span>
                                                    <p>Gastos recaudados</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Paper>
                            </Grid>

                            {/* Charts */}
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaper}>
                                    {
                                        loading ? 
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <div style={{width: '50%'}}>        
                                                    <Skeleton variant="rect" width={'100%'} height={150} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                                <div style={{width: '40%'}}>
                                                    <Skeleton variant="circle" width={150} height={150} />
                                                </div>
                                            </div>
                                        :
                                            <div style={{display: 'flex'}}>
                                                <div style={{width: '50%'}}>
                                                    <HorizontalBar  data={dataGastos} options={optionsGastos}/>
                                                    <div className="containerLabelsCharts">
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#507FF2'}}></span>
                                                            <p>Proyectados</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#FFB12E'}}></span>
                                                            <p>Comprometidos</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#8064A2'}}></span>
                                                            <p>Causados</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{width: '50%'}}>
                                                    <Doughnut data={dataGastosDoughnut} options={optionsGastosDoughnut}/>
                                                </div>
                                            </div>
                                    }
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaper}>
                                    {
                                        loading ? 
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <div style={{width: '50%'}}>        
                                                    <Skeleton variant="rect" width={'100%'} height={150} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                                <div style={{width: '40%'}}>
                                                    <Skeleton variant="circle" width={150} height={150} />
                                                </div>
                                            </div>
                                        :
                                            <div style={{display: 'flex'}}>
                                                <div style={{width: '50%'}}>
                                                    <HorizontalBar  data={dataInversion} options={optionsGastos}/>
                                                    <div className="containerLabelsCharts">
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#507FF2'}}></span>
                                                            <p>Proyectados</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#FFB12E'}}></span>
                                                            <p>Comprometidos</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#8064A2'}}></span>
                                                            <p>Causados</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{width: '50%'}}>
                                                    <Doughnut data={dataInversionDoughnut} options={optionsGastosDoughnut}/>
                                                </div>
                                            </div>
                                    }
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>

    );
}