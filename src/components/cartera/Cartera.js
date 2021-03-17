import React, {useState, useEffect} from "react";
import {Breadcrumbs, Typography, makeStyles, Container, Grid, Paper, Tabs, Tab, Select, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import services from '../../services';
import {loadServerExcel} from '../../services';
import Skeleton from '@material-ui/lab/Skeleton';
import {filterColumnMes, optionsInforGeneral, filterEstrato, optionsGroupBar, optionsGroupBarHorizontal, filterSegmento, filterEdadCartera} from '../../services/cartera';
import Header from '../menu/Header';
import { Line, HorizontalBar, Bar }  from 'react-chartjs-2';
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
        justifyContent: 'space-around',
    },
    fixedHeight: {
        height: 350,
    },
    fixedHeightVH: {
        height: 450,
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
    title: {
        fontSize: '15px',
        letterSpacing: '1px'
    },
    tabs: {
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
    }
}));

// Items que iran en el header.
export const ItemsHeader = (changeFilter, changeSelectA, mesesA, changeSelectB, mesesB) => {

    const [tabActive, setTabActive] = useState('UENE');
    const [value, setValue] = useState(0);
    const classes = useStyles();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                <Tab label="EMCALI" onClick={changeFilter('all')} icon={<img src={logo} style={{marginRight: '5px', marginBottom: 0, width: '35px'}} alt="energia" />}/>
                <Tab label="Energia" onClick={changeFilter('energia')} icon={<img src={UENE} style={{marginRight: '5px', marginBottom: 0}} alt="energia" />}/>
                <Tab label="Acueducto" onClick={changeFilter('acueducto')}  icon={<img src={acueducto} style={{marginRight: '5px', marginBottom: 0}} alt="acueducto" />}/>
                <Tab label="Alcantarillado" onClick={changeFilter('alcantarillado')}  icon={<img src={alcantarillado} style={{marginRight: '5px', marginBottom: 0}} alt="alcantarillado" />}/>
                <Tab label="Telecomunicaciones" onClick={changeFilter('telecomunicaciones')} icon={<img src={telecomunicaciones} style={{marginRight: '5px', marginBottom: 0}} alt="telecomunicaciones" />} />
            </Tabs>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography component="h6" variant="h6" color="inherit" noWrap style={{fontSize: '15px',letterSpacing: '1px',paddingRight:'10px'}}>
                            Cifras en Millones COP |
                </Typography> 
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={mesesA}
                    onChange={changeSelectA}
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
                </Select>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={mesesB}
                    onChange={changeSelectB}
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

export default function Cartera() {

    // Estilos.
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const fixedHeightPaperVH = clsx(classes.paper, classes.fixedHeightVH);
    const [mesesA, setAgeA] = useState('Enero');
    const [mesesB, setAgeB] = useState('Enero');

    const changeSelectA = (event) => {
      setAgeA(event.target.value);
      loadCharts(dataExcel, filters.nombre_gerencia, event.target.value);
    };
    const changeSelectB = (event) => {
      setAgeB(event.target.value);
      loadCharts(dataExcel, filters.nombre_gerencia, event.target.value);
    };
    // Estados
    const [dataExcel, setDataExcel] = useState([]);
    const [filters, setFilters] = useState({nombre_gerencia : 'all'});
    const [facturacionInfoGen, setFacturacionInfoGen] = useState([]);
    const [saldoCarteraInfoGen, setSaldoCarteraInfoGen] = useState([]);
    const [recaudoInfoGen, setRecaudoInfoGen] = useState([]);
    const [estratoMesAnt, setEstratoMesAnt] = useState([]);
    const [estratoMesAct, setEstratoMesAct] = useState([]);
    const [estratoMesAct2, setEstratoMesAct2] = useState([]);
    const [segmentoAcueducto, setSegmentoAcueducto] = useState([]);
    const [segmentoAlcantarillado, setSegmentoAlcantarillado] = useState([]);
    const [segmentoEnergia, setSegmentoEnergia] = useState([]);
    const [segmentoTelco, setSegmentoTelco] = useState([]);
    const [carteraAcueducto, setCarteraAcueducto] = useState([]);
    const [carteraAlcantarillado, setCarteraAlcantarillado] = useState([]);
    const [carteraEnergia, setCarteraEnergia] = useState([]);
    const [carteraTelco, setCarteraTelco] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hook de React.
    useEffect(() => {
        loadDataExcel();
    }, []);
    
    // Hace la petición de carga que trae la informacion del excel desde el backend.
    const loadDataExcel = () => {
        // Carga del excel.
        loadServerExcel(services.baseUrl + 'download-template/cartera', function (data, err) {
            setDataExcel(data.data);
            loadCharts(data.data);
        });
    }

    // Carga de las estadisticas.
    const loadCharts = (data, nombre_gerencia = filters.nombre_gerencia, mes_dataA = mesesA, mes_dataB = mesesB) => {

        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        var estadosResidenciales = ['ESTRATO 1', 'ESTRATO 2', 'ESTRATO 3', 'ESTRATO 4', 'ESTRATO 5', 'ESTRATO 6', 'SUBNORMAL'];
        var estadosSegmento = ['PROVISIONAL', 'ALUMBRADO PUBLICO', 'ESPECIAL', 'INDUSTRIAL', 'PUBLICO', 'COMERCIAL', 'RESIDENCIAL'];
        var edadCartera = ['30 dias', '60-120 dias', '121-360 dias', '361-1800', 'mayores A 1800'];
        
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

        // Grafica #2 - Estratos.
        var sep_anio_ant = [];
        var ago_anio_act = [];
        var sep_anio_act = [];

        estadosResidenciales.forEach( estado => {
            sep_anio_ant.push(filterEstrato(data, nombre_gerencia, estado, 2019, mes_dataA, 'valor_estrato'));
            ago_anio_act.push(filterEstrato(data, nombre_gerencia, estado, 2020, mes_dataB, 'valor_estrato'));
            sep_anio_act.push(filterEstrato(data, nombre_gerencia, estado, 2020, mes_dataA, 'valor_estrato'));
            console.log(sep_anio_ant);
        });

        // Grafica #3 - Segmentos
        var acueducto = [];
        var alcantarillado = [];
        var energia = [];
        var telecomunicaciones = [];
        
        estadosSegmento.forEach(segmento => {
            acueducto.push(filterSegmento(data, 'ACUEDUCTO', segmento, mes_dataA, 'valor_segmento'));
            alcantarillado.push(filterSegmento(data, 'ALCANTARILLADO', segmento, mes_dataA, 'valor_segmento'));
            energia.push(filterSegmento(data, 'ENERGIA', segmento, mes_dataA, 'valor_segmento'));
            telecomunicaciones.push(filterSegmento(data, 'TELECOMUNICACIONES', segmento, mes_dataA, 'valor_segmento'));
        })

        // Grafica #4 - Cartera
        var acueductoCart = [];
        var alcantarilladoCart = [];
        var energiaCart = [];
        var telecomunicacionesCart = [];
        
        edadCartera.forEach(cartera => {
            acueductoCart.push(filterEdadCartera(data, 'ACUEDUCTO', cartera, mes_dataA, 'valor_cartera'));
            alcantarilladoCart.push(filterEdadCartera(data, 'ALCANTARILLADO', cartera, mes_dataA, 'valor_cartera'));
            energiaCart.push(filterEdadCartera(data, 'ENERGIA', cartera, mes_dataA, 'valor_cartera'));
            telecomunicacionesCart.push(filterEdadCartera(data, 'TELECOMUNICACIONES', cartera, mes_dataA, 'valor_cartera'));
        })

        // Cambiar estados. 
        // Grafica #1
        setFacturacionInfoGen(facturacion_mes);
        setSaldoCarteraInfoGen(saldo_cartera);
        setRecaudoInfoGen(recaudo);

        // Grafica #2
        setEstratoMesAnt(sep_anio_ant);
        setEstratoMesAct(ago_anio_act);
        setEstratoMesAct2(sep_anio_act);

        // Grafica #2
        setEstratoMesAnt(sep_anio_ant);
        setEstratoMesAct(ago_anio_act);
        setEstratoMesAct2(sep_anio_act);

        // Grafica #3
        setSegmentoAcueducto(acueducto);
        setSegmentoAlcantarillado(alcantarillado);
        setSegmentoEnergia(energia);
        setSegmentoTelco(telecomunicaciones);
        
        // Grafica #4
        setCarteraAcueducto(acueductoCart);
        setCarteraAlcantarillado(alcantarilladoCart);
        setCarteraEnergia(energiaCart);
        setCarteraTelco(telecomunicacionesCart);

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
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
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
       
    // Grafica #2 - Estratos
    const dataEstratos = {
        labels: ['ESTRATO 1', 'ESTRATO 2', 'ESTRATO 3', 'ESTRATO 4', 'ESTRATO 5', 'ESTRATO 6', 'SUBNORMAL'],
        datasets: [
            {
                label: mesesA+' 2019',
                data: estratoMesAnt,
                backgroundColor: '#FF0000',
            },
            {
                label: mesesB+' 2020',
                data: estratoMesAct,
                backgroundColor: '#002060',
            },
            {
                label: mesesA+' 2020',
                data: estratoMesAct2,
                backgroundColor: '#FFFF00',
            },
        ],
    }
       
    // Grafica #3 - Segmentos
    const dataSegmentos = {
        labels: ['PROVISIONAL', 'ALUMBRADO PUBLICO', 'ESPECIAL', 'INDUSTRIAL', 'PUBLICO', 'COMERCIAL', 'RESIDENCIAL'],
        datasets: [
          {
            label: 'Acueducto',
            data: segmentoAcueducto,
            backgroundColor: '#3B7CCA',
          },
          {
            label: 'Alcantarillado',
            data: segmentoAlcantarillado,
            backgroundColor: '#CD3B38',
          },
          {
            label: 'Energia',
            data: segmentoEnergia,
            backgroundColor: '#9CC646',
          },
          {
            label: 'Telco',
            data: segmentoTelco,
            backgroundColor: '#7B57A8',
          },
        ],
    }
       
    // Grafica #4 - cartera
    const dataCartera = {
        labels: ['30 dias', '60-120 dias', '121-360 dias', '361-1800', 'mayores A 1800'],
        datasets: [
          {
            label: 'Acueducto',
            data: carteraAcueducto,
            backgroundColor: '#3B7CCA',
          },
          {
            label: 'Alcantarillado',
            data: carteraAlcantarillado,
            backgroundColor: '#CD3B38',
          },
          {
            label: 'Energia',
            data: carteraEnergia,
            backgroundColor: '#9CC646',
          },
          {
            label: 'Telco',
            data: carteraTelco,
            backgroundColor: '#7B57A8',
          },
        ],
    }

    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            <div className={classes.root}>
                <Header active={'cartera'} itemsHeader={() => ItemsHeader(changeFilterNomGerencia, changeSelectA, mesesA, changeSelectB, mesesB)} />
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
                                            <Line data={data} options={optionsInforGeneral} height={50}/>
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
                            <Grid item xs={12} md={12} lg={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Paper className={fixedHeightPaperVH}>
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
                                                    <Bar data={dataSegmentos} options={optionsGroupBar} height={150}/>
                                                    <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#3B7CCA'}}></span>
                                                            <p>Acueducto</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#CD3B38'}}></span>
                                                            <p>Alcantarillado</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#9CC646'}}></span>
                                                            <p>Energia</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#7B57A8'}}></span>
                                                            <p>Telco</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Paper className={fixedHeightPaperVH}>
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
                                                    <Bar data={dataCartera} options={optionsGroupBar} height={150}/>
                                                    <div className="containerLabelsCharts" style={{marginTop: 10}}>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#3B7CCA'}}></span>
                                                            <p>Acueducto</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#CD3B38'}}></span>
                                                            <p>Alcantarillado</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#9CC646'}}></span>
                                                            <p>Energia</p>
                                                        </div>
                                                        <div className="itemChart">
                                                            <span className="iconList" style={{background: '#7B57A8'}}></span>
                                                            <p>Telco</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <Paper className={fixedHeightPaperVH}>
                                    {(loading) ? 
                                        <div style={{padding: '10px'}}>
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Skeleton variant="text" width={'40%'}/>
                                                <Skeleton variant="text" width={'40%'}/>
                                            </div>
                                            <Skeleton variant="rect" width={'100%'} height={100} style={{marginBottom: '10px'}} />
                                            <Skeleton variant="rect" width={'100%'} height={100} style={{marginBottom: '10px'}} />
                                            <Skeleton variant="rect" width={'100%'} height={100} style={{marginBottom: '10px'}} />
                                            <Skeleton variant="rect" width={'100%'} height={100} style={{marginBottom: '10px'}} />
                                            <Skeleton variant="rect" width={'100%'} height={100} style={{marginBottom: '10px'}} />
                                            <Skeleton variant="rect" width={'100%'} height={100} style={{marginBottom: '10px'}} />
                                            <Skeleton variant="rect" width={'100%'} height={100} style={{marginBottom: '10px'}} />
                                        </div>
                                        :
                                        <div>
                                            <Bar data={dataEstratos} options={optionsGroupBarHorizontal} height={60} />
                                            <div className="containerLabelsCharts" style={{marginTop: 10}}>
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