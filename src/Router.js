import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import EjecucionPresupuestal from './components/ejecucion-presupuestal/EjecucionPresupuestal';
import Ingresos from './components/ejecucion-presupuestal/Ingresos';
import Gastos from './components/ejecucion-presupuestal/Gastos';
import Pyg from './components/pyg/Pyg';
import IngresosOperacionales from './components/pyg/IngresosOperacionales';
import CostosVenta from './components/pyg/CostosVenta';
import CostosOperacionales from './components/pyg/CostosOperacionales';
import Indicadores from './components/pyg/Indicadores';
import Gestion from './components/gestion/Gestion';
import Cartera from './components/cartera/Cartera';
import Comercial from './components/comercial/Comercial';
import Configuracion from './components/configuracion/Configuracion';
import Usuarios from './components/configuracion/Usuarios';
import Upload from './components/comercial/Upload';
import Actualizar from './components/configuracion/Actualizar';

export default function Router() {

    return (
        <BrowserRouter>
            <Switch>
                {/* Inicio */}
                <Route exact path="/"> 
                    <Login />
                </Route>

                {/* Login */}
                <Route path="/login">
                    <Login/>
                </Route>

                {/* Ejecucion Presupuestal */}
                <Route path="/ejecucion-presupuestal"> 
                    <EjecucionPresupuestal />
                </Route>
                    {/* Ingresos */}
                    <Route path="/ingresos"> 
                        <Ingresos />
                    </Route>
                    {/* Gastos */}
                    <Route path="/gastos"> 
                        <Gastos />
                    </Route>
                {/*  */}

                {/* PYG */}
                <Route path="/pyg"> 
                    <Pyg />
                </Route>
                    {/* Ingresos operacionales */}
                    <Route path="/ingresos-operacionales"> 
                        <IngresosOperacionales />
                    </Route>
                    {/* Costos de venta */}
                    <Route path="/costos-venta"> 
                        <CostosVenta />
                    </Route>
                    {/* Costos operacionales */}
                    <Route path="/costos-operacionales"> 
                        <CostosOperacionales />
                    </Route>
                    {/* Indicadores */}
                    <Route path="/indicadores"> 
                        <Indicadores />
                    </Route>
                {/*  */}

                {/* Gestion */}
                <Route path="/gestion">
                    <Gestion />
                </Route>
                {/*  */}

                {/* Cartera */}
                <Route path="/cartera">
                    <Cartera />
                </Route>
                {/*  */}
                
                {/* Comercial */}
                <Route path="/comercial">
                    <Comercial />
                </Route>
                {/*  */}

                {/* Configuración */}
                <Route path="/configuracion">
                    <Configuracion />
                </Route>
                    <Route path="/usuarios">
                        <Usuarios />
                    </Route>
                    <Route path="/actualizacion">
                        <Actualizar />
                    </Route>
                    {/* RUTA DE PRUEBA */}
                    <Route path="/carga"> 
                        <Upload />
                    </Route>
                {/*  */}

                {/* Route sin path, es la pagina 404; Ej: */}
                {/* <Route> <Component404/> </Route> */}
            </Switch>
        </BrowserRouter>
    );
}
