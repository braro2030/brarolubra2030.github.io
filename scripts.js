document.addEventListener('DOMContentLoaded', function() {
    let selecciones = [];

    
    document.querySelectorAll('.badge[data-service]:not([data-service="TODOS"])').forEach(badge => {
        badge.addEventListener('click', function() {
            const service = this.getAttribute('data-service');

            if (selecciones.includes(service)) {
    
                selecciones = selecciones.filter(s => s !== service);
                this.classList.remove('selected');
            } else {
    
                selecciones.push(service);
                this.classList.add('selected');
            }
        });
    });

    
    document.querySelector('.badge[data-service="TODOS"]').addEventListener('click', function() {
        const todos = document.querySelectorAll('.badge[data-service]:not([data-service="TODOS"])');
        if (selecciones.length === todos.length) {
            todos.forEach(badge => {
                badge.classList.remove('selected');
            });
            selecciones = [];
        } else {
            todos.forEach(badge => {
                badge.classList.add('selected');
                if (!selecciones.includes(badge.getAttribute('data-service'))) {
                    selecciones.push(badge.getAttribute('data-service'));
                }
            });
        }
    });
});

