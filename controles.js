

document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const serviciosSeleccionados = params.get('servicios') ? params.get('servicios').split(',') : [];
  mostrarControles(serviciosSeleccionados);
  actualizarBotonEnviar();
});

function mostrarControles(serviciosSeleccionados) {
  const contenedor = document.getElementById('controles');
  contenedor.innerHTML = '';

  serviciosSeleccionados.forEach(servicio => {
      const tareas = tareasPorServicio[servicio];
      if (tareas && tareas.length > 0) {
          tareas.forEach(tarea => {
              const card = document.createElement('div');
              card.className = 'col';
              const cardContent = `
                  <div class="card h-100">
                      <div class="card-body">
                          <h5 class="card-title">${tarea.id}</h5>
                          <p class="card-text">${tarea.descripcion}</p>
                      </div>
                      <div class="card-footer bg-transparent border-top-0">
                          <button class="btn btn-outline-success cumple-btn" onclick="marcarCumplimiento('${tarea.id}', 'Cumple', this)">Cumple</button>
                          <button class="btn btn-outline-danger no-cumple-btn" onclick="marcarCumplimiento('${tarea.id}', 'No Cumple', this)">No Cumple</button>
                          <input type="text" class="form-control mt-2 comentario-input" placeholder="Comentarios..." id="comentario-${tarea.id}">
                      </div>
                  </div>
              `;
              card.innerHTML = cardContent;
              contenedor.appendChild(card);
          });
      } else {
          const mensajeError = document.createElement('div');
          mensajeError.className = 'alert alert-danger';
          mensajeError.textContent = `No se encontraron tareas para el servicio: ${servicio}`;
          contenedor.appendChild(mensajeError);
      }
  });

  
  actualizarEstadoControles();
}

function marcarCumplimiento(id, estado, elemento) {
  const botones = elemento.closest('.card-footer').querySelectorAll('button');
  botones.forEach(btn => btn.classList.remove('active'));
  elemento.classList.add('active');

  localStorage.setItem(id, estado);
  localStorage.setItem('comentario-' + id, document.getElementById('comentario-' + id).value);
  actualizarBotonEnviar();
}

function actualizarBotonEnviar() {
  const controles = Object.keys(tareasPorServicio).reduce((acc, curr) => acc.concat(tareasPorServicio[curr]), []);
  const completados = controles.every(control => localStorage.getItem(control.id) === 'Cumple' || localStorage.getItem(control.id) === 'No Cumple');
  const botonEnviar = document.getElementById('boton-enviar');
  if (completados && !botonEnviar) {
      const boton = document.createElement('button');
      boton.id = 'boton-enviar';
      boton.textContent = 'Enviar Evaluación';
      boton.className = 'btn btn-primary mt-4';
      boton.onclick = enviarDatos;
      document.body.appendChild(boton); 
  } else if (!completados && botonEnviar) {
      botonEnviar.remove();
  }
}

function enviarDatos() {
  const controles = Object.keys(tareasPorServicio).reduce((acc, curr) => acc.concat(tareasPorServicio[curr]), []);
  const resultados = controles.map(control => ({
      id: control.id,
      cumplimiento: localStorage.getItem(control.id),
      comentario: localStorage.getItem('comentario-' + control.id)
  }));
  console.log(resultados); 
}

function actualizarEstadoControles() {
  const controles = Object.keys(tareasPorServicio).reduce((acc, curr) => acc.concat(tareasPorServicio[curr]), []);

  controles.forEach(control => {
      const estadoCumple = localStorage.getItem(control.id) === 'Cumple';
      const estadoNoCumple = localStorage.getItem(control.id) === 'No Cumple';
      const botonCumple = document.querySelector(`button[onclick="marcarCumplimiento('${control.id}', 'Cumple', this)"]`);
      const botonNoCumple = document.querySelector(`button[onclick="marcarCumplimiento('${control.id}', 'No Cumple', this)"]`);
      
      if (estadoCumple && botonCumple) {
          botonCumple.classList.add('active');
      } else if (estadoNoCumple && botonNoCumple) {
          botonNoCumple.classList.add('active');
      }

      
      const comentarioInput = document.getElementById('comentario-' + control.id);
      if (comentarioInput) {
          comentarioInput.value = localStorage.getItem('comentario-' + control.id) || '';
      }
  });
}
