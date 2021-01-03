import React, { useState, useEffect } from "react";
import {
    Breadcrumbs, Typography, Menu, Button, makeStyles, Container, Grid, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CssBaseline, Select,
    MenuItem, TableSortLabel, Checkbox, Drawer, IconButton, Tabs, Tab, Divider, FormControl,
    withStyles, InputBase, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import Header from '../menu/Header';
import PropTypes from 'prop-types';
import Close from '@material-ui/icons/Close';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import services from '../../services';
import {Redirect} from 'react-router-dom';

// Estilos boostrap para combinar select material con bootstrap.
const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        width: '100%',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#ced4da',
            boxShadow: 'none',
        },
    },
}))(InputBase);

// Estilos
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
    fixedHeight: {
        height: 240,
    },
    heightFull: {
        height: '100%'
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
        minHeight: '569px',
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    paddingRow: {
        padding: '26px 16px'
    },
    paddingRowCheck: {
        padding: '26px 5px'
    },
    containerTabs: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 224,
    },
    widthFull: {
        width: '100%'
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        "& .MuiTab-wrapper": {
            textTransform: 'initial',
            textAlign: 'left',
            letterSpacing: '1px',
            lineHeight: '17px',
            flexDirection: 'row'
        },
        "& .MuiTab-textColorPrimary.Mui-selected": {
            color: '#ffffff',
            background: '#d91415',
        },
        "& 	.MuiTabs-indicator": {
            backgroundColor: '#d91415'
        },
        "& 	.MuiTab-root": {
            borderRight: `1px solid ${theme.palette.divider}`,
            color: '#4a6276'
        },
        "& 	.MuiTab-labelIcon": {
            minHeight: '48px',
        },
        "& 	.MuiTabs-scrollable": {
            width: '264px'
        },

    },
    tabPanel: {
        width: '32em'
    },
    buttonDrawer: {
        margin: theme.spacing(1),
        width: '50%',
        textTransform: 'initial'
    },
    buttonDrawerSend: {
        backgroundColor: '#D91415',
        border: '1px solid #D91415',
        "&:hover": {
            backgroundColor: 'transparent',
            color: '#D91415',
            border: '1px solid #D91415'
        },
    },
    buttonDrawerCancel: {
        color: '#D91415',
        border: '1px solid #D91415',
        "&:hover": {
            backgroundColor: '#D91415',
            color: '#fff',
            border: '1px solid #D91415',
        },
    },
    selectPaginate: {
        marginLeft: '20px'
    },
    pagination: {
        '& .MuiPaginationItem-page.Mui-selected': {
            background: '#d91415',
            color: '#fff'
        }
    },
    textRedItemsMenu: {
        color: '#d91415',
        fontSize: '16px',
        letterSpacing: '1px'
    },
    dividerRed: {
        background: '#d91415'
    },
    borderMenu: {
        '& .MuiMenu-list': {
            border: '1px solid #d91415'
        }
    }
}));


// Definir las celdas.
const headCells = [
    { id: 'nombres', numeric: false, disablePadding: false, label: 'Nombre' },
    { id: 'nombre_rol', numeric: false, disablePadding: false, label: 'Rol' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Usuario' },
    { id: 'ultimo_acceso', numeric: false, disablePadding: false, label: 'último acceso' },
];

// Function para ordenar de manera descendente.
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

// Function para comparar y enviar a ordenarde manera descendente.
function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Ordenar la tabla segun su orden.
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// Definir las propiedades de los tabs vertical.
function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}


// Definir la cabecera de la tabla como function o componente aparte.
function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    {/* <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    /> */}
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// Definir que propiedades de van a trabajar y cuales se requieren.
EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};


// Items que iran en el header.
export const ItemsHeader = (openDrawer, editUser, deleteUser) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Typography color="textPrimary" className="txt-breadcrumb">Usuarios</Typography>
            </Breadcrumbs>
            <div>
                <Button size="small" color="primary" className="btn-edit-outline" onClick={handleClick}>
                    Editar
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    className={classes.borderMenu}
                >
                    <MenuItem className={classes.textRedItemsMenu} onClick={editUser()}>Editar</MenuItem>
                    <Divider className={classes.dividerRed} />
                    <MenuItem className={classes.textRedItemsMenu} onClick={deleteUser()}>Eliminar</MenuItem>
                </Menu>
                <Button onClick={openDrawer(true)} variant="contained" size="small" color="primary" className="btn-red-small" disableElevation>
                    Nuevo usuario
                </Button>
            </div>
        </div>
    );
}

// Componente Usuarios.
export default function Usuarios() {

    // Estilos
    const classes = useStyles();
    // Combinar clases de los botones del drawer.
    const btnSend = clsx(classes.buttonDrawer, classes.buttonDrawerSend);
    const btnCancel = clsx(classes.buttonDrawer, classes.buttonDrawerCancel);


    // Estados.
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('nombres');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [value, setValue] = useState(0);
    const [userSession, setUserSession] = React.useState((localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : {nombres : '', apellidos : '', rol : ''});

    // Usuarios
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    // Crear usuario
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [cedula, setCedula] = useState('');
    const [celular, setCelular] = useState('');
    const [correo, setCorreo] = useState('');
    const [tipo, setTipo] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');

    // Editar usuario.
    const [edit, setEdit] = useState(false);

    // Confirm
    const [openConfirm, setopenConfirm] = React.useState(false);

    // Mensajes 
    const [openMessage, setOpenMessage] = useState({ open: false, message: '', type: '' });

    const [validate, setValidate] = useState({
        nombre: '',
        apellidos: '',
        cedula: '',
        celular: '',
        email: '',
        rol: '',
        password: ''
    });
    const [validatePss, setValidatePss] = useState('');

    // Variables globales en el componente.
    const baseUrl = services.baseUrl;
    const config = services.configAutorization;

    // Efecto. 
    useEffect(() => {
        getUsers();
        getRoles();
    }, [users.length]);

    const handleOpenConfirm = () => {
        setopenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setopenConfirm(false);
    };

    // Drawer
    const toggleDrawer = (open) => (event) => {
        setOpenDrawer(open);
    };

    // Metodo que trae los usuarios.
    const getUsers = () => {
        axios.get(baseUrl + 'users', config).then(
            response => {
                var data = response.data;
                if (data.response === 'success' && data.status === 200) {
                    setUsers(data.users);
                }
            }
        ).catch(
            error => {

            }
        );
    }

    const getRoles = () => {
        axios.get(baseUrl + 'roles', config).then(
            response => {
                var data = response.data;
                if (data.roles) {
                    setRoles(data.roles);
                }
            }
        ).catch(
            error => {

            }
        )
    }

    // Metodo que definie el orden.
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Metodo que define todas las celdas seleccionadas..
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = users.map((n) => n.nombres);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // Metodo que selecciona una fila.
    const handleClick = (event, user) => {
        const selectedIndex = selected.indexOf(user);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, user);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    // Cambio de pagina.
    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1);
    };

    // Cambiar la cantidad de filas por pagina.
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Valida que fila es seleccionada.
    const isSelected = (user) => selected.indexOf(user) !== -1;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Formulario que envia a crear usuario.
    const submitCreateUser = (event) => {
        event.preventDefault();
        var data = {
            nombres: nombres,
            apellidos: apellidos,
            cedula: cedula,
            celular: celular,
            email: correo,
            rol: tipo,
            usuario: correo,
            password: password
        }
        axios.post(baseUrl + 'users', data, config).then(
            response => {
                var data = response.data;
                if (data.response === 'success' && data.status === 200) {
                    console.log(data);
                    setOpenMessage({
                        open: true,
                        message: 'Usuario creado de manera correcta.',
                        type: 'success'
                    });
                    setOpenDrawer(false);
                    getUsers();
                    resetForm();
                }
            },
            error => {
                if (error.response) {
                    var errors = error.response.data.errors;
                    var setErrors = {
                        nombre: '',
                        apellidos: '',
                        cedula: '',
                        celular: '',
                        email: '',
                        rol: '',
                        password: ''
                    };
                    if (errors.email) setErrors.email = errors.email[0]
                    if (errors.rol) setErrors.email = errors.rol[0]
                    if (errors.celular) setErrors.celular = errors.celular[0]
                    if (errors.cedula) setErrors.cedula = errors.cedula[0]
                    setValidate(setErrors);
                    setValue(0);
                }
            }
        )
    }

    // Validaciones del formulario.
    function validationsForm() {
        var errorNombre = '';
        var next = true;
        if (nombres === '') {
            errorNombre = 'El nombre es requerido';
            next = false;
        };

        var errorApellidos = '';
        if (apellidos === '') {
            errorApellidos = 'El apellido es requerido';
            next = false;
        };

        var errorCedula = '';
        if (cedula === '') {
            errorCedula = 'La cedula es requerida';
            next = false;
        };

        var errorCorreo = '';
        if (correo === '') {
            errorCorreo = 'El correo es requerido';
            next = false;
        };

        var errorCelular = '';
        if (celular === '') {
            errorCelular = 'El celular es requerido';
            next = false;
        };

        var errorTipo = '';
        if (tipo === '') {
            errorTipo = 'El tipo de usuario es requerido';
            next = false;
        };

        var dataErrors = {
            nombre: errorNombre,
            apellidos: errorApellidos,
            cedula: errorCedula,
            celular: errorCelular,
            email: errorCorreo,
            rol: errorTipo,
            password: ''
        }
        setValidate(dataErrors);
        if (next) {
            setValue(1);
        } else {
            setValue(0);
        }
    }

    // Validacion de confirmacion de contraseña
    const validateConfirmPassword = (confirm) => {
        setConfirmPassword(confirm.target.value)
        if (confirm.target.value !== password) {
            setValidatePss('Las contraseñas deben coincidir.');
        } else {
            setValidatePss('');
        }
    }

    // Reiniciar el formulario.
    const resetForm = () => {
        setNombres('');
        setApellidos('');
        setCedula('');
        setCelular('');
        setCorreo('');
        setTipo('');
        setPassword('');
        setConfirmPassword('');
        setValue(0);
    }

    // Editar usuario.
    const editUser = () => (event) => {
        if (selected.length > 1 || selected.length === 0) {
            setOpenMessage({
                open: true,
                message: 'Para realizar esta acción debe tener un usuario seleccionado.',
                type: 'error'
            });
        } else {
            setOpenDrawer(true);
            var itemSelected = selected[0];
            setNombres(itemSelected.nombres);
            setApellidos(itemSelected.apellidos);
            setCedula(itemSelected.cedula);
            setCelular(itemSelected.celular);
            setCorreo(itemSelected.email);
            setTipo(itemSelected.id_rol);
            setEdit(true);
        }
    }

    // Submit del formulario de actualizar.
    const submitUpdateUser = (event) => {
        event.preventDefault();
        var data = {
            nombres: nombres,
            apellidos: apellidos,
            cedula: cedula,
            celular: celular,
            email: correo,
            rol: tipo,
            usuario: correo,
            password: password
        }
        var user_selected = selected[0];

        axios.post(baseUrl + 'users/' + user_selected.id, data, config).then(
            response => {
                var data = response.data;
                if (data.response === 'success' && data.status === 200) {
                    setOpenMessage({
                        open: true,
                        message: 'Usuario actualizado de manera correcta.',
                        type: 'success'
                    });
                    setOpenDrawer(false);
                    getUsers();
                    resetForm();
                }
            },
            error => {
                if (error.response) {
                    var errors = error.response.data.errors;
                    var setErrors = {
                        nombre: '',
                        apellidos: '',
                        cedula: '',
                        celular: '',
                        email: '',
                        rol: '',
                        password: ''
                    };
                    if (errors.email) setErrors.email = errors.email[0]
                    if (errors.rol) setErrors.email = errors.rol[0]
                    if (errors.celular) setErrors.celular = errors.celular[0]
                    if (errors.cedula) setErrors.cedula = errors.cedula[0]
                    setValidate(setErrors);
                    setValue(0);
                }
            }
        )
    }

    // Editar usuario.
    const deleteUser = () => (event) => {
        if (selected.length === 0) {
            setOpenMessage({
                open: true,
                message: 'Seleccione un usuario por favor.',
                type: 'error'
            });
        } else {
            handleOpenConfirm(true);
        }
    }

    const submitDeleteUser = () => {
        selected.forEach(element => {
            axios.post(baseUrl + 'delete/' + element.id, null, config).then(
                response => {
                    var data = response.data;
                    if (data.response === 'success' && data.status === 200) {
                        setOpenMessage({
                            open : true, 
                            message : 'Usuario ' + element.nombres + ' ' + element.apellidos + ' Eliminado correctamente.',
                            type : 'success'
                        });
                        setopenConfirm(false);
                        getUsers();
                    }
                }
            ).catch(
                error => {
                    var errors = error.response.data;
                    if (errors) {
                        setOpenMessage({
                            open : true, 
                            message : errors.message,
                            type : 'error'
                        });
                        setopenConfirm(false);
                        getUsers();
                    }
                }
            )
        });
    }

    return (
        (!services.sesionActive) ?
            <Redirect to="/" />
         :
            (userSession.rol !== 1 ) ?         
                <Redirect to="/" />
            :
            <div className={classes.root}>
                <Header itemsHeader={() => ItemsHeader(toggleDrawer, editUser, deleteUser)} />

                {/* Mensajes */}
                <Snackbar open={openMessage.open} autoHideDuration={6000}>
                    <MuiAlert elevation={6} variant="filled" onClose={() => setOpenMessage({ open: false, message: '', type: '' })} severity={openMessage.type}>
                        {openMessage.message}
                    </MuiAlert>
                </Snackbar>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} style={{ minHeight: '8em' }} />
                    <Container maxWidth="lg" className={classes.container}>
                        <CssBaseline />
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12} md={12} lg={12}>
                                {/* <Paper className={fixedHeightPaper}>
                                    
                                </Paper> */}
                                <Paper className={classes.paper}>
                                    <Drawer anchor={'right'} open={openDrawer} onClose={toggleDrawer(false)}>
                                        <div className="title-drawer">
                                            <p>Usuarios</p>
                                            <IconButton aria-label="delete" onClick={toggleDrawer(false)}>
                                                <Close />
                                            </IconButton>
                                        </div>
                                        <form className={classes.containerTabs} onSubmit={(!edit) ? submitCreateUser : submitUpdateUser}>
                                            <Tabs
                                                orientation="vertical"
                                                variant="scrollable"
                                                indicatorColor="primary"
                                                textColor="primary"
                                                value={value}
                                                onChange={handleChange}
                                                aria-label="Vertical tabs example"
                                                className={classes.tabs}
                                            >
                                                <Tab label="Datos generales" {...a11yProps(0)} />
                                                <Tab label="Usuario y contraseña" {...a11yProps(1)} />
                                            </Tabs>
                                            {/* Contenedor 1 - Datos generales. */}
                                            <div role="tabpanel"
                                                hidden={value !== 0}
                                                id={`vertical-tabpanel-${0}`}
                                                aria-labelledby={`vertical-tab-${0}`}
                                                value={value}
                                                className={classes.tabPanel}
                                                index={0}>
                                                <div style={{ padding: '24px' }}>

                                                    <div className="form-group">
                                                        <label htmlFor="nombres">Nombres*</label>
                                                        <input type="text" name="nombres" value={nombres} onChange={(element) => setNombres(element.target.value)} className="form-control" id="nombres" required />
                                                        {(validate.nombre !== '' &&
                                                            <div className="invalid-feedback">
                                                                {validate.nombre}
                                                            </div>
                                                        )
                                                        }
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="apellidos">Apellidos*</label>
                                                        <input type="text" name="apellidos" value={apellidos} onChange={(element) => setApellidos(element.target.value)} className="form-control" id="apellidos" required />
                                                        {(validate.apellidos !== '' &&
                                                            <div className="invalid-feedback">
                                                                {validate.apellidos}
                                                            </div>
                                                        )
                                                        }
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="dni">Cédula de ciudadania*</label>
                                                        <input type="text" name="cedula" value={cedula} onChange={(element) => setCedula(element.target.value)} className="form-control" id="dni" required />
                                                        {(validate.cedula !== '' &&
                                                            <div className="invalid-feedback">
                                                                {validate.cedula}
                                                            </div>
                                                        )
                                                        }
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="celular">Celular*</label>
                                                        <input type="text" name="celular" value={celular} onChange={(element) => setCelular(element.target.value)} className="form-control" id="celular" required />
                                                        {(validate.celular !== '' &&
                                                            <div className="invalid-feedback">
                                                                {validate.celular}
                                                            </div>
                                                        )
                                                        }
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="email">Correo electrónico*</label>
                                                        <input type="text" name="correo" className="form-control" id="email" value={correo} onChange={(element) => setCorreo(element.target.value)} required />
                                                        {(validate.email !== '' &&
                                                            <div className="invalid-feedback">
                                                                {validate.email}
                                                            </div>
                                                        )
                                                        }
                                                    </div>
                                                    <div className="form-group" style={{ marginBottom: '0px' }}>
                                                        <label htmlFor="tipo">Tipo de usuario*</label>
                                                    </div>
                                                    {/* <input type="text" className="form-control" id="tipo" /> */}
                                                    <FormControl className={classes.widthFull}>
                                                        <Select
                                                            labelId="demo-customized-select-label"
                                                            id="demo-customized-select"
                                                            value={tipo}
                                                            onChange={(element) => setTipo(element.target.value)}
                                                            input={<BootstrapInput />}
                                                        >
                                                            {roles.map((rol, index) =>
                                                                <MenuItem key={index} value={rol.id_rol}>{rol.nombre_rol}</MenuItem>
                                                            )}

                                                        </Select>
                                                        {(validate.rol !== '' &&
                                                            <div className="invalid-feedback">
                                                                {validate.rol}
                                                            </div>
                                                        )
                                                        }
                                                    </FormControl>
                                                </div>
                                            </div>

                                            {/* Contenedor 2 - Usuario y contraseña. */}
                                            <div role="tabpanel"
                                                hidden={value !== 1}
                                                id={`vertical-tabpanel-${1}`}
                                                aria-labelledby={`vertical-tab-${1}`}
                                                value={value}
                                                className={classes.tabPanel}
                                                index={1}>
                                                <div style={{ padding: '24px' }}>
                                                    <div className="form-group">
                                                        <label htmlFor="nombres">Usuario*</label>
                                                        <input type="text" name="usuario" value={correo} onChange={(element) => setCorreo(element.target.value)} className="form-control" id="usuario" required />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="password">Contraseña*</label>
                                                        {(!edit) ?
                                                            <input type="password" name="contrasena" value={password} onChange={(element) => setPassword(element.target.value)} className="form-control" id="password" required />
                                                            :
                                                            <input type="password" name="contrasena" value={password} onChange={(element) => setPassword(element.target.value)} className="form-control" id="password" />
                                                        }
                                                        {(validate.password !== '' &&
                                                            <div className="invalid-feedback">
                                                                {validate.password}
                                                            </div>
                                                        )
                                                        }
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="confirm_password">Confirmar contraseña*</label>
                                                        {(!edit) ?
                                                            <input type="password" name="confirm_contrasena" value={confirm_password} onChange={validateConfirmPassword} className="form-control" id="confirm_password" required />
                                                            :
                                                            <input type="password" name="confirm_contrasena" value={confirm_password} onChange={validateConfirmPassword} className="form-control" id="confirm_password" />
                                                        }
                                                        {(validatePss !== '' &&
                                                            <div className="invalid-feedback">
                                                                {validatePss}
                                                            </div>
                                                        )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Botones Drawer. */}
                                            <div className="footer-drawer">
                                                {(value === 0) &&
                                                    <Button variant="contained" type="button" size="small" color="primary" onClick={validationsForm} className={btnSend} disableElevation>
                                                        continuar
                                                    </Button>
                                                }
                                                {(value !== 0) &&
                                                    <Button variant="contained" type="submit" size="small" color="primary" onClick={validationsForm} className={btnSend} disableElevation>
                                                        {(!edit) ? 'Crear usuario' : 'Actualizar usuario'}
                                                    </Button>
                                                }
                                                <Button variant="outlined" size="small" color="primary" className={btnCancel} onClick={() => setOpenDrawer(false)}>
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </form>
                                    </Drawer>
                                    {/*  {numSelected} variable con la cantidad de seleccionados. */}
                                    <TableContainer>
                                        <Table
                                            className={classes.table}
                                            aria-labelledby="tableTitle"
                                            size={'medium'}
                                            aria-label="enhanced table"
                                        >
                                            <EnhancedTableHead
                                                classes={classes}
                                                numSelected={selected.length}
                                                order={order}
                                                orderBy={orderBy}
                                                onSelectAllClick={handleSelectAllClick}
                                                onRequestSort={handleRequestSort}
                                                rowCount={users.length}
                                            />
                                            <TableBody>
                                                {(users.length === 0) ?
                                                    <TableRow>
                                                        <TableCell style={{ textAlign: 'center' }} colSpan={5}>No existen registros hasta el momento</TableCell>
                                                    </TableRow>
                                                    :
                                                    stableSort(users, getComparator(order, orderBy))
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row, index) => {
                                                            const isItemSelected = isSelected(row);
                                                            const labelId = `enhanced-table-checkbox-${index}`;

                                                            return (
                                                                <TableRow
                                                                    hover
                                                                    // onClick={(event) => handleClick(event, row.nombres)}
                                                                    role="checkbox"
                                                                    aria-checked={isItemSelected}
                                                                    tabIndex={-1}
                                                                    key={index}
                                                                    selected={isItemSelected}
                                                                >
                                                                    <TableCell padding="checkbox" className={classes.paddingRowCheck}>
                                                                        <Checkbox
                                                                            checked={isItemSelected}
                                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                                            className={classes.checkBoxSelect}
                                                                            onChange={(event) => handleClick(event, row)}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell component="th" id={labelId} scope="row" className={classes.paddingRow}>
                                                                        {row.nombres + ' ' + row.apellidos}
                                                                    </TableCell>
                                                                    <TableCell align="left" className={classes.paddingRow}>{row.nombre_rol}</TableCell>
                                                                    <TableCell align="left" className={classes.paddingRow}>{row.email}</TableCell>
                                                                    <TableCell align="left" className={classes.paddingRow}>{row.ultimo_acceso}</TableCell>
                                                                </TableRow>
                                                            );
                                                        })
                                                }

                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Dialog
                            open={openConfirm}
                            onClose={handleCloseConfirm}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Eliminar usuario."}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Usted va eliminar un usuario. ¿Desea continuar con esta acción?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button  variant="contained" type="button" size="small" color="primary" onClick={submitDeleteUser} className={btnSend} disableElevation>
                                    Continuar
                                </Button>
                                <Button variant="outlined" size="small" color="primary" className={btnCancel} onClick={handleCloseConfirm}>
                                    Cancelar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Container>
                    <div className="footer-pagination">
                        <Pagination className={classes.pagination} count={Math.ceil(users.length / rowsPerPage)} page={page + 1} onChange={handleChangePage} variant="outlined" shape="rounded" />
                        <Select
                            value={rowsPerPage}
                            onChange={handleChangeRowsPerPage}
                            displayEmpty
                            className={classes.selectPaginate}
                        >
                            <MenuItem value={5}>5 Por página</MenuItem>
                            <MenuItem value={10}>10 Por página</MenuItem>
                            <MenuItem value={25}>25 Por página</MenuItem>
                            <MenuItem value={30}>30 Por página</MenuItem>
                        </Select>
                        {/* <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        /> */}
                    </div>
                </main>
            </div>
    )
}