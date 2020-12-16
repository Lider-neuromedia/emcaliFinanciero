import React from "react";
import {Breadcrumbs, Typography, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import Header from '../menu/Header';
import { Redirect } from 'react-router-dom';
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
        height: 280,
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
        marginBottom: '13px'
    }
}));

// Items que iran en el header.
export const itemsHeader = () => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Breadcrumbs aria-label="breadcrumb">
                <Typography color="textPrimary" className="txt-breadcrumb">Gestión</Typography>
            </Breadcrumbs>
        </div>
    );
}


export default function Gestion(){
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            <div className={classes.root}>
                <Header active={'gestion'} itemsHeader={itemsHeader}/>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                    <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12} md={8} lg={8}>
                                <Paper className={classes.heightFull}>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
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

                            {/* Charts */}
                            <Grid item xs={12} md={12} lg={12}>
                                <Paper className={fixedHeightPaper}>
                                    <p variant="p" className={classes.titleGestion}>
                                        Gestiones Realizadas
                                    </p>
                                    <p variant="p" className={classes.textGestion}>
                                        - Desde el 2 de marzo Emcali inicio seguimiento diario a las inversiones junto con el consorcio EMCALI
                                    </p>
                                    <p variant="p" className={classes.textGestion}>
                                        - Los recursos solo se invertian en el % de participación de las consorciadas, aunque el contrato de fiducia no lo establece como requisito
                                    </p>
                                    <p variant="p" className={classes.textGestion}>
                                        - Implementación de comité de inversiones en conjunto con el Consorcio EMCALI y las fiducias administradoras de los recursos
                                    </p>
                                    <p variant="p" className={classes.textGestion}>
                                        - Acompañamiento en dicho Comité de profesionales en gestión de portafolios de las fiduciarias participantes del consorcio
                                    </p>
                                    <p variant="p" className={classes.textGestion}>
                                        - Análisis semanal de mercados y prospectivas para toma de decisiones de inversión
                                    </p>
                                    <p variant="p" className={classes.textGestion}>
                                        - Control del flujo de caja para identificar excedentes de liquidez para inversión den FIC
                                    </p>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>
    )
}