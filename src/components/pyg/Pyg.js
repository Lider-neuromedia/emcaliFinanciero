import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { Breadcrumbs, Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Header from '../menu/Header';
import { Redirect } from 'react-router-dom';
import services from '../../services';
import {loadServerExcel} from '../../services';
import {filterColumnMes, optionsIngresosOper, optionsGroupBar} from '../../services/pyg';
import { Bar  } from 'react-chartjs-2';
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
        height: 333,
    },
    heightSmall: {
        height: 185
    },
    heightAuto : {
        height: 214
    }
}));


// Items que iran en el header.
export const itemsHeader = (changeFilter) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Typography color="textPrimary" className="txt-breadcrumb">PyG</Typography>
            </Breadcrumbs>
            <ButtonGroup variant="text" color="default" aria-label="text default button group">
                <Button style={{ padding: '0 2em' }} onClick={changeFilter('all')}><img src={logo} alt="uene" style={{paddingRight: '10px', width: 40}}/>EMCALI</Button>
                <Button style={{ padding: '0 2em' }} onClick={changeFilter('telco')}><img src={internet} alt="uene" style={{paddingRight: '10px'}}/>TELCO</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('uenaa')}><img src={alcantarillado} alt="uene" style={{paddingRight: '10px'}}/>UENAA</Button>
                <Button style={{ padding: '6px 2em' }} onClick={changeFilter('uene')}><img src={UENE} alt="uene" style={{paddingRight: '10px'}}/>UENE</Button>
            </ButtonGroup>
        </div>
    );
}

export default function Pyg() {

    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const fixedHeightPaperVH = clsx(classes.paper, classes.heightAuto);
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'all'});
    const [ingresosOpera, setIngresosOpera] = useState({ anio_ant : 0, anio_act : 0});
    const [costosVenta, setCostosVenta] = useState({ anio_ant : 0, anio_act : 0});
    const [gastosOper, setGastosOper] = useState({ anio_ant : 0, anio_act : 0});
    const [ebitda, setEbitda] = useState({ anio_ant : 0, anio_act : 0});
    const [utilidadNeta, setUtilidadNeta] = useState({ anio_ant : 0, anio_act : 0});
    const [ebitdaGerencia, setEbitdaGerencia] = useState({ uene : 0, uenaa : 0, telco : 0});
    const [utilidadGerencia, setUtilidadGerencia] = useState({ uene : 0, uenaa : 0, telco : 0});
    const [ebitdaMesesAnioAnt, setEbitdaMesesAnioAnt] = useState([]);
    const [ebitdaMesesAnioAct, setEbitdaMesesAnioAct] = useState([]);
    const [utilidadMesesAnioAnt, setUtilidadMesesAnioAnt] = useState([]);
    const [utilidadMesesAnioAct, setUtilidadMesesAnioAct] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hook de React.
    useEffect(() => {
        loadDataExcel();
    }, []);

    // Hace la petición de carga que trae la informacion del excel desde el backend.
    const loadDataExcel = () => {
        // Carga del excel.
        loadServerExcel('https://pruebasneuro.co/N-1006/api/download-template/pyg', function (data, err) {
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
        
        // Grafica #1
        var ingresos_oper_anio_ant = filterColumnMes(data, 2019, nombre_gerencia, 'Septiembre', 'ingresos_operacionales');
        var ingresos_oper_anio_act = filterColumnMes(data, 2020, nombre_gerencia, 'Septiembre', 'ingresos_operacionales');

        // Grafica 2
        var costos_vta_anio_ant = filterColumnMes(data, 2019, nombre_gerencia, 'Septiembre', 'costos_venta');
        var costos_vta_anio_act = filterColumnMes(data, 2020, nombre_gerencia, 'Septiembre', 'costos_venta');
        
        // Grafica 3
        var gastos_op_anio_ant = filterColumnMes(data, 2019, nombre_gerencia, 'Septiembre', 'gastos_operacionales');
        var gastos_op_anio_act = filterColumnMes(data, 2020, nombre_gerencia, 'Septiembre', 'gastos_operacionales');
            
        // Grafica 4
        var ebitda_anio_ant = filterColumnMes(data, 2019, nombre_gerencia, 'Septiembre', 'ebitda');
        var ebitda_anio_act = filterColumnMes(data, 2020, nombre_gerencia, 'Septiembre', 'ebitda');
            
        // Grafica 5
        var utilidad_anio_ant = filterColumnMes(data, 2019, nombre_gerencia, 'Septiembre', 'utilidad_neta');
        var utilidad_anio_act = filterColumnMes(data, 2020, nombre_gerencia, 'Septiembre', 'utilidad_neta');
            
        // Grafica 6
        var ebitda_gerencia_uene = filterColumnMes(data, 2020, 'uene', 'Septiembre', 'ebitda');
        var ebitda_gerencia_uenaa = filterColumnMes(data, 2020, 'uenaa', 'Septiembre', 'ebitda');
        var ebitda_gerencia_telco = filterColumnMes(data, 2020, 'telco', 'Septiembre', 'ebitda');
    
        // Grafica 7 -  utilidad neta por gerencia.
        var utilidad_gerencia_uene = filterColumnMes(data, 2020, 'uene', 'Septiembre', 'utilidad_neta');
        var utilidad_gerencia_uenaa = filterColumnMes(data, 2020, 'uenaa', 'Septiembre', 'utilidad_neta');
        var utilidad_gerencia_telco = filterColumnMes(data, 2020, 'telco', 'Septiembre', 'utilidad_neta');
    
        // Grafica 8 -  ebitda x mes.
        var ebitda_mes_anio_ant = [];
        var ebitda_mes_anio_act = [];

        meses.forEach( mes => {
            var ebitda = filterColumnMes(data, 2019, nombre_gerencia, mes, 'ebitda');
            ebitda_mes_anio_ant.push(ebitda);
        });
        meses.forEach( mes => {
            var ebitda = filterColumnMes(data, 2020, nombre_gerencia, mes, 'ebitda');
            ebitda_mes_anio_act.push(ebitda)
        });
        var substraction_ebitda_anio_ant = restaElementoAnt(ebitda_mes_anio_ant);
        var substraction_ebitda_anio_act = restaElementoAnt(ebitda_mes_anio_act);
    
        // Grafica 9 -  utilidad x mes.
        var utilidad_mes_anio_ant = [];
        var utilidad_mes_anio_act = [];

        meses.forEach( mes => {
            var utilidad = filterColumnMes(data, 2019, nombre_gerencia, mes, 'utilidad_neta');
            utilidad_mes_anio_ant.push(utilidad);
        });
        meses.forEach( mes => {
            var utilidad = filterColumnMes(data, 2020, nombre_gerencia, mes, 'utilidad_neta');
            utilidad_mes_anio_act.push(utilidad);
        });
        var substraction_utilidad_anio_ant = restaElementoAnt(utilidad_mes_anio_ant);
        var substraction_utilidad_anio_act = restaElementoAnt(utilidad_mes_anio_act);
       
        // Cambiar estados. 
        // Grafica #1
        setIngresosOpera({
            anio_ant : ingresos_oper_anio_ant,
            anio_act : ingresos_oper_anio_act
        });

        // Grafica #2
        setCostosVenta({
            anio_ant : costos_vta_anio_ant,
            anio_act : costos_vta_anio_act
        });

        // Grafica #3
        setGastosOper({
            anio_ant : gastos_op_anio_ant,
            anio_act : gastos_op_anio_act
        });
        
        // Grafica #4
        setEbitda({
            anio_ant : ebitda_anio_ant,
            anio_act : ebitda_anio_act
        });
        
        // Grafica #5
        setUtilidadNeta({
            anio_ant : utilidad_anio_ant,
            anio_act : utilidad_anio_act
        });
        
        // Grafica #6
        setEbitdaGerencia({
            uene : ebitda_gerencia_uene,
            uenaa : ebitda_gerencia_uenaa,
            telco : ebitda_gerencia_telco
        });
        
        // Grafica #7 
        setUtilidadGerencia({
            uene : utilidad_gerencia_uene,
            uenaa : utilidad_gerencia_uenaa,
            telco : utilidad_gerencia_telco
        });
        
        // Grafica #8 
        setEbitdaMesesAnioAnt(substraction_ebitda_anio_ant);
        setEbitdaMesesAnioAct(substraction_ebitda_anio_act);
        
        // Grafica #9
        setUtilidadMesesAnioAnt(substraction_utilidad_anio_ant);
        setUtilidadMesesAnioAct(substraction_utilidad_anio_act);

        // Al final desactivamos loading.
        setLoading(false);

    }

    // Cambiar los filtros en base a nombre gerencia.
    const changeFilterNomGerencia = (value)  => (event) => {
        setFilters({nombre_gerencia : value});
        // Inicializacion del loading.
        setLoading(true);
        loadCharts(dataExcel, value);
    }
    
    /* 
        DATA - GRAFICOS.
    */

    // Grafica #1 - Ingresos operacionales
    const dataIngresosOper = {
    labels: ['', ''],
    datasets: [
        {
        label: 'Ingresos operacionales',
        data: [ingresosOpera.anio_ant, ingresosOpera.anio_act],
        backgroundColor: [
            '#28F828',
            '#28F828',
        ],
        borderColor: [
            '#28F828',
            '#28F828',
        ],
        borderWidth: 1,
        },
    ],
    }

    // Grafica #2 - Costos de venta
    const dataCostosVnta = {
    labels: ['', ''],
    datasets: [
        {
        label: 'Costos de venta',
        data: [costosVenta.anio_ant, costosVenta.anio_act],
        backgroundColor: [
            '#E46C0A',
            '#E46C0A',
        ],
        borderColor: [
            '#E46C0A',
            '#E46C0A',
        ],
        borderWidth: 1,
        },
    ],
    }

    // Grafica #3 - gastos operacionales
    const dataGastosOpe = {
    labels: ['', ''],
    datasets: [
        {
        label: 'Gastos operacionales',
        data: [gastosOper.anio_ant, gastosOper.anio_act],
        backgroundColor: [
            '#C00000',
            '#C00000',
        ],
        borderColor: [
            '#C00000',
            '#C00000',
        ],
        borderWidth: 1,
        },
    ],
    }

    // Grafica #4 - ebitda
    const dataEbitda = {
    labels: ['', ''],
    datasets: [
        {
        label: 'Ebitda',
        data: [ebitda.anio_ant, ebitda.anio_act],
        backgroundColor: [
            '#3C7BC8',
            '#99C047',
        ],
        borderColor: [
            '#3C7BC8',
            '#99C047',
        ],
        borderWidth: 1,
        },
    ],
    }

    // Grafica #5 - utilidad neta acumulada
    const dataUtilidad = {
    labels: ['', ''],
    datasets: [
        {
        label: 'Utilidad neta',
        data: [utilidadNeta.anio_ant, utilidadNeta.anio_act],
        backgroundColor: [
            '#CA3D3A',
            '#7A57A4',
        ],
        borderColor: [
            '#CA3D3A',
            '#7A57A4',
        ],
        borderWidth: 1,
        },
    ],
    }

    // Grafica #6 - Ebitda utilidad
    const dataEbitdaGerencia = {
    labels: ['', '', ''],
    datasets: [
        {
        label: 'Ebitda gerencia',
        data: [ebitdaGerencia.uene, ebitdaGerencia.uenaa, ebitdaGerencia.telco],
        backgroundColor: [
            '#002060',
            '#FFFF00',
            '#FF0000'
        ],
        borderColor: [
            '#002060',
            '#FFFF00',
            '#FF0000'
        ],
        borderWidth: 1,
        },
    ],
    }

    // Grafica #7 - Utilidad neta x gerencia
    const dataUtilidadGerencia = {
    labels: ['', '', ''],
    datasets: [
        {
        label: 'Utilidad gerencia',
        data: [utilidadGerencia.uene, utilidadGerencia.uenaa, utilidadGerencia.telco],
        backgroundColor: [
            '#002060',
            '#FFFF00',
            '#FF0000'
        ],
        borderColor: [
            '#002060',
            '#FFFF00',
            '#FF0000'
        ],
        borderWidth: 1,
        },
    ],
    }
    
    // Grafica #8 - Ebitda x meses
    const dataEbitdaMeses = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: '2019',
            data: ebitdaMesesAnioAnt,
            backgroundColor: '#3670B6',
          },
          {
            label: '2020',
            data: ebitdaMesesAnioAct,
            backgroundColor: '#8EB341',
          },
        ],
    }
    
    // Grafica #9 - Utilidad x meses
    const dataUtilidadMeses = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        datasets: [
          {
            label: '2019',
            data: utilidadMesesAnioAnt,
            backgroundColor: '#CD3C38',
          },
          {
            label: '2020',
            data: utilidadMesesAnioAct,
            backgroundColor: '#7B57A7',
          },
        ],
    }

    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            <div className={classes.root}>
                <Header active={'pyg'} itemsHeader={() => itemsHeader(changeFilterNomGerencia)}  />
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12} md={2} lg={2}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Paper className={fixedHeightPaperVH} style={{padding: 10}}>
                                        {(loading) ? 
                                            <div>
                                                <Skeleton variant="rect" width={'100%'} height={174} />
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                    <Skeleton variant="text" width={'40%'}/>
                                                </div>
                                            </div>
                                         :
                                         <div>
                                             <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                <div className="itemChart" >
                                                    <p style={{fontSize: '16px', fontWeight: 'bold'}}>Ingresos operacionales</p>
                                                </div>
                                            </div>
                                            <Bar data={dataIngresosOper} height={200} options={optionsIngresosOper} />
                                            <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#28F828'}}></span>
                                                    <p>2019</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#28F828'}}></span>
                                                    <p>2020</p>
                                                </div>
                                            </div>
                                         </div>
                                        }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Paper className={fixedHeightPaperVH} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={174} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                            <div>
                                                <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                    <div className="itemChart" >
                                                        <p style={{fontSize: '16px', fontWeight: 'bold'}}>Costos de Ventas</p>
                                                    </div>
                                                </div>
                                                <Bar data={dataCostosVnta} height={200} options={optionsIngresosOper} />
                                                <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#E46C0A'}}></span>
                                                        <p>2019</p>
                                                    </div>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#E46C0A'}}></span>
                                                        <p>2020</p>
                                                    </div>
                                                </div>
                                            </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Paper className={fixedHeightPaperVH} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={174} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                            <div>
                                                <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                    <div className="itemChart" >
                                                        <p style={{fontSize: '16px', fontWeight: 'bold'}}>Gastos Operacionales</p>
                                                    </div>
                                                </div>
                                                <Bar data={dataGastosOpe} height={200} options={optionsIngresosOper} />
                                                <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                    <div className="itemChart">
                                                        <span className="iconList" style={{background: '#C00000'}}></span>
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
                            </Grid>

                            <Grid item xs={12} md={10} lg={10}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={2} lg={2}>
                                        <Paper className={fixedHeightPaper} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={290} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                                <div>
                                                    <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                        <div className="itemChart" >
                                                            <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '15px'}}>EBITDA Acumulado</p>
                                                        </div>
                                                    </div>
                                                    <Bar data={dataEbitda} height={400} options={optionsIngresosOper} />
                                                    <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#3C7BC8'}}></span>
                                                            <p>2019</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#99C047'}}></span>
                                                            <p>2020</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={2} lg={2}>
                                        <Paper className={fixedHeightPaper} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={290} />
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
                                                            <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>EBITDA por Gerencia</p>
                                                        </div>
                                                    </div>
                                                    <Bar data={dataEbitdaGerencia} height={430} options={optionsIngresosOper} />
                                                    <div className="containerLabelsCharts" style={{marginTop: 15}}>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#002060'}}></span>
                                                            <p>UENE</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#FFFF00'}}></span>
                                                            <p>UENAA</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#FF0000'}}></span>
                                                            <p>TELCO</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={8} lg={8}>
                                        <Paper className={fixedHeightPaper} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={290} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                                <div>
                                                    <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                        <div className="itemChart" >
                                                            <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>EBITDA</p>
                                                        </div>
                                                    </div>
                                                    <Bar data={dataEbitdaMeses} height={90} options={optionsGroupBar} />
                                                    <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#3670B6'}}></span>
                                                            <p>2019</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#8EB341'}}></span>
                                                            <p>2020</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={2} lg={2}>
                                        <Paper className={fixedHeightPaper} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={290} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                                <div>
                                                    <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                        <div className="itemChart" >
                                                            <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Utilidad neta Acumulada</p>
                                                        </div>
                                                    </div>
                                                    <Bar data={dataUtilidad} height={400} options={optionsIngresosOper} />
                                                    <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#CA3D3A'}}></span>
                                                            <p>2019</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#7A57A4'}}></span>
                                                            <p>2020</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={2} lg={2}>
                                        <Paper className={fixedHeightPaper} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={290} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                                <div>
                                                    <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                        <div className="itemChart" >
                                                            <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Utilidad Neta por Gerencia</p>
                                                        </div>
                                                    </div>
                                                    <Bar data={dataUtilidadGerencia} height={400} options={optionsIngresosOper} />
                                                    <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                    <div className="itemChart">
                                                            <span className="iconList" style={{background: '#002060'}}></span>
                                                            <p>UENE</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#FFFF00'}}></span>
                                                            <p>UENAA</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#FF0000'}}></span>
                                                            <p>TELCO</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={8} lg={8}>
                                        <Paper className={fixedHeightPaper} style={{padding: 10}}>
                                            {(loading) ? 
                                                <div>
                                                    <Skeleton variant="rect" width={'100%'} height={290} />
                                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                        <Skeleton variant="text" width={'40%'}/>
                                                    </div>
                                                </div>
                                            :
                                                <div>
                                                    <div className="containerLabelsCharts" style={{display: 'flex', justifyContent: 'center'}}>
                                                        <div className="itemChart" >
                                                            <p style={{fontSize: '16px', fontWeight: 'bold', paddingBottom: '10px'}}>Utilidad Neta</p>
                                                        </div>
                                                    </div>
                                                    <Bar data={dataUtilidadMeses} height={90} options={optionsGroupBar} />
                                                    <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#CD3C38'}}></span>
                                                            <p>2019</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#7B57A7'}}></span>
                                                            <p>2020</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>

    );
}