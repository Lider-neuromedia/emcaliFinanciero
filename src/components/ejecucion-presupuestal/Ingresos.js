import React, {useState, useEffect} from "react";
import { Breadcrumbs, Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { Link, Redirect } from 'react-router-dom';
import Header from '../menu/Header';
import services from '../../services';
import {loadServerExcel} from '../../services';
import {optionsEjecucionAcum, filterMesesGroup, filterBasic, filterMes} from '../../services/ejecucionPresupuesta'
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
        height: 240,
    },
}));


// Items que iran en el header.
export const itemsHeader = (changeFilter) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/ejecucion-presupuestal">
                    Ejecución Presupuestal
                </Link>
                <Typography color="textPrimary" className="txt-breadcrumb">Ingresos</Typography>
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


export default function Ingresos() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'corporativo'});
    const [ingresosAnioAnt, setIngresosAnioAnt] = useState({recaudadosAnt : 0, proyectados : 0, recaudadosAct: 0});
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
    const loadCharts = (data, nombre_gerencia = filters.nombre_gerencia) => {
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'];
        
        // Grafica #1
        var recaudados_anio_anterior = filterMesesGroup(data, 2019, 'Ingresos Recaudados', nombre_gerencia, meses);
        var proyectados_anio_act = filterMesesGroup(data, 2020, 'Ingresos Proyectados', nombre_gerencia, meses);
        var recaudados_anio_act = filterMesesGroup(data, 2020, 'Ingresos Recaudados', nombre_gerencia, meses);
        
        setIngresosAnioAnt({
            recaudadosAnt : recaudados_anio_anterior, 
            proyectados : proyectados_anio_act, 
            recaudadosAct: recaudados_anio_act
        });

        setLoading(false);
    }

    // Cambiar los filtros en base a nombre gerencia.
    const changeFilterNomGerencia = (value)  => (event) => {
        setFilters({nombre_gerencia : value});
        // Inicializacion del loading.
        setLoading(true);
        loadCharts(dataExcel, value);
    }

    // 
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
                            <Grid item xs={12} md={3} lg={3}>
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
                            <Grid item xs={12} md={5} lg={5}>
                                <Paper className={fixedHeightPaper}>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <Paper className={fixedHeightPaper}>
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