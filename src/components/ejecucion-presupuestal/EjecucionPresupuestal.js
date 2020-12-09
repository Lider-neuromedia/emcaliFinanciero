import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { Breadcrumbs, Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Header from '../menu/Header';
import {Redirect} from 'react-router-dom';
import services from '../../services';
import {optionsIngreVsGas, optionsEjecucionAcum} from '../../services/ejecucionPresupuesta';
import {loadServerExcel} from '../../services';
import { HorizontalBar, Bar  } from 'react-chartjs-2';
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
export const itemsHeader = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Typography color="textPrimary" className="txt-breadcrumb">Ejecución Presupuestal</Typography>
            </Breadcrumbs>
            <ButtonGroup variant="text" color="default" aria-label="text default button group">
                <Button style={{ padding: '0 2em' }}>Corporativo</Button>
                <Button style={{ padding: '0 2em' }}>TELCO</Button>
                <Button style={{ padding: '6px 2em' }}>UENAA</Button>
                <Button style={{ padding: '6px 2em' }}>UENE</Button>
            </ButtonGroup>
        </div>
    );
}

export default function EjecucionPresupuestal() {

    // Styles
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    // Estados.
    const [ejecucionAcumulada, setEjecucionAcumulada] = useState({ingresos : 0, gastos : 0});
    const [ingresosVs, setIngresosVs] = useState([]);
    const [gastosVs, setGastosVs] = useState([]);
    const [ingresosReca, setIngresosReca] = useState([]);
    const [ingresosProye, setIngresosProye] = useState([]);
    const [ejemploGrafico, setEjemploGrafico] = useState(0);

    const [loading, setLoading] = useState(true);


    // Calulos para obtener la grafica de ejecución acumulada.
    const getEjecucionAcumulada = (data, anio, tipo, nombreGerencia) => {
        const dataFilter = data.filter((e) => {
            var validateTipo = e.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
            return (e.anio === anio && e.nombre_grupo !== 'DISPONIBILIDAD INICIAL' && (e.clase === undefined || e.clase === '0') && e.nombre_gerencia === nombreGerencia && validateTipo );
        });
    
        const sumData = dataFilter.reduce((a, b) => {
            return a + (b.valor || 0);
        }, 0);
        return sumData;
    }

    // Calulos para obtener la grafica de Ingresos vs gastos..
    const getIngresosVsGastos = (data, anio, tipo, nombreGerencia, mes) => {
        const dataFilter = data.filter((e) => {
            var validateTipo = e.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
            return (e.anio === anio && e.nombre_grupo !== 'DISPONIBILIDAD INICIAL' && (e.clase === undefined || e.clase === '0') && e.nombre_gerencia === nombreGerencia && validateTipo && e.mes === mes );
        });

        const sumData = dataFilter.reduce((a, b) => {
            return a + (b.valor || 0); 
        }, 0);
        return sumData;
    }
    
    // Calulos para obtener la grafica de Ingresos proyectados y recaudados..
    const getIngresos = (data, anio, tipo, nombreGerencia, mes) => {
        const dataFilter = data.filter((e) => {
            var validateTipo = e.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
            return (e.anio === anio && e.nombre_grupo !== 'DISPONIBILIDAD INICIAL' && (e.clase === undefined || e.clase === '0') && e.nombre_gerencia === nombreGerencia && validateTipo && e.mes === mes );
        });

        const sumData = dataFilter.reduce((a, b) => {
            return a + (b.valor || 0); 
        }, 0);
        return sumData;
    }

    // Calulos para obtener la grafica de gastos por año.
    const getGastosXAnio = (data, anio, tipo, nombreGerencia) => {
        const dataFilter = data.filter((e) => {
            var validateTipo = e.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
            return (e.anio === anio && e.nombre_grupo !== 'DISPONIBILIDAD INICIAL' && (e.clase === undefined || e.clase === '0') && e.nombre_gerencia === nombreGerencia && validateTipo );
        });

        const sumData = dataFilter.reduce((a, b) => {
            return a + (b.valor || 0);
        }, 0);
        
        return sumData;
    }

    useEffect(() => {
        loadServerExcel('http://127.0.0.1:8000/api/download-template', function (data, err) {
            var gastos_causados = getEjecucionAcumulada(data.data, 2020, 'Gastos Causados', 'UENE');
            var ingresos_recaudados = getEjecucionAcumulada(data.data, 2020, 'Ingresos Recaudados', 'UENE');
            
            var ejemplo = getGastosXAnio(data.data, 2020, 'Ingresos Recaudados', 'UENE');
            setEjemploGrafico(ejemplo);

            var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'];
            var dataGastos = [];
            var dataIngresos = [];
            var dataIngresosProye = [];
            var dataIngresosReca = [];
            meses.forEach(mes => {
                var gastos = getIngresosVsGastos(data.data, 2020, 'Gastos Causados', 'UENE', mes);
                var ingresos = getIngresosVsGastos(data.data, 2020, 'Ingresos Recaudados', 'UENE', mes);

                dataGastos.push(gastos);
                dataIngresos.push(ingresos);
            });
            meses.forEach(mes => {
                var proyectados = getIngresosVsGastos(data.data, 2020, 'Ingresos Proyectados', 'UENE', mes);
                var recaudados = getIngresosVsGastos(data.data, 2020, 'Ingresos Recaudados', 'UENE', mes);

                dataIngresosProye.push(proyectados);
                dataIngresosReca.push(recaudados);
            });
            
            setEjecucionAcumulada({ingresos: ingresos_recaudados, gastos : gastos_causados});
            setIngresosVs(dataIngresos);
            setGastosVs(dataGastos);
            setIngresosProye(dataIngresosProye);
            setIngresosReca(dataIngresosReca);
            setLoading(false);
        });
    }, []);

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
    
    const dataIngresosAnios = {
        labels: ['', '', ''],
        datasets: [{
            label: '2019',
            data: [ejemploGrafico, 200000000, 200000000],
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

    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            <div className={classes.root}>
                <Header active={'ejecucion_pres'} itemsHeader={itemsHeader} />
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
                                    <HorizontalBar  data={dataIngresosAnios} options={optionsEjecucionAcum}/>

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
                                    }

                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={8} lg={8}>
                                <Paper className={fixedHeightPaper}>
                                </Paper>
                            </Grid>

                            {/* Charts */}
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaper}>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaper}>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>

    );
}