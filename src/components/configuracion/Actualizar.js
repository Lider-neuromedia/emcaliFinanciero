import React, {useState} from "react";
import {Breadcrumbs, Typography, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import Header from '../menu/Header';
import { Link, Redirect } from 'react-router-dom';
import {Button, Snackbar} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import services from '../../services';
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
    },
    labelFile: {
        margin: 0, 
        height: '100%', 
        cursor: 'pointer'
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
    const [selectFile, setSelectFile] = useState(null);
    const [moduleSelect, setModuleSelect] = useState(null);
    const [message, setMessage] = useState({type: 'default', message: ''});
    const [openMessage, setOpenMessage] = useState(false);
    const [user, setUser] = React.useState((localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : {nombres : '', apellidos : '', rol : ''});

    const onChangeFile = (name) => (event) => {
        var file = event.target.files[0];
        if (file) {
            setSelectFile(file);
            setModuleSelect(name);
            uploadFile(file, name);
        }else{
            setModuleSelect(null);
            setSelectFile(null);
        }
    }

    const uploadFile = (file, name) => {
        const formData = new FormData();
        
        formData.append("file", file);
        formData.append("name", 'datos_pr');
        axios.post(services.baseUrl + 'uploadFile', formData, services.configAutorization).then(
            response => {
                var data = response.data;
                if (data.response === 'success' && data.status === 200) {
                    setOpenMessage(true);
                    setMessage({type: 'success', message: data.message});
                    setSelectFile(null);
                    setModuleSelect(null);
                }
            }
        ).catch(
            error => {

            }
        )
    }

    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            (user.rol !== 1 ) ?         
                <Redirect to="/" />
            :
            <div className={classes.root}>
                <Header itemsHeader={itemsHeader}/>
                <main className={classes.content}>
                    {/* Mensajes */}
                    <Snackbar open={openMessage} autoHideDuration={6000} onClose={() => setOpenMessage(false)}>
                        <MuiAlert elevation={6} variant="filled" onClose={() => setOpenMessage(false)} severity={message.type}>
                            {message.message}
                        </MuiAlert>
                    </Snackbar>
                    <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Ejecucion presupuestal */}
                            <Grid item xs={12} md={2} lg={2}>
                                <Paper className={fixedHeightPaper} onMouseEnter={() => setisHover('ejecucion_pre')} onMouseLeave={() => setisHover('')}>
                                    <label htmlFor="file" className={classes.labelFile}>
                                        <div className={classes.containerConfig}>
                                            {isHover === 'ejecucion_pre' ?
                                                <img src={ejecucionPresWhite} className={classes.imgConfig} alt="Ejecucion presupuestal"/>
                                            : 
                                                <img src={ejecucionPres} className={classes.imgConfig} alt="Ejecucion presupuestal"/>
                                            }
                                            <p className={classes.titleConfig}>
                                                {(selectFile === null) ? 
                                                    'Ejecución presupuestal' 
                                                : 
                                                    (moduleSelect === 'datos_pr') ?
                                                        selectFile.name 
                                                    :
                                                        'Ejecución Presupuestal'
                                                }
                                            </p>
                                            
                                            <input
                                                style={{ display: 'none' }}
                                                id="file"
                                                name="file"
                                                onChange={onChangeFile("datos_pr")}
                                                type="file"
                                            />
                                        </div>
                                    </label>
                                </Paper>
                            </Grid>
                            {/* Pyg */}
                            <Grid item xs={12} md={2} lg={2}>
                                <Paper className={fixedHeightPaper} onMouseEnter={() => setisHover('pyg')} onMouseLeave={() => setisHover('')}>
                                    <label htmlFor="file_pyg" className={classes.labelFile}>
                                        <div className={classes.containerConfig}>
                                            {isHover === 'pyg' ?
                                                <img src={pygWhite} className={classes.imgConfig} alt="Pyg"/>
                                            : 
                                                <img src={pyg} className={classes.imgConfig} alt="Pyg"/>
                                            }
                                            <p className={classes.titleConfig}>
                                                {(selectFile === null) ? 
                                                    'Pyg' 
                                                : 
                                                    (moduleSelect === 'datos_pyg') ?
                                                        selectFile.name 
                                                    :
                                                        'Pyg'
                                                }
                                                
                                            </p>

                                            <input
                                                style={{ display: 'none' }}
                                                id="file_pyg"
                                                name="file_pyg"
                                                onChange={onChangeFile("datos_pyg")}
                                                type="file"
                                            />
                                        </div>
                                    </label>
                                </Paper>
                            </Grid>
                            {/* Gestion */}
                            <Grid item xs={12} md={2} lg={2}>
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
                            </Grid>
                            {/* Cartera */}
                            <Grid item xs={12} md={2} lg={2}>
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
                            </Grid>
                            {/* Comercial */}
                            <Grid item xs={12} md={2} lg={2}>
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
                            </Grid>

                        </Grid>
                    </Container>
                </main>
            </div>
    )
}