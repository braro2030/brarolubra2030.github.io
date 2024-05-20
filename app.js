
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const serviciosSeleccionados = params.get('servicios') ? params.get('servicios').split(',') : [];
    mostrarTitulosServicios(serviciosSeleccionados);
    mostrarControles(serviciosSeleccionados);
});

function enviarDatos() {
    const controles = document.querySelectorAll('.control-visible');
    const resultados = Array.from(controles).map(control => {
        const id = control.querySelector('.card-title').textContent;
        const cumplimiento = localStorage.getItem(id);
        return { id, cumplimiento };
    });

    mostrarRecomendaciones(resultados);
    const puntaje = calcularPuntaje(resultados);
    mostrarPuntaje(puntaje);
}

function calcularPuntaje(resultados) {
    const total = resultados.length;
    const cumplidos = resultados.filter(r => r.cumplimiento === "Cumple").length;
    return (cumplidos / total) * 100;
}
