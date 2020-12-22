export const filterGestion = (data, anio, mes) => {
    const dataFilter = data.filter((e) => {
        return (e.anios === anio && e.meses === mes);
    });
    return dataFilter;
}