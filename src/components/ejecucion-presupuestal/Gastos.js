import React, {useState, useEffect} from "react";
import { Breadcrumbs, Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { Link, Redirect } from 'react-router-dom';
import Header from '../menu/Header';
import services from '../../services';
import {loadServerExcel} from '../../services';
import {optionsEjecucionAcum, filterMesesGroup, filterBasic, filterMes, filterNameGroup, optionsIngreVsGas, optionsGastosDoughnut, optionsStacked} from '../../services/ejecucionPresupuesta'
import { HorizontalBar, Bar, Doughnut, Pie } from 'react-chartjs-2';
import Skeleton from '@material-ui/lab/Skeleton';
import UENE from '../../assets/images/icons/comercial/uene.png'
import acueducto from '../../assets/images/icons/comercial/acueducto.png'
import alcantarillado from '../../assets/images/icons/comercial/alcantarillado.png'
import internet from '../../assets/images/icons/comercial/internet.png'
import telecomunicaciones from '../../assets/images/icons/comercial/telecomunicaciones.png'
import tv from '../../assets/images/icons/comercial/tv.png'
import logo from '../../assets/images/logosidebar_reducido.png'
import corporativo from '../../assets/images/icons/comercial/corporativo.png'

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
        height: 180,
    },
    heightFull: {
        height: '100%'
    },
    fixedHeightVH: {
        height: 384,
    },
    fixedHeightMedium: {
        height: 300,
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
                <Typography color="textPrimary" className="txt-breadcrumb">Gastos</Typography>
            </Breadcrumbs>
            <ButtonGroup variant="text" color="default" aria-label="text default button group">
                <Button style={{ padding: '0 1em' }} onClick={changeFilter('all')}><img src={logo} alt="uene" style={{paddingRight: '10px', width: 40}}/>Emcali</Button>
                <Button style={{ padding: '0 1em' }} onClick={changeFilter('corporativo')}><img src={corporativo} alt="uene" style={{paddingRight: '10px'}}/>Corporativo</Button>
                <Button style={{ padding: '0 1em' }} onClick={changeFilter('telco')}><img src={internet} alt="uene" style={{paddingRight: '10px'}}/>TELCO</Button>
                <Button style={{ padding: '6px 1em' }} onClick={changeFilter('uenaa')}><img src={alcantarillado} alt="uene" style={{paddingRight: '10px'}}/>UENAA</Button>
                <Button style={{ padding: '6px 1em' }} onClick={changeFilter('uene')}><img src={UENE} alt="uene" style={{paddingRight: '10px'}}/>UENE</Button>
            </ButtonGroup>
        </div>
    );
}

export default function Gastos() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const fixedHeightPaperVH = clsx(classes.paper, classes.fixedHeightVH);
    const fixedHeightMedium = clsx(classes.paper, classes.fixedHeightMedium);
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'all'});
    const [loading, setLoading] = useState(true);
    const [ejecucionAcumulada, serEjecucionAcumulada2020] = useState({Proyectados : 0, Comprometidos : 0, Causados: 0});

    const [Gastos_proyectados, setGastos_proyectados] = useState([]);
    const [Gastos_comprometidos, setGastos_comprometidos] = useState([]);
    const [Gastos_causados, setGastos_causados] = useState([]);

    const [gastosComprocaucom, setGastosComprocaucom] = useState({valueOne : 0, valueTwo : 0});

    const [invComprocaucom, setInvComprocaucom] = useState({valueOne : 0, valueTwo : 0});

    const [gastosCausados_corpo_ant, setGastosCausados_corpo_anioAnt] = useState({valueOne : 0, valueTwo: 0, valueThree: 0, valueFour: 0});
    const [gastosCausados_corpo_act, setGastosCausados_corpo_anioAct] = useState({valueOne : 0, valueTwo: 0, valueThree: 0, valueFour: 0});
    const [NombreGrupo_totalAct, setNombreGrupo_totalAct] = useState({valueOne : 0, valueTwo: 0, valueThree: 0, valueFour: 0});

    const [inversionAnterior, setGastos_inversion_anterior] = useState([]);
    const [inversionAct, setGastos_inversion_act] = useState([]);

    const [operacionAnterior, setGastos_operacion_anterior] = useState([]);
    const [operacionAct, setGastos_operacion_act] = useState([]);

    const [funcionalidadAnterior, setGastos_funcionalidad_anterior] = useState([]);
    const [funcionalidadAct, setGastos_funcionalidad_act] = useState([]);

    const [servicioAnterior, setGastos_servicio_anterior] = useState([]);
    const [servicioAct, setGastos_servicio_act] = useState([]);

    useEffect(() => {
        loadDataExcel();
    }, []);

    const loadDataExcel = () => {
        // Carga del excel.
        loadServerExcel('https://pruebasneuro.co/N-1006/api/download-template/ejecucion_presupuestal', function (data, err) {
            setDataExcel(data.data);
            loadCharts(data.data);
        });
    }

    const loadCharts = (data, nombre_gerencia = filters.nombre_gerencia) => {
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'];
        var dataGastos_proyectados = [];
        var dataGastos_comprometidos = [];
        var dataGastos_causados = [];

        var dataGastos_inversionAnt= [];
        var dataGastos_inversionAct = [];

        var dataGastos_operacionAnt= [];
        var dataGastos_operacionAct = [];

        var dataGastos_funcionalidadAnt= [];
        var dataGastos_funcionalidadAct = [];

        var dataGastos_servicioAnt= [];
        var dataGastos_servicioAct = [];

        // Grafica #1
        var gastos_proyectados = filterMesesGroup(data, 2020, 'Gastos Proyectados', nombre_gerencia, meses);
        var gastos_comprometidos = filterMesesGroup(data, 2020, 'Gastos Comprometidos', nombre_gerencia, meses);
        var gastos_causados = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, meses);

        serEjecucionAcumulada2020({
            Proyectados : gastos_proyectados, 
            Comprometidos : gastos_comprometidos, 
            Causados: gastos_causados
        });

        // Grafica # 2
        var gastos_comPro = Math.round((gastos_comprometidos / gastos_proyectados) * 100, -1);
        var gastos_Caucom = Math.round((gastos_causados / gastos_comprometidos) * 100, -1);

        setGastosComprocaucom({valueOne : gastos_comPro, valueTwo : gastos_Caucom})

        // Grafica # 3
        var inv_causados = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, meses, true);
        var inv_comprometidos = filterMesesGroup(data, 2020, 'Gastos Comprometidos', nombre_gerencia, meses, true);
        var inv_proyectados = filterMesesGroup(data, 2020, 'Gastos Proyectados', nombre_gerencia, meses, true);

        var inv_comPro = Math.round((inv_comprometidos / inv_proyectados) * 100, -1);
        var inv_Caucom = Math.round((inv_causados / inv_comprometidos) * 100, -1);

        setInvComprocaucom({valueOne : inv_comPro, valueTwo : inv_Caucom})

        // Grafica # 4
        var gasto_causados_total_anio_anterior = filterMesesGroup(data, 2019, 'Gastos Causados', 'all', meses);
        var gastos_causados_corpo_anio_anterior = filterMesesGroup(data, 2019, 'Gastos Causados', 'corporativo', meses);
        var gastos_causados_uenaa_anio_anterior = filterMesesGroup(data, 2019, 'Gastos Causados', 'uenaa', meses);
        var gastos_causados_telco_anio_anterior = filterMesesGroup(data, 2019, 'Gastos Causados', 'telco', meses);
        var gastos_causados_uene_anio_anterior = filterMesesGroup(data, 2019, 'Gastos Causados', 'uene', meses);

        var gastos_causados_corpo_anio_anteriorMath = Math.round((gastos_causados_corpo_anio_anterior / gasto_causados_total_anio_anterior) * 100, -1);
        var gastos_causados_uenaa_anio_anteriorMath = Math.round((gastos_causados_uenaa_anio_anterior / gasto_causados_total_anio_anterior) * 100, -1);
        var gastos_causados_telco_anio_anteriorMath = Math.round((gastos_causados_telco_anio_anterior / gasto_causados_total_anio_anterior) * 100, -1);
        var gastos_causados_uene_anio_anteriorMath = Math.round((gastos_causados_uene_anio_anterior / gasto_causados_total_anio_anterior) * 100, -1);

        setGastosCausados_corpo_anioAnt({valueOne : gastos_causados_corpo_anio_anteriorMath, valueTwo : gastos_causados_uenaa_anio_anteriorMath, valueThree : gastos_causados_telco_anio_anteriorMath, valueFour : gastos_causados_uene_anio_anteriorMath})

        // Grafica # 5
        var gasto_causados_total_anio_act = filterMesesGroup(data, 2020, 'Gastos Causados', 'all', meses);
        var gastos_causados_corpo_anio_act = filterMesesGroup(data, 2020, 'Gastos Causados', 'corporativo', meses);
        var gastos_causados_uenaa_anio_act = filterMesesGroup(data, 2020, 'Gastos Causados', 'uenaa', meses);
        var gastos_causados_telco_anio_act = filterMesesGroup(data, 2020, 'Gastos Causados', 'telco', meses);
        var gastos_causados_uene_anio_act = filterMesesGroup(data, 2020, 'Gastos Causados', 'uene', meses);

        var gastos_causados_corpo_anio_actMath = Math.round((gastos_causados_corpo_anio_act / gasto_causados_total_anio_act) * 100, -1);
        var gastos_causados_uenaa_anio_actMath = Math.round((gastos_causados_uenaa_anio_act / gasto_causados_total_anio_act) * 100, -1);
        var gastos_causados_telco_anio_actMath = Math.round((gastos_causados_telco_anio_act / gasto_causados_total_anio_act) * 100, -1);
        var gastos_causados_uene_anio_actMath = Math.round((gastos_causados_uene_anio_act / gasto_causados_total_anio_act) * 100, -1);

        setGastosCausados_corpo_anioAct({valueOne : gastos_causados_corpo_anio_actMath, valueTwo : gastos_causados_uenaa_anio_actMath, valueThree : gastos_causados_telco_anio_actMath, valueFour : gastos_causados_uene_anio_actMath})

        // Grafica # 6
        var nombreGrupo_total_anio_act = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, meses);
        var inversion_anio_act = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, meses, true, false, false, false);
        var servicio_anio_act = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, meses, false, true, false, false);
        var funcionamiento_anio_act = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, meses, false, false, true, false);
        var operacion_anio_act = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, meses, false, false, false, true);

        var inversion_anio_act_data = Math.round((inversion_anio_act / nombreGrupo_total_anio_act) * 100, -1);
        var servicio_anio_act_data = Math.round((servicio_anio_act / nombreGrupo_total_anio_act) * 100, -1);
        var funcionamiento_anio_act_data = Math.round((funcionamiento_anio_act / nombreGrupo_total_anio_act) * 100, -1);
        var operacion_anio_act_data = Math.round((operacion_anio_act / nombreGrupo_total_anio_act) * 100, -1);

        setNombreGrupo_totalAct({valueOne : inversion_anio_act_data, valueTwo : operacion_anio_act_data, valueThree : funcionamiento_anio_act_data, valueFour : servicio_anio_act_data})

        // Grafica # 7
        meses.forEach(mes => {
            var gastos_proyectados2 = filterMes(data, 2020, 'Gastos Proyectados', nombre_gerencia, mes);
            var gastos_comprometidos2 = filterMes(data, 2020, 'Gastos Comprometidos', nombre_gerencia, mes);
            var gastos_causados2 = filterMes(data, 2020, 'Gastos Causados', nombre_gerencia, mes);

            dataGastos_proyectados.push(gastos_proyectados2);
            dataGastos_comprometidos.push(gastos_comprometidos2);
            dataGastos_causados.push(gastos_causados2);
        });

        setGastos_proyectados(dataGastos_proyectados);
        setGastos_comprometidos(dataGastos_comprometidos);
        setGastos_causados(dataGastos_causados);

        // Grafica # 8
        meses.forEach(mes => {
            var gastos_inversion_anterior = filterMesesGroup(data, 2019, 'Gastos Causados', nombre_gerencia, mes, true, false);
            var gastos_inversion_act = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, mes, true, false);
            dataGastos_inversionAnt.push(gastos_inversion_anterior);
            dataGastos_inversionAct.push(gastos_inversion_act);
        });

        setGastos_inversion_anterior(dataGastos_inversionAnt);
        setGastos_inversion_act(dataGastos_inversionAct);

        // Grafica # 9
        meses.forEach(mes => {
            var gastos_operacion_anterior = filterMesesGroup(data, 2019, 'Gastos Causados', nombre_gerencia, mes, false, true);
            var gastos_operacion_act = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, mes, false, true);
            dataGastos_operacionAnt.push(gastos_operacion_anterior);
            dataGastos_operacionAct.push(gastos_operacion_act);

        });

        setGastos_operacion_anterior(dataGastos_operacionAnt);
        setGastos_operacion_act(dataGastos_operacionAct);

        // Grafica # 10
        meses.forEach(mes => {
            var gastos_funcionalidad_anterior = filterMesesGroup(data, 2019, 'Gastos Causados', nombre_gerencia, mes, false, false, true);
            var gastos_funcionalidad_act = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, mes, false, false, true);
            dataGastos_funcionalidadAnt.push(gastos_funcionalidad_anterior);
            dataGastos_funcionalidadAct.push(gastos_funcionalidad_act);

        });

        setGastos_funcionalidad_anterior(dataGastos_funcionalidadAnt);
        setGastos_funcionalidad_act(dataGastos_funcionalidadAct);

         // Grafica # 11
         meses.forEach(mes => {
            var gastos_servicio_anterior = filterMesesGroup(data, 2019, 'Gastos Causados', nombre_gerencia, mes, false, false, false, true);
            var gastos_servicio_act = filterMesesGroup(data, 2020, 'Gastos Causados', nombre_gerencia, mes, false, false, false, true);
            dataGastos_servicioAnt.push(gastos_servicio_anterior);
            dataGastos_servicioAct.push(gastos_servicio_act);

        });

        setGastos_servicio_anterior(dataGastos_servicioAnt);
        setGastos_servicio_act(dataGastos_servicioAct);
        
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
        labels: ['', '', ''],
        datasets: [{
            label: '',
            data: [ejecucionAcumulada.Proyectados, ejecucionAcumulada.Comprometidos, ejecucionAcumulada.Causados],
            backgroundColor: [
                '#052569',
                '#FFFF05',
                '#FF0F0F',
            ],
            borderColor: [
                '#052569',
                '#FFFF05',
                '#FF0F0F',
            ],
            borderWidth: 1
        }]
    };

    // Grafica #2
    const datagGastosComprocaucom = {
        labels: ['', ''],
            datasets: [
            {
                label: '',
                data: [gastosComprocaucom.valueOne, gastosComprocaucom.valueTwo],
                backgroundColor: [
                    '#FFFF00',
                    '#FF0000',
                ],
                borderColor: [
                    '#FFFF00',
                    '#FF0000',
                ],
                borderWidth: 1,
            },
        ],
    }

    // Grafica #3
    const datagInvComprocaucom = {
        labels: ['', ''],
            datasets: [
            {
                label: '',
                data: [invComprocaucom.valueOne, invComprocaucom.valueTwo],
                backgroundColor: [
                    '#FFFF00',
                    '#FF0000',
                ],
                borderColor: [
                    '#FFFF00',
                    '#FF0000',
                ],
                borderWidth: 1,
            },
        ],
    }
    // Grafica #4
    const dataPieAnt = {
        labels: ['Corporativo', 'UENAA', 'TELCO', 'UENE'],
        datasets: [
          {
            label: '',
            data: [gastosCausados_corpo_ant.valueOne, gastosCausados_corpo_ant.valueTwo, gastosCausados_corpo_ant.valueThree, gastosCausados_corpo_ant.valueFour],
            backgroundColor: [
              '#4F81BD',
              '#C0504D',
              '#9BBB59',
              '#8064A2',
            ],
            borderColor: [
              '#4F81BD',
              '#C0504D',
              '#9BBB59',
              '#8064A2',
            ],
            borderWidth: 1,
          },
        ],
    }

    // Grafica #5
    const dataPieAct = {
        labels: ['Corporativo', 'UENAA', 'TELCO', 'UENE'],
        datasets: [
          {
            label: '',
            data: [gastosCausados_corpo_act.valueOne, gastosCausados_corpo_act.valueTwo, gastosCausados_corpo_act.valueThree, gastosCausados_corpo_act.valueFour],
            backgroundColor: [
              '#4F81BD',
              '#C0504D',
              '#9BBB59',
              '#8064A2',
            ],
            borderColor: [
              '#4F81BD',
              '#C0504D',
              '#9BBB59',
              '#8064A2',
            ],
            borderWidth: 1,
          },
        ],
    }

    // Grafica #6
    const NombreGrupo_total = {
        labels: ['1'],
        datasets: [
          {
            label: 'Inversión',
            data: [NombreGrupo_totalAct.valueOne],
            backgroundColor: '#A02F2C',
          },
          {
            label: 'Servicio de la deuda',
            data: [NombreGrupo_totalAct.valueTwo],
            backgroundColor: '#6C4C92',
          },
          {
            label: 'Funcionamiento',
            data: [NombreGrupo_totalAct.valueThree],
            backgroundColor: '#FA8B28',
          },
          {
            label: 'Operación',
            data: [NombreGrupo_totalAct.valueFour],
            backgroundColor: '#671916',
          },
        ],
      }

    // Grafica #7
    const dataGastos = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: 'proyectados - 2020',
            data: Gastos_proyectados,
            backgroundColor: '#052569',
          },
          {
            label: 'comprometidos - 2020',
            data: Gastos_comprometidos,
            backgroundColor: '#FFFF05',
          },
          {
            label: 'causados - 2020',
            data: Gastos_causados,
            backgroundColor: '#FF0404',
          },
        ],
    }

    // Grafico #8
    const dataIngresos = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: '2019',
            data: inversionAnterior,
            backgroundColor: '#4F81BD',
          },
          {
            label: '2020',
            data: inversionAct,
            backgroundColor: '#FF0000',
          }
        ],
    };

    // Grafico #9
    const dataOperacion = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: '2019',
            data: operacionAnterior,
            backgroundColor: '#4F81BD',
          },
          {
            label: '2020',
            data: operacionAct,
            backgroundColor: '#FF0000',
          }
        ],
    };

    // Grafico #10
    const dataFuncionalidad = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: '2019',
            data: funcionalidadAnterior,
            backgroundColor: '#4F81BD',
          },
          {
            label: '2020',
            data: funcionalidadAct,
            backgroundColor: '#FF0000',
          }
        ],
    };

    // Grafico #11
    const dataServicio = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: '2019',
            data: servicioAnterior,
            backgroundColor: '#4F81BD',
          },
          {
            label: '2020',
            data: servicioAct,
            backgroundColor: '#FF0000',
          }
        ],
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
                            <Grid item xs={12} md={6} lg={6}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Paper className={fixedHeightPaper}>
                                            {
                                                loading ? 
                                                    <div>
                                                        <Skeleton variant="rect" width={'100%'} height={120} />
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
                                                                <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Gastos</p>
                                                            </div>
                                                        </div>
                                                        <HorizontalBar  data={dataIngresosAnios} options={optionsEjecucionAcum} height={30}/>
                                                        <div className="containerLabelsCharts">
                                                            <div className="itemChart">
                                                                <span className="iconList" style={{background: '#052569'}}></span>
                                                                <p>Proyectados</p>
                                                            </div>
                                                            <div className="itemChart">
                                                                <span className="iconList" style={{background: '#FFFF05'}}></span>
                                                                <p>Comprometidos</p>
                                                            </div>
                                                            <div className="itemChart">
                                                                <span className="iconList" style={{background: '#FF0F0F'}}></span>
                                                                <p>Causados</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Paper className={fixedHeightPaper}>
                                            {
                                                loading ? 
                                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                    <Skeleton variant="circle" width={100} height={100} />
                                                </div>
                                                :
                                                    <div style={{display: 'flex'}}>
                                                        <div style={{width: '100%'}}>
                                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                                <div className="itemChart" >
                                                                    <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Gastos</p>
                                                                </div>
                                                            </div>
                                                            <Doughnut data={datagGastosComprocaucom} options={optionsGastosDoughnut} height={180}/>
                                                        </div>
                                                    </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Paper className={fixedHeightPaper}>
                                            {
                                                loading ? 
                                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                    <Skeleton variant="circle" width={100} height={100} />
                                                </div>
                                                :
                                                    <div style={{display: 'flex'}}>
                                                        <div style={{width: '100%'}}>
                                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                                <div className="itemChart" >
                                                                    <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Inversión</p>
                                                                </div>
                                                            </div>
                                                            <Doughnut data={datagInvComprocaucom} options={optionsGastosDoughnut} height={180}/>
                                                        </div>
                                                    </div>
                                            }
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaperVH}>
                                    {(loading) ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={330} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '16px', fontWeight: 'bold'}}>Gastos</p>
                                                </div>
                                            </div>
                                            <Bar  data={dataGastos} options={optionsIngreVsGas} height={200}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#052569'}}></span>
                                                    <p>Proyectados</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FFFF05'}}></span>
                                                    <p>Comprometidos</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FF0404'}}></span>
                                                    <p>Causados</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4} lg={4}>
                                        <Paper className={fixedHeightPaper}>
                                            {
                                                loading ? 
                                                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                        <Skeleton variant="circle" width={100} height={100} />
                                                    </div>
                                                :
                                                    <div style={{display: 'flex'}}>
                                                        <div style={{width: '100%'}}>
                                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                                <div className="itemChart" >
                                                                    <p style={{fontSize: '16px', fontWeight: 'bold'}}>2019</p>
                                                                </div>
                                                            </div>
                                                            <Pie data={dataPieAnt} options={optionsGastosDoughnut} height={120}/>
                                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                                <div className="itemChart">
                                                                    <span className="iconList" style={{background: '#4F81BD'}}></span>
                                                                    <p>Corporativo</p>
                                                                </div>
                                                                <div className="itemChart">
                                                                    <span className="iconList" style={{background: '#C0504D'}}></span>
                                                                    <p>UENAA</p>
                                                                </div>
                                                                <div className="itemChart">
                                                                    <span className="iconList" style={{background: '#9BBB59'}}></span>
                                                                    <p>TELCO</p>
                                                                </div>
                                                                <div className="itemChart">
                                                                    <span className="iconList" style={{background: '#8064A2'}}></span>
                                                                    <p>UENE</p>
                                                                </div>
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
                                                        <Skeleton variant="circle" width={100} height={100} />
                                                    </div>
                                                :
                                                    <div style={{display: 'flex'}}>
                                                        <div style={{width: '100%'}}>
                                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                                <div className="itemChart" >
                                                                    <p style={{fontSize: '16px', fontWeight: 'bold'}}>2020</p>
                                                                </div>
                                                            </div>
                                                            <Pie data={dataPieAct} options={optionsGastosDoughnut} height={120}/>
                                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                                <div className="itemChart">
                                                                    <span className="iconList" style={{background: '#4F81BD'}}></span>
                                                                    <p>Corporativo</p>
                                                                </div>
                                                                <div className="itemChart">
                                                                    <span className="iconList" style={{background: '#C0504D'}}></span>
                                                                    <p>UENAA</p>
                                                                </div>
                                                                <div className="itemChart">
                                                                    <span className="iconList" style={{background: '#9BBB59'}}></span>
                                                                    <p>TELCO</p>
                                                                </div>
                                                                <div className="itemChart">
                                                                    <span className="iconList" style={{background: '#8064A2'}}></span>
                                                                    <p>UENE</p>
                                                                </div>
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
                                                        <Skeleton variant="rect" width={'100%'} height={125} />
                                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                            <Skeleton variant="text" width={'25%'}/>
                                                            <Skeleton variant="text" width={'25%'}/>
                                                            <Skeleton variant="text" width={'25%'}/>

                                                        </div>
                                                    </div>
                                                :
                                                <div style={{display: 'flex'}}>
                                                    <div style={{width: '100%'}}>
                                                        <HorizontalBar data={NombreGrupo_total} options={optionsStacked} height={80}/>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                            
                            {/* Charts */}                       
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightMedium}>
                                {
                                    loading ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={245} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                :
                                        <div>
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Inversión</p>
                                                </div>
                                            </div>
                                            <Bar  data={dataIngresos} options={optionsIngreVsGas} height={150}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#4F81BD'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FF0000'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                        </div>
                                 }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightMedium}>
                                {
                                    loading ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={245} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                :
                                        <div>
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Operación</p>
                                                </div>
                                            </div>
                                            <Bar  data={dataOperacion} options={optionsIngreVsGas} height={150}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#4F81BD'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FF0000'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                        </div>
                                 }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightMedium}>
                                {
                                    loading ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={245} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                :
                                        <div>
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Funcionamiento</p>
                                                </div>
                                            </div>
                                            <Bar  data={dataFuncionalidad} options={optionsIngreVsGas} height={150}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#4F81BD'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FF0000'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                        </div>
                                 }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightMedium}>
                                {
                                    loading ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={245} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                :
                                        <div>
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Servicio de la Deuda</p>
                                                </div>
                                            </div>
                                            <Bar  data={dataServicio} options={optionsIngreVsGas} height={150}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#4F81BD'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FF0000'}}></span>
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