import React, {useState, useEffect} from "react";
import {Breadcrumbs, Typography, makeStyles, Container, Grid, Paper, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import clsx from 'clsx';
import Header from '../menu/Header';
import { Link, Redirect } from 'react-router-dom';
import services from '../../services';
import {loadServerExcel} from '../../services';
import { filterGestion, filterGestionesRealizadas, filterSaldo, filterFiduciarias, filterPorcentaje } from '../../services/gestion';
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
        justifyContent: 'space-around',
    },
    fixedHeight: {
        height: 320,
    },
    heightFull: {
        height: '100%'
    },
    fixedHeightVH: {
        height: 665,
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
    },
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
    const fixedHeightPaperVH = clsx(classes.paper, classes.fixedHeightVH);
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'all'});
    const [loading, setLoading] = useState(true);
    const [rendimiendo_anioAnt, setRendimiento_anio_ant] = useState([]);
    const [rendimiendo_anioAct, setRendimiento_anio_act] = useState([]);

    const [EA_Ant, setEA_anio_ant] = useState([]);
    const [EA_Act, setEA_anio_act] = useState([]);

    const [saldoAnt, setSaldoAnt] = useState([]);
    const [saldoAct, setSaldoAct] = useState([]);

    // const [fiduciarias_data, serFiduciarias_data] = useState([]);
    // serFiduciarias_data({valueOne : fiduciarias1, valueTwo : fiduciarias2, valueThree : fiduciarias3, valueFour : fiduciarias4, valueFive : fiduciarias5, valueFix : fiduciarias6});
    const [fiduciarias_data, serFiduciarias_data] = useState({valueOne : 0, valueTwo : 0, valueThree : 0, valueFour : 0, valueFive : 0, valueSix : 0});

    const [gestiones_realizadas, setGestiones_realizadas] = useState([]);

    // Hook de React.
    useEffect(() => {
        loadDataExcel();
    }, []);

    const loadDataExcel = () => {
        // Carga del excel
        loadServerExcel(services.baseUrl + 'download-template/gestion', function (data, err) {
            setDataExcel(data.data);
            loadCharts(data.data);
        });
    }

    const loadCharts = (data) => {
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        var infoRendimientoAnt_data = [];
        var infoRendimientoAct_data = [];
        var porcentaje_anio_Ant_data = [];
        var porcentaje_anio_Act_data = [];

        // Grafica #1
        meses.forEach(mes => {

            var dataRendimientoAnt = filterGestion(data, 2019, mes);
            var dataRendimientoAct = filterGestion(data, 2020, mes);

            dataRendimientoAnt.forEach(dataRendimientoAnt_info => {
                var infoRendimientoAnt = dataRendimientoAnt_info.rendimiento;
                var infoEAAnt = dataRendimientoAnt_info.ea;
                infoRendimientoAnt_data.push(infoRendimientoAnt);
            });
            
            dataRendimientoAct.forEach(dataRendimientoAct_info => {
                var infoRendimientoAct = dataRendimientoAct_info.rendimiento;
                var infoEAAnt = dataRendimientoAct_info.ea;
                infoRendimientoAct_data.push(infoRendimientoAct);
                // infoEAAct_data.push(infoEAAnt);
            });
        });
        setRendimiento_anio_ant(infoRendimientoAnt_data);
        setRendimiento_anio_act(infoRendimientoAct_data);

        meses.forEach(mes => {
            var porcentaje_anio_Ant = filterPorcentaje(data, 2019, mes);
            porcentaje_anio_Ant.forEach(porceAnt => {
                var porceeaAnt = porceAnt.ea;
                porcentaje_anio_Ant_data.push((porceeaAnt * 100).toFixed(1));
            });
            var porcentaje_anio_Act = filterPorcentaje(data, 2020, mes);
            porcentaje_anio_Act.forEach(porceAct => {
                var porceeaAct = porceAct.ea;
                porcentaje_anio_Act_data.push((porceeaAct * 100).toFixed(1));
            });
        }); 
        setEA_anio_ant(porcentaje_anio_Ant_data);
        setEA_anio_act(porcentaje_anio_Act_data);
        
        // Grafica #2
        var saldoAnt = filterSaldo(data, 2019);
        var saldoAct = filterSaldo(data, 2020);
        var saldoAnt = saldoAnt[0].saldo;
        var saldoAct = saldoAct[0].saldo;
        setSaldoAnt(saldoAnt);
        setSaldoAct(saldoAct);

        // Grafica #3
        var fiduciarias = filterFiduciarias(data);
        var fiduciarias1 = (fiduciarias[0].porcentajes * 100).toFixed(1);
        var fiduciarias2 = (fiduciarias[1].porcentajes * 100).toFixed(1);;
        var fiduciarias3 = (fiduciarias[2].porcentajes * 100).toFixed(1);;
        var fiduciarias4 = (fiduciarias[3].porcentajes * 100).toFixed(1);;
        var fiduciarias5 = (fiduciarias[4].porcentajes * 100).toFixed(1);;
        var fiduciarias6 = (fiduciarias[5].porcentajes * 100).toFixed(1);;
        serFiduciarias_data({valueOne : fiduciarias1, valueTwo : fiduciarias2, valueThree : fiduciarias3, valueFour : fiduciarias4, valueFive : fiduciarias5, valueSix : fiduciarias6});

        // Tabla
        var gestiones_realizadas = filterGestionesRealizadas(data);
        setGestiones_realizadas(gestiones_realizadas);

        setLoading(false);
    }

    const genData = () => ({
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
          {
            type: 'line',
            label: '% EA 2019',
            yAxisID: 'B',
            borderColor: '#9BBB59',
            borderWidth: 2,
            fill: false,
            data: EA_Ant,
          },
          {
            type: 'line',
            label: '% EA 2020',
            yAxisID: 'B',
            borderColor: '#866BA6',
            borderWidth: 2,
            fill: false,
            data: EA_Act,
          },
          {
            type: 'bar',
            label: 'Rendimiento 2019',
            yAxisID: 'A',
            backgroundColor: '#3771B7',
            data: rendimiendo_anioAnt,
            borderColor: 'white',
            borderWidth: 2,
          },
          {
            type: 'bar',
            label: 'Rendimiento 2020',
            yAxisID: 'A',
            backgroundColor: '#AE3330',
            data: rendimiendo_anioAct,
          },
        ],
    });

    const options = {
        scales: {
            yAxes: [
            { 
                id: 'A', 
                type: 'linear', 
                position: 'left', 
            }, 
            { 
                id: 'B',
                type: 'linear',
                position: 'right',
                ticks: { 
                    max: 9,
                    min: 0,
                    callback: function(value, index, values) {
                        return value+' %';
                    }
                }
            }]
        },
        plugins: {
            datalabels: {
                align: 'start',
                anchor: 'end',
                offset: -16,
                font: {
                    size: 10,
                },
                labels: {
                    id: 'A',
                    value: {
                        display: false,
                        color: '#000',
                    }
                },
                formatter: function(value, context) {
                    return value;
                }
            }
        }
    }

    const dataSaldo = {
        labels: ['', ''],
        datasets: [
            {
            label: 'Saldo',
            data: [saldoAnt, saldoAct],
            backgroundColor: [
                '#CD3C38',
                '#CD3C38',
            ],
            borderColor: [
                '#CD3C38',
                '#CD3C38',
            ],
            borderWidth: 1,
            },
        ],
        
    }

    const optionsSaldo = {
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
        title: {
            display: false
        },
        legend: {
            display: false
        },
        tooltips: {enabled: false},
        plugins: {
            datalabels: {
                align: 'top',
                padding: 0,
                labels: {
                    value: {
                        color: '#000',
                    }
                },
                formatter: function(value, context) {
                    var currencyFormat = new Intl.NumberFormat('de-DE').format(value);
                    return currencyFormat;
                }
            }
        }
    }

    const dataFiduciarias = {
        labels: ['FIDUOCCIDENTE', 'FIDUAGRARIA', 'FIDUPREVISORA', 'FIDUACIARIA BBVA', 'FIDUBOGOTA', 'FIDUCOLOMBIA'],
        datasets: [
        {
            label: '',
            data: [fiduciarias_data.valueOne, fiduciarias_data.valueTwo, fiduciarias_data.valueThree, fiduciarias_data.valueFour, fiduciarias_data.valueFive, fiduciarias_data.valueSix],
            backgroundColor: [
            '#4F81BD',
            '#C0504D',
            '#9BBB59',
            '#8064A2',
            '#4BACC6',
            '#F79646',
            ],
            borderColor: [
            '#4F81BD',
            '#C0504D',
            '#9BBB59',
            '#8064A2',
            '#4BACC6',
            '#F79646',
            ],
            borderWidth: 1,
        },
        ],
    }

    const optionsFiduciarias = {
        tooltips: {enabled: false},
        legend: {
            display: true,
            labels: {
                fontSize: 10,
            }
        },
        layout: {
            padding: {
                top: 0,
                bottom: 0
            }
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
                                <Paper className={fixedHeightPaperVH}>
                                    <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                        <div className="itemChart" >
                                            <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Rendimientos FIC</p>
                                        </div>
                                    </div>
                                    <Bar data={genData} options={options} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
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
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Saldo</p>
                                                </div>
                                            </div>
                                            <Bar data={dataSaldo} height={150} options={optionsSaldo} />
                                            <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#CD3C38'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#CD3C38'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                         </div>
                                        }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Paper className={fixedHeightPaper}>
                                        {
                                            loading ? 
                                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                    <Skeleton variant="circle" width={145} height={145} />
                                                </div>
                                            :
                                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                                    <div style={{width: '100%'}}>
                                                        <Pie data={dataFiduciarias} options={optionsFiduciarias} hegith={250} width={250}/>
                                                    </div>
                                                </div>
                                        }
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
                                    {gestiones_realizadas.map((row) => (
                                        <p variant="p" className={classes.textGestion}>
                                            - {row.gestiones_realizadas}
                                        </p>
                                    ))}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>
    )
}