import React, {useState, useEffect} from "react";
import { Breadcrumbs, Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { Link, Redirect } from 'react-router-dom';
import Header from '../menu/Header';
import services from '../../services';
import {loadServerExcel} from '../../services';
import {optionsEjecucionAcum, filterMesesGroup, filterBasic, filterMes, filterNameGroup, optionsIngreVsGas, optionsGastosDoughnut} from '../../services/ejecucionPresupuesta'
import { HorizontalBar, Bar, Doughnut  } from 'react-chartjs-2';
import Skeleton from '@material-ui/lab/Skeleton';

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
        height: 180,
    },
    heightFull: {
        height: '100%'
    }
}));

// Items que iran en el header.
export const itemsHeader = (changeFilter) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/ejecucion-presupuestal">
                    Ejecución Presupuestal
                </Link>
                <Typography color="textPrimary" className="txt-breadcrumb">Gastos</Typography>
            </Breadcrumbs>
            <ButtonGroup variant="text" color="default" aria-label="text default button group">
                <Button style={{ padding: '0 2em' }} onClick={changeFilter('all')}>Todos</Button>
                <Button style={{ padding: '0 2em' }} onClick={changeFilter('corporativo')}>Corporativo</Button>
                <Button style={{ padding: '0 2em' }} onClick={changeFilter('telco')}>TELCO</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('uenaa')}>UENAA</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('uene')}>UENE</Button>
            </ButtonGroup>
        </div>
    );
}

export default function Gastos() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'all'});
    const [loading, setLoading] = useState(true);
    const [ejecucionAcumulada, serEjecucionAcumulada2020] = useState({Proyectados : 0, Comprometidos : 0, Causados: 0});
    // const [comprometidos2020, setComprometidos2020] = useState([]);
    // const [causados2020, setCausados2020] = useState([]);

    useEffect(() => {
        loadDataExcel();
    }, []);

    const loadDataExcel = () => {
        // Carga del excel.
        loadServerExcel('http://127.0.0.1:8000/api/download-template/ejecucion_presupuestal', function (data, err) {
            setDataExcel(data.data);
            loadCharts(data.data);
        });
    }

    const loadCharts = (data, nombre_gerencia = filters.nombre_gerencia) => {
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'];
        // var gastos_proyectados_data = [];
        // var gastos_comprometidos_data = [];
        // var gastos_causados_data = [];

        // var disponibilidad_inicial_anio_anterior_data = [];
        // var disponibilidad_inicial_anio_act_data = [];

        // var ingresos_corrientes_anio_anterior_data = [];
        // var ingresos_corrientes_anio_act_data = [];

        // var ingresos_capital_anio_anterior_data = [];
        // var ingresos_capital_anio_act_data = [];
        
        // // Grafica #1
        // var recaudados_anio_anterior = filterMesesGroup(data, 2019, 'Ingresos Recaudados', nombre_gerencia, meses);
        // var proyectados_anio_act = filterMesesGroup(data, 2020, 'Ingresos Proyectados', nombre_gerencia, meses);
        // var recaudados_anio_act = filterMesesGroup(data, 2020, 'Ingresos Recaudados', nombre_gerencia, meses);
        
        // setIngresosAnioAnt({
        //     recaudadosAnt : recaudados_anio_anterior, 
        //     proyectados : proyectados_anio_act, 
        //     recaudadosAct: recaudados_anio_act
        // });

        // Grafica #2
        // meses.forEach(mes => {
        var gastos_proyectados = filterMesesGroup(data, 2020, 'Gastos Proyectados', nombre_gerencia, meses);
        var gastos_comprometidos = filterMesesGroup(data, 2020, 'Gastos Comprometidos', nombre_gerencia, meses);
        var gastos_causados = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, meses);

        serEjecucionAcumulada2020({
            Proyectados : gastos_proyectados, 
            Comprometidos : gastos_comprometidos, 
            Causados: gastos_causados
        });

        // gastos_proyectados_data.push(gastos_proyectados);
        // gastos_comprometidos_data.push(gastos_comprometidos);
        // gastos_causados_data.push(gastos_causados);
        // });

        // setProyectados2020(gastos_proyectados_data);
        // setComprometidos2020(gastos_comprometidos_data);
        // setCausados2020(gastos_causados_data);
        
        setLoading(false);
    }

    // Cambiar los filtros en base a nombre gerencia.
    const changeFilterNomGerencia = (value)  => (event) => {
        setFilters({nombre_gerencia : value});
        // Inicializacion del loading.
        setLoading(true);
        loadCharts(dataExcel, value);
    }

    const dataIngresosAnios = {
        labels: ['', '', ''],
        datasets: [{
            label: '',
            data: [ejecucionAcumulada.Proyectados, ejecucionAcumulada.Comprometidos, ejecucionAcumulada.Causados],
            backgroundColor: [
                '#507FF2',
                '#FFB12E',
                '#00CE80',
            ],
            borderColor: [
                '#507FF2',
                '#FFB12E',
                '#00CE80',
            ],
            borderWidth: 1
        }]
    };

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
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Paper className={fixedHeightPaper}>
                                        <Paper className={fixedHeightPaper}>
                                    {
                                        loading ? 
                                            <div>
                                                <Skeleton variant="rect" width={'100%'} height={150} />
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Skeleton variant="text" width={'25%'}/>
                                                    <Skeleton variant="text" width={'25%'}/>
                                                    <Skeleton variant="text" width={'25%'}/>

                                                </div>
                                            </div>
                                        :
                                            <div>
                                                <HorizontalBar  data={dataIngresosAnios} options={optionsEjecucionAcum}/>
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
                                                        <span className="iconList" style={{background: '#00CE80'}}></span>
                                                        <p>Causados</p>
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                </Paper>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Paper className={fixedHeightPaper}>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Paper className={fixedHeightPaper}>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={8} lg={8}>
                                <Paper className={classes.heightFull}>
                                </Paper>
                            </Grid>

                            {/* Charts */}
                            <Grid item xs={12} md={4} lg={4}>
                                <Paper className={fixedHeightPaper}>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={4} lg={4}>
                                <Paper className={fixedHeightPaper}>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={4} lg={4}>
                                <Paper className={fixedHeightPaper}>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>
    )
}