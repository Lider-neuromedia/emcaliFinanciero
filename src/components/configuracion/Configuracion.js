import React, {useState} from "react";
import {Breadcrumbs, Typography, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import Header from '../menu/Header';
import usuarios from '../../assets/images/icons/usuarios.png';
import usuariosWhite from '../../assets/images/icons/usuarios_white.png';
import actualizar from '../../assets/images/icons/actualizar.png';
import actualizarWhite from '../../assets/images/icons/actualizar_white.png';
import { Link, Redirect } from 'react-router-dom';
import services from '../../services';

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
                <Typography color="textPrimary" className="txt-breadcrumb">Configuración</Typography>
            </Breadcrumbs>
        </div>
    );
}

export default function Configuracion(){
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [isHover, setisHover] = useState('');

    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            <div className={classes.root}>
                <Header itemsHeader={itemsHeader}/>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Actualización */}
                            <Grid item xs={12} md={2} lg={2}>
                                <Link to="/actualizacion">
                                    <Paper className={fixedHeightPaper} onMouseEnter={() => setisHover('actualizar')} onMouseLeave={() => setisHover('')}>
                                        <div className={classes.containerConfig}>
                                            {isHover === 'actualizar' ?
                                                <img src={actualizarWhite} className={classes.imgConfig} alt="Actualizar"/>
                                            : 
                                                <img src={actualizar} className={classes.imgConfig} alt="Actualizar"/>
                                            }
                                            <p className={classes.titleConfig}>
                                                Actualización
                                            </p>
                                        </div>
                                    </Paper>
                                </Link>                            
                            </Grid>
                            {/* Usuarios */}
                            <Grid item xs={12} md={2} lg={2}>
                                <Link to="/usuarios">
                                    <Paper className={fixedHeightPaper} onMouseEnter={() => setisHover('user')} onMouseLeave={() => setisHover('')}>
                                        <div className={classes.containerConfig}>
                                            {isHover === 'user' ?
                                                <img src={usuariosWhite} className={classes.imgConfig} alt="Usuarios"/>
                                            : 
                                                <img src={usuarios} className={classes.imgConfig} alt="Usuarios"/>
                                            }
                                            <p className={classes.titleConfig}>
                                                Usuarios
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