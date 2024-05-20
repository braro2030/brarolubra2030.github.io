document.addEventListener('DOMContentLoaded', function() {
    const botonEnviar = document.getElementById('boton-enviar');
    botonEnviar.addEventListener('click', () => {
        mostrarRecomendaciones();
    });
});

function mostrarRecomendaciones() {
    // Asegurar que contenedores y datos estén limpios
    document.getElementById('controles').style.display = 'none'; // Oculta los controles actuales
    document.getElementById('boton-container').style.display = 'none'; // Oculta el botón enviar

    const contenedorRecomendaciones = document.getElementById('recomendaciones');
    contenedorRecomendaciones.innerHTML = '';
    contenedorRecomendaciones.style.display = 'block'; // Muestra el contenedor de recomendaciones

    const controles = document.querySelectorAll('.control-visible');
    controles.forEach(control => {
        const id = control.querySelector('.card-title').textContent;
        const estado = localStorage.getItem(id);
        if (estado !== 'Cumple') { // Para estados 'No Cumple' y 'Cumple Parcialmente'
            const recomendacion = recomendacionesPorServicio["A&A"].find(r => r.id === id);
            if (recomendacion) {
                const elemRecomendacion = document.createElement('div');
                elemRecomendacion.className = 'recomendacion';
                elemRecomendacion.innerHTML = `<h4>${recomendacion.id}</h4><p>${recomendacion.recomendacion}</p>`;
                contenedorRecomendaciones.appendChild(elemRecomendacion);
            }
        }
    });
}


