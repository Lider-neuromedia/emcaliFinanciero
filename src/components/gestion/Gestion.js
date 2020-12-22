import React, {useState, useEffect} from "react";
import {Breadcrumbs, Typography, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import Header from '../menu/Header';
import { Link, Redirect } from 'react-router-dom';
import services from '../../services';
import {loadServerExcel} from '../../services';
import { filterGestion } from '../../services/gestion';
import { HorizontalBar, Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import Skeleton from '@material-ui/lab/Skeleton';
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
        height: 280,
    },
    heightFull: {
        height: '100%'
    },
    titleGestion: {
        fontSize: '15px',
        letterSpacing: '1px',
        fontWeight: 600,
        textTransform: 'uppercase'
    },
    textGestion: {
        fontSize: '15px',
        letterSpacing: '1px',
        color: '#5c6166',
        marginBottom: '13px'
    }
}));

// Items que iran en el header.
export const itemsHeader = () => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Breadcrumbs aria-label="breadcrumb">
                <Typography color="textPrimary" className="txt-breadcrumb">Gestión</Typography>
            </Breadcrumbs>
        </div>
    );
}


export default function Gestion(){
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'all'});
    const [loading, setLoading] = useState(true);
    const [rendimiendo_anioAnt, setRendimiento_anio_ant] = useState([]);
    const [rendimiendo_anioAct, setRendimiento_anio_act] = useState([]);
    const [EA_Ant, setEA_anio_ant] = useState([]);
    const [EA_Act, setEA_anio_act] = useState([]);

    // Hook de React.
    useEffect(() => {
        loadDataExcel();
    }, []);

    const loadDataExcel = () => {
        // Carga del excel
        loadServerExcel('http://127.0.0.1:8000/api/download-template/gestion', function (data, err) {
            setDataExcel(data.data);
            loadCharts(data.data);
        });
    }

    const loadCharts = (data) => {
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        var infoRendimientoAnt_data = [];
        var infoRendimientoAct_data = [];
        var infoEAAnt_data = [];
        var infoEAAct_data = [];

        meses.forEach(mes => {
            var dataRendimientoAnt = filterGestion(data, 2019, mes, 'rendimiento');
            var dataRendimientoAct = filterGestion(data, 2020, mes, 'rendimiento');
            dataRendimientoAnt.forEach(dataRendimientoAnt_info => {
                var infoRendimientoAnt = dataRendimientoAnt_info.rendimiento;
                var infoEAAnt = dataRendimientoAnt_info.ea;

                console.log(infoEAAnt);
                var infoEAAnt_float = Math.round((infoEAAnt) * 100);
                infoRendimientoAnt_data.push(infoRendimientoAnt);
                infoEAAnt_data.push(infoEAAnt);
            });
            dataRendimientoAct.forEach(dataRendimientoAct_info => {
                var infoRendimientoAct = dataRendimientoAct_info.rendimiento;
                var infoEAAnt = dataRendimientoAct_info.ea;
                infoRendimientoAct_data.push(infoRendimientoAct);
                infoEAAct_data.push(infoEAAnt);
            });
        });
        
        setRendimiento_anio_ant(infoRendimientoAnt_data);
        setRendimiento_anio_act(infoRendimientoAct_data);
        setEA_anio_ant(infoEAAnt_data);
        setEA_anio_act(infoEAAct_data);

        setLoading(false);
        // var indiEstr = filterIndicadores(data, 'indicadoresEficiencia');
        // setIndicadoresEficiencia(indiEstr);

        // var indiRenta = filterIndicadores(data, 'indicadoresRentabilidad');
        // setIndicadoresRentabilidad(indiRenta);

        // var indiOper = filterIndicadores(data, 'indicadoresOperacion');
        // setIndicadoresOperacion(indiOper);
    }

    const genData = () => ({
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
          {
            type: 'line',
            label: 'Dataset 1',
            borderColor: '#0000ff',
            borderWidth: 2,
            fill: false,
            data: EA_Ant,
          },
          {
            type: 'line',
            label: 'Dataset 2',
            borderColor: '#0000ff',
            borderWidth: 2,
            fill: false,
            data: EA_Act,
          },
          {
            type: 'bar',
            label: 'Dataset 2',
            backgroundColor: '#3771B7',
            data: rendimiendo_anioAnt,
            borderColor: 'white',
            borderWidth: 2,
          },
          {
            type: 'bar',
            label: 'Dataset 3',
            backgroundColor: '#AE3330',
            data: rendimiendo_anioAct,
          },
        ],
    });

    const options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
    }

    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            <div className={classes.root}>
                <Header active={'gestion'} itemsHeader={() => itemsHeader()} />
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                    <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12} md={8} lg={8}>
                                <Paper className={classes.heightFull}>
                                    <Bar data={genData} options={options} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Paper className={fixedHeightPaper}>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Paper className={fixedHeightPaper}>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Charts */}
                            <Grid item xs={12} md={12} lg={12}>
                                <Paper className={fixedHeightPaper}>
                                    <p variant="p" className={classes.titleGestion}>
                                        Gestiones Realizadas
                                    </p>
                                    <p variant="p" className={classes.textGestion}>
                                        - Desde el 2 de marzo Emcali inicio seguimiento diario a las inversiones junto con el consorcio EMCALI
                                    </p>
                                    <p variant="p" className={classes.textGestion}>
                                        - Los recursos solo se invertian en el % de participación de las consorciadas, aunque el contrato de fiducia no lo establece como requisito
                                    </p>
                                    <p variant="p" className={classes.textGestion}>
                                        - Implementación de comité de inversiones en conjunto con el Consorcio EMCALI y las fiducias administradoras de los recursos
                                    </p>
                                    <p variant="p" className={classes.textGestion}>
                                        - Acompañamiento en dicho Comité de profesionales en gestión de portafolios de las fiduciarias participantes del consorcio
                                    </p>
                                    <p variant="p" className={classes.textGestion}>
                                        - Análisis semanal de mercados y prospectivas para toma de decisiones de inversión
                                    </p>
                                    <p variant="p" className={classes.textGestion}>
                                        - Control del flujo de caja para identificar excedentes de liquidez para inversión den FIC
                                    </p>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>
    )
}