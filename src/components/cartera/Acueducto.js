import React from "react";
import {Breadcrumbs, Typography, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { Link, Redirect } from 'react-router-dom';
import Header from '../menu/Header';

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
        marginBottom: '15px'
    }
}));

// Items que iran en el header.
export const itemsHeader = () => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/cartera">
                    Cartera
                </Link>
                <Typography color="textPrimary" className="txt-breadcrumb">Acueducto</Typography>
            </Breadcrumbs>
        </div>
    );
}

export default function Acueducto() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

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