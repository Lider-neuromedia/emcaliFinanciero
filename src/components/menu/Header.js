import React from 'react';
import clsx from 'clsx';
import { makeStyles, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, IconButton, Button,
    ListItem, ListItemIcon, ListItemText, Collapse, withStyles, Menu, MenuItem  } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MenuIcon from '@material-ui/icons/Menu';
import Close from '@material-ui/icons/Close';
import logoSideBar from '../../assets/images/logo_sidebar.png';
import logoSideBarSmall from '../../assets/images/logosidebar_reducido.png';
import ejecucionPresupuestal from '../../assets/images/icons/ejecucion_presupuestal.png';
import cartera from '../../assets/images/icons/cartera.png';
import comercial from '../../assets/images/icons/comercial.png';
import gestion from '../../assets/images/icons/gestion.png';
import pyg from '../../assets/images/icons/pyg.png';
import ejecucionPresupuestalAct from '../../assets/images/icons/ejecucion_presupuestal_active.png';
import carteraAct from '../../assets/images/icons/cartera_active.png';
import comercialAct from '../../assets/images/icons/comercial_active.png';
import gestionAct from '../../assets/images/icons/gestion_active.png';
import pygAct from '../../assets/images/icons/pyg_active.png';
import settings from '../../assets/images/icons/settings.png';
import shape from '../../assets/images/icons/shape.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import services, {setSesionActive} from '../../services';
import { useHistory } from "react-router-dom";

const drawerWidth = 220;

const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d91415',
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2em 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: '95%',
        boxShadow: 'none',
    },
    appBarShift: {
        marginLeft: drawerWidth,
        boxShadow: 'none',
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 5,
    },
    menuButtonList: {
        marginRight: 5,
        color: '#798b9b',
        letterSpacing: '0.03em',
        fontSize: '15px'
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
        fontSize: '15px',
        letterSpacing: '1px'
    },
    small:{
        background: '#fff',
        color: '#000',
        padding: '2px 10px',
        borderRadius: '4px',
        fontSize: '16px',
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
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
    button: {
        margin: theme.spacing(1),
        textTransform: 'inherit',
        fontWeight: 600,
        color: '#fff',
        letterSpacing: '1px',
    },
    seconAppBar: {
        width: '100%',
        background: '#fff',
        color: '#5f7387',
        padding: '10px 24px',
        fontSize: '16px',
        letterSpacing: '1px',
        boxShadow: '0 0 5px 0 rgba(125 125 125 / 50%)',
    },
    menuItemActive : {
        background : '#f6faff',
        '&:hover': {
            background: "#f6faff",
        },
    },
    menuTextActive : {
        color: '#f66666',
    },
    subMenuActive : {
        background: '#dbe9f9',
        color : '#6d8298',
        '&:hover': {
            background: "#dbe9f9",
        },
    }
}));

export default function Header(props) {

    const classes = useStyles();

    const itemsHeaderProps = props.itemsHeader;

    // Estados.
    const [open, setOpen] = React.useState(true); //Open drawe o menu izquierdo.
    const [openEjecPresupuestal, setOpenEjecPresupuestal] = React.useState((props.active === 'ejecucion_pres') ? true : false); //Open list Ejecucion presupuestal.
    const [openPyG, setOpenPyG] = React.useState((props.active === 'pyg') ? true : false); //Open list PyG.
    const [itemActive, setItemActive] = React.useState((props.active) ? props.active : 'ejecucion_pres');
    const [user, setUser] = React.useState((localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : {nombres : '', apellidos : '', rol : ''});
    const [anchorEl, setAnchorEl] = React.useState(null);
    let history = useHistory();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const logout = () => {
        var baseUrl = services.baseUrl;
        axios.post(baseUrl + 'auth/logout', null, services.configAutorization).then(
            res => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                handleClose();

                setSesionActive(false);
                history.push('/');
            }
        ).catch(
            error => {

            }
        )
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleSetListEjecPresupuestal = () => {
        setItemActive('ejecucion_pres');
        setOpenEjecPresupuestal(!openEjecPresupuestal);
        setOpenPyG(false);
    };

    const handleSetPyG = () => {
        setItemActive('pyg');
        setOpenPyG(!openPyG);
        setOpenEjecPresupuestal(false);
    };

    const handleSetItemActive = (item) =>{
        setItemActive(item);
        setOpenEjecPresupuestal(false);
        setOpenPyG(false);
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="close drawer"
                        onClick={handleDrawerClose}
                        className={clsx(classes.menuButton, !open && classes.menuButtonHidden)}
                    >
                        <Close />
                    </IconButton>
                    <Typography component="h4" variant="h6" color="inherit" noWrap className={classes.title}>
                        Menú
                    </Typography>
                    {/* <Typography component="h4" variant="h6" color="inherit" noWrap className={classes.title}>
                        Cifras en Millones COP | <small className={classes.small}>Septiembre 2020</small>
                    </Typography> */}
                    {user.rol === 1 &&
                        <Link to="/configuracion">
                        <Button
                            className={classes.button}
                            startIcon={<img src={settings} alt="configuración" />}
                        >
                            Configuración
                        </Button>
                    </Link>                    
                    }

                    <Button
                        className={classes.button}
                        startIcon={<img src={shape} alt="usuario"/>}
                        onClick={handleClick}
                    >
                        {user.nombres + ' ' + user.apellidos}
                    </Button>
                    <StyledMenu
                        id="customized-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={logout}>
                            <ListItemIcon>
                                <InboxIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Cerrar sesión" />
                        </MenuItem>
                    </StyledMenu>
                </Toolbar>
                <div className={classes.seconAppBar}>
                    {itemsHeaderProps()}
                </div>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    {
                        (open) ? <img src={logoSideBar} alt="logo" /> : <img src={logoSideBarSmall} alt="logo" />
                    }
                </div>

                <List>
                    {/* Ejecucion presupuestal - Menu */}
                    <Link  to="/ejecucion-presupuestal">
                        <ListItem button className={itemActive === 'ejecucion_pres' ? classes.menuItemActive : ''}  onClick={handleSetListEjecPresupuestal}>
                            <ListItemIcon>
                                {
                                    itemActive === 'ejecucion_pres' ? 
                                        <img src={ejecucionPresupuestalAct} alt="ejecución presupuestal" />
                                    :
                                        <img src={ejecucionPresupuestal} alt="ejecución presupuestal" />
                                }
                            </ListItemIcon>
                            <ListItemText primary="Ejecución Presupuestal" className={clsx(classes.menuButtonList, itemActive === 'ejecucion_pres' && classes.menuTextActive, !open && classes.menuButtonHidden)} />
                        </ListItem>
                    </Link>
                    {/* Ejecucion presupuestal - Sub-menu */}
                    <Collapse in={openEjecPresupuestal} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Link  to="/ingresos">
                                <ListItem button className={classes.subMenuActive}>
                                    <ListItemText primary="Ingresos" />
                                </ListItem>
                            </Link>
                            <Link  to="/gastos">
                                <ListItem button className={classes.subMenuActive}>
                                    <ListItemText primary="Gastos" />
                                </ListItem>
                            </Link>
                        </List>
                    </Collapse>
                    {/* PyG - Menu */}
                    <Link  to="/pyg">
                        <ListItem button className={itemActive === 'pyg' ? classes.menuItemActive : ''} onClick={handleSetPyG}>
                            <ListItemIcon>
                                {
                                    itemActive === 'pyg' ? 
                                        <img src={pygAct} alt="pyg" />
                                    :
                                        <img src={pyg} alt="pyg" />
                                }
                            </ListItemIcon>
                            <ListItemText primary="PyG" className={clsx(classes.menuButtonList, itemActive === 'pyg' && classes.menuTextActive, !open && classes.menuButtonHidden)} />
                        </ListItem>
                    </Link>
                    {/* Ejecucion presupuestal - Sub-menu */}
                    <Collapse in={openPyG} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Link to="/ingresos-operacionales">
                                <ListItem button className={classes.subMenuActive}>
                                    <ListItemText primary="Ingresos operacionales" />
                                </ListItem>
                            </Link>
                            <Link to="/costos-venta">
                                <ListItem button className={classes.subMenuActive}>
                                    <ListItemText primary="Costos de venta" />
                                </ListItem>
                            </Link>
                            <Link to="/costos-operacionales">
                                <ListItem button className={classes.subMenuActive}>
                                    <ListItemText primary="Gastos operacionales" />
                                </ListItem>
                            </Link>
                            <Link to="/indicadores">
                                <ListItem button className={classes.subMenuActive}>
                                    <ListItemText primary="Indicadores" />
                                </ListItem>
                            </Link>
                        </List>
                    </Collapse>
                    {/* Gestion */}
                    <Link to="/gestion">
                        <ListItem button className={itemActive === 'gestion' ? classes.menuItemActive : ''} onClick={() => {handleSetItemActive('gestion')}}>
                            <ListItemIcon>
                                {
                                    itemActive === 'gestion' ? 
                                        <img src={gestionAct} alt="gestion" />
                                    :
                                        <img src={gestion} alt="gestion" />
                                }
                                
                            </ListItemIcon>
                            <ListItemText primary="Gestión" className={clsx(classes.menuButtonList, itemActive === 'gestion' && classes.menuTextActive, !open && classes.menuButtonHidden)} />
                        </ListItem>
                    </Link>
                    <Link to="/cartera">
                        {/* Cartera */}
                        <ListItem button className={itemActive === 'cartera' ? classes.menuItemActive : ''} onClick={() => {handleSetItemActive('cartera')}}>
                            <ListItemIcon>
                                {
                                    itemActive === 'cartera' ? 
                                        <img src={carteraAct} alt="cartera" />
                                    :
                                        <img src={cartera} alt="cartera" />
                                }

                            </ListItemIcon>
                            <ListItemText primary="Cartera" className={clsx(classes.menuButtonList, itemActive === 'cartera' && classes.menuTextActive, !open && classes.menuButtonHidden)} />
                        </ListItem>
                    </Link>
                    {/* Comercial */}
                    <Link to="/comercial">
                        <ListItem button className={itemActive === 'comercial' ? classes.menuItemActive : ''} onClick={() => {handleSetItemActive('comercial')}}>
                            <ListItemIcon>
                                {
                                    itemActive === 'comercial' ? 
                                        <img src={comercialAct} alt="comercial" />
                                    :
                                        <img src={comercial} alt="comercial" />
                                }
                                
                            </ListItemIcon>
                            <ListItemText primary="Comercial" className={clsx(classes.menuButtonList, itemActive === 'comercial' && classes.menuTextActive, !open && classes.menuButtonHidden)} />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
        </div>
    );
}