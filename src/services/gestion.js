export const filterGestion = (data, anio, mes) => {
    const dataFilter = data.filter((e) => {
        return (e.anios === anio && e.meses === mes);
    });
    return dataFilter;
}

export const filterGestionesRealizadas = (data) => {
    const dataFilter = data.filter((e) => {
        return (e.gestiones_realizadas);
    });
    return dataFilter;
}

export const filterSaldo = (data, anio) => {
    const dataFilter = data.filter((e) => {
        return (e.saldo && e.total_anios_saldo === anio);
    });
    return dataFilter;
}

export const filterPorcentaje = (data, anio, mes) => {
    const dataFilter = data.filter((e) => {
        return (e.ea && e.anios === anio && e.meses === mes);
    });
    return dataFilter;
}

export const filterFiduciarias = (data) => {
    const dataFilter = data.filter((e) => {
        return (e.porcentajes);
    });
    return dataFilter;
}
