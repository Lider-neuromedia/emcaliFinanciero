import React, {useState} from 'react';
import '../assets/styles/login.css';
import logo from '../assets/images/logo.png';
import background from '../assets/images/login_background.jpg';
import {makeStyles, Snackbar, LinearProgress, Button, TextField} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from "react-router-dom";
import services, {setHeader, setSesionActive} from '../services';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    inputCustom: {
        width: '100%',
        marginBottom: '3em',
        '& label.Mui-focused':{
            color: '#375167'
        },
        '& .MuiInput-underline:after':{
            color: '#375167',
            borderBottom: ' 2px solid  #375167'
        }
    }
}));

function Login() {

    const classes = useStyles();

    // Estados
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openMessage, setOpenMessage] = useState(false);
    const baseUrl = services.baseUrl;
    let history = useHistory();

    // Enviar peticion de login.
    const submitLogin = (event) =>{
        event.preventDefault();
        setLoading(true);
        var sendData = {
            email : email,
            password: password
        }
        axios.post(baseUrl + 'auth/login', sendData).then(
            response => {
                var data = response.data;
                if (data.response === 'success' && data.status === 200) {
                    // Almacenar todo en localStorage.
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // setear token y sesion activa en los servicios para que se actualice en la aplicacion.
                    setHeader(data.access_token);
                    setSesionActive(true);
                    setLoading(false);
                    history.push('/ejecucion-presupuestal');
                }else{
                    setLoading(false);
                    setOpenMessage(true);
                }
            } 
        ).catch(
            error => {
                setLoading(false);
                setOpenMessage(true);
            }
        );
    }

    return (
        
        (services.sesionActive) ? 
            <Redirect to="/ejecucion-presupuestal"/>
        :
        <div className="container">
            <img src={background} alt="bg" className="bg"/>
            <div className="row justify-content-end" style={{ marginTop : '5em'}}>
                <div className="col-md-6">
                    <div className="card">
                        {(loading) &&
                            <LinearProgress color="secondary"/>
                        }
                        <Snackbar open={openMessage} autoHideDuration={6000} onClose={() => setOpenMessage(false)}>
                            <MuiAlert elevation={6} variant="filled" onClose={() => setOpenMessage(false)} severity="error">
                                Usuario y/o contraseña incorrectos.
                            </MuiAlert>
                        </Snackbar>
                        <div className="card-body" style={{padding : '5em'}}>
                            <div className="flx-center">
                                <img src={logo} alt="Logo"/>
                            </div>  
                            <form onSubmit={submitLogin}>
                                {/* Inputs */}
                                <TextField className={classes.inputCustom} value={email} type="email" id="email" label="Correo electronico"required={true} onChange={(element) => setEmail(element.target.value)}/>
                                <TextField className={classes.inputCustom} value={password} type="password" id="password" label="Contraseña" required={true} onChange={(element) => setPassword(element.target.value)}/>
                                
                                <div style={{width: '100%', display: 'flex', justifyContent : 'center'}}>
                                        <Button variant="contained" type="submit" color="secondary" className="btn-red" disableElevation>
                                            Iniciar sesión
                                        </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ); 
}

export default Login;