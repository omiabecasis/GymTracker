document.addEventListener('DOMContentLoaded', function() {

    // --- Definición de la Rutina ---
    const scheduleData = [
        { name: 'Desayuno', start: '10:00', end: '10:30', duration: 30, colorClass: 'color-meal' },
        { name: 'Barrer piso', start: '10:30', end: '11:00', duration: 30, colorClass: 'color-cleaning' },
        { name: 'Ordenar pieza', start: '11:00', end: '11:45', duration: 45, colorClass: 'color-personal' },
        { name: 'Hacer almuerzo', start: '11:45', end: '12:45', duration: 60, colorClass: 'color-meal' },
        { name: 'Almorzar', start: '12:45', end: '13:15', duration: 30, colorClass: 'color-meal' },
        { name: 'Prepararse para salir', start: '13:15', end: '13:45', duration: 30, colorClass: 'color-prep' },
        { name: 'Entrenar', start: '13:45', end: '17:45', duration: 240, colorClass: 'color-training' },
        { name: 'Transición / Viaje Escuela', start: '17:45', end: '18:00', duration: 15, colorClass: 'color-travel' },
        { name: 'Escuela', start: '18:00', end: '22:15', duration: 255, colorClass: 'color-school' },
        { name: 'Viaje / Desconectar', start: '22:15', end: '22:45', duration: 30, colorClass: 'color-travel' },
        { name: 'Hacer cena', start: '22:45', end: '00:15', duration: 90, colorClass: 'color-meal' },
        { name: 'Cenar', start: '00:15', end: '00:45', duration: 30, colorClass: 'color-meal' },
        { name: 'Trapear piso', start: '00:45', end: '01:30', duration: 45, colorClass: 'color-cleaning' },
        { name: 'Baño', start: '01:30', end: '02:00', duration: 30, colorClass: 'color-sleep-prep' },
    ];

    // --- Cálculo y Generación de la Barra ---
    const totalDurationMinutes = 16 * 60; // 16 horas de 10:00 a 02:00 = 960 minutos
    const scheduleBar = document.getElementById('scheduleBar');
    const tooltip = document.getElementById('tooltip');

    if (!scheduleBar || !tooltip) {
        console.error("Error: No se encontraron los elementos 'scheduleBar' o 'tooltip'.");
        return;
    }

    scheduleData.forEach(activity => {
        const segment = document.createElement('div');
        const percentageWidth = (activity.duration / totalDurationMinutes) * 100;

        segment.classList.add('activity-segment', activity.colorClass);
        segment.style.width = `${percentageWidth}%`;

        // Guardar datos para el tooltip
        segment.dataset.name = activity.name;
        segment.dataset.time = `${activity.start} - ${activity.end}`;
        segment.dataset.duration = `${activity.duration} min`;

        // Añadir Event Listeners para el tooltip
        segment.addEventListener('mouseover', (event) => {
            tooltip.innerHTML = `
                <strong>${event.target.dataset.name}</strong><br>
                ${event.target.dataset.time}<br>
                (${event.target.dataset.duration})
            `;
            tooltip.style.display = 'block';
        });

        segment.addEventListener('mousemove', (event) => {
            // Posiciona el tooltip cerca del cursor
            // Ajusta los +10 / +15 para que no quede exactamente debajo del cursor
            tooltip.style.left = `${event.pageX + 15}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
        });

        segment.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });

        scheduleBar.appendChild(segment);
    });

});
