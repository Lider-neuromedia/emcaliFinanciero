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
import {filterConsumoTarifa, filterConsumoAnio, optionsGroupBar, optionsInforGeneral} from '../../services/comercial';
import { Bar, Line } from 'react-chartjs-2';
import Skeleton from '@material-ui/lab/Skeleton';

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
        height: 280,
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
    const [tabActive, setTabActive] = useState('UENE');
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
                <Typography color="textPrimary" className="txt-breadcrumb"> {active}</Typography>
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
    const [value, setValue] = useState(0);
    const [tabActive, setTabActive] = useState('UENE');
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'all'});
    const [dataAnioAnt1, setDataAnioAnt1] = useState([]);
    const [dataAnioAnt2, setDataAnioAnt2] = useState([]);
    const [dataAnioAct, setDataAnioAct] = useState([]);
    const [dataFacturadoAnioAnt1, setDataFacturadoAnioAnt1] = useState([]);
    const [dataFacturadoAnioAnt2, setDataFacturadoAnioAnt2] = useState([]);
    const [dataFacturadoAnioAct, setDataFacturadoAnioAct] = useState([]);
    const [dataTableFacturacion, setDataTableFacturacion] = useState({
        facturacion_anio_ant : 0, 
        facturacion_anio_act : 0, 
        consumo_anio_ant : 0, 
        consumo_anio_act : 0, 
        suscriptores_anio_ant : 0, 
        suscriptores_anio_act : 0, 
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
            producto = 'internet';
        }else if (nombre_gerencia === 'television') {
            producto = 'Television';
        }else{
            producto = null;
        }

        // Grafica #1.
        var data_2018 = [];
        var data_2019 = [];
        var data_2020 = [];

        fechas.forEach(fecha => {
            var value_data_2018 = filterConsumoTarifa(data, nombre_gerencia, fecha + 2018, producto, 'consumo');
            var value_data_2019 = filterConsumoTarifa(data, nombre_gerencia, fecha + 2019, producto, 'consumo');
            var value_data_2020 = filterConsumoTarifa(data, nombre_gerencia, fecha + 2020, producto, 'consumo');
            data_2018.push(value_data_2018);
            data_2019.push(value_data_2019);
            data_2020.push(value_data_2020);
        });
        
        // Grafica #1.
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
            consumo_anio_ant : 0, 
            consumo_anio_act : 0, 
            suscriptores_anio_ant : 0, 
            suscriptores_anio_act : 0, 
        };
        data_table.facturacion_anio_ant = filterConsumoAnio(data, nombre_gerencia, 2019, producto, 'valor_facturado', 8);
        data_table.facturacion_anio_act = filterConsumoAnio(data, nombre_gerencia, 2020, producto, 'valor_facturado', 8);
        data_table.consumo_anio_ant = filterConsumoAnio(data, nombre_gerencia, 2019, producto, 'consumo', 8);
        data_table.consumo_anio_act = filterConsumoAnio(data, nombre_gerencia, 2020, producto, 'consumo', 8);
        data_table.suscriptores_anio_ant = filterConsumoAnio(data, nombre_gerencia, 2019, producto, 'suscriptores', 8);
        data_table.suscriptores_anio_act = filterConsumoAnio(data, nombre_gerencia, 2020, producto, 'suscriptores', 8);
        

        // Seteos.
        setDataAnioAnt1(data_2018);
        setDataAnioAnt2(data_2019);
        setDataAnioAct(data_2020);
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

    // Grafica 2
    const dataFacturado = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: '2018',
            data: dataFacturadoAnioAnt1,
            fill: false,
            backgroundColor: '#507FF2',
            borderColor: '#507FF2',
            yAxisID: 'y-axis-1',
          },
          {
            label: '2019',
            data: dataFacturadoAnioAnt2,
            fill: false,
            backgroundColor: '#FFB12E',
            borderColor: '#FFB12E',
            yAxisID: 'y-axis-2',
          },
          {
            label: '2020',
            data: dataFacturadoAnioAct,
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
                                            <Skeleton variant="rect" width={'100%'} height={200} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                    :
                                        <div>
                                            <Bar data={dataConsumoTarifas} height={60} options={optionsGroupBar} />
                                        </div>
                                    }
                                </Paper>
                            </Grid>

                            {/* Charts */}
                            <Grid item xs={12} md={7} lg={7}>
                                <Paper className={fixedHeightPaper}>
                                    {(loading) ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={200} />
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                        </div>
                                    :
                                        <Line data={dataFacturado} height={100} options={optionsInforGeneral} height={100}/>
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={5} lg={5}>
                                <Paper className={fixedHeightPaper}>
                                {(loading) ? 
                                        <div>
                                            <Skeleton variant="rect" width={'100%'} height={230} />
                                        </div>
                                    :
                                    <TableContainer>
                                        <Table className={classes.table} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.titleTable}>Energia</TableCell>
                                                    <TableCell align="left" className={classes.titleTable}>2019</TableCell>
                                                    <TableCell align="left" className={classes.titleTable}>2020</TableCell>
                                                    <TableCell align="left" className={classes.titleTable}>% Var</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {/* Subtitulo table. */}
                                                <TableRow>
                                                    <TableCell align="left" className={classes.textTable}>Facturación</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.facturacion_anio_ant}</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.facturacion_anio_act}</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>2.5%</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.textTable}>Consumo</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumo_anio_ant}</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.consumo_anio_act}</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>2.5%</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.textTable}>Tarifa media</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>0</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>0</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>2.5%</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" className={classes.textTable}>Suscripciones</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.suscriptores_anio_ant}</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>{dataTableFacturacion.suscriptores_anio_act}</TableCell>
                                                    <TableCell align="left" className={classes.textTable}>2.5%</TableCell>
                                                </TableRow>
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