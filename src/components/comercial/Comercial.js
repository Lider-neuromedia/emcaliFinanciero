import React, { useState } from "react";
import {Breadcrumbs, Typography, makeStyles, Container, Grid, Paper, Tabs, Tab } from '@material-ui/core';
import clsx from 'clsx';
import Header from '../menu/Header';
import { Link } from 'react-router-dom';
import UENE from '../../assets/images/icons/comercial/uene.png'
import acueducto from '../../assets/images/icons/comercial/acueducto.png'
import alcantarillado from '../../assets/images/icons/comercial/alcantarillado.png'
import internet from '../../assets/images/icons/comercial/internet.png'
import telecomunicaciones from '../../assets/images/icons/comercial/telecomunicaciones.png'
import tv from '../../assets/images/icons/comercial/tv.png'

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
            flexDirection: 'row'
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
export const itemsHeader = (active) => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/comercial">
                    Comercial
                </Link>
                <Typography color="textPrimary" className="txt-breadcrumb"> {active}</Typography>
            </Breadcrumbs>
        </div>
    );
}

export default function Comercial() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [value, setValue] = useState(0);
    const [tabActive, setTabActive] = useState('UENE');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Header active={'comercial'} itemsHeader={() => itemsHeader(tabActive)}/>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>

                        {/* Tabs */}
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper square>
                                <Tabs
                                    value={value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={handleChange}
                                    aria-label="disabled tabs example"
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
                        </Grid>

                        {/* Charts */}
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper className={fixedHeightPaper}>
                            </Paper>
                        </Grid>

                        {/* Charts */}
                        <Grid item xs={12} md={7} lg={7}>
                            <Paper className={fixedHeightPaper}>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={5} lg={5}>
                            <Paper className={fixedHeightPaper}>
                            </Paper>
                        </Grid>

                    </Grid>
                </Container>
            </main>
        </div>
    )
}