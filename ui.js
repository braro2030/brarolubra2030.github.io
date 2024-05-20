// ui.js
function mostrarTitulosServicios(titulos) {
    const tituloContainer = document.getElementById('titulo-servicio');
    if (tituloContainer) {
        tituloContainer.textContent = titulos.join(', ');
    }
}

function mostrarRecomendaciones(resultados) {
    const contenedorRecomendaciones = document.getElementById('recomendaciones');
    contenedorRecomendaciones.innerHTML = ''; // Limpiar contenidos anteriores
    resultados.forEach(resultado => {
        if (resultado.cumplimiento === "No Cumple") {
            const recomendaciones = recomendacionesPorServicio[resultado.servicio];
            recomendaciones.forEach(recomendacion => {
                const cardHTML = `
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${recomendacion.id}</h5>
                            <p class="card-text">${recomendacion.recomendacion}</p>
                        </div>
                    </div>
                `;
                contenedorRecomendaciones.innerHTML += cardHTML;
            });
        }
    });
}

function mostrarPuntaje(puntaje) {
    const puntajeContainer = document.getElementById('puntaje');
    if (puntajeContainer) {
        puntajeContainer.textContent = `Puntaje de Cumplimiento: ${puntaje.toFixed(2)}%`;
    }
}
