// js/activities/numbers.js
document.addEventListener('DOMContentLoaded', () => {
    const itemsData = [
        { number: 19, item: "books", audioCue: "Nineteen books", options: [19, 9, 13] },
        { number: 16, item: "pens", audioCue: "Sixteen pens", options: [16, 6, 18] },
        { number: 13, item: "pencils", audioCue: "Thirteen pencils", options: [13, 15, 3] },
        { number: 4, item: "houses", audioCue: "Four houses", options: [4, 14, 20] },
        { number: 9, item: "chairs", audioCue: "Nine chairs", options: [9, 19, 11] },
        { number: 11, item: "friends", audioCue: "Eleven friends", options: [11, 18, 7] },
        { number: 20, item: "students", audioCue: "Twenty students", options: [20, 12, 2] },
        { number: 17, item: "computers", audioCue: "Seventeen computers", options: [17, 7, 10] }
    ];

    let currentItemIndex = 0;
    const itemNamePromptEl = document.getElementById('item-name-prompt');
    const numberOptionsAreaEl = document.getElementById('number-options-area');
    const feedbackAreaEl = document.getElementById('feedback-area');
    const nextItemBtn = document.getElementById('next-item-btn');
    // const startNumbersBtn = document.getElementById('start-numbers-btn'); // For "Ready" button UX

    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');

    // Check for critical elements
    if (!itemNamePromptEl || !numberOptionsAreaEl || !feedbackAreaEl || !nextItemBtn || !correctSound || !incorrectSound) {
        console.error("A critical element for the Numbers Activity is missing from the DOM.");
        const mainContainer = document.querySelector('.activity-container');
        if(mainContainer) mainContainer.innerHTML = "<p style='color:red; font-weight:bold;'>Error: Activity cannot load. Please check console.</p>";
        return; // Stop script execution
    }
    
    /**
     * Plays a sound effect.
     * @param {HTMLAudioElement} soundElement - The audio element to play.
     */
    function playSound(soundElement) {
        soundElement.currentTime = 0;
        soundElement.play().catch(e => console.error("Audio play failed:", e));
    }

    /**
     * Displays the current item prompt and number options.
     */
    function displayItem() {
        if (currentItemIndex < itemsData.length) {
            const currentItem = itemsData[currentItemIndex];
            itemNamePromptEl.textContent = `Listen for: "${currentItem.audioCue}" (from CD1 Track 21)`;
            
            feedbackAreaEl.textContent = '';
            feedbackAreaEl.className = ''; // Clear feedback style and 'visible' class
            nextItemBtn.classList.add('hidden');
            numberOptionsAreaEl.innerHTML = ''; // Clear previous options
            numberOptionsAreaEl.querySelectorAll('button').forEach(btn => btn.disabled = false);


            // Shuffle options before displaying
            const shuffledOptions = [...currentItem.options].sort(() => Math.random() - 0.5);

            shuffledOptions.forEach(optionNum => {
                const button = document.createElement('button');
                button.textContent = `${optionNum} ${currentItem.item}`; // e.g., "19 books"
                button.onclick = () => checkAnswer(optionNum, currentItem.number, currentItem.item);
                numberOptionsAreaEl.appendChild(button);
            });
        } else {
            // Activity Complete
            itemNamePromptEl.textContent = "Activity Complete!";
            numberOptionsAreaEl.innerHTML = '';
            feedbackAreaEl.textContent = 'Well done! You finished the Numbers activity.';
            feedbackAreaEl.className = 'feedback-correct visible';
            nextItemBtn.classList.add('hidden');
        }
    }

    /**
     * Checks the user's selected number against the correct number.
     * @param {number} selectedNumber - The number selected by the user.
     * @param {number} correctNumber - The correct number for the item.
     * @param {string} item - The name of the item (e.g., "books").
     */
    function checkAnswer(selectedNumber, correctNumber, item) {
        numberOptionsAreaEl.querySelectorAll('button').forEach(btn => btn.disabled = true); // Disable options

        if (selectedNumber === correctNumber) {
            feedbackAreaEl.textContent = 'Correct!';
            feedbackAreaEl.className = 'feedback-correct visible';
            playSound(correctSound);
        } else {
            feedbackAreaEl.textContent = `Not quite. The correct answer was ${correctNumber} ${item}.`;
            feedbackAreaEl.className = 'feedback-incorrect visible';
            playSound(incorrectSound);
        }
        nextItemBtn.classList.remove('hidden');
    }

    nextItemBtn.addEventListener('click', () => {
        currentItemIndex++;
        displayItem();
    });

    // Initial setup
    // If using a "Ready" button:
    // numberOptionsAreaEl.classList.add('hidden'); // Hide options initially
    // startNumbersBtn.addEventListener('click', () => {
    //     startNumbersBtn.classList.add('hidden');
    //     numberOptionsAreaEl.classList.remove('hidden');
    //     displayItem();
    // });
    // If not using a "Ready" button, start directly:
    displayItem();
});