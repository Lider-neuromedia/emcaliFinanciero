import React, {useState, useEffect} from "react";
import { Breadcrumbs, Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { Link, Redirect } from 'react-router-dom';
import Header from '../menu/Header';
import services from '../../services';
import {loadServerExcel} from '../../services';
import {optionsEjecucionAcum, filterMesesGroup, filterBasic, filterMes, filterNameGroup, optionsIngreVsGas, optionsGastosDoughnut} from '../../services/ejecucionPresupuesta'
import { HorizontalBar, Bar, Doughnut, Pie  } from 'react-chartjs-2';
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
        height: 240,
    },
    fixedHeightVH: {
        height: 320,
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
            <Button style={{ padding: '0 1em' }} onClick={changeFilter('all')}><img src={logo} alt="uene" style={{paddingRight: '10px', width: 40}}/> Emcali</Button>
                <Button style={{ padding: '0 1em' }} onClick={changeFilter('corporativo')}><img src={corporativo} alt="uene" style={{paddingRight: '10px'}}/>Corporativo</Button>
                <Button style={{ padding: '0 1em' }} onClick={changeFilter('telco')}><img src={internet} alt="uene" style={{paddingRight: '10px'}}/>TELCO</Button>
                <Button style={{ padding: '6px 1em' }} onClick={changeFilter('uenaa')}><img src={alcantarillado} alt="uene" style={{paddingRight: '10px'}}/>UENAA</Button>
                <Button style={{ padding: '6px 1em' }} onClick={changeFilter('uene')}><img src={UENE} alt="uene" style={{paddingRight: '10px'}}/>UENE</Button>
            </ButtonGroup>
        </div>
    );
}


export default function Ingresos() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeightVH);
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'all'});
    const [ingresosAnioAnt, setIngresosAnioAnt] = useState({recaudadosAnt : 0, proyectados : 0, recaudadosAct: 0});
    const [loading, setLoading] = useState(true);


    const [recaudados2019, setRecaudados2019] = useState([]);
    const [proyectados2020, setProyectados2020] = useState([]);
    const [recaudados2020, setRecaudados2020] = useState([]);

    const [disponibilidadInicial_anios_anterior, setDisponibilidadInicial_anios_anterior] = useState([]);
    const [disponibilidadInicial_anios_act, setDisponibilidadInicial_anios_act] = useState([]);

    const [ingresos_ant, setingresos_anioAnt] = useState({valueOne : 0, valueTwo: 0, valueThree: 0, valueFour: 0});
    const [ingresos_act, setingresos_anioAct] = useState({valueOne : 0, valueTwo: 0, valueThree: 0, valueFour: 0});

    const [ingresos_corrientes_anios_anterior, setIngresosCorrientes_anios_anterior] = useState([]);
    const [ingresos_corrientes_anios_act, setIngresosCorrientes_anios_act] = useState([]);

    const [ingresos_capital_anios_anterior, setIngresosCapital_anios_anterior] = useState([]);
    const [ingresos_capital_anios_act, setIngresosCapital_anios_act] = useState([]);

    // const [ingresosDoughnut, setIngresosDoughnut] = useState({valueOne : 0, valueTwo : 0, valueThree : 0, valueFour : 0});


    // Hook de React.
    useEffect(() => {
        loadDataExcel();
    }, []);

    // Hace la petición de carga que trae la informacion del excel desde el backend.
    const loadDataExcel = () => {
        // Carga del excel.
        loadServerExcel('https://pruebasneuro.co/N-1006/api/download-template/ejecucion_presupuestal', function (data, err) {
            setDataExcel(data.data);
            loadCharts(data.data);
        });
    }
    const loadCharts = (data, nombre_gerencia = filters.nombre_gerencia) => {
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'];
        var ingresos_recaudados_anio_anterior_data = [];
        var ingresos_proyectados_anio_act_data = [];
        var ingresos_recaudados_anio_act_data = [];

        var disponibilidad_inicial_anio_anterior_data = [];
        var disponibilidad_inicial_anio_act_data = [];

        var ingresos_corrientes_anio_anterior_data = [];
        var ingresos_corrientes_anio_act_data = [];

        var ingresos_capital_anio_anterior_data = [];
        var ingresos_capital_anio_act_data = [];
        
        // Grafica #1
        var recaudados_anio_anterior = filterMesesGroup(data, 2019, 'Ingresos Recaudados', nombre_gerencia, meses);
        var proyectados_anio_act = filterMesesGroup(data, 2020, 'Ingresos Proyectados', nombre_gerencia, meses);
        var recaudados_anio_act = filterMesesGroup(data, 2020, 'Ingresos Recaudados', nombre_gerencia, meses);
        
        setIngresosAnioAnt({
            recaudadosAnt : recaudados_anio_anterior, 
            proyectados : proyectados_anio_act, 
            recaudadosAct: recaudados_anio_act
        });

        // Grafica #2
        meses.forEach(mes => {
            var ingresos_recaudados_anio_anterior = filterMes(data, 2019, 'Ingresos Recaudados', nombre_gerencia, mes);
            var ingresos_proyectados_anio_act = filterMes(data, 2020, 'Ingresos Proyectados', nombre_gerencia, mes);
            var ingresos_recaudados_anio_act = filterMes(data, 2020, 'Ingresos Recaudados', nombre_gerencia, mes);

            ingresos_recaudados_anio_anterior_data.push(ingresos_recaudados_anio_anterior);
            ingresos_proyectados_anio_act_data.push(ingresos_proyectados_anio_act);
            ingresos_recaudados_anio_act_data.push(ingresos_recaudados_anio_act);
        });

        setRecaudados2019(ingresos_recaudados_anio_anterior_data);
        setProyectados2020(ingresos_proyectados_anio_act_data);
        setRecaudados2020(ingresos_recaudados_anio_act_data);

        // Grafica # 3
        var ingreso_recaudados_total_anio_anterior = filterMesesGroup(data, 2019, 'Ingresos Recaudados', 'all', meses);
        var ingresos_recaudados_corpo_anio_anterior = filterMesesGroup(data, 2019, 'Ingresos Recaudados', 'corporativo', meses);
        var ingresos_recaudados_uenaa_anio_anterior = filterMesesGroup(data, 2019, 'Ingresos Recaudados', 'uenaa', meses);
        var ingresos_recaudados_telco_anio_anterior = filterMesesGroup(data, 2019, 'Ingresos Recaudados', 'telco', meses);
        var ingresos_recaudados_uene_anio_anterior = filterMesesGroup(data, 2019, 'Ingresos Recaudados', 'uene', meses);

        var ingresos_recaudados_corpo_anio_anteriorMath = Math.round((ingresos_recaudados_corpo_anio_anterior / ingreso_recaudados_total_anio_anterior) * 100, -1);
        var ingresos_recaudados_uenaa_anio_anteriorMath = Math.round((ingresos_recaudados_uenaa_anio_anterior / ingreso_recaudados_total_anio_anterior) * 100, -1);
        var ingresos_recaudados_telco_anio_anteriorMath = Math.round((ingresos_recaudados_telco_anio_anterior / ingreso_recaudados_total_anio_anterior) * 100, -1);
        var ingresos_recaudados_uene_anio_anteriorMath = Math.round((ingresos_recaudados_uene_anio_anterior / ingreso_recaudados_total_anio_anterior) * 100, -1);

        setingresos_anioAnt({valueOne : ingresos_recaudados_corpo_anio_anteriorMath, valueTwo : ingresos_recaudados_uenaa_anio_anteriorMath, valueThree : ingresos_recaudados_telco_anio_anteriorMath, valueFour : ingresos_recaudados_uene_anio_anteriorMath})

        // Grafica # 3_1
        var ingreso_recaudados_total_anio_act= filterMesesGroup(data, 2020, 'Ingresos Recaudados', 'all', meses);
        var ingresos_recaudados_corpo_anio_act= filterMesesGroup(data, 2020, 'Ingresos Recaudados', 'corporativo', meses);
        var ingresos_recaudados_uenaa_anio_act= filterMesesGroup(data, 2020, 'Ingresos Recaudados', 'uenaa', meses);
        var ingresos_recaudados_telco_anio_act= filterMesesGroup(data, 2020, 'Ingresos Recaudados', 'telco', meses);
        var ingresos_recaudados_uene_anio_act= filterMesesGroup(data, 2020, 'Ingresos Recaudados', 'uene', meses);

        var ingresos_recaudados_corpo_anio_anteriorMath = Math.round((ingresos_recaudados_corpo_anio_act/ ingreso_recaudados_total_anio_act) * 100, -1);
        var ingresos_recaudados_uenaa_anio_anteriorMath = Math.round((ingresos_recaudados_uenaa_anio_act/ ingreso_recaudados_total_anio_act) * 100, -1);
        var ingresos_recaudados_telco_anio_anteriorMath = Math.round((ingresos_recaudados_telco_anio_act/ ingreso_recaudados_total_anio_act) * 100, -1);
        var ingresos_recaudados_uene_anio_anteriorMath = Math.round((ingresos_recaudados_uene_anio_act/ ingreso_recaudados_total_anio_act) * 100, -1);

        setingresos_anioAct({valueOne : ingresos_recaudados_corpo_anio_anteriorMath, valueTwo : ingresos_recaudados_uenaa_anio_anteriorMath, valueThree : ingresos_recaudados_telco_anio_anteriorMath, valueFour : ingresos_recaudados_uene_anio_anteriorMath})

        // Grafica #4
        meses.forEach(mes => {
            var disponibilidad_inicial_anio_anterior = filterNameGroup(data, 2019, 'Ingresos Recaudados', nombre_gerencia, mes, 'disponibilidad inicial');
            var disponibilidad_inicial_anio_act = filterNameGroup(data, 2020, 'Ingresos Recaudados', nombre_gerencia, mes, 'disponibilidad inicial');

            disponibilidad_inicial_anio_anterior_data.push(disponibilidad_inicial_anio_anterior);
            disponibilidad_inicial_anio_act_data.push(disponibilidad_inicial_anio_act);
        });

        setDisponibilidadInicial_anios_anterior(disponibilidad_inicial_anio_anterior_data);
        setDisponibilidadInicial_anios_act(disponibilidad_inicial_anio_act_data);

        // Grafica #5
        meses.forEach(mes => {
            var ingresos_corrientes_anio_anterior = filterNameGroup(data, 2019, 'Ingresos Recaudados', nombre_gerencia, mes, 'ingresos corrientes');
            var ingresos_corrientes_anio_act = filterNameGroup(data, 2020, 'Ingresos Recaudados', nombre_gerencia, mes, 'ingresos corrientes');

            ingresos_corrientes_anio_anterior_data.push(ingresos_corrientes_anio_anterior);
            ingresos_corrientes_anio_act_data.push(ingresos_corrientes_anio_act);
        });
        setIngresosCorrientes_anios_anterior(ingresos_corrientes_anio_anterior_data);
        setIngresosCorrientes_anios_act(ingresos_corrientes_anio_act_data);

        // Grafica #6
        meses.forEach(mes => {
            var ingresos_capital_anio_anterior = filterMes(data, 2019, 'Ingresos Recaudados', nombre_gerencia, mes, 'ingresos de capital');
            var ingresos_capital_anio_act = filterMes(data, 2020, 'Ingresos Recaudados', nombre_gerencia, mes, 'ingresos de capital');

            ingresos_capital_anio_anterior_data.push(ingresos_capital_anio_anterior);
            ingresos_capital_anio_act_data.push(ingresos_capital_anio_act);
        });

        setIngresosCapital_anios_anterior(ingresos_capital_anio_anterior_data);
        setIngresosCapital_anios_act(ingresos_capital_anio_act_data);

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
            label: 'Ejecución acumulada',
            data: [ingresosAnioAnt.recaudadosAnt, ingresosAnioAnt.proyectados, ingresosAnioAnt.recaudadosAct],
            backgroundColor: [
                '#2DFF2D',
                '#2119C8',
                '#2DFF2D',
            ],
            borderColor: [
                '#2DFF2D',
                '#2119C8',
                '#2DFF2D',
            ],
            borderWidth: 1
        }]
    };

    const dataIngreVsGas = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: 'Recaudado - 2019',
            data: recaudados2019,
            backgroundColor: '#FFC503',
          },
          {
            label: 'Proyectados - 2020',
            data: proyectados2020,
            backgroundColor: '#2119C8',
          },
          {
            label: 'Recaudados - 2020',
            data: recaudados2020,
            backgroundColor: '#2DFF2D',
          },
        ],
    }

    // Grafica 3
    const dataPieAnt = {
        labels: ['Corporativo', 'UENAA', 'TELCO', 'UENE'],
        datasets: [
          {
            label: '',
            data: [ingresos_ant.valueOne, ingresos_ant.valueTwo, ingresos_ant.valueThree, ingresos_ant.valueFour],
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

    // Grafica 3_1
    const dataPieAct = {
        labels: ['Corporativo', 'UENAA', 'TELCO', 'UENE'],
        datasets: [
          {
            label: '',
            data: [ingresos_act.valueOne, ingresos_act.valueTwo, ingresos_act.valueThree, ingresos_act.valueFour],
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

    const dataDisponibilidadInicial = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: 'Recaudado - 2019',
            data: disponibilidadInicial_anios_anterior,
            backgroundColor: '#FFFF00',
          },
          {
            label: 'Recaudado - 2020',
            data: disponibilidadInicial_anios_act,
            backgroundColor: '#9BBB59',
          }
        ],
    };

    const dataIngresosCorrientes = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: '2019',
            data: ingresos_corrientes_anios_anterior,
            backgroundColor: '#FFFF00',
          },
          {
            label: '2020',
            data: ingresos_corrientes_anios_act,
            backgroundColor: '#9BBB59',
          }
        ],
    };

    const dataIngresosCapital = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: '2019',
            data: ingresos_capital_anios_anterior,
            backgroundColor: '#FFFF00',
          },
          {
            label: '2020',
            data: ingresos_capital_anios_act,
            backgroundColor: '#9BBB59',
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
                            <Grid item xs={12} md={3} lg={3}>
                                <Paper className={fixedHeightPaper}>
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
                                                        <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '15px'}}>Ejecución acumulada</p>
                                                    </div>
                                                </div>
                                                <HorizontalBar  data={dataIngresosAnios} options={optionsEjecucionAcum} height={40}/>
                                                <div className="containerLabelsCharts">
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#2DFF2D'}}></span>
                                                        <p>Ingresos recaudados</p>
                                                    </div>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#2119C8'}}></span>
                                                        <p>Ingresos proyectados</p>
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
                                            <Skeleton variant="rect" width={'100%'} height={245} />
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
                                                    <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '15px'}}>Ingresos</p>
                                                </div>
                                            </div>
                                            <Bar  data={dataIngreVsGas} options={optionsIngreVsGas} height={100}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FFC503'}}></span>
                                                    <p>Recaudados - 2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#2119C8'}}></span>
                                                    <p>Proyectados - 2020</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#2DFF2D'}}></span>
                                                    <p>Recaudados - 2020</p>
                                                </div>
                                            </div>
                                        </div>
                                 }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={2} lg={2}>
                                <Paper className={fixedHeightPaper}>
                                    {
                                        loading ? 
                                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                <Skeleton variant="circle" width={120} height={120} />
                                            </div>
                                        :
                                            <div>
                                                <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                    <div className="itemChart" >
                                                        <p style={{fontSize: '16px', fontWeight: 'bold'}}>2019</p>
                                                    </div>
                                                </div>
                                                <div style={{width: '100%'}}>
                                                    <Pie data={dataPieAnt} options={optionsGastosDoughnut} height={300}/>
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
                            <Grid item xs={12} md={2} lg={2}>
                                <Paper className={fixedHeightPaper}>
                                    {
                                        loading ? 
                                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                <Skeleton variant="circle" width={120} height={120} />
                                            </div>
                                        :
                                            <div>
                                                <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                    <div className="itemChart" >
                                                        <p style={{fontSize: '16px', fontWeight: 'bold'}}>2020</p>
                                                    </div>
                                                </div>
                                                <div style={{width: '100%'}}>
                                                    <Pie data={dataPieAct} options={optionsGastosDoughnut} height={300}/>
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
                            {/* Charts */}
                            <Grid item xs={12} md={4} lg={4}>
                                <Paper className={fixedHeightPaper}>
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
                                                        <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Disponibilidad Inicial</p>
                                                    </div>
                                                </div>
                                                <Bar  data={dataDisponibilidadInicial} options={optionsIngreVsGas}/>
                                                <div className="containerLabelsCharts">
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#ffff00'}}></span>
                                                        <p>2019</p>
                                                    </div>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#9BBB59'}}></span>
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
                                                        <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Ingresos Corrientes</p>
                                                    </div>
                                                </div>
                                                <Bar  data={dataIngresosCorrientes} options={optionsIngreVsGas}/>
                                                <div className="containerLabelsCharts">
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#ffff00'}}></span>
                                                        <p>2019</p>
                                                    </div>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#9BBB59'}}></span>
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
                                                    <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Ingresos de Capital</p>
                                                </div>
                                            </div>
                                            <Bar  data={dataIngresosCapital} options={optionsIngreVsGas}/>
                                            <div className="containerLabelsCharts">
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#ffff00'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#9BBB59'}}></span>
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