import React from "react";
import {Breadcrumbs, Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import Header from '../menu/Header';
import { Link, Redirect } from 'react-router-dom';
import services from '../../services';
import { Bar  } from 'react-chartjs-2';

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
        height: 240,
    },
}));

// Items que iran en el header.
export const itemsHeader = () => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/pyg">
                    Pyg
                </Link>
                <Typography color="textPrimary" className="txt-breadcrumb">Ingresos operacionales</Typography>
            </Breadcrumbs>
            <ButtonGroup variant="text" color="default" aria-label="text default button group">
                <Button style={{ padding: '0 2em' }}>TELCO</Button>
                <Button style={{ padding: '6px 2em' }}>UENAA</Button>
                <Button style={{ padding: '6px 2em' }}>UENE</Button>
            </ButtonGroup>
        </div>
    );
}

export default function IngresosOperacionales(){
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        <div className={classes.root}>
            <Header active={'pyg'} itemsHeader={itemsHeader}/>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>

                        {/* Chart */}
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper className={fixedHeightPaper}>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper className={fixedHeightPaper}>
                            </Paper>
                        </Grid>

                        {/* Charts */}
                        <Grid item xs={12} md={8} lg={8}>
                            <Paper className={fixedHeightPaper}>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4} lg={4}>
                            <Paper className={fixedHeightPaper}>
                            </Paper>
                        </Grid>

                        {/* Charts */}
                        <Grid item xs={12} md={4} lg={4}>
                            <Paper className={fixedHeightPaper}>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4} lg={4}>
                            <Paper className={fixedHeightPaper}>
                            </Paper>
                        </Grid>
                        
                        <Grid item xs={12} md={4} lg={4}>
                            <Paper className={fixedHeightPaper}>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    )
}