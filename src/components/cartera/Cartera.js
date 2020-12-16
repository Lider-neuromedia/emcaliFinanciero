import React, {useState, useEffect} from "react";
import {Breadcrumbs, Typography, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import services from '../../services';
import {loadServerExcel} from '../../services';
import Skeleton from '@material-ui/lab/Skeleton';
import {filterColumnMes, optionsInforGeneral} from '../../services/cartera';
import Header from '../menu/Header';
import { Line }  from 'react-chartjs-2';
import { Redirect } from 'react-router-dom';

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
    }
}));

// Items que iran en el header.
export const itemsHeader = () => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Breadcrumbs aria-label="breadcrumb">
                <Typography color="textPrimary" className="txt-breadcrumb">Cartera</Typography>
            </Breadcrumbs>
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
                <Header active={'cartera'} itemsHeader={itemsHeader}/>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Charts */}
                            <Grid item xs={12} md={12} lg={12}>
                                <Paper className={fixedHeightPaper}>
                                    {(loading) ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={300} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                    :
                                        <div>
                                            <Line data={data} height={100} options={optionsInforGeneral} />
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