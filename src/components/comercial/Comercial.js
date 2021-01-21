import React, {useState, useEffect} from "react";
import {Breadcrumbs, Typography, makeStyles, Container, Grid, Paper, Tabs, Tab,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import clsx from 'clsx';
import Header from '../menu/Header';
import { Link, Redirect } from 'react-router-dom';
import UENE from '../../assets/images/icons/comercial/uene.png'
import acueducto from '../../assets/images/icons/comercial/acueducto.png'
import alcantarillado from '../../assets/images/icons/comercial/alcantarillado.png'
import internet from '../../assets/images/icons/comercial/internet.png'
import telecomunicaciones from '../../assets/images/icons/comercial/telecomunicaciones.png'
import tv from '../../assets/images/icons/comercial/tv.png'
import services from '../../services';
import {loadServerExcel} from '../../services';
import {filterConsumoTarifa, filterConsumoAnio, optionsGroupBar, optionsInforGeneral, filterConsumoAnioMedia} from '../../services/comercial';
import { Bar, Line } from 'react-chartjs-2';
import Skeleton from '@material-ui/lab/Skeleton';
import logo from '../../assets/images/logosidebar_reducido.png'

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
        height: 350,
    },
    fixedHeightMedium: {
        height: 480,
    },
    heightFull: {
        height: '100%'
    },
    tabs: {
        borderBottom: '1px solid #365068',
        "& .MuiTab-wrapper": {
            textTransform: 'initial',
            textAlign: 'left',
            letterSpacing: '1px',
            lineHeight: '17px',
            flexDirection: 'row',
            fontSize: '11.5px',
            paddingRight: 0,
            paddingLeft: 0
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
    },
    title: {
        textAlign: 'center',
        fontWeight: 600,
        letterSpacing: '1px',
        color: '#323e4a'
    },
    titleTable: {
        fontWeight: 600,
        letterSpacing: '1px',
    },
    subTitleTable: {
        fontWeight: 600,
        letterSpacing: '1px',
        background: '#fafafa'
    },
    textTable: {
        letterSpacing: '1px',
        color: '#444a4f',
    },
}));


// Items que iran en el header.
export const ItemsHeader = (active, changeFilter) => {
    // const [tabActive, setTabActive] = useState('UENE');
    const [value, setValue] = useState(0);
    const classes = useStyles();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/comercial">
                    Comercial
                </Link>
                {/* <Typography color="textPrimary" className="txt-breadcrumb"> {active}</Typography> */}
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
                <Tab label="EMCALI" onClick={changeFilter('all')} icon={<img src={logo} style={{marginRight: '5px', marginBottom: 0, width: '35px'}} alt="all" />}/>
                <Tab label="UENE" onClick={changeFilter('energia')} icon={<img src={UENE} style={{marginRight: '5px', marginBottom: 0}} alt="energia" />}/>
                <Tab label="Acueducto" onClick={changeFilter('acueducto')}  icon={<img src={acueducto} style={{marginRight: '5px', marginBottom: 0}} alt="acueducto" />}/>
                <Tab label="Alcantarillado" onClick={changeFilter('alcantarillado')}  icon={<img src={alcantarillado} style={{marginRight: '5px', marginBottom: 0}} alt="alcantarillado" />}/>
                <Tab label="Telecomunicaciones" onClick={changeFilter('telecomunicaciones')} icon={<img src={telecomunicaciones} style={{marginRight: '5px', marginBottom: 0}} alt="telecomunicaciones" />} />
                <Tab label="Internet" onClick={changeFilter('internet')} icon={<img src={internet} style={{marginRight: '5px', marginBottom: 0}} alt="telecomunicaciones" />} />
                <Tab label="Televisión" onClick={changeFilter('television')} icon={<img src={tv} style={{marginRight: '5px', marginBottom: 0}} alt="telecomunicaciones" />} />
            </Tabs>
        </div>
    );
}

export default function Comercial() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const fixedHeightPaperMedium = clsx(classes.paper, classes.fixedHeightMedium);
    const [value, setValue] = useState(0);
    const [tabActive, setTabActive] = useState('UENE');
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'all'});
    const [dataAnioAnt1, setDataAnioAnt1] = useState([]);
    const [dataAnioAnt2, setDataAnioAnt2] = useState([]);
    const [dataAnioAct, setDataAnioAct] = useState([]);
    const [dataSUSAnioAnt1, setDataSUSAnioAnt1] = useState([]);
    const [dataSUSAnioAnt2, setDataSUSAnioAnt2] = useState([]);
    const [dataSUSAnioAct, setDataSUSAnioAct] = useState([]);
    const [dataFacturadoAnioAnt1, setDataFacturadoAnioAnt1] = useState([]);
    const [dataFacturadoAnioAnt2, setDataFacturadoAnioAnt2] = useState([]);
    const [dataFacturadoAnioAct, setDataFacturadoAnioAct] = useState([]);
    const [dataTableFacturacion, setDataTableFacturacion] = useState({
        facturacion_anio_ant : 0, 
        facturacion_anio_act : 0, 
        facturacion_var: 0,
        consumo_anio_ant : 0, 
        consumo_anio_act : 0, 
        consumo_var : 0,
        suscriptores_anio_ant : 0, 
        suscriptores_anio_act : 0, 
        suscriptores_var : 0,
        consumoMedio_anio_ant : 0, 
        consumoMedio_anio_act : 0, 
        consumoMedio_var : 0, 
        tarifaMedia_anio_ant : 0, 
        tarifaMedia_anio_act : 0, 
        tarifaMedia_var : 0, 
        ingSuscriptor_anio_ant : 0, 
        ingSuscriptor_anio_act : 0,
        ingSuscriptor_var : 0,
        precioMedio_anio_ant : 0, 
        precioMedio_anio_act : 0, 
        precioMedio_var : 0, 
    });
    const [loading, setLoading] = useState(true);

    // Hook de React.
    useEffect(() => {
        loadDataExcel();
    }, []);

    // Hace la petición de carga que trae la informacion del excel desde el backend.
    const loadDataExcel = () => {
        // Carga del excel.
        loadServerExcel(services.baseUrl + 'download-template/comercial', function (data, err) {
            setDataExcel(data.data);
            loadCharts(data.data);
        });
    }

    const loadCharts = (data, nombre_gerencia = filters.nombre_gerencia) => {

        var fechas = ['01/01/', '01/02/', '01/03/', '01/04/', '01/05/', '01/06/', '01/07/', '01/08/', '01/09/', '01/10/', '01/11/', '01/12/'];
        var producto = null;

        if (nombre_gerencia === 'telecomunicaciones') {
            producto = 'Linea Basica';
        }else if (nombre_gerencia === 'internet') {
            producto = 'Internet';
        }else if (nombre_gerencia === 'television') {
            producto = 'Television';
        }else{
            producto = null;
        }

        // Grafica #1.
        var data_2018 = [];
        var data_2019 = [];
        var data_2020 = [];
        var data_sus_2018 = [];
        var data_sus_2019 = [];
        var data_sus_2020 = [];

        fechas.forEach(fecha => {
            var value_data_2018 = filterConsumoTarifa(data, nombre_gerencia, fecha + 2018, producto, 'consumo');
            var value_data_2019 = filterConsumoTarifa(data, nombre_gerencia, fecha + 2019, producto, 'consumo');
            var value_data_2020 = filterConsumoTarifa(data, nombre_gerencia, fecha + 2020, producto, 'consumo');
            var value_data_sus_2018 = filterConsumoTarifa(data, nombre_gerencia, fecha + 2018, producto, 'suscriptores');
            var value_data_sus_2019 = filterConsumoTarifa(data, nombre_gerencia, fecha + 2019, producto, 'suscriptores');
            var value_data_sus_2020 = filterConsumoTarifa(data, nombre_gerencia, fecha + 2020, producto, 'suscriptores');
            data_2018.push(value_data_2018);
            data_2019.push(value_data_2019);
            data_2020.push(value_data_2020);
            data_sus_2018.push(value_data_sus_2018);
            data_sus_2019.push(value_data_sus_2019);
            data_sus_2020.push(value_data_sus_2020);
        });
        
        // Grafica #2.
        var data_facturado_2018 = [];
        var data_facturado_2019 = [];
        var data_facturado_2020 = [];

        fechas.forEach(fecha => {
            var value_data_facturado_2018 = filterConsumoTarifa(data, nombre_gerencia, fecha + 2018, producto, 'valor_facturado');
            var value_data_facturado_2019 = filterConsumoTarifa(data, nombre_gerencia, fecha + 2019, producto, 'valor_facturado');
            var value_data_facturado_2020 = filterConsumoTarifa(data, nombre_gerencia, fecha + 2020, producto, 'valor_facturado');
            data_facturado_2018.push(value_data_facturado_2018);
            data_facturado_2019.push(value_data_facturado_2019);
            data_facturado_2020.push(value_data_facturado_2020);
        });

        // Grafica 3 - Tabla.
        var data_table = {
            facturacion_anio_ant : 0, 
            facturacion_anio_act : 0, 
            facturacion_var : 0,
            consumo_anio_ant : 0, 
            consumo_anio_act : 0, 
            consumo_var: 0,
            suscriptores_anio_ant : 0, 
            suscriptores_anio_act : 0, 
            suscriptores_var : 0,
            consumoMedio_anio_ant : 0, 
            consumoMedio_anio_act : 0, 
            consumoMedio_var : 0, 
            tarifaMedia_anio_ant : 0, 
            tarifaMedia_anio_act : 0, 
            tarifaMedia_var : 0, 
            ingSuscriptor_anio_ant : 0, 
            ingSuscriptor_anio_act : 0, 
            ingSuscriptor_var : 0, 
            precioMedio_anio_ant : 0, 
            precioMedio_anio_act : 0, 
            precioMedio_var : 0, 
        };
        data_table.facturacion_anio_ant = filterConsumoAnio(data, nombre_gerencia, 2019, producto, 'valor_facturado', 8);
        data_table.facturacion_anio_act = filterConsumoAnio(data, nombre_gerencia, 2020, producto, 'valor_facturado', 8);
        data_table.facturacion_var = (Number(((parseFloat(data_table.facturacion_anio_act) / parseFloat(data_table.facturacion_anio_ant))-1)*100).toFixed(1));

        data_table.consumo_anio_ant = filterConsumoAnio(data, nombre_gerencia, 2019, producto, 'consumo', 8);
        data_table.consumo_anio_act = filterConsumoAnio(data, nombre_gerencia, 2020, producto, 'consumo', 8);
        data_table.consumo_var = (Number(((parseFloat(data_table.consumo_anio_act) / parseFloat(data_table.consumo_anio_ant))-1)*100).toFixed(1));

        data_table.suscriptores_anio_ant = filterConsumoAnio(data, nombre_gerencia, 2019, producto, 'suscriptores', 8);
        data_table.suscriptores_anio_act = filterConsumoAnio(data, nombre_gerencia, 2020, producto, 'suscriptores', 8);
        
        data_table.consumoMedio_anio_ant = filterConsumoAnioMedia(data, nombre_gerencia, 2019, producto, 'consumo_medio', 8);
        data_table.consumoMedio_anio_act = filterConsumoAnioMedia(data, nombre_gerencia, 2020, producto, 'consumo_medio', 8);
        
        data_table.tarifaMedia_anio_ant = filterConsumoAnioMedia(data, nombre_gerencia, 2019, producto, 'tarifa_media', 8);
        data_table.tarifaMedia_anio_act = filterConsumoAnioMedia(data, nombre_gerencia, 2020, producto, 'tarifa_media', 8);
        
        data_table.ingSuscriptor_anio_ant = filterConsumoAnioMedia(data, nombre_gerencia, 2019, producto, 'ing_suscriptor', 8);
        data_table.ingSuscriptor_anio_act = filterConsumoAnioMedia(data, nombre_gerencia, 2020, producto, 'ing_suscriptor', 8);
        
        data_table.precioMedio_anio_ant = filterConsumoAnioMedia(data, nombre_gerencia, 2019, producto, 'precio_medio', 8);
        data_table.precioMedio_anio_act = filterConsumoAnioMedia(data, nombre_gerencia, 2020, producto, 'precio_medio', 8);
        
        data_table.suscriptores_anio_ant = ((parseFloat(data_table.suscriptores_anio_ant) / 8) * 1000);
        data_table.suscriptores_anio_act = ((parseFloat(data_table.suscriptores_anio_act) / 8) * 1000);
        data_table.suscriptores_var = (Number(((parseFloat(data_table.suscriptores_anio_act) / parseFloat(data_table.suscriptores_anio_ant))-1)*100).toFixed(1));
        data_table.consumoMedio_anio_ant = (parseFloat((data_table.consumoMedio_anio_ant.split(',').join('.') / 8) * 1000));
        data_table.consumoMedio_anio_act = (parseFloat((data_table.consumoMedio_anio_act.split(',').join('.') / 8) * 1000));
        data_table.consumoMedio_var = (Number(((parseFloat(data_table.consumoMedio_anio_act) / parseFloat(data_table.consumoMedio_anio_ant))-1)*100).toFixed(1));
        data_table.tarifaMedia_anio_ant = (parseFloat((data_table.tarifaMedia_anio_ant.split(',').join('.') / 8) * 1000));
        data_table.tarifaMedia_anio_act = (parseFloat((data_table.tarifaMedia_anio_act.split(',').join('.') / 8) * 1000));
        data_table.tarifaMedia_var = (Number(((parseFloat(data_table.tarifaMedia_anio_act) / parseFloat(data_table.tarifaMedia_anio_ant))-1)*100).toFixed(1));
        data_table.ingSuscriptor_anio_ant = (parseFloat(data_table.ingSuscriptor_anio_ant.split(',').join('.')) / 8) * 1000;
        data_table.ingSuscriptor_anio_act = (parseFloat(data_table.ingSuscriptor_anio_act.split(',').join('.')) / 8) * 1000;
        data_table.ingSuscriptor_var = (Number(((parseFloat(data_table.ingSuscriptor_anio_act) / parseFloat(data_table.ingSuscriptor_anio_ant))-1)*100).toFixed(1));
        data_table.precioMedio_anio_ant = (parseFloat((data_table.precioMedio_anio_ant.split(',').join('.') / 8) * 1000));
        data_table.precioMedio_anio_act = (parseFloat((data_table.precioMedio_anio_act.split(',').join('.') / 8) * 1000));
        data_table.precioMedio_var = (Number(((parseFloat(data_table.precioMedio_anio_act) / parseFloat(data_table.precioMedio_anio_ant))-1)*100).toFixed(1));
        
        // Seteos.
        setDataAnioAnt1(data_2018);
        setDataAnioAnt2(data_2019);
        setDataAnioAct(data_2020);
        setDataSUSAnioAnt1(data_sus_2018);
        setDataSUSAnioAnt2(data_sus_2019);
        setDataSUSAnioAct(data_sus_2020);
        setDataFacturadoAnioAnt1(data_facturado_2018);
        setDataFacturadoAnioAnt2(data_facturado_2019);
        setDataFacturadoAnioAct(data_facturado_2020);
        setDataTableFacturacion(data_table);
        setLoading(false);

    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    
    // Cambiar los filtros en base a nombre gerencia.
    const changeFilterNomGerencia = (value)  => (event) => {
        setFilters({nombre_gerencia : value});
        // Inicializacion del loading.
        setLoading(true);
        loadCharts(dataExcel, value);
    }

    // Data graficas.
    // Grafica #1 - consumo y tarifas
    const genDataPrueba = () => ({
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
          {
            type: 'line',
            label: '% EA 2019',
            yAxisID: 'B',
            borderColor: '#9BBB59',
            borderWidth: 2,
            fill: false,
            // data: dataTableFacturacion.tarifaMedia_anio_act,
          },
        //   {
        //     type: 'line',
        //     label: '% EA 2020',
        //     yAxisID: 'B',
        //     borderColor: '#866BA6',
        //     borderWidth: 2,
        //     fill: false,
        //     // data: EA_Act,
        //   },
          {
            type: 'bar',
            label: 'Rendimiento 2018',
            yAxisID: 'A',
            backgroundColor: '#3771B7',
            data: dataAnioAnt1,
            borderColor: 'white',
            borderWidth: 2,
          },
          {
            type: 'bar',
            label: 'Rendimiento 2019',
            yAxisID: 'A',
            backgroundColor: '#AE3330',
            data: dataAnioAnt2,
          },
          {
            type: 'bar',
            label: 'Rendimiento 2020',
            yAxisID: 'A',
            backgroundColor: '#AE3330',
            data: dataAnioAct,
          },
        ],
    });
    const optionsPrueba = {
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

    const dataConsumoTarifas = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: '2018',
            data: dataAnioAnt1,
            backgroundColor: '#3670B6',
          },
          {
            label: '2019',
            data: dataAnioAnt2,
            backgroundColor: '#FFFF00',
          },
          {
            label: '2020',
            data: dataAnioAct,
            backgroundColor: '#8EB341',
          },
        ],
    }

    const dataSUSTarifas = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: '2018',
            data: dataSUSAnioAnt1,
            backgroundColor: '#3670B6',
          },
          {
            label: '2019',
            data: dataSUSAnioAnt2,
            backgroundColor: '#FFFF00',
          },
          {
            label: '2020',
            data: dataSUSAnioAct,
            backgroundColor: '#8EB341',
          },
        ],
    }

    // Grafica 2
    const dataFacturado = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: '2018',
            data: dataFacturadoAnioAnt1,
            fill: false,
            backgroundColor: '#4F81BD',
            borderColor: '#4F81BD',
            yAxisID: 'y-axis-1',
            lineTension: 0
          },
          {
            label: '2019',
            data: dataFacturadoAnioAnt2,
            fill: false,
            backgroundColor: '#C0504D',
            borderColor: '#C0504D',
            yAxisID: 'y-axis-2',
            lineTension: 0
          },
          {
            label: '2020',
            data: dataFacturadoAnioAct,
            fill: false,
            backgroundColor: '#9BBB59',
            borderColor: '#9BBB59',
            yAxisID: 'y-axis-2',
            lineTension: 0
          },
        ],
    }   

    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            <div className={classes.root}>
                <Header active={'comercial'} itemsHeader={() => ItemsHeader(tabActive, changeFilterNomGerencia)}/>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>

                            {/* Tabs */}
                            {/* <Grid item xs={12} md={12} lg={12}>
                                <Paper square>
                                    <Tabs
                                        value={value}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        onChange={handleChange}
                                        aria-label="Tabs"
                                        variant="fullWidth"
                                        className={classes.tabs}
                                    >
                                        <Tab label="UENE" onClick={() => {setTabActive('UENE')}} icon={<img src={UENE} style={{marginRight: '5px'}} alt="energia" />}/>
                                        <Tab label="Acueducto" onClick={() => {setTabActive('Acueducto')}} icon={<img src={acueducto} style={{marginRight: '5px'}} alt="energia" />}/>
                                        <Tab label="Alcantarillado" onClick={() => {setTabActive('Alcantarillado')}} icon={<img src={alcantarillado} style={{marginRight: '5px'}} alt="energia" />}/>
                                        <Tab label="Telecomunicaciones línea básica" onClick={() => {setTabActive('Telecomunicaciones')}} icon={<img src={telecomunicaciones} style={{marginRight: '5px'}} alt="energia" />} />
                                        <Tab label="Internet" onClick={() => {setTabActive('Internet')}} icon={<img src={internet} style={{marginRight: '5px'}} alt="energia" />}/>
                                        <Tab label="Televisión" onClick={() => {setTabActive('Televisión')}} icon={<img src={tv} style={{marginRight: '5px'}} alt="energia" />}/>
                                    </Tabs>
                                </Paper>
                            </Grid> */}

                            {/* Charts */}
                            <Grid item xs={12} md={12} lg={12}>
                                <Paper className={fixedHeightPaper}>
                                    {(loading) ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={290} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                    :
                                        <div style={{textAlign: 'center', paddingBottom: '10px'}}>
                                            {
                                            (filters.nombre_gerencia === 'all') 
                                            ?
                                                <div>EMCALI</div>
                                            : 
                                            (filters.nombre_gerencia === 'energia')
                                            ?
                                                <div>Consume y Tarifa Energía</div>
                                            :
                                            (filters.nombre_gerencia === 'acueducto')
                                            ?
                                                <div>Consume y Tarifa Acueducto</div>
                                            :
                                            (filters.nombre_gerencia === 'alcantarillado')
                                            ?
                                                <div>Consume y Tarifa Alcantarillado</div>
                                            :
                                            (filters.nombre_gerencia === 'telecomunicaciones')
                                            ?
                                                <div>Suscritores y Precio Línea Básica</div>
                                            :
                                            (filters.nombre_gerencia === 'internet')
                                            ?
                                                <div>Suscritores y Precio Internet</div>
                                            :
                                            (filters.nombre_gerencia === 'television')
                                            ?
                                                <div>Suscritores y Precio Televisión</div>
                                            :
                                                <div>Sin título</div>
                                            }
                                            {
                                                (filters.nombre_gerencia === 'all' || filters.nombre_gerencia === 'energia' || filters.nombre_gerencia === 'acueducto' || filters.nombre_gerencia === 'alcantarillado')
                                                ?
                                                <Bar data={dataConsumoTarifas} options={optionsGroupBar} height={50}/>
                                                :
                                                <Bar data={dataSUSTarifas} options={optionsGroupBar} height={50}/>
                                            }
                                            {/* <Bar data={genDataPrueba} options={optionsPrueba} height={50}/> */}
                                        </div>
                                    }
                                </Paper>
                            </Grid>

                            {/* Charts */}
                            <Grid item xs={12} md={7} lg={7}>
                                <Paper className={fixedHeightPaperMedium}>
                                        <div style={{textAlign: 'center', paddingBottom: '10px'}}>
                                            {
                                                (filters.nombre_gerencia === 'all') 
                                                ?
                                                    <div>EMCALI</div>
                                                : 
                                                (filters.nombre_gerencia === 'energia')
                                                ?
                                                    <div>Facturación Acumulada Energía</div>
                                                :
                                                (filters.nombre_gerencia === 'acueducto')
                                                ?
                                                    <div>Facturación Acumulada Acueducto</div>
                                                :
                                                (filters.nombre_gerencia === 'alcantarillado')
                                                ?
                                                    <div>Facturación Acumulada Alcantarillado</div>
                                                :
                                                (filters.nombre_gerencia === 'telecomunicaciones')
                                                ?
                                                    <div>Facturación Acumulada Línea Básica</div>
                                                :
                                                (filters.nombre_gerencia === 'internet')
                                                ?
                                                    <div>Facturación Acumulada Internet</div>
                                                :
                                                (filters.nombre_gerencia === 'television')
                                                ?
                                                    <div>Facturación Acumulada TV</div>
                                                :
                                                    <div>Sin título</div>
                                            }
                                        </div>
                                    {(loading) ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={295} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                    :                                        
                                        <Line data={dataFacturado} height={100} options={optionsInforGeneral} height={90}/>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={5} lg={5}>
                                <Paper className={fixedHeightPaperMedium}>
                                {(loading) ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={310} />
                                        </div>
                                    :
                                    <TableContainer>
                                        <Table className={classes.table} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.titleTable}>
                                                    {
                                                        (filters.nombre_gerencia === 'all') 
                                                        ?
                                                            <div>EMCALI</div>
                                                        : 
                                                        (filters.nombre_gerencia === 'energia')
                                                        ?
                                                            <div>Energía</div>
                                                        :
                                                        (filters.nombre_gerencia === 'acueducto')
                                                        ?
                                                            <div>Acueducto</div>
                                                        :
                                                        (filters.nombre_gerencia === 'alcantarillado')
                                                        ?
                                                            <div>Alcantarillado</div>
                                                        :
                                                        (filters.nombre_gerencia === 'telecomunicaciones')
                                                        ?
                                                            <div>Telco - Línea Básica</div>
                                                        :
                                                        (filters.nombre_gerencia === 'internet')
                                                        ?
                                                            <div>Telco - Internet</div>
                                                        :
                                                        (filters.nombre_gerencia === 'television')
                                                        ?
                                                            <div>Telco - Televisión</div>
                                                        :
                                                            <div>Sin título</div>
                                                    }
                                                    </TableCell>
                                                    <TableCell align="left" className={classes.titleTable}>2019</TableCell>
                                                    <TableCell align="left" className={classes.titleTable}>2020</TableCell>
                                                    <TableCell align="left" className={classes.titleTable}>% Var</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {/* Subtitulo table. */}
                                                <TableRow>
                                                    <TableCell align="left" className={classes.textTable}>Facturación ($MM)</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.facturacion_anio_ant}</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.facturacion_anio_act}</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.facturacion_var}%</TableCell>
                                                </TableRow>

                                                {
                                                    (filters.nombre_gerencia === 'all') ?
                                                        <TableRow>
                                                            <TableCell align="left" className={classes.textTable}>Consumo</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumo_anio_ant}</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumo_anio_act}</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumo_var}%</TableCell>
                                                        </TableRow>
                                                    :
                                                    (filters.nombre_gerencia === 'energia') ?
                                                        <TableRow>
                                                            <TableCell align="left" className={classes.textTable}>Consumo (kWh)</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumo_anio_ant}</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumo_anio_act}</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumo_var}%</TableCell>
                                                        </TableRow>
                                                    :
                                                    (filters.nombre_gerencia === 'acueducto' || filters.nombre_gerencia === 'alcantarillado') &&
                                                        <TableRow>
                                                            <TableCell align="left" className={classes.textTable}>Consumo (m3)</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumo_anio_ant}</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumo_anio_act}</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumo_var}%</TableCell>
                                                        </TableRow>
                                                }
                                                {
                                                    (filters.nombre_gerencia === 'all') ?
                                                        <TableRow>
                                                            <TableCell align="left" className={classes.textTable}>Tarifa Media</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.tarifaMedia_anio_ant}</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.tarifaMedia_anio_act}</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.tarifaMedia_var}%</TableCell>
                                                        </TableRow>
                                                    :
                                                    (filters.nombre_gerencia === 'energia') ?
                                                        <TableRow>
                                                            <TableCell align="left" className={classes.textTable}>Tarifa Media ($/kWh)</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.tarifaMedia_anio_ant}</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.tarifaMedia_anio_act}</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.tarifaMedia_var}%</TableCell>
                                                        </TableRow>
                                                    :
                                                    (filters.nombre_gerencia === 'acueducto' || filters.nombre_gerencia === 'alcantarillado') &&
                                                        <TableRow>
                                                            <TableCell align="left" className={classes.textTable}>Tarifa Media ($/m3)</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.tarifaMedia_anio_ant}</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.tarifaMedia_anio_act}</TableCell>
                                                            <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.tarifaMedia_var}%</TableCell>
                                                        </TableRow>
                                                }
                                                <TableRow>
                                                    <TableCell align="left" className={classes.textTable}>Suscriptores</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.suscriptores_anio_ant}</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.suscriptores_anio_act}</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.suscriptores_var}%</TableCell>
                                                </TableRow>
                                                {
                                                    (filters.nombre_gerencia === 'all' || filters.nombre_gerencia === 'energia' || filters.nombre_gerencia === 'acueducto' || filters.nombre_gerencia === 'alcantarillado') &&
                                                    <TableRow>
                                                        <TableCell align="left" className={classes.textTable}>Consumo Unitario</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumoMedio_anio_ant}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumoMedio_anio_act}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumoMedio_var}%</TableCell>
                                                    </TableRow>
                                                }
                                                {
                                                    (filters.nombre_gerencia === 'all' || filters.nombre_gerencia === 'energia' || filters.nombre_gerencia === 'acueducto' || filters.nombre_gerencia === 'alcantarillado') &&
                                                    <TableRow>
                                                        <TableCell align="left" className={classes.textTable}>Ingreso por Suscriptor</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.ingSuscriptor_anio_ant}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.ingSuscriptor_anio_act}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.ingSuscriptor_var}%</TableCell>
                                                    </TableRow>
                                                }   
                                                {
                                                    (filters.nombre_gerencia === 'telecomunicaciones' || filters.nombre_gerencia === 'internet' || filters.nombre_gerencia === 'television') &&
                                                    <TableRow>
                                                        <TableCell align="left" className={classes.textTable}>Precio Medio</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.precioMedio_anio_ant}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.precioMedio_anio_act}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.precioMedio_var}%</TableCell>
                                                    </TableRow>
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                }
                                </Paper>
                            </Grid>

                        </Grid>
                    </Container>
                </main>
            </div>
    )
}