import React, {useState, useEffect} from "react";
import { Breadcrumbs, Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import Header from '../menu/Header';
import { Link, Redirect } from 'react-router-dom';
import services from '../../services';
import {loadServerExcel} from '../../services';
import {filterColumnMes, optionsIngresosOper, optionsGastosDoughnut, optionsGroupBar, optionsEjecucionAcum,  filterMesesGroup, filterColumnMesTipo, filterMes, optionsBarGroup, optionsMeses, filterMesAcum, filterColumnMesTipo2, filterMesCostos, optionsStacked, filterColumnMesTipoCostoVenta, filterColumnMesTipoIngreso, optionsBarHorizontal, optionsLines, filterColumnMesTipo4} from '../../services/pyg';
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
        height: 240,
    },
}));

// Items que iran en el header.
export const itemsHeader = (changeFilter) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/pyg">
                    Costos Operacionales
                </Link>
                <Typography color="textPrimary" className="txt-breadcrumb">Costos de venta</Typography>
            </Breadcrumbs>
            <ButtonGroup variant="text" color="default" aria-label="text default button group">
            <Button style={{ padding: '0 2em' }} onClick={changeFilter('all')}>Todos</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('telco')}>TELCO</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('uenaa')}>UENAA</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('uene')}>UENE</Button>
            </ButtonGroup>
        </div>
    );
}

export default function CostosOperacionales() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'all'});
    const [loading, setLoading] = useState(true);


    // Grafica #1
    const [ingresosAnioAnt, setIngresosAnioAnt] = useState({proyectados_anio_anterior : 0, reales_anio_act : 0, reales_anio_act: 0});

    // Grafica #2
    const [ingresosOpeAnt, setIngresosOpeAnt] = useState([]);
    const [ingresosOpeAct, setIngresosOpeAct] = useState([]);

    // Gracica #3
    const [costosReales_act, setcostosReales_anioAct] = useState({valueOne : 0, valueTwo: 0, valueThree: 0, valueFour: 0});

    // Gracica #4
    const [grafico4_act, setgrafico4_anioAct] = useState({valueOne : 0, valueTwo: 0});

    // Grafica #5
    const [ueneAnt, setUeneAnt] = useState([]);
    const [ueneAct, setUeneAct] = useState([]);

    // Grafica #6
    const [uenaaAnt, setUenaaAnt] = useState([]);
    const [uenaaAct, setUenaaAct] = useState([]);

    // Grafica #7
    const [telcoAnt, setTelcoAnt] = useState([]);
    const [telcoAct, setTelcoAct] = useState([]);

    // Grafica #8
    const [mensualizadosRestAnt, setIngresosOpeRestAnt] = useState([]);
    const [mensualizadosRestAct, setIngresosOpeRestAct] = useState([]);

    // Grafica #9
    const [ingOpeAcumAnt, setingeOpeAcumAnt] = useState([]);
    const [ingOpeAcumAct, setingeOpeAcumAct] = useState([]);

    // Hook de React.
    useEffect(() => {
        loadDataExcel();
    }, []);

    const loadDataExcel = () => {
        // Carga del excel.
        loadServerExcel('http://127.0.0.1:8000/api/download-template/pyg', function (data, err) {
            setDataExcel(data.data);
            loadCharts(data.data);
        });
    }

    const loadCharts = (data, nombre_gerencia = filters.nombre_gerencia) => {
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'];
        var CostosVenta = ['Compra de Energía', 'Uso de Redes', 'Costos de Personal',  'Honorarios','Depreciación y amortización' ,'Mantenimiento y Reparaciones', 'Otros Costos Generales', 'Costo de venta de bienes', 'Impuestos', 'Materiales'];
        var CostosTelco = ['Costos de Personal', 'Depreciación y amortización telecomunicaciones', 'Otros Generales',  'Honorarios','Seguros' ,'Vigilancia', 'Energía', 'Costo por Conexión', 'Servicios Públicos', 'Mantenimientos y Reparaciones', 'Impuestos', 'Materiales'];
        var CostosUenaa = ['Depreciaciones', 'Costos de Personal', 'Energía', 'Mantenimiento', 'Otros Costos Generales', 'Honorarios', 'Vigilancia y Seguridad', 'Seguros', 'Productos Quimicos', 'Costo de venta de bienes', 'Impuestos', 'Materiales'];

        var costosVentas = ['Costo de venta de bienes', 'Ingresos operacionales']

        var uene_anio_anterior_data = [];
        var uene_anio_act_data = [];

        var ingresos_operacionales_acumulados_anio_ant_data = [];
        var ingresos_operacionales_acumulados_anio_act_data = [];

        var mensualizados_acumulados_anio_ant_data = [];
        var mensualizados_acumulados_anio_act_data = [];

        // Grafica #5
        var uene_anio_ant_data = [];
        var uene_anio_act_data = [];

        // Grafica #6
        var uenaa_anio_ant_data = [];
        var uenaa_anio_act_data = [];

        // Grafica #7
        var telco_anio_ant_data = [];
        var telco_anio_act_data = [];
        
        // Grafica #9
        var ingeOpeAcum_anio_ant_data = [];
        var ingeOpeAcum_anio_act_data = [];

        var ingresos_operacionales_acumuladosRest_anio_ant_data = [];
        var ingresos_operacionales_acumuladosRest_anio_act_data = [];


        // Grafica #1
        var proyectados_anio_anterior = filterColumnMesTipo2(data, 2019, nombre_gerencia, 'Septiembre', 'costos reales');
        var reales_anio_act = filterColumnMesTipo2(data, 2020, nombre_gerencia, 'Septiembre', 'costos reales');
        var reales_anio_act = filterColumnMesTipo2(data, 2020, nombre_gerencia, 'Septiembre', 'costos proyectados');
        setIngresosAnioAnt({
            proyectadosAnt_data : proyectados_anio_anterior, 
            realesAnt_data : reales_anio_act, 
            realesAct_data: reales_anio_act
        });

        // Grafica #2
        meses.forEach(mes => {
            var ingresos_operacionales_acumulados_anio_ant = filterMesCostos(data, 2019, 'Costos Reales', nombre_gerencia, mes);
            var ingresos_operacionales_acumulados_anio_act = filterMesCostos(data, 2020, 'Costos Reales', nombre_gerencia, mes);
            ingresos_operacionales_acumulados_anio_ant_data.push(ingresos_operacionales_acumulados_anio_ant);
            ingresos_operacionales_acumulados_anio_act_data.push(ingresos_operacionales_acumulados_anio_act);
        });
        setIngresosOpeAnt(ingresos_operacionales_acumulados_anio_ant_data);
        setIngresosOpeAct(ingresos_operacionales_acumulados_anio_act_data);

        // Grafica #3
        var costosReales_total_anio_act = filterColumnMesTipo2(data, 2020, 'all', 'Septiembre', 'costos reales');
        var costosReales_telco_anio_act = filterColumnMesTipo2(data, 2020, 'telco', 'Septiembre', 'costos reales');
        var costosReales_alca_anio_act = filterColumnMesTipo2(data, 2020, 'uenaa', 'Septiembre', 'costos reales');
        var costosReales_uene_anio_act = filterColumnMesTipo2(data, 2020, 'uene', 'Septiembre', 'costos reales');

        var costosReales_alca_anio_act_data = Math.round((costosReales_alca_anio_act / costosReales_total_anio_act) * 100, -1);
        var costosReales_telco_anio_act_data = Math.round((costosReales_telco_anio_act / costosReales_total_anio_act) * 100, -1);
        var costosReales_uene_anio_act_data = Math.round((costosReales_uene_anio_act / costosReales_total_anio_act) * 100, -1);
        setcostosReales_anioAct({valueOne : costosReales_alca_anio_act_data, valueTwo : costosReales_telco_anio_act_data, valueThree : costosReales_uene_anio_act_data});

        // Grafica # 4
        var grafico4_anio_act1 = filterColumnMesTipoCostoVenta(data, 2020, nombre_gerencia, 'Septiembre', 'Costos Reales', 'Costos de Personal');
        var grafico4_anio_act2 = filterColumnMesTipoCostoVenta(data, 2020, nombre_gerencia, 'Septiembre', 'Gastos Reales', 'Gasto de Personal');
        setgrafico4_anioAct({valueOne : grafico4_anio_act1, valueTwo : grafico4_anio_act2});

        // Grafica #5
        CostosTelco.forEach(costoTelco => {
            var telco_anio_anterior = filterColumnMesTipoCostoVenta(data, 2019, 'telco', 'Septiembre', 'Costos Reales', costoTelco);
            var telco_anio_act = filterColumnMesTipoCostoVenta(data, 2020, 'telco', 'Septiembre', 'Costos Reales', costoTelco);
            telco_anio_ant_data.push(telco_anio_anterior);
            telco_anio_act_data.push(telco_anio_act);
        });
        setTelcoAnt(telco_anio_ant_data);
        setTelcoAct(telco_anio_act_data);

        // Grafica #6
        CostosUenaa.forEach(costoUenaa => {
            var uenaa_anio_anterior = filterColumnMesTipoCostoVenta(data, 2019, 'uenaa', 'Septiembre', 'Costos Reales', costoUenaa);
            var uenaa_anio_act = filterColumnMesTipoCostoVenta(data, 2020, 'uenaa', 'Septiembre', 'Costos Reales', costoUenaa);
            uenaa_anio_ant_data.push(uenaa_anio_anterior);
            uenaa_anio_act_data.push(uenaa_anio_act);
        });
        setUenaaAnt(uenaa_anio_ant_data);
        setUenaaAct(uenaa_anio_act_data);
        
        // Grafica #7
        CostosVenta.forEach(costo => {
            var uene_anio_anterior = filterColumnMesTipoCostoVenta(data, 2019, 'uene', 'Septiembre', 'Costos Reales', costo);
            var uene_anio_act = filterColumnMesTipoCostoVenta(data, 2020, 'uene', 'Septiembre', 'Costos Reales', costo);
            uene_anio_ant_data.push(uene_anio_anterior);
            uene_anio_act_data.push(uene_anio_act);
        });
        setUeneAnt(uene_anio_ant_data);
        setUeneAct(uene_anio_act_data);

        // // Grafica #8
        // meses.forEach(mes => {
        //     var ingresos_operacionales_acumuladosRest_anio_ant = filterMesAcum(data, '2019', 'Ingresos Reales', nombre_gerencia, mes);
        //     var ingresos_operacionales_acumuladosRest_anio_act = filterMesAcum(data, '2020', 'Ingresos Reales', nombre_gerencia, mes);
        //     ingresos_operacionales_acumuladosRest_anio_ant_data.push(ingresos_operacionales_acumuladosRest_anio_ant);
        //     ingresos_operacionales_acumuladosRest_anio_act_data.push(ingresos_operacionales_acumuladosRest_anio_act);
        // }); 
        // var mensualizados_res_ant = Math.round((ingresos_operacionales_acumuladosRest_anio_ant_data - ingresos_operacionales_acumuladosRest_anio_ant_data), -1);
        // var mensualizados_res_act = Math.round((ingresos_operacionales_acumuladosRest_anio_act_data - ingresos_operacionales_acumuladosRest_anio_act_data), -1);
        // setIngresosOpeRestAnt(mensualizados_res_ant);
        // setIngresosOpeRestAct(mensualizados_res_act);

        // // Grafica #8
        // meses.forEach(mes => {
        //     var cosVsIngOpeAcum_anio_ant = filterColumnMesTipo2(data, 2019, nombre_gerencia, mes, 'Costos reales');
        //     var cosVsIngOpeAcum_anio_act = filterColumnMesTipo2(data, 2020, nombre_gerencia, mes, 'Costos reales');
        //     console.log(cosVsIngOpeAcum_anio_ant, cosVsIngOpeAcum_anio_act);
        //     cosVsIngOpeAcum_anio_ant_data.push(cosVsIngOpeAcum_anio_ant);
        //     cosVsIngOpeAcum_anio_act_data.push(cosVsIngOpeAcum_anio_act);
        // });
        // setcosVsIngOpeAcumAnt(cosVsIngOpeAcum_anio_ant_data);
        // setcosVsIngOpeAcumAct(cosVsIngOpeAcum_anio_act_data);

        // Grafica #9
        meses.forEach(mes => {
            costosVentas.forEach(costoVenta => {
                var ingeOpeAcum_anio_ant = filterColumnMesTipo4(data, 2019, nombre_gerencia, mes, costoVenta);
                var ingeOpeAcum_anio_act = filterColumnMesTipo4(data, 2020, nombre_gerencia, mes, costoVenta);
                console.log(ingeOpeAcum_anio_ant, ingeOpeAcum_anio_act);
                ingeOpeAcum_anio_ant_data.push(ingeOpeAcum_anio_ant);
                ingeOpeAcum_anio_act_data.push(ingeOpeAcum_anio_act);
            })
        });
        setingeOpeAcumAnt(ingeOpeAcum_anio_ant_data);
        setingeOpeAcumAct(ingeOpeAcum_anio_act_data);

        setLoading(false);
    }

    // Cambiar los filtros en base a nombre gerencia.
    const changeFilterNomGerencia = (value)  => (event) => {
        setFilters({nombre_gerencia : value});
        // Inicializacion del loading.
        setLoading(true);
        loadCharts(dataExcel, value);
    }

    // Grafica #1
    const dataIngresosAnios = {
        labels: ['2019', '2019', '2020'],
        datasets: [{
            label: [''],
            data: [ingresosAnioAnt.proyectadosAnt_data, ingresosAnioAnt.realesAnt_data, ingresosAnioAnt.realesAct_data],
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

    // Grafica #2
    const dataIngreVsGas = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
        {
            label: '2020',
            data: ingresosOpeAct,
            backgroundColor: '#2119C8',
        },
        ],
    }


    // Grafica #3
    const dataIngresosReales = {
        labels: ['TELCO', 'UENAA', 'UENE'],
        datasets: [
        {
            label: '',
            data: [costosReales_act.valueOne, costosReales_act.valueTwo, costosReales_act.valueThree],
            backgroundColor: [
            '#4F81BD',
            '#C0504D',
            '#9BBB59',
            ],
            borderColor: [
            '#4F81BD',
            '#C0504D',
            '#9BBB59',
            ],
            borderWidth: 1,
        },
        ],
    }

    // Grafica #4
    const dataGrafico4 = {
        labels: ['1'],
        datasets: [
          {
            label: 'Inversión',
            data: [grafico4_act.valueOne],
            backgroundColor: '#A02F2C',
          },
          {
            label: 'Servicio de la deuda',
            data: [grafico4_act.valueTwo],
            backgroundColor: '#6C4C92',
          },
        ],
      }
    
      // Grafica #5
    const dataCostoVentaUENE = {
        labels: ['Compra de Energía', 'Uso de Redes', 'Costos de Personal',  'Honorarios','Depreciación y amortización' ,'Mantenimiento y Reparaciones', 'Otros Costos Generales', 'Costo de venta de bienes', 'Impuestos', 'Materiales'],
        datasets: [
          {
            label: '2019',
            data: ueneAnt,
            backgroundColor: '#FFC503',
          },
          {
            label: '2020',
            data: ueneAct,
            backgroundColor: '#2119C8',
          },
        ],
    }

    // Grafica #6
    const dataCostoVentaUENAA = {
        labels: ['Depreciaciones', 'Costos de Personal', 'Energía', 'Mantenimiento', 'Otros Costos Generales', 'Honorarios', 'Vigilancia y Seguridad', 'Seguros', 'Productos Quimicos', 'Costo de venta de bienes', 'Impuestos', 'Materiales'],
        datasets: [
        {
            label: '2019',
            data: uenaaAnt,
            backgroundColor: '#FFC503',
        },
        {
            label: '2020',
            data: uenaaAct,
            backgroundColor: '#2119C8',
        },
        ],
    }

    // Grafica #7
    const dataCostoVentaTELCO = {
        labels: ['Costos de Personal', 'Depreciación y amortización telecomunicaciones', 'Otros Generales',  'Honorarios','Seguros' ,'Vigilancia', 'Energía', 'Costo por Conexión', 'Servicios Públicos', 'Mantenimientos y Reparaciones', 'Impuestos', 'Materiales'],
        datasets: [
          {
            label: '2019',
            data: telcoAnt,
            backgroundColor: '#FFC503',
          },
          {
            label: '2020',
            data: telcoAct,
            backgroundColor: '#2119C8',
          },
        ],
    }

    // Grafica #8
    const data = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        datasets: [
          {
            label: '2019 - costo de ventas',
            data: ingOpeAcumAnt,
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
            yAxisID: 'y-axis-1',
          },
          {
            label: '2019 - Ingresos Operacionales',
            data: ingOpeAcumAct,
            fill: false,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgba(54, 162, 235, 0.2)',
            yAxisID: 'y-axis-2',
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
                                                        <p>Ingresos Proyectados</p>
                                                    </div>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#FFB12E'}}></span>
                                                        <p>Ingresos Reales</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={5} lg={5}>
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
                                            <Bar  data={dataIngreVsGas} options={optionsMeses}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#507FF2'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FFB12E'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                        </div>
                                 }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <Paper className={fixedHeightPaper}>
                                    {
                                        loading ? 
                                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                <div style={{width: '100%'}}>
                                                    <Skeleton variant="circle" width={145} height={145} />
                                                </div>
                                            </div>
                                        :
                                            <div style={{display: 'flex'}}>
                                                <div style={{width: '100%'}}>
                                                    <Pie data={dataIngresosReales} options={optionsGastosDoughnut}/>
                                                </div>
                                            </div>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
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
                                        <div style={{display: 'flex'}}>
                                            <div style={{width: '100%'}}>
                                                <HorizontalBar data={dataGrafico4} options={optionsStacked}/>
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
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>UENE</p>
                                                </div>
                                            </div>
                                            <HorizontalBar  data={dataCostoVentaUENE} options={optionsBarHorizontal}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#507FF2'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FFB12E'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                        </div>
                                 }
                                </Paper>
                            </Grid>

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
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>UENAA</p>
                                                </div>
                                            </div>
                                            <HorizontalBar  data={dataCostoVentaUENAA} options={optionsBarHorizontal}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#507FF2'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FFB12E'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                        </div>
                                 }
                                </Paper>
                            </Grid>

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
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>TELCO</p>
                                                </div>
                                            </div>
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>UENAA</p>
                                                </div>
                                            </div>
                                            <HorizontalBar  data={dataCostoVentaTELCO} options={optionsBarHorizontal}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#507FF2'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FFB12E'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                        </div>
                                 }
                                </Paper>
                            </Grid>

                            {/* Charts */}
                            

                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaper}>
                                <Line data={data} options={optionsLines} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>
    )
}