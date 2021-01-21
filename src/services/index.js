import * as XLSX from 'xlsx';

const services = {

    baseUrl : process.env.REACT_APP_API_URL,
    webUrl : process.env.REACT_APP_WEB_URL,
    configAutorization : {
        headers : {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    },
    sesionActive : (localStorage.getItem('token')) ? true : false,
}

export default services;

export const setHeader = (token) => {
    services.configAutorization.headers = { Authorization: `Bearer ${token}`};
}

export const setSesionActive = (active) => {
    services.sesionActive = active;
}

export const loadServerExcel = (url, done) => {
    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
    req.responseType = "arraybuffer";
    
    req.onload = function(e){
        var data = new Uint8Array(req.response);
        const wb = XLSX.read(data, {type:"buffer"});
        const  wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const dataExcel = XLSX.utils.sheet_to_json(ws);
        let response = {data : dataExcel, error : false};
        done(response);
    }

    req.onerror = function () {
        done({data : [], error: true});
    }

    req.send();

}
