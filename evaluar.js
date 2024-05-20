document.addEventListener('DOMContentLoaded', function() {
    const btnEvaluar = document.getElementById('btnEvaluar');
    if (btnEvaluar) {
        btnEvaluar.addEventListener('click', function() {
            const serviciosSeleccionados = document.querySelectorAll('.badge[data-service].selected');
            
            const serviciosAEvaluar = Array.from(serviciosSeleccionados).map(el => encodeURIComponent(el.getAttribute('data-service')));

            
            const url = '/SAAS/Paginaconcontroles/controlesseleccionados.html?servicios=' + serviciosAEvaluar.join(',');

            
            window.location.href = url;
        });
    }
});
