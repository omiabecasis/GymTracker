document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const daySelector = document.getElementById('day-selector');
    const exerciseDisplay = document.getElementById('exercise-display');
    const dayButtons = document.querySelectorAll('.day-btn');
    const toggleUpdateBtn = document.getElementById('toggle-update-btn');
    const updateSection = document.getElementById('update-section');
    const routineJsonInput = document.getElementById('routine-json-input');
    const saveRoutineBtn = document.getElementById('save-routine-btn');
    const saveFeedback = document.getElementById('save-feedback');

    // --- Claves para LocalStorage ---
    const ROUTINE_STORAGE_KEY = 'tendonRoutineData';
    const COMPLETION_STORAGE_KEY = 'tendonCompletionStatus'; // NUEVA CLAVE

    // --- Variables Globales ---
    let currentWeekRoutine = {};
    let completionStatus = {}; // NUEVO: Objeto para guardar estado completado
    let currentlySelectedDayId = 'day-1';

    // --- Rutina por Defecto (Etapa 0/1 combinada) ---
    // (Misma rutina default que en la respuesta anterior, la omito aquí por brevedad)
        const defaultWeekRoutine = {
        "day-1": { "type": "Rodilla HSR", "exercises": [ { "name": "Calentamiento", "instructions": "5-10 minutos de cardio ligero (bicicleta estática, caminar suave).", "sets": "N/A", "reps": "5-10 min", "rest": "N/A", "tempo": "N/A" }, { "name": "Sentadilla con Talones Elevados (HSR)", "instructions": [ "Coloca talones sobre disco/libro (2-5 cm).", "Puedes empezar con peso corporal o añadir un peso ligero (ej. mancuerna al pecho) que te permita mantener la técnica y el tempo.", "Baja LENTAMENTE (3 seg).", "Pausa 1 seg abajo (controlando, sin dolor > 4-5/10).", "Sube LENTAMENTE (3 seg)." ], "sets": "4", "reps": "10-12", "rest": "2 minutos", "tempo": "3 / 1 / 3" }, { "name": "Wall Sit (Isométrico Opcional Post)", "instructions": [ "Si sientes molestias leves después de las sentadillas, puedes añadir esto.", "Apoya espalda en pared, rodillas 60-90°.", "Mantén sin moverte.", "Intensidad moderada (5-7/10 RPE)." ], "sets": "1-2", "reps": "Mantener 45 segundos", "rest": "2 minutos", "tempo": "Isométrico" } ] },
        "day-2": { "type": "Isométrico + Movilidad Tobillo", "exercises": [ { "name": "Wall Sit (Isométrico Principal)", "instructions": [ "Apoya espalda en pared, rodillas 60-90° (ángulo cómodo).", "Mantén posición sin moverte.", "Intensidad moderada-alta (7/10 RPE)." ], "sets": "4", "reps": "Mantener 45 segundos", "rest": "2 minutos", "tempo": "Isométrico" }, { "name": "Movilidad Tobillo Rodilla a Pared", "instructions": ["Calentamiento/Movilidad.", "Talón siempre en suelo."], "sets": "2", "reps": "15 por pierna", "rest": "Alternar", "tempo": "Controlado" }, { "name": "PNF CR Gemelo (Rodilla Recta)", "instructions": ["1. Estira suave 10s.", "2. CONTRAER iso 6-8s.", "3. RELAJAR 2-3s.", "4. ESTIRAR nuevo rango 15-20s."], "sets": "2-3 ciclos", "reps": "por pierna", "rest": "30 seg", "tempo": "Ver pasos" }, { "name": "PNF CR Sóleo (Rodilla Doblada)", "instructions": ["1. Estira suave 10s.", "2. CONTRAER iso 6-8s.", "3. RELAJAR 2-3s.", "4. ESTIRAR nuevo rango 15-20s."], "sets": "2-3 ciclos", "reps": "por pierna", "rest": "30 seg", "tempo": "Ver pasos" } ] },
        "day-3": { "type": "Rodilla HSR", "exercises": [ { "name": "Calentamiento", "instructions": "5-10 min cardio ligero.", "sets": "N/A", "reps": "5-10 min", "rest": "N/A", "tempo": "N/A"}, { "name": "Sentadilla con Talones Elevados (HSR)", "instructions": ["Como Día 1. Considera si puedes usar el mismo peso o necesitas ajustarlo según la respuesta del Día 2."], "sets": "4", "reps": "10-12", "rest": "2 minutos", "tempo": "3 / 1 / 3"}, { "name": "Wall Sit (Isométrico Opcional Post)", "instructions": ["Opcional post-HSR si ayuda."], "sets": "1-2", "reps": "Mantener 45 segundos", "rest": "2 minutos", "tempo": "Isométrico"} ] },
        "day-4": { "type": "Isométrico + Movilidad Tobillo", "exercises": [ { "name": "Wall Sit (Isométrico Principal)", "instructions": ["Como Día 2."], "sets": "4", "reps": "Mantener 45 segundos", "rest": "2 minutos", "tempo": "Isométrico"}, { "name": "Movilidad Tobillo Rodilla a Pared", "instructions": ["Como Día 2."], "sets": "2", "reps": "15 por pierna", "rest": "Alternar", "tempo": "Controlado"}, { "name": "PNF CR Gemelo (Rodilla Recta)", "instructions": ["Como Día 2."], "sets": "2-3 ciclos", "reps": "por pierna", "rest": "30 seg", "tempo": "Ver pasos"}, { "name": "PNF CR Sóleo (Rodilla Doblada)", "instructions": ["Como Día 2."], "sets": "2-3 ciclos", "reps": "por pierna", "rest": "30 seg", "tempo": "Ver pasos"} ] },
        "day-5": { "type": "Rodilla HSR", "exercises": [ { "name": "Calentamiento", "instructions": "5-10 min cardio ligero.", "sets": "N/A", "reps": "5-10 min", "rest": "N/A", "tempo": "N/A"}, { "name": "Sentadilla con Talones Elevados (HSR)", "instructions": ["Como Días 1 y 3. Evalúa si puedes aumentar ligeramente el peso si las repeticiones son fáciles y la recuperación ha sido buena."], "sets": "4", "reps": "10-12", "rest": "2 minutos", "tempo": "3 / 1 / 3"}, { "name": "Wall Sit (Isométrico Opcional Post)", "instructions": ["Opcional post-HSR si ayuda."], "sets": "1-2", "reps": "Mantener 45 segundos", "rest": "2 minutos", "tempo": "Isométrico"} ] },
        "day-6": { "type": "Isométrico + Movilidad Tobillo", "exercises": [ { "name": "Wall Sit (Isométrico Principal)", "instructions": ["Como Días 2 y 4."], "sets": "4", "reps": "Mantener 45 segundos", "rest": "2 minutos", "tempo": "Isométrico"}, { "name": "Movilidad Tobillo Rodilla a Pared", "instructions": ["Como Días 2 y 4."], "sets": "2", "reps": "15 por pierna", "rest": "Alternar", "tempo": "Controlado"}, { "name": "PNF CR Gemelo (Rodilla Recta)", "instructions": ["Como Días 2 y 4."], "sets": "2-3 ciclos", "reps": "por pierna", "rest": "30 seg", "tempo": "Ver pasos"}, { "name": "PNF CR Sóleo (Rodilla Doblada)", "instructions": ["Como Días 2 y 4."], "sets": "2-3 ciclos", "reps": "por pierna", "rest": "30 seg", "tempo": "Ver pasos"} ] },
        "day-7": { "type": "Descanso", "exercises": [ { "name": "Descanso Activo o Completo", "instructions": "Caminata ligera o descanso total. Permite que el cuerpo se recupere.", "sets": "N/A", "reps": "N/A", "rest": "N/A", "tempo": "N/A" } ] }
    };

    // --- Función para Cargar Datos (Rutina y Estado Completado) ---
    function loadData() {
        // Cargar Rutina
        const storedRoutine = localStorage.getItem(ROUTINE_STORAGE_KEY);
        if (storedRoutine) {
            try {
                currentWeekRoutine = JSON.parse(storedRoutine);
                console.log("Rutina cargada desde LocalStorage.");
            } catch (e) {
                console.error("Error parseando rutina, usando default:", e);
                currentWeekRoutine = defaultWeekRoutine;
                localStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(currentWeekRoutine));
            }
        } else {
            console.log("No hay rutina guardada, usando y guardando default.");
            currentWeekRoutine = defaultWeekRoutine;
            localStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(currentWeekRoutine));
        }

        // Cargar Estado Completado
        const storedCompletion = localStorage.getItem(COMPLETION_STORAGE_KEY);
        if (storedCompletion) {
            try {
                completionStatus = JSON.parse(storedCompletion);
                console.log("Estado completado cargado.");
            } catch (e) {
                console.error("Error parseando estado completado, iniciando vacío:", e);
                completionStatus = {};
                localStorage.setItem(COMPLETION_STORAGE_KEY, JSON.stringify(completionStatus)); // Guardar vacío si hay error
            }
        } else {
            console.log("No hay estado completado guardado, iniciando vacío.");
            completionStatus = {};
            localStorage.setItem(COMPLETION_STORAGE_KEY, JSON.stringify(completionStatus)); // Guardar vacío inicialmente
        }

        updateDayButtonLabels();
        // Seleccionar y mostrar Día 1 por defecto al cargar
        const initialButton = document.getElementById(currentlySelectedDayId);
         if (initialButton) {
            dayButtons.forEach(btn => btn.classList.remove('active-day'));
            initialButton.classList.add('active-day');
            displayExercises(currentlySelectedDayId);
         }
    }

     // --- Función para Guardar Estado Completado en LocalStorage ---
     function saveCompletionStatus() {
         try {
             localStorage.setItem(COMPLETION_STORAGE_KEY, JSON.stringify(completionStatus));
         } catch (e) {
             console.error("Error guardando estado completado:", e);
         }
     }

     // --- Función para Actualizar Nombres de Botones ---
     function updateDayButtonLabels() {
        dayButtons.forEach(button => {
            const dayId = button.id;
            // Añadir comprobación de existencia antes de acceder a 'type'
            if (currentWeekRoutine && currentWeekRoutine[dayId] && currentWeekRoutine[dayId].type) {
                button.textContent = `Día ${dayId.split('-')[1]} (${currentWeekRoutine[dayId].type})`;
            } else {
                button.textContent = `Día ${dayId.split('-')[1]}`; // Fallback
            }
        });
    }


    // --- Función para Guardar Nueva Rutina ---
    function saveRoutine() {
        const jsonInput = routineJsonInput.value.trim();
        if (!jsonInput) {
            showFeedback("El área de texto está vacía.", true);
            return;
        }
        try {
            const newRoutineObject = JSON.parse(jsonInput);
            if (typeof newRoutineObject !== 'object' || newRoutineObject === null || !newRoutineObject['day-1']) {
                 throw new Error("El formato JSON no parece una rutina válida.");
            }
            localStorage.setItem(ROUTINE_STORAGE_KEY, jsonInput);
            currentWeekRoutine = newRoutineObject;

            // *** IMPORTANTE: Al guardar nueva rutina, reiniciar estado completado ***
            completionStatus = {};
            saveCompletionStatus(); // Guardar el estado vacío

            updateDayButtonLabels();
            displayExercises(currentlySelectedDayId); // Refrescar vista
            showFeedback("¡Rutina guardada y actualizada! Estado completado reiniciado.", false);
            routineJsonInput.value = '';
            updateSection.classList.add('hidden');
        } catch (e) {
            console.error("Error al guardar/parsear rutina:", e);
            showFeedback(`Error al procesar: ${e.message}. Revisa el código JSON pegado. No se guardó.`, true);
        }
    }

    // --- Función para Mostrar Feedback ---
    function showFeedback(message, isError) {
        saveFeedback.textContent = message;
        saveFeedback.className = isError ? 'feedback-error' : 'feedback-success';
        setTimeout(() => {
            saveFeedback.textContent = '';
            saveFeedback.className = '';
        }, 7000);
    }

    // --- Lógica para Mostrar Ejercicios (ACTUALIZADA para estado completado) ---
    function displayExercises(dayId) {
        currentlySelectedDayId = dayId;
        exerciseDisplay.innerHTML = '';
        const dayData = currentWeekRoutine[dayId];

        if (!dayData || !dayData.exercises || dayData.exercises.length === 0) {
            exerciseDisplay.innerHTML = '<p>No hay ejercicios programados para este día.</p>';
            return;
        }

        const dayTitle = document.createElement('h2');
        dayTitle.textContent = `Día ${dayId.split('-')[1]}${dayData.type ? ': ' + dayData.type : ''}`;
        dayTitle.style.textAlign = 'center';
        dayTitle.style.marginBottom = '15px';
        exerciseDisplay.appendChild(dayTitle);

        // Asegurarse de que haya una entrada para este día en completionStatus
        if (!completionStatus[dayId]) {
            completionStatus[dayId] = []; // Inicializar si no existe
        }
        const completedIndices = new Set(completionStatus[dayId]); // Usar Set para búsqueda rápida

        dayData.exercises.forEach((exercise, index) => {
            const exerciseItem = document.createElement('div');
            exerciseItem.classList.add('exercise-item');
            exerciseItem.dataset.exerciseIndex = index; // Guardar índice

            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('exercise-details');
            // ...(código para añadir nombre, instrucciones, parámetros - sin cambios)
             const name = document.createElement('h3');
             name.textContent = exercise.name;
             detailsDiv.appendChild(name);
             if (Array.isArray(exercise.instructions)) { /* ... (como antes) ... */
                const instructionsList = document.createElement('ul');
                exercise.instructions.forEach(step => {
                    const li = document.createElement('li');
                    li.innerHTML = step;
                    instructionsList.appendChild(li);
                });
                detailsDiv.appendChild(instructionsList);
             } else if (exercise.instructions) { /* ... (como antes) ... */
                 const instructions = document.createElement('p');
                 instructions.innerHTML = `<strong>Instrucciones:</strong> ${exercise.instructions}`;
                 detailsDiv.appendChild(instructions);
             }
             const params = document.createElement('p');
             let paramsText = '';
             if(exercise.sets) paramsText += `<strong>Series:</strong> ${exercise.sets}`;
             if(exercise.reps) paramsText += ` | <strong>Reps/Tiempo:</strong> ${exercise.reps}`;
             if(exercise.rest) paramsText += ` | <strong>Descanso:</strong> ${exercise.rest}`;
             if(exercise.tempo) paramsText += ` | <strong>Tempo:</strong> ${exercise.tempo}`;
             if (paramsText && exercise.sets !== 'N/A') {
                 params.innerHTML = paramsText;
                 detailsDiv.appendChild(params);
             }
            exerciseItem.appendChild(detailsDiv);


            // Botón Completar (si aplica)
            if (exercise.sets !== 'N/A') {
                const completeBtn = document.createElement('button');
                completeBtn.classList.add('complete-btn');
                const isCompleted = completedIndices.has(index); // Comprobar si este índice está completado

                // Establecer estado inicial del botón y el item
                if (isCompleted) {
                    exerciseItem.classList.add('completed');
                    completeBtn.textContent = '✓ Completo';
                } else {
                    completeBtn.textContent = '✓ Completar';
                }

                // Event Listener del botón (ACTUALIZADO)
                completeBtn.addEventListener('click', () => {
                    const currentlyCompleted = exerciseItem.classList.toggle('completed');
                    const exerciseIndex = parseInt(exerciseItem.dataset.exerciseIndex); // Obtener índice

                    // Actualizar estado en memoria
                    if (!completionStatus[currentlySelectedDayId]) {
                         completionStatus[currentlySelectedDayId] = []; // Asegurar que exista el array
                    }

                    if (currentlyCompleted) {
                        completeBtn.textContent = '✓ Completo';
                        // Añadir índice si no está ya
                        if (!completionStatus[currentlySelectedDayId].includes(exerciseIndex)) {
                            completionStatus[currentlySelectedDayId].push(exerciseIndex);
                        }
                    } else {
                        completeBtn.textContent = '✓ Completar';
                        // Quitar índice
                        completionStatus[currentlySelectedDayId] = completionStatus[currentlySelectedDayId].filter(i => i !== exerciseIndex);
                    }

                    // Guardar estado actualizado en LocalStorage
                    saveCompletionStatus();
                });
                exerciseItem.appendChild(completeBtn);
             }

            exerciseDisplay.appendChild(exerciseItem);
        });
    }

    // --- Event Listeners ---
    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            dayButtons.forEach(btn => btn.classList.remove('active-day'));
            button.classList.add('active-day');
            displayExercises(button.id);
        });
    });

    toggleUpdateBtn.addEventListener('click', () => {
        updateSection.classList.toggle('hidden');
        saveFeedback.textContent = '';
        saveFeedback.className = '';
        if (!updateSection.classList.contains('hidden')) {
            routineJsonInput.focus();
        }
    });

    saveRoutineBtn.addEventListener('click', saveRoutine);

    // --- Carga Inicial de Datos (Rutina y Estado Completado) ---
    loadData();

});
