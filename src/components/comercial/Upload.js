import React from "react";
import * as XLSX from 'xlsx';

export default function Upload(){

    const loadServerExcel = () => {
        let url = services.baseUrl + 'download-template';
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "arraybuffer";
        
        req.onload = function(e){
          var data = new Uint8Array(req.response);
          const wb = XLSX.read(data, {type:"buffer"});
          const  wsname = wb.SheetNames[0];
                
          const ws = wb.Sheets[wsname];

          const dataExcel = XLSX.utils.sheet_to_json(ws);

          var gastos_causados = ejecucionAcumulada(dataExcel, 2020, 'Gastos Causados', 'UENE');
          var ingresos_recaudados = ejecucionAcumulada(dataExcel, 2020, 'Ingresos Rec', 'UENE');

          console.log(gastos_causados, ingresos_recaudados);
          /* DO SOMETHING WITH workbook HERE */
        }

        req.send();

    }

    const ejecucionAcumulada = (data, anio, tipo, nombreGerencia) => {
        const dataFilter = data.filter((e) => {
            var validateTipo = e.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1;
            return (e.anio === anio && e.nombre_grupo !== 'DISPONIBILIDAD INICIAL' && (e.clase === undefined || e.clase === '0') && e.nombre_gerencia === nombreGerencia && validateTipo );
        });

        const sumData = dataFilter.reduce((a, b) => {
            return a + (b.valor || 0); 
        }, 0);
        return sumData;
    }


    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            
            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, {type: 'buffer'});

                const  wsname = wb.SheetNames[0];
                
                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            }

            fileReader.onerror = ((error) => {
                reject(error);
            });
        });

        promise.then( (result) => {
            console.log(result);
        });
    }   

    return (
        <div>
            <h1>Carga</h1>
            <input type="file" onChange={(e) => {
                const file = e.target.files[0];
                readExcel(file);
            }} />

            <button type="button" onClick={loadServerExcel}>File server</button>
        </div>
    );
}