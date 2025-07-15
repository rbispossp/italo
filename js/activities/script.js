// js/activities/days_of_week.js
document.addEventListener('DOMContentLoaded', () => {
    const daysToOrder = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]; // Monday is fixed
    const correctFullOrder = ["Monday", ...daysToOrder];

    const draggableDaysPoolEl = document.getElementById('draggable-days-pool');
    const daysDropZoneEl = document.getElementById('days-drop-zone');
    const checkOrderBtn = document.getElementById('check-order-btn');
    const resetDragBtn = document.getElementById('reset-drag-btn');
    const orderFeedbackEl = document.getElementById('order-feedback');
    
    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');
    const clickSound = document.getElementById('click-sound');

    let draggedItem = null; // To store the item being dragged

    // Check for critical elements for Part 1
    if (!draggableDaysPoolEl || !daysDropZoneEl || !checkOrderBtn || !resetDragBtn || !orderFeedbackEl) {
        console.error("Critical elements for Days of Week (Part 1 - Drag/Drop) are missing.");
        const orderSection = document.getElementById('order-days-section');
        if(orderSection) orderSection.innerHTML = "<p style='color:red; font-weight:bold;'>Error: Drag and drop part cannot load.</p>";
        // return; // Don't stop entirely if Part 2 can still load
    }

    /**
     * Plays a sound effect.
     * @param {HTMLAudioElement} soundElement - The audio element to play.
     */
    function playSound(soundElement) {
        if(soundElement){
            soundElement.currentTime = 0;
            soundElement.play().catch(e => console.error("Audio play failed:", e));
        }
    }

    // --- Part 1: Order the Days (Drag and Drop) ---
    /**
     * Sets up the draggable day items in the pool.
     */
    function setupDraggableDays() {
        if(!draggableDaysPoolEl || !daysDropZoneEl) return;
        draggableDaysPoolEl.innerHTML = ''; 
        daysDropZoneEl.innerHTML = ''; 
        orderFeedbackEl.textContent = '';
        orderFeedbackEl.className = 'feedback-subsection';
        if(checkOrderBtn) checkOrderBtn.disabled = false;


        const shuffledDays = [...daysToOrder].sort(() => Math.random() - 0.5);
        shuffledDays.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day-item');
            dayDiv.textContent = day;
            dayDiv.draggable = true;
            dayDiv.id = `drag-${day.toLowerCase().replace(/\s+/g, '-')}`; // Make ID HTML valid
            dayDiv.addEventListener('dragstart', handleDragStart);
            dayDiv.addEventListener('dragend', handleDragEnd);
            draggableDaysPoolEl.appendChild(dayDiv);
        });
    }

    function handleDragStart(e) {
        draggedItem = e.target; // Store the element being dragged
        e.dataTransfer.setData('text/plain', e.target.id);
        setTimeout(() => { // Timeout to allow browser to render drag image before hiding
            e.target.classList.add('dragging'); // Style the source item
        }, 0);
        playSound(clickSound);
    }

    function handleDragEnd(e) {
        if(draggedItem) draggedItem.classList.remove('dragging'); // Clean up style
        draggedItem = null;
    }

    // Add drag event listeners to both pool and drop zone to allow moving items back
    [draggableDaysPoolEl, daysDropZoneEl].forEach(zone => {
        if(zone){
            zone.addEventListener('dragover', handleDragOver);
            zone.addEventListener('dragleave', handleDragLeave);
            zone.addEventListener('drop', handleDrop);
        }
    });

    function handleDragOver(e) {
        e.preventDefault(); 
        if (e.currentTarget.classList.contains('drop-zone') && e.currentTarget.children.length >= daysToOrder.length && e.currentTarget === daysDropZoneEl) {
            // Don't add drag-over if drop zone is full (for target drop zone only)
            return;
        }
        e.currentTarget.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        if (!draggedItem) return; // Should not happen if dragstart was successful

        // If dropping into the target drop zone and it's already full (6 items), don't allow drop
        if (e.currentTarget === daysDropZoneEl && e.currentTarget.children.length >= daysToOrder.length) {
            orderFeedbackEl.textContent = "The order box is full. Drag items out to change the order.";
            orderFeedbackEl.className = 'feedback-subsection feedback-incorrect visible';
            playSound(incorrectSound);
            return;
        }
        
        // Append the dragged item to the current drop target (pool or drop zone)
        e.currentTarget.appendChild(draggedItem);
    }

    if(checkOrderBtn) checkOrderBtn.addEventListener('click', () => {
        if(!daysDropZoneEl || !orderFeedbackEl) return;
        const droppedItems = Array.from(daysDropZoneEl.children).map(child => child.textContent);
        const studentOrder = ["Monday", ...droppedItems]; 
        
        let isCorrect = studentOrder.length === correctFullOrder.length && 
                        studentOrder.every((day, index) => day === correctFullOrder[index]);

        if (isCorrect) {
            orderFeedbackEl.textContent = "Perfect order! Moving to Part 2...";
            orderFeedbackEl.className = 'feedback-subsection feedback-correct visible';
            playSound(correctSound);
            checkOrderBtn.disabled = true; 
            if(resetDragBtn) resetDragBtn.disabled = true;
            // Disable further dragging for items in drop zone
            Array.from(daysDropZoneEl.children).forEach(child => child.draggable = false);

            setTimeout(() => {
                const orderSection = document.getElementById('order-days-section');
                const listenSection = document.getElementById('listen-verify-days-section');
                if(orderSection) orderSection.classList.add('hidden');
                if(listenSection) listenSection.classList.remove('hidden');
                setupListenVerifyDays();
            }, 2000);
        } else {
            orderFeedbackEl.textContent = "Not quite in the right order. Try rearranging them or dragging them back to the pool.";
            orderFeedbackEl.className = 'feedback-subsection feedback-incorrect visible';
            playSound(incorrectSound);
        }
    });

    if(resetDragBtn) resetDragBtn.addEventListener('click', setupDraggableDays);


    // --- Part 2: Listen and Verify ---
    const orderedDaysListEl = document.getElementById('ordered-days-list');
    const listenFeedbackEl = document.getElementById('listen-feedback');
    let resetListenBtn = document.getElementById('reset-listen-btn');
    let expectedDayIndex = 0;

    // Check for critical elements for Part 2
    if (!orderedDaysListEl || !listenFeedbackEl || !resetListenBtn) {
        console.error("Critical elements for Days of Week (Part 2 - Listen/Verify) are missing.");
        const listenSection = document.getElementById('listen-verify-days-section');
        if(listenSection) listenSection.innerHTML = "<p style='color:red; font-weight:bold;'>Error: Listening part cannot load.</p>";
    }

    /**
     * Sets up the list of days for the listen and verify part.
     */
    function setupListenVerifyDays() {
        if (!orderedDaysListEl || !listenFeedbackEl || !resetListenBtn) {
            console.error("Debug: Critical elements for Part 2 (setupListenVerifyDays) are missing for setup.");
            const listenSection = document.getElementById('listen-verify-days-section');
            if(listenSection) listenSection.innerHTML = "<p style='color:red; font-weight:bold;'>Error: Listening part cannot fully initialize.</p>";
            return;
        }

        orderedDaysListEl.innerHTML = ''; // Clear previous list
        if(listenFeedbackEl) {
            listenFeedbackEl.textContent = '';
            listenFeedbackEl.className = 'feedback-subsection';
        }
        if(resetListenBtn) {
            resetListenBtn.classList.add('hidden'); // Hide reset button initially
            // Ensure event listener is not duplicated if setup is called multiple times (e.g. on reset)
            const newResetBtn = resetListenBtn.cloneNode(true);
            resetListenBtn.parentNode.replaceChild(newResetBtn, resetListenBtn);
            resetListenBtn = newResetBtn; // Update reference
            resetListenBtn.addEventListener('click', setupListenVerifyDays);
        }
        expectedDayIndex = 0; // Reset progress

        correctFullOrder.forEach((day, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${day}`;
            li.dataset.day = day; 
            li.classList.add('day-listen-item'); 
            li.tabIndex = 0; // Make it focusable and clickable
            li.setAttribute('role', 'button');
            li.addEventListener('click', handleDayListenClick);
            li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') handleDayListenClick(e); }); // Accessibility
            orderedDaysListEl.appendChild(li);
        });
        
        if(resetListenBtn) resetListenBtn.classList.remove('hidden'); // Show reset button
    }

    function handleDayListenClick(event) {
        if(!listenFeedbackEl || !orderedDaysListEl) return;

        const clickedDayItem = event.target.closest('.day-listen-item'); // Ensure we get the LI
        if (!clickedDayItem) return;

        const clickedDay = clickedDayItem.dataset.day;

        if (clickedDayItem.classList.contains('correct') || clickedDayItem.classList.contains('incorrect-clicked') || expectedDayIndex >= correctFullOrder.length) {
            return;
        }
        playSound(clickSound);

        if (clickedDay === correctFullOrder[expectedDayIndex]) {
            clickedDayItem.classList.add('correct');
            listenFeedbackEl.textContent = `${clickedDay} is correct!`;
            listenFeedbackEl.className = 'feedback-subsection feedback-correct visible';
            playSound(correctSound);
            expectedDayIndex++;
            if (expectedDayIndex === correctFullOrder.length) {
                listenFeedbackEl.textContent = "Excellent! You've verified all the days in order!";
                Array.from(orderedDaysListEl.children).forEach(child => child.classList.add('disabled')); // Visually disable
            }
        } else {
            clickedDayItem.classList.add('incorrect-clicked'); // Use a different class to avoid confusion with permanent 'incorrect' state
            listenFeedbackEl.textContent = `Not this one. Try to find ${correctFullOrder[expectedDayIndex]}.`;
            listenFeedbackEl.className = 'feedback-subsection feedback-incorrect visible';
            playSound(incorrectSound);
            // User needs to click the correct one or reset.
            setTimeout(() => clickedDayItem.classList.remove('incorrect-clicked'), 1000); // Briefly show error
        }
    }

    // --- Initial Setup ---
    setupDraggableDays();
});