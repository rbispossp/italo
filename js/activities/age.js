// js/activities/age.js
document.addEventListener('DOMContentLoaded', () => {
    const charactersAgeData = [
        { name: "Mike", age: 12, image: "../assets/images/age/mike.png", options: [11, 12, 13] },
        { name: "Jane", age: 17, image: "../assets/images/age/jane.png", options: [16, 17, 18] },
        { name: "Simon", age: 15, image: "../assets/images/age/simon.png", options: [14, 15, 16] },
        { name: "Jackie", age: 16, image: "../assets/images/age/jackie.png", options: [15, 16, 17] },
        { name: "Erica", age: 11, image: "../assets/images/age/erica.png", options: [10, 11, 12] },
        { name: "Tom", age: 14, image: "../assets/images/age/tom.png", options: [13, 14, 15] }
    ];

    let currentCharacterIndex = 0;
    const questionTextEl = document.getElementById('age-question-text');
    const characterImageEl = document.getElementById('character-age-image');
    const ageOptionsAreaEl = document.getElementById('age-options-area');
    const feedbackAreaEl = document.getElementById('feedback-area');
    const nextQuestionBtn = document.getElementById('next-age-question-btn');

    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');

    const PLACEHOLDER_IMAGE_PATH = "../assets/images/ui/placeholder_image.png";
    // Check for critical elements
    if (!questionTextEl || !characterImageEl || !ageOptionsAreaEl || !feedbackAreaEl || !nextQuestionBtn || !correctSound || !incorrectSound) {
        console.error("A critical element for the Age Activity is missing from the DOM.");
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
     * Displays the current character, question, and age options.
     */
    function displayQuestion() {
        if (currentCharacterIndex < charactersAgeData.length) {
            const character = charactersAgeData[currentCharacterIndex];
            questionTextEl.textContent = `How old is ${character.name}?`;
            characterImageEl.src = character.image;
            characterImageEl.alt = character.name;
            
            feedbackAreaEl.textContent = '';
            feedbackAreaEl.className = ''; // Clear feedback style and 'visible' class
            nextQuestionBtn.classList.add('hidden');


            // Ensure options always include the correct age, then shuffle
            let currentOptions = [...character.options];
            if (!currentOptions.includes(character.age)) { // Defensive: if correct age isn't in predefined options
                currentOptions.pop(); // Remove one to make space
                currentOptions.push(character.age);
            }
            const shuffledOptions = currentOptions.sort(() => Math.random() - 0.5);
            ageOptionsAreaEl.innerHTML = ''; // Clear previous options

            shuffledOptions.forEach(optionAge => {
                const button = document.createElement('button');
                button.textContent = optionAge;
                button.onclick = () => checkAnswer(optionAge, character.age, character.name);
                ageOptionsAreaEl.appendChild(button);
            });
        } else {
            // Activity Complete
            questionTextEl.textContent = "Activity Complete!";
            characterImageEl.src = PLACEHOLDER_IMAGE_PATH;
            characterImageEl.alt = "Activity Complete";
            ageOptionsAreaEl.innerHTML = '';
            feedbackAreaEl.textContent = 'Well done! You finished the Age activity.';
            feedbackAreaEl.className = 'feedback-correct visible';
            nextQuestionBtn.classList.add('hidden');
        }
    }

    /**
     * Checks the user's selected age against the correct age.
     * @param {number} selectedAge - The age selected by the user.
     * @param {number} correctAge - The correct age of the character.
     * @param {string} characterName - The name of the character.
     */
    function checkAnswer(selectedAge, correctAge, characterName) {
        ageOptionsAreaEl.querySelectorAll('button').forEach(btn => btn.disabled = true); // Disable options

        if (selectedAge === correctAge) {
            feedbackAreaEl.textContent = 'Correct!';
            feedbackAreaEl.className = 'feedback-correct visible';
            playSound(correctSound);
        } else {
            feedbackAreaEl.textContent = `Not quite. ${characterName} is ${correctAge}.`;
            feedbackAreaEl.className = 'feedback-incorrect visible';
            playSound(incorrectSound);
        }
        nextQuestionBtn.classList.remove('hidden');
    }

    nextQuestionBtn.addEventListener('click', () => {
        currentCharacterIndex++;
        displayQuestion();
    });

    // Initial display
    displayQuestion();
});