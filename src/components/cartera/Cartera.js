import React, {useState, useEffect} from "react";
import {Breadcrumbs, Typography, makeStyles, Container, Grid, Paper, Tabs, Tab } from '@material-ui/core';
import clsx from 'clsx';
import services from '../../services';
import {loadServerExcel} from '../../services';
import Skeleton from '@material-ui/lab/Skeleton';
import {filterColumnMes, optionsInforGeneral} from '../../services/cartera';
import Header from '../menu/Header';
import { Line }  from 'react-chartjs-2';
import { Redirect } from 'react-router-dom';
import UENE from '../../assets/images/icons/comercial/uene.png'
import acueducto from '../../assets/images/icons/comercial/acueducto.png'
import alcantarillado from '../../assets/images/icons/comercial/alcantarillado.png'
import logo from '../../assets/images/logosidebar_reducido.png'
import telecomunicaciones from '../../assets/images/icons/comercial/telecomunicaciones.png'

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
        height: 350,
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
        marginBottom: '15px'
    },
    tabs: {
        "& .MuiTab-wrapper": {
            textTransform: 'initial',
            textAlign: 'left',
            letterSpacing: '1px',
            lineHeight: '17px',
            flexDirection: 'row',
            fontSize: '13px'
        },
        "& .MuiTab-textColorPrimary.Mui-selected": {
            color: '#ffffff',
            background: '#365068', 
        },
        "& 	.MuiTabs-indicator": {
            backgroundColor: '#365068'
        },
        "& 	.MuiTab-root": {
            borderRight: `1px solid ${theme.palette.divider}`,
            color: '#4a6276'
        },
        "& 	.MuiTab-labelIcon": {
            minHeight: '48px',
        },
    }
}));

// Items que iran en el header.
export const ItemsHeader = (changeFilter) => {

    const [tabActive, setTabActive] = useState('UENE');
    const [value, setValue] = useState(0);
    const classes = useStyles();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const changeTab = (tab) => {
        setTabActive(tab);
        changeFilter('acueducto');
    }

    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            
            <Breadcrumbs aria-label="breadcrumb">
                <Typography color="textPrimary" className="txt-breadcrumb">Cartera</Typography>
            </Breadcrumbs>
            <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                aria-label="Tabs"
                variant="fullWidth"
                className={classes.tabs}
            >
                {/* <Tab label="Energia" onClick={() => changeTab('UENE')} icon={<img src={UENE} style={{marginRight: '5px', marginBottom: 0}} alt="energia" />}/> */}
                <Tab label="EMCALI" onClick={changeFilter('all')} icon={<img src={logo} style={{marginRight: '5px', marginBottom: 0, width: '35px'}} alt="energia" />}/>
                <Tab label="Energia" onClick={changeFilter('energia')} icon={<img src={UENE} style={{marginRight: '5px', marginBottom: 0}} alt="energia" />}/>
                <Tab label="Acueducto" onClick={changeFilter('acueducto')}  icon={<img src={acueducto} style={{marginRight: '5px', marginBottom: 0}} alt="acueducto" />}/>
                <Tab label="Alcantarillado" onClick={changeFilter('alcantarillado')}  icon={<img src={alcantarillado} style={{marginRight: '5px', marginBottom: 0}} alt="alcantarillado" />}/>
                <Tab label="Telecomunicaciones" onClick={changeFilter('telecomunicaciones')} icon={<img src={telecomunicaciones} style={{marginRight: '5px', marginBottom: 0}} alt="telecomunicaciones" />} />
            </Tabs>
        </div>
    );
}

export default function Cartera() {

    // Estilos.
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    
    // Estados
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'all'});
    const [facturacionInfoGen, setFacturacionInfoGen] = useState([]);
    const [saldoCarteraInfoGen, setSaldoCarteraInfoGen] = useState([]);
    const [recaudoInfoGen, setRecaudoInfoGen] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hook de React.
    useEffect(() => {
        loadDataExcel();
    }, []);
    
    // Hace la petición de carga que trae la informacion del excel desde el backend.
    const loadDataExcel = () => {
        // Carga del excel.
        loadServerExcel('http://127.0.0.1:8000/api/download-template/cartera', function (data, err) {
            setDataExcel(data.data);
            loadCharts(data.data);
        });
    }

    // Carga de las estadisticas.
    const loadCharts = (data, nombre_gerencia = filters.nombre_gerencia) => {

        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'];
        
        // Grafica #1
        var facturacion_mes = [];
        var saldo_cartera = [];
        var recaudo = [];
        meses.forEach(mes => {
            var data_facturacion_mes_general = filterColumnMes(data, nombre_gerencia, mes, 'facturacion_mes');
            var data_saldo_cartera_general = filterColumnMes(data, nombre_gerencia, mes, 'saldo_cartera');
            var data_recaudo_general = filterColumnMes(data, nombre_gerencia, mes, 'recaudo_total');
            facturacion_mes.push(data_facturacion_mes_general);
            saldo_cartera.push(data_saldo_cartera_general);
            recaudo.push(data_recaudo_general);
        });

        // Cambiar estados. 
        // Grafica #1
        setFacturacionInfoGen(facturacion_mes);
        setSaldoCarteraInfoGen(saldo_cartera);
        setRecaudoInfoGen(recaudo);
        
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
   const data = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
    datasets: [
      {
        label: 'Facturación mensual',
        data: facturacionInfoGen,
        fill: false,
        backgroundColor: '#507FF2',
        borderColor: '#507FF2',
        yAxisID: 'y-axis-1',
      },
      {
        label: 'Saldo cartera',
        data: saldoCarteraInfoGen,
        fill: false,
        backgroundColor: '#FFB12E',
        borderColor: '#FFB12E',
        yAxisID: 'y-axis-2',
      },
      {
        label: 'Recaudo total',
        data: recaudoInfoGen,
        fill: false,
        backgroundColor: '#F66666',
        borderColor: '#F66666',
        yAxisID: 'y-axis-2',
      },
    ],
    }
  
    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            <div className={classes.root}>
                <Header active={'cartera'} itemsHeader={() => ItemsHeader(changeFilterNomGerencia)} />
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Charts */}
                            <Grid item xs={12} md={12} lg={12}>
                                <Paper className={fixedHeightPaper}>
                                    {(loading) ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={280} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                    :
                                        <div>
                                            <Line data={data} height={100} options={optionsInforGeneral} height={80}/>
                                            <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#507FF2'}}></span>
                                                    <p>Información general</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#FFB12E'}}></span>
                                                    <p>Saldo cartera</p>
                                                </div>
                                                <div className="itemChart">
                                                    <span className="iconList" style={{background: '#F66666'}}></span>
                                                    <p>Recaudo total</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Paper>
                            </Grid>

                            {/* Chart */}
                            <Grid item xs={12} md={9} lg={9}>
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
                            <Grid item xs={12} md={3} lg={3}>
                                <Paper className={classes.heightFull}>
                                </Paper>
                            </Grid>

                        </Grid>
                    </Container>
                </main>
            </div>
    )
}