import React, {useState} from "react";
import {Breadcrumbs, Typography, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import Header from '../menu/Header';
// Imagenes.
import ejecucionPres from '../../assets/images/icons/actualizacion/ejecución_presupuestal.png';
import ejecucionPresWhite from '../../assets/images/icons/actualizacion/ejecución_presupuestal_white.png';
import pyg from '../../assets/images/icons/actualizacion/pyg.png';
import pygWhite from '../../assets/images/icons/actualizacion/pyg_white.png';
import gestion from '../../assets/images/icons/actualizacion/gestion.png';
import gestionWhite from '../../assets/images/icons/actualizacion/gestion_white.png';
import cartera from '../../assets/images/icons/actualizacion/cartera.png';
import carteraWhite from '../../assets/images/icons/actualizacion/cartera_white.png';
import comercial from '../../assets/images/icons/actualizacion/comercial.png';
import comercialWhite from '../../assets/images/icons/actualizacion/comercial_white.png';
import { Link } from 'react-router-dom';


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
        height: 180,
        cursor: 'pointer',
        color: '#375167',
        '&:hover': {
            background: "#d91415",
            color: "#fff"
        },
    },
    heightFull: {
        height: '100%'
    },
    titleConfig: {
        fontSize: '18px',
        letterSpacing: '0.97px',
        lineHeight: '19px',
        textAlign: 'left',
        fontWeight: 600
    },
    containerConfig: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%'
    },
    imgConfig: {
        width: 'min-content',
        marginTop: '20px'
    }
}));

// Items que iran en el header.
export const itemsHeader = () => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/configuracion">
                    Configuración
                </Link>
                <Typography color="textPrimary" className="txt-breadcrumb">Actualización</Typography>
            </Breadcrumbs>
        </div>
    );
}

export default function Actualizar(){
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [isHover, setisHover] = useState('');

    return (
        <div className={classes.root}>
            <Header itemsHeader={itemsHeader}/>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        {/* Ejecucion presupuestal */}
                        <Grid item xs={12} md={2} lg={2}>
                            <Link to="/usuarios">
                                <Paper className={fixedHeightPaper} onMouseEnter={() => setisHover('ejecucion_pre')} onMouseLeave={() => setisHover('')}>
                                    <div className={classes.containerConfig}>
                                        {isHover === 'ejecucion_pre' ?
                                            <img src={ejecucionPresWhite} className={classes.imgConfig} alt="Ejecucion presupuestal"/>
                                        : 
                                            <img src={ejecucionPres} className={classes.imgConfig} alt="Ejecucion presupuestal"/>
                                        }
                                        <p className={classes.titleConfig}>
                                            Ejecución presupuestal
                                        </p>
                                    </div>
                                </Paper>
                            </Link>                            
                        </Grid>
                        {/* Pyg */}
                        <Grid item xs={12} md={2} lg={2}>
                            <Link to="/usuarios">
                                <Paper className={fixedHeightPaper} onMouseEnter={() => setisHover('pyg')} onMouseLeave={() => setisHover('')}>
                                    <div className={classes.containerConfig}>
                                        {isHover === 'pyg' ?
                                            <img src={pygWhite} className={classes.imgConfig} alt="Pyg"/>
                                        : 
                                            <img src={pyg} className={classes.imgConfig} alt="Pyg"/>
                                        }
                                        <p className={classes.titleConfig}>
                                            Pyg
                                        </p>
                                    </div>
                                </Paper>
                            </Link>                            
                        </Grid>
                        {/* Gestion */}
                        <Grid item xs={12} md={2} lg={2}>
                            <Link to="/usuarios">
                                <Paper className={fixedHeightPaper} onMouseEnter={() => setisHover('gestion')} onMouseLeave={() => setisHover('')}>
                                    <div className={classes.containerConfig}>
                                        {isHover === 'gestion' ?
                                            <img src={gestionWhite} className={classes.imgConfig} alt="Gestion"/>
                                        : 
                                            <img src={gestion} className={classes.imgConfig} alt="Gestion"/>
                                        }
                                        <p className={classes.titleConfig}>
                                            Gestión
                                        </p>
                                    </div>
                                </Paper>
                            </Link>                            
                        </Grid>
                        {/* Cartera */}
                        <Grid item xs={12} md={2} lg={2}>
                            <Link to="/usuarios">
                                <Paper className={fixedHeightPaper} onMouseEnter={() => setisHover('cartera')} onMouseLeave={() => setisHover('')}>
                                    <div className={classes.containerConfig}>
                                        {isHover === 'cartera' ?
                                            <img src={carteraWhite} className={classes.imgConfig} alt="Cartera"/>
                                        : 
                                            <img src={cartera} className={classes.imgConfig} alt="Cartera"/>
                                        }
                                        <p className={classes.titleConfig}>
                                            Cartera
                                        </p>
                                    </div>
                                </Paper>
                            </Link>                            
                        </Grid>
                        {/* Comercial */}
                        <Grid item xs={12} md={2} lg={2}>
                            <Link to="/usuarios">
                                <Paper className={fixedHeightPaper} onMouseEnter={() => setisHover('comercial')} onMouseLeave={() => setisHover('')}>
                                    <div className={classes.containerConfig}>
                                        {isHover === 'comercial' ?
                                            <img src={comercialWhite} className={classes.imgConfig} alt="Comercial"/>
                                        : 
                                            <img src={comercial} className={classes.imgConfig} alt="Comercial"/>
                                        }
                                        <p className={classes.titleConfig}>
                                            Comercial
                                        </p>
                                    </div>
                                </Paper>
                            </Link>                            
                        </Grid>

                    </Grid>
                </Container>
            </main>
        </div>
    )
}