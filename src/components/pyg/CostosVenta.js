import React, {useState, useEffect} from "react";
import { Breadcrumbs, Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper, Select, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import Header from '../menu/Header';
import { Link, Redirect } from 'react-router-dom';
import services from '../../services';
import {loadServerExcel} from '../../services';
import {filterColumnMes, optionsIngresosOper, optionsGastosDoughnut, optionsGroupBar, optionsEjecucionAcum,  filterMesesGroup, filterColumnMesTipo, filterMes, optionsBarGroup, optionsMeses, filterMesAcum, filterColumnMesTipo2, filterMesCostos, optionsStacked, filterColumnMesTipoCostoVenta, filterColumnMesTipoIngreso, optionsBarHorizontal, optionsLines, filterColumnMesTipo4} from '../../services/pyg';
import { HorizontalBar, Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import Skeleton from '@material-ui/lab/Skeleton';
import "chartjs-plugin-datalabels";
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
        height: 280,
    },
    fixedHeightVH: {
        height: 550,
    },
}));

// Items que iran en el header.
export const itemsHeader = (changeFilter, changeSelect, mesesA) => {
    
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/pyg">
                    Costos Operacionales
                </Link>
                <Typography color="textPrimary" className="txt-breadcrumb">Costos de venta</Typography>
            </Breadcrumbs>
            <ButtonGroup variant="text" color="default" aria-label="text default button group">
                <Button style={{ padding: '0 1em' }} onClick={changeFilter('all')}><img src={logo} alt="emcali" style={{paddingRight: '10px', width: 40}}/>EMCALI</Button>
                <Button style={{ padding: '6px 1em' }} onClick={changeFilter('telco')}><img src={internet} alt="uent" style={{paddingRight: '10px'}}/>UENT</Button>
                <Button style={{ padding: '6px 1em' }} onClick={changeFilter('uenaa')}><img src={alcantarillado} alt="uenaa" style={{paddingRight: '10px'}}/>UENAA</Button>
                <Button style={{ padding: '6px 1em' }} onClick={changeFilter('uene')}><img src={UENE} alt="uene" style={{paddingRight: '10px'}}/>UENE</Button>
            </ButtonGroup>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography component="h6" variant="h6" color="inherit" noWrap style={{fontSize: '15px',letterSpacing: '1px',paddingRight:'10px'}}>
                            Cifras en Millones COP |
                </Typography> 
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={mesesA}
                    onChange={changeSelect}
                    style={{marginRight:'10px'}}
                >
                    <MenuItem value={'Enero'}>Enero</MenuItem>
                    <MenuItem value={'Febrero'}>Febrero</MenuItem>
                    <MenuItem value={'Marzo'}>Marzo</MenuItem>
                    <MenuItem value={'Abril'}>Abril</MenuItem>
                    <MenuItem value={'Mayo'}>Mayo</MenuItem>
                    <MenuItem value={'Junio'}>Junio</MenuItem>
                    <MenuItem value={'Julio'}>Julio</MenuItem>
                    <MenuItem value={'Agosto'}>Agosto</MenuItem>
                    <MenuItem value={'Septiembre'}>Septiembre</MenuItem>
                    <MenuItem value={'Octubre'}>Octubre</MenuItem>
                    <MenuItem value={'Noviembre'}>Noviembre</MenuItem>
                    <MenuItem value={'Diciembre'}>Diciembre</MenuItem>
                </Select> 2020
            </div>
        </div>
    );
}

export default function CostosOperacionales() {
    const classes = useStyles();
    
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const fixedHeightPaperVH = clsx(classes.paper, classes.fixedHeightVH);
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'all'});
    const [mesesA, setAge] = useState('Enero');

    const changeSelect = (event) => {
      setAge(event.target.value);
      loadCharts(dataExcel, filters.nombre_gerencia, event.target.value);
    };
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

    // Grafica #9
    const [ingreOperAnt, setingreOperAnt] = useState([]);
    const [costosVentAnt, setcostosVentaAnt] = useState([]);
    const [ingreOperAct, setingreOperAct] = useState([]);
    const [costosVentaAct, setcostosVentaAct] = useState([]);

    // Grafica #10
    const [ingreOperAcumAnt, setingreOperAcumAnt] = useState([]);
    const [costosVentAcumAnt, setcostosVentaAcumAnt] = useState([]);
    const [ingreOperAcumAct, setingreOperAcumAct] = useState([]);
    const [costosVentaAcumAct, setcostosVentAcumaAct] = useState([]);


    // Hook de React.
    useEffect(() => {
        loadDataExcel();
    }, []);

    const loadDataExcel = () => {
        // Carga del excel.
        loadServerExcel(services.baseUrl + 'download-template/pyg', function (data, err) {
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

    const loadCharts = (data, nombre_gerencia = filters.nombre_gerencia, mes_data = mesesA) => {
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        var CostosVenta = ['Compra de Energía', 'Uso de Redes', 'Costos de Personal',  'Honorarios','Depreciación y amortización' ,'Mantenimiento y Reparaciones', 'Otros Costos Generales', 'Costo de venta de bienes', 'Impuestos', 'Materiales'];
        var CostosTelco = ['Costos de Personal', 'Depreciación y amortización telecomunicaciones', 'Otros Generales',  'Honorarios','Seguros' ,'Vigilancia', 'Energía', 'Costo por Conexión', 'Servicios Públicos', 'Mantenimientos y Reparaciones', 'Impuestos', 'Materiales'];
        var CostosUenaa = ['Depreciaciones', 'Costos de Personal', 'Energía', 'Mantenimiento', 'Otros Costos Generales', 'Honorarios', 'Vigilancia y Seguridad', 'Seguros', 'Productos Quimicos', 'Costo de venta de bienes', 'Impuestos', 'Materiales'];
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
        var ingreOper_anio_ant_data = [];
        var costosVenta_anio_ant_data = [];
        var ingreOper_anio_act_data = [];
        var costosVenta_anio_act_data = [];

        // Grafica #1
        var proyectados_anio_anterior = filterColumnMesTipo2(data, 2019, nombre_gerencia, mes_data, 'costos reales');
        var reales_anio_act = filterColumnMesTipo2(data, 2020, nombre_gerencia, mes_data, 'costos reales');
        var reales_anio_act = filterColumnMesTipo2(data, 2020, nombre_gerencia, mes_data, 'costos proyectados');
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
        var costosReales_total_anio_act = filterColumnMesTipo2(data, 2020, 'all', mes_data, 'costos reales');
        var costosReales_telco_anio_act = filterColumnMesTipo2(data, 2020, 'telco', mes_data, 'costos reales');
        var costosReales_alca_anio_act = filterColumnMesTipo2(data, 2020, 'uenaa', mes_data, 'costos reales');
        var costosReales_uene_anio_act = filterColumnMesTipo2(data, 2020, 'uene', mes_data, 'costos reales');

        var costosReales_alca_anio_act_data = Math.round((costosReales_alca_anio_act / costosReales_total_anio_act) * 100, -1);
        var costosReales_telco_anio_act_data = Math.round((costosReales_telco_anio_act / costosReales_total_anio_act) * 100, -1);
        var costosReales_uene_anio_act_data = Math.round((costosReales_uene_anio_act / costosReales_total_anio_act) * 100, -1);
        setcostosReales_anioAct({valueOne : costosReales_alca_anio_act_data, valueTwo : costosReales_telco_anio_act_data, valueThree : costosReales_uene_anio_act_data});

        // Grafica # 4
        var grafico4_anio_act1 = filterColumnMesTipoCostoVenta(data, 2020, nombre_gerencia, mes_data, 'Costos Reales', 'Costos de Personal');
        var grafico4_anio_act2 = filterColumnMesTipoCostoVenta(data, 2020, nombre_gerencia, mes_data, 'Gastos Reales', 'Gasto de Personal');
        setgrafico4_anioAct({valueOne : grafico4_anio_act1, valueTwo : grafico4_anio_act2});

        // Grafica #5
        CostosTelco.forEach(costoTelco => {
            var telco_anio_anterior = filterColumnMesTipoCostoVenta(data, 2019, 'telco', mes_data, 'Costos Reales', costoTelco);
            var telco_anio_act = filterColumnMesTipoCostoVenta(data, 2020, 'telco', mes_data, 'Costos Reales', costoTelco);
            telco_anio_ant_data.push(telco_anio_anterior);
            telco_anio_act_data.push(telco_anio_act);
        });
        setTelcoAnt(telco_anio_ant_data);
        setTelcoAct(telco_anio_act_data);

        // Grafica #6
        CostosUenaa.forEach(costoUenaa => {
            var uenaa_anio_anterior = filterColumnMesTipoCostoVenta(data, 2019, 'uenaa', mes_data, 'Costos Reales', costoUenaa);
            var uenaa_anio_act = filterColumnMesTipoCostoVenta(data, 2020, 'uenaa', mes_data, 'Costos Reales', costoUenaa);
            uenaa_anio_ant_data.push(uenaa_anio_anterior);
            uenaa_anio_act_data.push(uenaa_anio_act);
        });
        setUenaaAnt(uenaa_anio_ant_data);
        setUenaaAct(uenaa_anio_act_data);
        
        // Grafica #7
        CostosVenta.forEach(costo => {
            var uene_anio_anterior = filterColumnMesTipoCostoVenta(data, 2019, 'uene', mes_data, 'Costos Reales', costo);
            var uene_anio_act = filterColumnMesTipoCostoVenta(data, 2020, 'uene', mes_data, 'Costos Reales', costo);
            uene_anio_ant_data.push(uene_anio_anterior);
            uene_anio_act_data.push(uene_anio_act);
        });
        setUeneAnt(uene_anio_ant_data);
        setUeneAct(uene_anio_act_data);

        // Grafica #9
        meses.forEach(mes => {
            var ingreOper_anio_ant = filterColumnMes(data, 2019, nombre_gerencia, mes_data, 'ingresos_operacionales');
            var costosVenta_anio_ant = filterColumnMes(data, 2019, nombre_gerencia, mes_data, 'costos_venta');
            var ingreOper_anio_act = filterColumnMes(data, 2020, nombre_gerencia, mes_data, 'ingresos_operacionales');
            var costosVenta_anio_act = filterColumnMes(data, 2020, nombre_gerencia, mes_data, 'costos_venta');
            ingreOper_anio_ant_data.push(ingreOper_anio_ant);
            costosVenta_anio_ant_data.push(costosVenta_anio_ant);
            ingreOper_anio_act_data.push(ingreOper_anio_act);
            costosVenta_anio_act_data.push(costosVenta_anio_act);
        });
        setingreOperAnt(ingreOper_anio_ant_data);
        setcostosVentaAnt(costosVenta_anio_ant_data);
        setingreOperAct(ingreOper_anio_act_data);
        setcostosVentaAct(costosVenta_anio_act_data);

        // Grafica #10
        var substractionIngreOper_anio_ant = restaElementoAnt(ingreOper_anio_ant_data);
        var substractionCostosVenta_anio_ant = restaElementoAnt(costosVenta_anio_ant_data);
        var substractionIngreOper_anio_act = restaElementoAnt(ingreOper_anio_act_data);
        var substractionCostosVenta_anio_act = restaElementoAnt(costosVenta_anio_act_data);
        setingreOperAcumAnt(substractionIngreOper_anio_ant);
        setcostosVentaAcumAnt(substractionCostosVenta_anio_ant);
        setingreOperAcumAct(substractionIngreOper_anio_act);
        setcostosVentAcumaAct(substractionCostosVenta_anio_act);

        setLoading(false);
    }

    // Cambiar los filtros en base a nombre gerencia.
    const changeFilterNomGerencia = (value)  => (event) => {
        setFilters({nombre_gerencia : value});
        // setAge({mesesA : value});
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
                '#FFB12E',
                '#507FF2',
                '#FFB12E',
            ],
            borderColor: [
                '#FFB12E',
                '#507FF2',
                '#FFB12E',
            ],
            borderWidth: 1
        }]
    };

    // Grafica #2
    const dataIngreVsGas = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
        {
            label: '2020',
            data: ingresosOpeAct,
            backgroundColor: '#FFB12E',
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
            label: 'gasto de personal',
            data: [grafico4_act.valueOne],
            backgroundColor: '#FF9630',
          },
          {
            label: 'costos de personal',
            data: [grafico4_act.valueTwo],
            backgroundColor: '#3CBADC',
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
            backgroundColor: '#31859C',
          },
          {
            label: '2020',
            data: ueneAct,
            backgroundColor: '#F79646',
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
            backgroundColor: '#31859C',
        },
        {
            label: '2020',
            data: uenaaAct,
            backgroundColor: '#F79646',
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
            backgroundColor: '#31859C',
          },
          {
            label: '2020',
            data: telcoAct,
            backgroundColor: '#F79646',
          },
        ],
    }

    // Grafica #8
    const dataIngreOper = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
          {
            label: '2019 - costo de ventas',
            data: ingreOperAnt,
            fill: false,
            backgroundColor: '#4BACC6',
            borderColor: '#4BACC6',
            yAxisID: 'y-axis-1',
          },
          {
            label: '2019 - Ingresos Operacionales',
            data: costosVentAnt,
            fill: false,
            backgroundColor: '#F79646',
            borderColor: '#F79646',
            yAxisID: 'y-axis-2',
          },
        ],
    }

    // Grafica #9
    const dataCostosVentas = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
          {
            label: '2020 - costo de ventas',
            data: ingreOperAct,
            fill: false,
            backgroundColor: '#4BACC6',
            borderColor: '#4BACC6',
            yAxisID: 'y-axis-1',
          },
          {
            label: '2020 - Ingresos Operacionales',
            data: costosVentaAct,
            fill: false,
            backgroundColor: '#F79646',
            borderColor: '#F79646',
            yAxisID: 'y-axis-2',
          },
        ],
    }

    // Grafica #10
    const dataIngreOperAcum = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
          {
            label: '2019 - costo de ventas',
            data: ingreOperAcumAnt,
            fill: false,
            backgroundColor: '#4BACC6',
            borderColor: '#4BACC6',
            yAxisID: 'y-axis-1',
          },
          {
            label: '2019 - Ingresos Operacionales',
            data: costosVentAcumAnt,
            fill: false,
            backgroundColor: '#F79646',
            borderColor: '#F79646',
            yAxisID: 'y-axis-2',
          },
        ],
    }

    // Grafica #11
    const dataCostosVentasAcum = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
          {
            label: '2020 - costo de ventas',
            data: ingreOperAcumAct,
            fill: false,
            backgroundColor: '#4BACC6',
            borderColor: '#4BACC6',
            yAxisID: 'y-axis-1',
          },
          {
            label: '2020 - Ingresos Operacionales',
            data: costosVentaAcumAct,
            fill: false,
            backgroundColor: '#F79646',
            borderColor: '#F79646',
            yAxisID: 'y-axis-2',
          },
        ],
    }

    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            <div className={classes.root}>
                <Header active={'pyg'} itemsHeader={() => itemsHeader(changeFilterNomGerencia, changeSelect, mesesA)}  />
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
                                                <Skeleton variant="rect" width={'100%'} height={220} />
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                </div>
                                            </div>
                                        :
                                            <div>
                                                <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                    <div className="itemChart" >
                                                        <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Costos de Ventas</p>
                                                    </div>
                                                </div>
                                                <HorizontalBar  data={dataIngresosAnios} options={optionsEjecucionAcum} height={100}/>
                                                <div className="containerLabelsCharts">
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#507FF2'}}></span>
                                                        <p>Costos Proyectados</p>
                                                    </div>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#FFB12E'}}></span>
                                                        <p>Costos Reales</p>
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
                                            <Skeleton variant="rect" width={'100%'} height={220} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'25%'}/>
                                                <Skeleton variant="text" width={'25%'}/>
                                                <Skeleton variant="text" width={'25%'}/>
                                            </div>
                                        </div>
                                :
                                        <div>
                                            <Bar  data={dataIngreVsGas} options={optionsMeses} height={100}/>
                                            <div className="containerLabelsCharts">
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
                                                <Skeleton variant="circle" width={180} height={180} />
                                            </div>
                                        :
                                            <div style={{display: 'flex'}}>
                                                <Doughnut  data={dataIngresosReales} options={optionsGastosDoughnut} height={200}/>
                                            </div>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaperVH}>
                                    {
                                        loading ? 
                                            <div>
                                                <Skeleton variant="rect" width={'100%'} height={490} />
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                    <Skeleton variant="text" width={'40%'}/>

                                                </div>
                                            </div>
                                        :
                                        <div style={{display: 'flex'}}>
                                            <div style={{width: '100%'}}>
                                                <Bar data={dataGrafico4} options={optionsStacked} height={120}/>
                                                <div className="containerLabelsCharts">
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#FF9630'}}></span>
                                                        <p>Gasto de Personal</p>
                                                    </div>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#3CBADC'}}></span>
                                                        <p>Costos de Personal</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Paper>
                            </Grid>

                            {/* Charts */}
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaperVH}>
                                {
                                    loading ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={490} />
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
                                            <HorizontalBar  data={dataCostoVentaUENE} options={optionsBarHorizontal} height={180}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#31859C'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#F79646'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                        </div>
                                 }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaperVH}>
                                {
                                    loading ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={490} />
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
                                            <HorizontalBar  data={dataCostoVentaUENAA} options={optionsBarHorizontal} height={180}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#31859C'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#F79646'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                        </div>
                                 }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaperVH}>
                                {
                                    loading ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={490} />
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
                                            <HorizontalBar  data={dataCostoVentaTELCO} options={optionsBarHorizontal} height={180}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#31859C'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#F79646'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                        </div>
                                 }
                                </Paper>
                            </Grid>
                            {/* Charts */}
                            

                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaperVH}>
                                    {
                                        loading ? 
                                            <div>
                                                <Skeleton variant="rect" width={'100%'} height={490} />
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                </div>
                                            </div>
                                        :
                                        <div>
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>Acumulados</p>
                                                </div>
                                            </div>
                                            <Line data={dataIngreOper} options={optionsLines} />
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#4BACC6'}}></span>
                                                    <p>Costos de ventas 2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#F79646'}}></span>
                                                    <p>Ingresos Operacionales 2019</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaperVH}>
                                    {
                                        loading ? 
                                            <div>
                                                <Skeleton variant="rect" width={'100%'} height={490} />
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                </div>
                                            </div>
                                        :
                                        <div>
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>Acumulados</p>
                                                </div>
                                            </div>
                                            <Line data={dataCostosVentas} options={optionsLines} />
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#4BACC6'}}></span>
                                                    <p>Costos de ventas 2020</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#F79646'}}></span>
                                                    <p>Ingresos Operacionales 2020</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaperVH}>
                                    {
                                        loading ? 
                                            <div>
                                                <Skeleton variant="rect" width={'100%'} height={490} />
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                </div>
                                            </div>
                                        :
                                        <div>
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>Mensualizados</p>
                                                </div>
                                            </div>
                                            <Line data={dataIngreOperAcum} options={optionsLines} />
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#4BACC6'}}></span>
                                                    <p>Costos de ventas 2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#F79646'}}></span>
                                                    <p>Ingresos Operacionales 2019</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper className={fixedHeightPaperVH}>
                                    {
                                        loading ? 
                                            <div>
                                                <Skeleton variant="rect" width={'100%'} height={490} />
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                </div>
                                            </div>
                                    :
                                            <div>
                                            <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                    <div className="itemChart" >
                                                        <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>Mensualizados</p>
                                                    </div>
                                                </div>
                                                <Line data={dataCostosVentasAcum} options={optionsLines} />
                                                <div className="containerLabelsCharts">
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#4BACC6'}}></span>
                                                        <p>Costos de ventas 2020</p>
                                                    </div>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#F79646'}}></span>
                                                        <p>Ingresos Operacionales 2020</p>
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