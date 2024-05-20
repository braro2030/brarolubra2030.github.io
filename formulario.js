function mostrarFormulario(tareas) {
    const formularioRespuestas = document.getElementById('formularioRespuestas');
    formularioRespuestas.innerHTML = ''; // Limpiar el formulario previo

    const form = document.createElement('form');
    form.id = 'formTareas';
    tareas.forEach((tarea, index) => {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.classList.add('form-group');

        const preguntaLabel = document.createElement('label');
        preguntaLabel.for = `pregunta-${index}`;
        preguntaLabel.textContent = `${tarea.id}: ${tarea.titulo}`;

        const respuestaSi = document.createElement('input');
        respuestaSi.type = 'radio';
        respuestaSi.id = `pregunta-${index}-si`;
        respuestaSi.name = `pregunta-${index}`;
        respuestaSi.value = 'si';
        respuestaSi.required = true;

        const respuestaNo = document.createElement('input');
        respuestaNo.type = 'radio';
        respuestaNo.id = `pregunta-${index}-no`;
        respuestaNo.name = `pregunta-${index}`;
        respuestaNo.value = 'no';

        const labelSi = document.createElement('label');
        labelSi.for = `pregunta-${index}-si`;
        labelSi.textContent = ' Sí ';

        const labelNo = document.createElement('label');
        labelNo.for = `pregunta-${index}-no`;
        labelNo.textContent = ' No ';

        preguntaDiv.appendChild(preguntaLabel);
        preguntaDiv.appendChild(respuestaSi);
        preguntaDiv.appendChild(labelSi);
        preguntaDiv.appendChild(respuestaNo);
        preguntaDiv.appendChild(labelNo);
        form.appendChild(preguntaDiv);
    });

    const botonEnviar = document.createElement('button');
    botonEnviar.type = 'submit';
    botonEnviar.textContent = 'Enviar Respuestas';
    botonEnviar.classList.add('btn', 'btn-primary');

    form.appendChild(botonEnviar);

    form.onsubmit = function(event) {
        event.preventDefault();
        procesarRespuestas(this);
    };

    formularioRespuestas.appendChild(form);
}

function procesarRespuestas(form) {
    const formData = new FormData(form);
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
    
}
