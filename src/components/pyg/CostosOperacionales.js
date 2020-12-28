import React, {useState, useEffect} from "react";
import { Breadcrumbs, Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import Header from '../menu/Header';
import { Link, Redirect } from 'react-router-dom';
import services from '../../services';
import {loadServerExcel} from '../../services';
import {filterColumnMes, optionsIngresosOper, optionsGastosDoughnut, optionsGroupBar, optionsEjecucionAcum,  filterMesesGroup, filterColumnMesTipo, filterMes, optionsBarGroup, optionsMeses, filterMesAcum, filterColumnMesTipo2, filterMesCostos, optionsStacked, filterColumnMesTipoCostoVenta, filterColumnMesTipoIngreso, optionsBarHorizontal, filterColumnMesTipo3, filterMesAcumGastos, filterMesGastosOper, filterColumnMesTipoIngreso2, filterColumnMesTipoGastosOper, filterColumnMesTipoGastoOpera, optionsStackedPorcentual} from '../../services/pyg';
import { HorizontalBar, Bar, Doughnut, Pie  } from 'react-chartjs-2';
import Skeleton from '@material-ui/lab/Skeleton';
import "chartjs-plugin-datalabels";
import icon_uene from './../../assets/images/icons/comercial/uene.png';

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
        height: 240,
    },
    fixedHeightVH: {
        height: 300,
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
            <Button style={{ padding: '0 2em' }} onClick={changeFilter('all')}>EMCALI</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('telco')}>TELCO</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('uenaa')}>UENAA</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('uene')} ><img src={icon_uene} alt="uene" style={{paddingRight: '10px'}}/> UENE</Button>
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
    const [mensualizadosRestAnt, setGastosOpeAcumAnt] = useState([]);
    const [mensualizadosRestAct, setGastosOpeAcumAct] = useState([]);

    // Grafica #4
    const [gastosOper_act, setGastosOper_anioAct] = useState({valueOne : 0, valueTwo: 0, valueThree: 0});

    // Grafica #5
    const [grafico4_act, setgrafico4_anioAct] = useState({valueOne : 0, valueTwo: 0});

    // Grafica #6
    const [uenecoAnt, setUENEcoAnt] = useState([]);
    const [uenecoAct, setUENEcoAct] = useState([]);

    // Grafica #7
    const [uenaacoAnt, setUENAAcoAnt] = useState([]);
    const [uenaacoAct, setUENAAcoAct] = useState([]);

    // Grafica #8
    const [telcocoAnt, setTelcocoAnt] = useState([]);
    const [telcocoAct, setTelcocoAct] = useState([]);


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
        // var GastosOperUENE = ['Gasto de Personal', 'Gasto de Personal', 'Generales',  'Impuestos, contribuciones y tasas','Seguros'];
        var GastosOperUENE = ['Dep,  Amort, Deterioros y Provisiones', 'Gasto de Personal', 'Generales',  'Impuestos, contribuciones y tasas'];
        var GastosOperUENAA = ['Gasto de Personal', 'Generales',  'Dep,  Amort, Deterioros y Provisiones','Impuestos, contribuciones y tasas'];
        var GastosOperTelco = ['Gasto de Personal', 'Generales',  'Dep,  Amort, Deterioros y Provisiones','Impuestos, contribuciones y tasas'];

        // Grafica #2
        var ingresos_operacionales_acumuladosRest_anio_ant_data = [];
        var ingresos_operacionales_acumuladosRest_anio_act_data = [];

        // Grafica #3
        var ingresos_operacionales_acumulados_anio_ant_data = [];
        var ingresos_operacionales_acumulados_anio_act_data = [];

        // Grafica #6
        var uene_anio_ant_data = [];
        var uene_anio_act_data = [];

        // Grafica #7
        var uenaa_anio_ant_data = [];
        var uenaa_anio_act_data = [];

        // Grafica #8
        var telco_anio_ant_data = [];
        var telco_anio_act_data = [];


        // Grafica #1
        var proyectados_anio_anterior = filterColumnMesTipo3(data, 2019, nombre_gerencia, 'Septiembre', 'Gastos reales');
        var reales_anio_act = filterColumnMesTipo3(data, 2020, nombre_gerencia, 'Septiembre', 'Gastos Proyectados');
        var reales_anio_act = filterColumnMesTipo3(data, 2020, nombre_gerencia, 'Septiembre', 'Gastos reales');
        setIngresosAnioAnt({
            proyectadosAnt_data : proyectados_anio_anterior, 
            realesAnt_data : reales_anio_act, 
            realesAct_data: reales_anio_act
        });

        // Grafica #2
        meses.forEach(mes => {
            var ingresos_operacionales_acumuladosRest_anio_ant = filterMesAcumGastos(data, 2019, 'Gastos reales', nombre_gerencia, mes);
            var ingresos_operacionales_acumuladosRest_anio_act = filterMesAcumGastos(data, 2020, 'Gastos reales', nombre_gerencia, mes);
            ingresos_operacionales_acumuladosRest_anio_ant_data.push(ingresos_operacionales_acumuladosRest_anio_ant);
            ingresos_operacionales_acumuladosRest_anio_act_data.push(ingresos_operacionales_acumuladosRest_anio_act);
        }); 
        setIngresosOpeAnt(ingresos_operacionales_acumuladosRest_anio_ant_data);
        setIngresosOpeAct(ingresos_operacionales_acumuladosRest_anio_act_data);

         // Grafica #3
         meses.forEach(mes => {
            var ingresos_operacionales_acumulados_anio_ant = filterMesGastosOper(data, 2019, 'Gastos reales', nombre_gerencia, mes);
            var ingresos_operacionales_acumulados_anio_act = filterMesGastosOper(data, 2020, 'Gastos reales', nombre_gerencia, mes);
            ingresos_operacionales_acumulados_anio_ant_data.push(ingresos_operacionales_acumulados_anio_ant);
            ingresos_operacionales_acumulados_anio_act_data.push(ingresos_operacionales_acumulados_anio_act);
        });
        var substraction_ebitda_anio_ant = restaElementoAnt(ingresos_operacionales_acumulados_anio_ant_data);
        var substraction_ebitda_anio_act = restaElementoAnt(ingresos_operacionales_acumulados_anio_act_data);
        setGastosOpeAcumAnt(substraction_ebitda_anio_ant);
        setGastosOpeAcumAct(substraction_ebitda_anio_act);

        // Grafica #4
        var ingresoReales_total_anio_act = filterColumnMesTipoGastosOper(data, 2020, 'all', 'Septiembre', 'Gastos reales');
        var ingresoReales_acue_anio_act = filterColumnMesTipoGastosOper(data, 2020, 'telco', 'Septiembre', 'Gastos reales');
        var ingresoReales_alca_anio_act = filterColumnMesTipoGastosOper(data, 2020, 'uenaa', 'Septiembre', 'Gastos reales');
        var ingresoReales_uene_anio_act = filterColumnMesTipoGastosOper(data, 2020, 'uene', 'Septiembre', 'Gastos reales');

        var ingresoReales_acue_anio_act_data = Math.round((ingresoReales_acue_anio_act / ingresoReales_total_anio_act) * 100, -1);
        var ingresoReales_alca_anio_act_data = Math.round((ingresoReales_alca_anio_act / ingresoReales_total_anio_act) * 100, -1);
        var ingresoReales_uene_anio_act_data = Math.round((ingresoReales_uene_anio_act / ingresoReales_total_anio_act) * 100, -1);
        setGastosOper_anioAct({valueOne : ingresoReales_acue_anio_act_data, valueTwo : ingresoReales_alca_anio_act_data, valueThree : ingresoReales_uene_anio_act_data})

        // Grafica #5
        var grafico4_anio_act1 = filterColumnMesTipoGastoOpera(data, 2020, nombre_gerencia, 'Septiembre', 'Costos Reales', 'Costos de Personal');
        var grafico4_anio_act2 = filterColumnMesTipoGastoOpera(data, 2020, nombre_gerencia, 'Septiembre', 'Gastos Reales', 'Gasto de Personal');
        var total = Math.round(grafico4_anio_act1 + grafico4_anio_act2);
        setgrafico4_anioAct({valueOne :  Math.round((grafico4_anio_act1 * 100) / total, -1), valueTwo : Math.round((grafico4_anio_act2 * 100) / total, -1)});

        // Grafica #6
        GastosOperUENE.forEach(gastoOperUENE => {
            var uene_anio_anterior = filterColumnMesTipoGastoOpera(data, 2019, 'uene', 'Septiembre', 'Gastos Reales', gastoOperUENE);
            var uene_anio_act = filterColumnMesTipoGastoOpera(data, 2020, 'uene', 'Septiembre', 'Gastos Reales', gastoOperUENE);
            uene_anio_ant_data.push(uene_anio_anterior);
            uene_anio_act_data.push(uene_anio_act);
        });
        setUENEcoAnt(uene_anio_ant_data);
        setUENEcoAct(uene_anio_act_data);

        // Grafica #7
        GastosOperUENAA.forEach(gastoOperUENAA => {
            var uenaa_anio_anterior = filterColumnMesTipoGastoOpera(data, 2019, 'uenaa', 'Septiembre', 'Gastos Reales', gastoOperUENAA);
            var uenaa_anio_act = filterColumnMesTipoGastoOpera(data, 2020, 'uenaa', 'Septiembre', 'Gastos Reales', gastoOperUENAA);
            uenaa_anio_ant_data.push(uenaa_anio_anterior);
            uenaa_anio_act_data.push(uenaa_anio_act);
        });
        setUENAAcoAnt(uenaa_anio_ant_data);
        setUENAAcoAct(uenaa_anio_act_data);

        // Grafica #8
        GastosOperTelco.forEach(gastoOperTelco => {
            var telco_anio_anterior = filterColumnMesTipoGastoOpera(data, 2019, 'telco', 'Septiembre', 'Gastos Reales', gastoOperTelco);
            var telco_anio_act = filterColumnMesTipoGastoOpera(data, 2020, 'telco', 'Septiembre', 'Gastos Reales', gastoOperTelco);
            telco_anio_ant_data.push(telco_anio_anterior);
            telco_anio_act_data.push(telco_anio_act);
        });
        setTelcocoAnt(telco_anio_ant_data);
        setTelcocoAct(telco_anio_act_data);
        

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
        labels: ['2019', '2020', '2020'],
        datasets: [{
            label: [''],
            data: [ingresosAnioAnt.proyectadosAnt_data, ingresosAnioAnt.realesAnt_data, ingresosAnioAnt.realesAct_data],
            backgroundColor: [
                '#CC0505',
                '#052569',
                '#CC0505',
            ],
            borderColor: [
                '#CC0505',
                '#052569',
                '#CC0505',
            ],
            borderWidth: 1
        }]
    };

    // Grafica #2
    const dataIngreVsGas = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: '2019',
            data: ingresosOpeAnt,
            backgroundColor: '#3C77BE',
          },
          {
            label: '2020',
            data: ingresosOpeAct,
            backgroundColor: '#CB0505',
          },
        ],
    }

    // Grafica #3
    const dataMensualizados = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
        {
            label: '2019',
            data: mensualizadosRestAnt,
            backgroundColor: '#3C77BE',
        },
        {
            label: '2020',
            data: mensualizadosRestAct,
            backgroundColor: '#CB0505',
        },
        ],
    }

    // Grafica #4
    const dataIngresosReales = {
        labels: ['TELCO', 'UENAA', 'UENE'],
        datasets: [
        {
            label: '',
            data: [gastosOper_act.valueOne, gastosOper_act.valueTwo, gastosOper_act.valueThree],
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

    // Grafica #5
    const dataGrafico4 = {
        labels: ['1'],
        datasets: [
          {
            label: 'Gasto de Personal',
            data: [grafico4_act.valueOne],
            backgroundColor: '#4283D2',
          },
          {
            label: 'Costos de Personal',
            data: [grafico4_act.valueTwo],
            backgroundColor: '#C33D3A',
          },
        ],
      }

    // Grafica #6
    const dataCostoVentaUENE = {
        labels: ['Dep,  Amort, Deterioros y Provisiones', 'Gasto de Personal', 'Generales',  'Impuestos, contribuciones y tasas'],
        datasets: [
          {
            label: '2019',
            data: uenecoAnt,
            backgroundColor: '#558ED5',
          },
          {
            label: '2020',
            data: uenecoAct,
            backgroundColor: '#C00000',
          },
        ],
    }

    // Grafica #7
    const dataCostoVentaUENAA = {
        labels: ['Gasto de Personal', 'Generales',  'Dep,  Amort, Deterioros y Provisiones','Impuestos, contribuciones y tasas'],
        datasets: [
          {
            label: '2019',
            data: uenaacoAnt,
            backgroundColor: '#558ED5',
          },
          {
            label: '2020',
            data: uenaacoAct,
            backgroundColor: '#C00000',
          },
        ],
    }

    // Grafica #8
    const dataCostoVentaTelco = {
        labels: ['Gasto de Personal', 'Generales',  'Dep,  Amort, Deterioros y Provisiones','Impuestos, contribuciones y tasas'],
        datasets: [
          {
            label: '2019',
            data: telcocoAnt,
            backgroundColor: '#558ED5',
          },
          {
            label: '2020',
            data: telcocoAct,
            backgroundColor: '#C00000',
          },
        ],
    }
    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            <div className={classes.root}>
                <Header active={'pyg'} itemsHeader={() => itemsHeader(changeFilterNomGerencia)} />
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
                                                <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                    <div className="itemChart" >
                                                        <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>Gastos Operacionales</p>
                                                    </div>
                                                </div>
                                                <HorizontalBar  data={dataIngresosAnios} options={optionsEjecucionAcum}/>
                                                <div className="containerLabelsCharts">
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#CC0505'}}></span>
                                                        <p>Gastos Proyectados</p>
                                                    </div>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#052569'}}></span>
                                                        <p>Gastos Reales</p>
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
                                                <Skeleton variant="text" width={'25%'}/>
                                                <Skeleton variant="text" width={'25%'}/>
                                                <Skeleton variant="text" width={'25%'}/>
                                            </div>
                                        </div>
                                :
                                        <div>
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>Gastos Ope. Acumulados</p>
                                                </div>
                                            </div>
                                            <Bar  data={dataIngreVsGas} options={optionsMeses}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#3C77BE'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#CB0505'}}></span>
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
                                                <Skeleton variant="text" width={'25%'}/>
                                                <Skeleton variant="text" width={'25%'}/>
                                                <Skeleton variant="text" width={'25%'}/>
                                            </div>
                                        </div>
                                :
                                        <div>
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>Gastos Ope. Mensualizados</p>
                                                </div>
                                            </div>
                                            <Bar  data={dataMensualizados} options={optionsMeses}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#3C77BE'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#CB0505'}}></span>
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
                                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                <div style={{width: '100%'}}>
                                                    <Skeleton variant="circle" width={145} height={145} />
                                                </div>
                                            </div>
                                        :
                                            <div style={{display: 'flex'}}>
                                                <div style={{width: '100%'}}>
                                                    <Doughnut data={dataIngresosReales} options={optionsGastosDoughnut}/>
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
                                                    <Skeleton variant="text" width={'25%'}/>
                                                    <Skeleton variant="text" width={'25%'}/>
                                                </div>
                                            </div>
                                        :
                                        <div style={{display: 'flex'}}>
                                            <div style={{width: '100%'}}>
                                                <Bar data={dataGrafico4} options={optionsStackedPorcentual}/>
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
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>UENE</p>
                                                </div>
                                            </div>
                                            <HorizontalBar  data={dataCostoVentaUENE} options={optionsBarHorizontal}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#558ED5'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#C00000'}}></span>
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
                                                    <span className="iconList" style={{background: '#558ED5'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#C00000'}}></span>
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
                                            <HorizontalBar  data={dataCostoVentaTelco} options={optionsBarHorizontal}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#558ED5'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#C00000'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                        </div>
                                 }
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>
    )
}