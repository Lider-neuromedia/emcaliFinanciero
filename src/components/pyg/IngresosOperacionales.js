import React, {useState, useEffect} from "react";
import { Breadcrumbs, Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import Header from '../menu/Header';
import { Link, Redirect } from 'react-router-dom';
import services from '../../services';
import {loadServerExcel} from '../../services';
import {filterColumnMes, optionsIngresosOper, optionsGastosDoughnut, optionsGroupBar, optionsEjecucionAcum, filterMesesGroup, filterColumnMesTipo, filterMes, optionsBarGroup, optionsMeses, filterMesAcum, filterColumnMesTipoCostoVenta, filterColumnMesTipoIngreso, optionsBarHorizontal, filterColumnMesTipoIngreso2} from '../../services/pyg';
import { HorizontalBar, Bar, Doughnut, Pie  } from 'react-chartjs-2';
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
                <Typography color="textPrimary" className="txt-breadcrumb">Ingresos Operacionales</Typography>
            </Breadcrumbs>
            <ButtonGroup variant="text" color="default" aria-label="text default button group">
            <Button style={{ padding: '0 2em' }} onClick={changeFilter('all')}>Todos</Button>
                <Button style={{ padding: '0 2em' }} onClick={changeFilter('acueducto')}>ACUEDUCTO</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('alcantarillado')}>ALCANTARILLADO</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('telco')}>TELCO</Button>
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
    const [ingresosAnioAnt, setIngresosAnioAnt] = useState({proyectados_anio_anterior : 0, reales_anio_act : 0, proAct_data: 0});

    // Gracica #2
    const [ingresosReales_act, setingresosReales_anioAct] = useState({valueOne : 0, valueTwo: 0, valueThree: 0, valueFour: 0});

    // Grafica #3
    const [ueneAnt, setUeneAnt] = useState([]);
    const [ueneAct, setUeneAct] = useState([]);

    // Grafica #4
    const [telcoAnt, setTelcoAnt] = useState([]);
    const [telcoAct, setTelcoAct] = useState([]);

    // Grafica #5
    const [acueductoAnt, setAcueductoAnt] = useState([]);
    const [acueductoAct, setAcueductoAct] = useState([]);

    // Grafica #6
    const [alcaAnt, setAlcaAnt] = useState([]);
    const [alcaAct, setAlcaAct] = useState([]);

    // Grafica #7
    const [ingresosOpeAnt, setIngresosOpeRestAnt] = useState([]);
    const [ingresosOpeAct, setIngresosOpeRestAct] = useState([]);

    // Grafica #8
    const [mensualizadosRestAnt, setIngresosOpeAnt] = useState([]);
    const [mensualizadosRestAct, setIngresosOpeAct] = useState([]);

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
        // var CostosVenta = ['Devoluciones', 'Venta de bienes', 'Otros Servicios', 'Arrendamiento Operativo', 'Cobertura de flujos de efectivo', 'Distribución', 'Comercialización'];
        var CostosVenta = ['Comercialización', 'Distribución', 'Cobertura de flujos de efectivo',  'Arrendamiento Operativo','Otros Servicios' ,'Venta de bienes', 'Devoluciones'];
        var IngresosTelco = ['Servicio de telecomunicaciones', 'Servicio de comunicaciones (Televisión)', 'Arrendamiento operativo',  'Otros servicios - Facturación terceros','Servicios informáticos' ,'Devoluciones, rebajas y descuentos'];
        var IngresosAcueducto = ['Servicio Acueducto', 'Venta de bienes', 'Otros', 'Devoluciones'];
        var IngresosAlca = ['Servicio alcantarillado', 'Otros', 'Devoluciones'];

        // Grafica #3
        var uene_anio_ant_data = [];
        var uene_anio_act_data = [];

        // Grafica #4
        var telco_anio_ant_data = [];
        var telco_anio_act_data = [];

        // Grafica #5
        var acueducto_anio_ant_data = [];
        var acueducto_anio_act_data = [];

        // Grafica #6
        var alca_anio_ant_data = [];
        var alca_anio_act_data = [];

        // Grafica #7
        var ingresos_operacionales_acumulados_anio_ant_data = [];
        var ingresos_operacionales_acumulados_anio_act_data = [];

        // Grafica #8
        var ingresos_operacionales_acumuladosRest_anio_ant_data = [];
        var ingresos_operacionales_acumuladosRest_anio_act_data = [];


        // Grafica #1
        var proyectados_anio_anterior = filterColumnMesTipoIngreso2(data, 2019, nombre_gerencia, 'Septiembre', 'ingresos reales');
        var reales_anio_act = filterColumnMesTipoIngreso2(data, 2020, nombre_gerencia, 'Septiembre', 'ingresos reales');
        var pro_anio_act = filterColumnMesTipoIngreso2(data, 2020, nombre_gerencia, 'Septiembre', 'ingresos proyectados');
        setIngresosAnioAnt({
            proyectadosAnt_data : proyectados_anio_anterior, 
            realesAnt_data : reales_anio_act, 
            proAct_data: pro_anio_act
        });

        // Grafica #2
        var ingresoReales_total_anio_act = filterColumnMesTipoIngreso2(data, 2020, 'all', 'Septiembre', 'Ingresos reales');
        var ingresoReales_acue_anio_act = filterColumnMesTipoIngreso2(data, 2020, 'acueducto', 'Septiembre', 'Ingresos reales');
        var ingresoReales_alca_anio_act = filterColumnMesTipoIngreso2(data, 2020, 'alcantarillado', 'Septiembre', 'Ingresos reales');
        var ingresoReales_telco_anio_act = filterColumnMesTipoIngreso2(data, 2020, 'telco', 'Septiembre', 'Ingresos reales');
        var ingresoReales_uene_anio_act = filterColumnMesTipoIngreso2(data, 2020, 'uene', 'Septiembre', 'Ingresos reales');

        var ingresoReales_acue_anio_act_data = Math.round((ingresoReales_acue_anio_act / ingresoReales_total_anio_act) * 100, -1);
        var ingresoReales_alca_anio_act_data = Math.round((ingresoReales_alca_anio_act / ingresoReales_total_anio_act) * 100, -1);
        var ingresoReales_telco_anio_act_data = Math.round((ingresoReales_telco_anio_act / ingresoReales_total_anio_act) * 100, -1);
        var ingresoReales_uene_anio_act_data = Math.round((ingresoReales_uene_anio_act / ingresoReales_total_anio_act) * 100, -1);
        setingresosReales_anioAct({valueOne : ingresoReales_acue_anio_act_data, valueTwo : ingresoReales_alca_anio_act_data, valueThree : ingresoReales_telco_anio_act_data, valueFour : ingresoReales_uene_anio_act_data})

        // Grafica #3
        CostosVenta.forEach(costo => {
            var uene_anio_anterior = filterColumnMesTipoIngreso(data, 2019, 'uene', 'Septiembre', 'Ingresos reales', costo);
            var uene_anio_act = filterColumnMesTipoIngreso(data, 2020, 'uene', 'Septiembre', 'Ingresos reales', costo);
            uene_anio_ant_data.push(uene_anio_anterior);
            uene_anio_act_data.push(uene_anio_act);
        });
        setUeneAnt(uene_anio_ant_data);
        setUeneAct(uene_anio_act_data);

        // Grafica #4
        IngresosTelco.forEach(ingresoTelco => {
            var telco_anio_anterior = filterColumnMesTipoIngreso(data, 2019, 'telco', 'Septiembre', 'Ingresos reales', ingresoTelco);
            var telco_anio_act = filterColumnMesTipoIngreso(data, 2020, 'telco', 'Septiembre', 'Ingresos reales', ingresoTelco);
            telco_anio_ant_data.push(telco_anio_anterior);
            telco_anio_act_data.push(telco_anio_act);
        });
        setTelcoAnt(telco_anio_ant_data);
        setTelcoAct(telco_anio_act_data);

        // Grafica #5
        IngresosAcueducto.forEach(ingresoAcueducto => {
            var acueducto_anio_anterior = filterColumnMesTipoIngreso(data, 2019, 'acueducto', 'Septiembre', 'Ingresos reales', ingresoAcueducto);
            var acueducto_anio_act = filterColumnMesTipoIngreso(data, 2020, 'acueducto', 'Septiembre', 'Ingresos reales', ingresoAcueducto);
            acueducto_anio_ant_data.push(acueducto_anio_anterior);
            acueducto_anio_act_data.push(acueducto_anio_act);
        });
        setAcueductoAnt(acueducto_anio_ant_data);
        setAcueductoAct(acueducto_anio_act_data);

        // Grafica #6
        IngresosAlca.forEach(ingresoAlca => {
            var alca_anio_anterior = filterColumnMesTipoIngreso(data, 2019, 'alcantarillado', 'Septiembre', 'Ingresos reales', ingresoAlca);
            var alca_anio_act = filterColumnMesTipoIngreso(data, 2020, 'alcantarillado', 'Septiembre', 'Ingresos reales', ingresoAlca);
            alca_anio_ant_data.push(alca_anio_anterior);
            alca_anio_act_data.push(alca_anio_act);
        });
        setAlcaAnt(alca_anio_ant_data);
        setAlcaAct(alca_anio_act_data);

        // Grafica #7
        meses.forEach(mes => {
            var ingresos_operacionales_acumuladosRest_anio_ant = filterMesAcum(data, '2019', 'Ingresos Reales', nombre_gerencia, mes);
            var ingresos_operacionales_acumuladosRest_anio_act = filterMesAcum(data, '2020', 'Ingresos Reales', nombre_gerencia, mes);
            ingresos_operacionales_acumuladosRest_anio_ant_data.push(ingresos_operacionales_acumuladosRest_anio_ant);
            ingresos_operacionales_acumuladosRest_anio_act_data.push(ingresos_operacionales_acumuladosRest_anio_act);
        }); 
        setIngresosOpeRestAnt(ingresos_operacionales_acumuladosRest_anio_ant_data);
        setIngresosOpeRestAct(ingresos_operacionales_acumuladosRest_anio_act_data);

        // Grafica #8
        meses.forEach(mes => {
            var ingresos_operacionales_acumulados_anio_ant = filterMes(data, '2019', 'Ingresos Reales', nombre_gerencia, mes);
            var ingresos_operacionales_acumulados_anio_act = filterMes(data, '2020', 'Ingresos Reales', nombre_gerencia, mes);
            ingresos_operacionales_acumulados_anio_ant_data.push(ingresos_operacionales_acumulados_anio_ant);
            ingresos_operacionales_acumulados_anio_act_data.push(ingresos_operacionales_acumulados_anio_act);
        });
        var substraction_ebitda_anio_ant = restaElementoAnt(ingresos_operacionales_acumulados_anio_ant_data);
        var substraction_ebitda_anio_act = restaElementoAnt(ingresos_operacionales_acumulados_anio_act_data);
        setIngresosOpeAnt(substraction_ebitda_anio_ant);
        setIngresosOpeAct(substraction_ebitda_anio_act);

        

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
            data: [ingresosAnioAnt.proyectadosAnt_data, ingresosAnioAnt.realesAnt_data, ingresosAnioAnt.proAct_data],
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
    const dataIngresosReales = {
        labels: ['Acueducto', 'Alcantarillado', 'TELCO', 'UENE'],
        datasets: [
        {
            label: '',
            data: [ingresosReales_act.valueOne, ingresosReales_act.valueTwo, ingresosReales_act.valueThree, ingresosReales_act.valueFour],
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

    // Grafica #3
    const dataCostoVentaUENE = {
        labels: ['Comercialización', 'Distribución', 'Cobertura de flujos de efectivo',  'Arrendamiento Operativo','Otros Servicios' ,'Venta de bienes', 'Devoluciones'],
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

    // Grafica #4
    const dataCostoVentaTELCO = {
        labels: ['Servicio de telecomunicaciones', 'Servicio de comunicaciones (Televisión)', 'Arrendamiento operativo',  'Otros servicios - Facturación terceros','Servicios informáticos' ,'Devoluciones, rebajas y descuentos'],
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

    // Grafica #5
    const dataCostoVentaACUEDUCTO = {
        labels: ['Servicio Acueducto', 'Venta de bienes', 'Otros', 'Devoluciones'],
        datasets: [
          {
            label: '2019',
            data: acueductoAnt,
            backgroundColor: '#FFC503',
          },
          {
            label: '2020',
            data: acueductoAct,
            backgroundColor: '#2119C8',
          },
        ],
    }

    // Grafica #6
    const dataCostoVentaALCA = {
        labels: ['Servicio alcantarillado', 'Otros', 'Devoluciones'],
        datasets: [
          {
            label: '2019',
            data: alcaAnt,
            backgroundColor: '#FFC503',
          },
          {
            label: '2020',
            data: alcaAct,
            backgroundColor: '#2119C8',
          },
        ],
    }

    // Grafica #7
    const dataIngreVsGas = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: '2019',
            data: ingresosOpeAnt,
            backgroundColor: '#FFC503',
          },
          {
            label: '2020',
            data: ingresosOpeAct,
            backgroundColor: '#2119C8',
          },
        ],
    }

    // Grafica #8
    const dataMensualizados = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: '2019',
            data: mensualizadosRestAnt,
            backgroundColor: '#FFC503',
          },
          {
            label: '2020',
            data: mensualizadosRestAct,
            backgroundColor: '#2119C8',
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
                            <Grid item xs={12} md={5} lg={5}>
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
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>Telecomunicaciones</p>
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
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>Acueducto</p>
                                                </div>
                                            </div>
                                            <HorizontalBar  data={dataCostoVentaACUEDUCTO} options={optionsBarHorizontal}/>
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
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>Alcantarillado</p>
                                                </div>
                                            </div>
                                            <HorizontalBar  data={dataCostoVentaALCA} options={optionsBarHorizontal}/>
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
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>Ingresos Operacionales Acumulador</p>
                                                </div>
                                            </div>
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

                            <Grid item xs={12} md={6} lg={6}>
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
                                                    <p style={{fontSize: '20px', fontWeight: 'bold', paddingBottom: '15px'}}>Mensualizados</p>
                                                </div>
                                            </div>
                                            <Bar  data={dataMensualizados} options={optionsMeses}/>
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
                        </Grid>
                    </Container>
                </main>
            </div>
    )
}