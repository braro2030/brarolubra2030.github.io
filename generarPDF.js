function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'pt', 'a4');
  
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - 2 * margin;
  let yOffset = margin;

  
  const headerFontSize = 18;
  const subHeaderFontSize = 14;
  const textFontSize = 10; 
  const lineHeight = 12;
  const boxPadding = 10;

  
  const resultados = Array.from(document.querySelectorAll('.control-visible')).map(control => {
      const id = control.querySelector('.card-title').textContent;
      const cumplimiento = localStorage.getItem(id);
      const comentario = document.getElementById('comentario-' + id).value;
      const servicio = id.split("-")[0];
      return { id, servicio, cumplimiento, comentario };
  });

  const resumenPorServicio = resultados.reduce((acc, { servicio, cumplimiento }) => {
      if (!acc[servicio]) acc[servicio] = { total: 0, cumple: 0, noCumple: 0, cumpleParcialmente: 0 };
      acc[servicio].total++;
      if (cumplimiento === 'Cumple') acc[servicio].cumple++;
      if (cumplimiento === 'No Cumple') acc[servicio].noCumple++;
      if (cumplimiento === 'Cumple Parcialmente') acc[servicio].cumpleParcialmente++;
      return acc;
  }, {});

  
  doc.setFontSize(headerFontSize);
  doc.setTextColor(40, 78, 120);
  doc.text('Resumen de la Evaluación', margin, yOffset);
  yOffset += lineHeight + 10;

  doc.setFontSize(textFontSize);
  Object.keys(resumenPorServicio).forEach(servicio => {
      const { total, cumple, noCumple, cumpleParcialmente } = resumenPorServicio[servicio];
      const resumenText = `${servicio}: De ${total} controles, ${cumple} cumplieron, ${noCumple} no cumplieron, y ${cumpleParcialmente} cumplieron parcialmente.`;
      const splitText = doc.splitTextToSize(resumenText, contentWidth);
      doc.text(splitText, margin, yOffset);
      yOffset += splitText.length * lineHeight + 5;
  });
  yOffset += lineHeight;

  
  doc.setFontSize(headerFontSize);
  doc.setTextColor(40, 78, 120);
  doc.text('Resultado de la Evaluación', margin, yOffset);
  yOffset += lineHeight + 10;

  resultados.forEach(({ id, servicio, cumplimiento, comentario }) => {
      if (cumplimiento === 'Cumple') return; 

      const recomendacion = (recomendacionesPorServiciosaas[servicio] || []).find(r => r.id === id);
      if (!recomendacion) return;

      const recomendacionText = `Recomendación: ${recomendacion.recomendacion}`;
      const splitText = doc.splitTextToSize(recomendacionText, contentWidth - 2 * boxPadding);
      const boxHeight = (splitText.length + 4) * lineHeight + 2 * boxPadding;

      if (yOffset + boxHeight > pageHeight - margin) {
          doc.addPage();
          yOffset = margin;
      }

      
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yOffset, contentWidth, boxHeight, 'F');

      doc.setFontSize(subHeaderFontSize);
      if (cumplimiento === 'No Cumple') doc.setTextColor(255, 0, 0); // Rojo
      else if (cumplimiento === 'Cumple Parcialmente') doc.setTextColor(255, 165, 0); // Amarillo
      doc.text(`Control: ${id}`, margin + boxPadding, yOffset + lineHeight);

      doc.setFontSize(textFontSize);
      doc.setTextColor(40, 40, 40);
      doc.text(`Estado: ${cumplimiento}`, margin + boxPadding, yOffset + lineHeight * 2);

      const splitComentarios = doc.splitTextToSize(`Comentarios: ${comentario}`, contentWidth - 2 * boxPadding);
      doc.text(splitComentarios, margin + boxPadding, yOffset + lineHeight * 3);

      
      splitText.forEach((line, index) => {
          doc.text(line, margin + boxPadding, yOffset + lineHeight * (4 + index), { align: 'justify' });
      });

      yOffset += boxHeight + 10;
  });

  
  const puntaje = calcularPuntaje(resultados);
  doc.setFontSize(headerFontSize);
  doc.setTextColor(40, 78, 120);
  doc.text(`Puntaje de Cumplimiento: ${puntaje}`, margin, yOffset);
  yOffset += lineHeight + 10;

  
  const canvas = document.querySelector('.grafica-servicio canvas');
  if (canvas) {
      const imgData = canvas.toDataURL('image/png');
      if (yOffset + 100 > pageHeight - margin) {
          doc.addPage();
          yOffset = margin;
      }
      doc.addImage(imgData, 'PNG', margin, yOffset, contentWidth, contentWidth * canvas.height / canvas.width); // Ajusta el tamaño y posición de la imagen según sea necesario
      yOffset += contentWidth * canvas.height / canvas.width + 10;
  }

  
  doc.save('resultado_evaluacion.pdf');
}

const grafica = document.getElementById("id-de-tu-grafica");
    html2canvas(grafica).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 20, yOffset, 560, 280);
        yOffset += 300;

        
        doc.save('resultado_evaluacion.pdf');
    });

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

  return `Calificación: ${calificacion} (${puntajePorcentaje.toFixed(2)}%)`;
}
