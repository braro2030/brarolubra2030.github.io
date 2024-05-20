document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const serviciosSeleccionados = params.get('servicios') ? params.get('servicios').split(',') : [];
    mostrarControles(serviciosSeleccionados);
});

function mostrarControles(serviciosSeleccionados) {
    const contenedor = document.getElementById('controles');
    contenedor.innerHTML = '';

    serviciosSeleccionados.forEach(servicio => {
        const tareas = tareasPorServiciopaas[servicio];
        tareas.forEach(tarea => {
            const card = document.createElement('div');
            card.className = 'col control-visible';
            const cardContent = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${tarea.id}</h5>
                        <p class="card-text">${tarea.descripcion}</p>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                        <button class="btn btn-outline-success cumple-btn">Cumple</button>
                        <button class="btn btn-outline-danger no-cumple-btn">No Cumple</button>
                        <button class="btn btn-outline-warning cumple-parcial-btn">Cumple Parcialmente</button>
                        <input type="text" class="form-control mt-2 comentario-input" placeholder="Comentarios..." id="comentario-${tarea.id}" disabled>
                    </div>
                </div>
            `;
            card.innerHTML = cardContent;
            contenedor.appendChild(card);

            card.querySelector('.cumple-btn').addEventListener('click', () => marcarCumplimiento(tarea.id, 'Cumple', card));
            card.querySelector('.no-cumple-btn').addEventListener('click', () => marcarCumplimiento(tarea.id, 'No Cumple', card));
            card.querySelector('.cumple-parcial-btn').addEventListener('click', () => marcarCumplimiento(tarea.id, 'Cumple Parcialmente', card));
        });
    });
}

function marcarCumplimiento(id, estado, card) {
    const botones = card.querySelectorAll('button');
    const comentarioInput = card.querySelector('.comentario-input');
    botones.forEach(btn => {
        if (btn.textContent === estado) {
            btn.classList.add('active');
            localStorage.setItem(id, estado);
            comentarioInput.disabled = estado !== 'Cumple Parcialmente';
        } else {
            btn.classList.remove('active');
        }
    });

    localStorage.setItem('comentario-' + id, comentarioInput.value);
    actualizarBotonEnviar();
}

function actualizarBotonEnviar() {
    const controles = document.querySelectorAll('.control-visible');
    let botonEnviar = document.getElementById('boton-enviar');
    if (controles.length && !botonEnviar) {
        botonEnviar = document.createElement('button');
        botonEnviar.id = 'boton-enviar';
        botonEnviar.textContent = 'Enviar Evaluación';
        botonEnviar.className = 'btn btn-primary mt-4';
        botonEnviar.onclick = enviarDatos;
        document.getElementById('boton-container').appendChild(botonEnviar);
    } else if (!controles.length && botonEnviar) {
        botonEnviar.remove();
    }
}


S


function calcularPuntaje(resultados) {
    const puntajeTotal = resultados.length;
    const puntajeObtenido = resultados.filter(r => r.cumplimiento === "Cumple").length;
    const puntajePorcentaje = (puntajeObtenido / puntajeTotal) * 100;

    const puntajeContainer = document.getElementById('puntaje');
    let calificacion = '';
    let color = '';

    if (puntajePorcentaje >= 90) {
        calificacion = 'A';
        color = 'green';
    } else if (puntajePorcentaje >= 70 && puntajePorcentaje < 90) {
        calificacion = 'B';
        color = 'blue';
    } else if (puntajePorcentaje >= 60 && puntajePorcentaje < 70) {
        calificacion = 'C';
        color = 'orange';
    } else {
        calificacion = 'D';
        color = 'red';
    }

    if (puntajeContainer) {
        puntajeContainer.innerHTML = `<span style="color: ${color}; font-size: 30px;">Calificación: ${calificacion}</span> (${puntajePorcentaje.toFixed(2)}%)`;
    } else {
        console.error('Elemento puntaje no encontrado en el DOM');
    }
}




function enviarDatos() {
    const controles = document.querySelectorAll('.control-visible');
    const resultados = Array.from(controles).map(control => {
        const id = control.querySelector('.card-title').textContent;
        const cumplimiento = localStorage.getItem(id);
        const comentario = document.getElementById('comentario-' + id).value; 
        const servicio = id.split("-")[0];
        return { id, servicio, cumplimiento, comentario };
    });
    mostrarRecomendaciones(resultados);
    
    dibujarGraficaPolarTotal(resultados); 
    calcularPuntaje(resultados);
}






document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const serviciosSeleccionados = params.get('servicios') ? params.get('servicios').split(',') : [];
    mostrarControles(serviciosSeleccionados);
});



function mostrarRecomendaciones(resultados) {
    document.getElementById('controles').style.display = 'none'; // Ocultar controles
    const contenedorRecomendaciones = document.getElementById('recomendaciones');
    contenedorRecomendaciones.innerHTML = '';
    contenedorRecomendaciones.style.display = 'block';

    const resultadosPorServicio = resultados.reduce((acc, resultado) => {
        if (!acc[resultado.servicio]) {
            acc[resultado.servicio] = [];
        }
        acc[resultado.servicio].push(resultado);
        return acc;
    }, {});

    Object.keys(resultadosPorServicio).forEach(servicio => {
        const servicioDiv = document.createElement('div');
        servicioDiv.className = 'servicio-recomendaciones';
        const tituloServicio = document.createElement('h3');
        tituloServicio.textContent = `Recomendaciones para ${servicio}`;
        servicioDiv.appendChild(tituloServicio);

        const row = document.createElement('div');
        row.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3';
        resultadosPorServicio[servicio].forEach(resultado => {
            if (resultado.cumplimiento === "No Cumple" || resultado.cumplimiento === "Cumple Parcialmente") {
                const recomendaciones = recomendacionesPorServicio[resultado.servicio].filter(rec => rec.id === resultado.id);
                recomendaciones.forEach(recomendacion => {
                    const col = document.createElement('div');
                    col.className = 'col';
                    const card = document.createElement('div');
                    card.className = 'card shadow-sm';

                    const cardBody = document.createElement('div');
                    cardBody.className = 'card-body';

                    const cardTitle = document.createElement('h5');
                    cardTitle.className = 'card-title';
                    cardTitle.textContent = `ID: ${recomendacion.id}`;

                    const cumplimientoLabel = document.createElement('span');
                    cumplimientoLabel.className = `badge ${resultado.cumplimiento === "Cumple Parcialmente" ? 'bg-warning' : 'bg-danger'}`;
                    cumplimientoLabel.textContent = resultado.cumplimiento;
                    cardTitle.appendChild(cumplimientoLabel);

                    const cardText = document.createElement('p');
                    cardText.className = 'card-text';
                    cardText.textContent = recomendacion.recomendacion;

                    // Agregar comentario si está presente
                    if (resultado.comentario) {
                        const comentarioText = document.createElement('p');
                        comentarioText.className = 'text-muted';
                        comentarioText.textContent = "Comentario: " + resultado.comentario;
                        cardBody.appendChild(comentarioText);
                    }

                    cardBody.appendChild(cardTitle);
                    cardBody.appendChild(cardText);
                    card.appendChild(cardBody);
                    col.appendChild(card);
                    row.appendChild(col);
                });
            }
        });

        servicioDiv.appendChild(row);
        contenedorRecomendaciones.appendChild(servicioDiv);
    });
}

function dibujarGraficaPolarTotal(resultados) {
    const graficasContainer = document.getElementById('graficas-servicio');
    graficasContainer.innerHTML = '';  // Limpiar gráficas anteriores
    graficasContainer.style.display = 'block'; // Asegurarse de que el contenedor está visible

    // Agrupar resultados por servicio
    const resultadosPorServicio = resultados.reduce((acc, curr) => {
        if (!acc[curr.servicio]) acc[curr.servicio] = { total: 0, noCumple: 0, cumpleParcialmente: 0 };
        acc[curr.servicio].total++;
        if (curr.cumplimiento === "No Cumple") {
            acc[curr.servicio].noCumple++;
        } else if (curr.cumplimiento === "Cumple Parcialmente") {
            acc[curr.servicio].cumpleParcialmente++;
        }
        return acc;
    }, {});

    const labels = Object.keys(resultadosPorServicio);
    const data = labels.map(label => resultadosPorServicio[label].noCumple + resultadosPorServicio[label].cumpleParcialmente);
    const backgroundColors = labels.map((_, i) => `hsl(${i * 360 / labels.length}, 70%, 70%)`);

    const graficaDiv = document.createElement('div');
    graficaDiv.className = 'grafica-servicio';
    graficaDiv.style.width = '400px';
    graficaDiv.style.height = '400px';
    const canvas = document.createElement('canvas');
    graficaDiv.appendChild(canvas);
    graficasContainer.appendChild(graficaDiv);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cumplimiento de Controles por Servicio',
                data: data,
                backgroundColor: backgroundColors,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    angleLines: {
                        display: false
                    },
                    suggestedMin: 0,
                    suggestedMax: Math.max(...labels.map(label => resultadosPorServicio[label].total))  // Máximo número de controles en cualquier servicio
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const servicio = context.label;
                            const total = resultadosPorServicio[servicio].total;
                            const noCumple = resultadosPorServicio[servicio].noCumple;
                            const cumpleParcialmente = resultadosPorServicio[servicio].cumpleParcialmente;
                            return `${servicio}: No Cumple ${noCumple}, Cumple Parcialmente ${cumpleParcialmente}, Total ${total}`;
                        }
                    }
                }
            }
        }
    });
}


