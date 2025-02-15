import React, {useState, useEffect} from "react";
import clsx from 'clsx';
import {
    Breadcrumbs,
    Typography, ButtonGroup, Button, makeStyles, Container, Grid, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import Header from '../menu/Header';
import services from '../../services';
import {loadServerExcel} from '../../services';
import {optionsStacked, filterIndicadores} from '../../services/pyg';

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
        height: 'auto',
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

function createData(name, anioAnt, anioAct, col) {
    return { name, anioAnt, anioAct, col };
}



const rowsIndiEst = [
    createData('Razón Corriente', 159, 6.0, 24),
    createData('Nivel en Endeudamiento', 237, 9.0, 37),
    createData('Concentración Deuda Corto Plazo', 262, 16.0, 24),
];

// Items que iran en el header.
export const itemsHeader = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/pyg">
                    Pyg
                </Link>
                <Typography color="textPrimary" className="txt-breadcrumb">Indicadores</Typography>
            </Breadcrumbs>
        </div>
    );
}

export default function Indicadores() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [dataExcel, setDataExcel] = useState([]);
    const [loading, setLoading] = useState(true);

    const [indicadoresEstructura, setIndicadoresEstructura] = useState([]);
    const [indicadoresEficiencia, setIndicadoresEficiencia] = useState([]);
    const [indicadoresRentabilidad, setIndicadoresRentabilidad] = useState([]);
    const [indicadoresOperacion, setIndicadoresOperacion] = useState([]);


    useEffect(() => {
        loadDataExcel();
    }, []);
    
    const loadDataExcel = () => {
        // Carga del excel.
        loadServerExcel(services.baseUrl + 'download-template/indicadores', function (data, err) {
            setDataExcel(data.data);
            loadTable(data.data);
        });
    }

    const loadTable = (data) => {

        var indiEstr = filterIndicadores(data, 'indicadoresEstructura');
        setIndicadoresEstructura(indiEstr);

        var indiEstr = filterIndicadores(data, 'indicadoresEficiencia');
        setIndicadoresEficiencia(indiEstr);

        var indiRenta = filterIndicadores(data, 'indicadoresRentabilidad');
        setIndicadoresRentabilidad(indiRenta);

        var indiOper = filterIndicadores(data, 'indicadoresOperacion');
        setIndicadoresOperacion(indiOper);

        setLoading(false);
    }
    
    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            <div className={classes.root}>
                <Header active={'pyg'} itemsHeader={itemsHeader} />
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} style={{ minHeight: '6em' }} />
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {/* Table */}
                            <Grid item xs={12} md={12} lg={12}>
                                <Paper className={fixedHeightPaper}>
                                    <Typography variant="h5" className={classes.title} gutterBottom>
                                        Indicadores financieros Consolidado EMCALI
                                    </Typography>

                                    {/* Table */}
                                    <TableContainer>
                                        <Table className={classes.table} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell></TableCell>
                                                    <TableCell align="left" className={classes.titleTable}>2019</TableCell>
                                                    <TableCell align="left" className={classes.titleTable}>2020</TableCell>
                                                    <TableCell align="left" className={classes.titleTable}>Var</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {/* Subtitulo table. */}
                                                <TableRow key="indicadores_estructura">
                                                    <TableCell component="th" scope="row" className={classes.subTitleTable} colSpan={4}>
                                                        Indicadores de Estructura
                                                        </TableCell>
                                                </TableRow>
                                                {indicadoresEstructura.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell component="th" scope="row" className={classes.textTable}>
                                                            {row.nombre}
                                                        </TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{row.anios_ant}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{row.anios_act}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{row.col}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {/* Subtitulo table. */}
                                                <TableRow key="indicadores_eficiencia">
                                                    <TableCell component="th" scope="row" className={classes.subTitleTable} colSpan={4}>
                                                        Indicadores de Eficiencia
                                                        </TableCell>
                                                </TableRow>
                                                {indicadoresEficiencia.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell component="th" scope="row" className={classes.textTable}>
                                                            {row.nombre}
                                                        </TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{row.anios_ant}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{row.anios_act}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{row.col}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {/* Subtitulo table. */}
                                                <TableRow key="indicadores_rentabilidad">
                                                    <TableCell component="th" scope="row" className={classes.subTitleTable} colSpan={4}>
                                                        Indicadores de Rentabilidad
                                                        </TableCell>
                                                </TableRow>
                                                {indicadoresRentabilidad.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell component="th" scope="row" className={classes.textTable}>
                                                            {row.nombre}
                                                        </TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{row.anios_ant}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{row.anios_act}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{row.col}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {/* Subtitulo table. */}
                                                <TableRow key="indicadores_operacion">
                                                    <TableCell component="th" scope="row" className={classes.subTitleTable} colSpan={4}>
                                                        Indicadores de Operación
                                                        </TableCell>
                                                </TableRow>
                                                {indicadoresOperacion.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell component="th" scope="row" className={classes.textTable}>
                                                            {row.nombre}
                                                        </TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{row.anios_ant}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{row.anios_act}</TableCell>
                                                        <TableCell align="left" className={classes.textTable}>{row.col}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>
    )
}