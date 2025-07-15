// js/activities/be_verb_practice.js
document.addEventListener('DOMContentLoaded', () => {
    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');

    /**
     * Plays a sound effect.
     * @param {HTMLAudioElement} soundElement - The audio element to play.
     */
    function playSound(soundElement) {
        if (soundElement) {
            soundElement.currentTime = 0;
            soundElement.play().catch(e => console.error("Audio play failed:", e));
        }
    }

    // --- Part 1: Subject Pronoun Choice (SB p18 Ex1) ---
    const spChoiceData = [
        { sentenceStart: "", sentenceEnd: "are from London.", options: ["He", "I", "They"], correct: "They" },
        { sentenceStart: "", sentenceEnd: "is nice.", options: ["It", "You", "We"], correct: "It" },
        { sentenceStart: "", sentenceEnd: "am thirteen.", options: ["I", "You", "They"], correct: "I" },
        { sentenceStart: "", sentenceEnd: "is fourteen.", options: ["We", "They", "She"], correct: "She" },
        { sentenceStart: "", sentenceEnd: "are English.", options: ["I", "He", "We"], correct: "We" }
    ];
    let currentSpChoiceIndex = 0;
    const spChoiceExerciseAreaEl = document.getElementById('sp-choice-exercise-area');
    const spChoiceFeedbackEl = document.getElementById('sp-choice-feedback');
    const nextSpChoiceBtn = document.getElementById('next-sp-choice-btn');
    const subjectPronounChoiceSectionEl = document.getElementById('subject-pronoun-choice-section');

    /**
     * Displays the current question for Subject Pronoun Choice (Part 1).
     */
    function displaySpChoiceQuestion() {
        if (!spChoiceExerciseAreaEl || !spChoiceFeedbackEl || !nextSpChoiceBtn || !subjectPronounChoiceSectionEl) {
            console.error("Missing critical elements for SP Choice section.");
            return;
        }

        if (currentSpChoiceIndex < spChoiceData.length) {
            const q = spChoiceData[currentSpChoiceIndex];
            spChoiceExerciseAreaEl.innerHTML = `
                <p style="font-size: 1.2em; margin-bottom: 10px;">
                    <span class="pronoun-placeholder">___</span> ${q.sentenceEnd}
                </p>
                <div class="button-choices">
                    ${q.options.map(opt => `<button data-pronoun="${opt}">${opt}</button>`).join('')}
                </div>
            `;
            spChoiceFeedbackEl.textContent = '';
            spChoiceFeedbackEl.className = 'feedback-subsection'; // Clear 'visible'
            nextSpChoiceBtn.classList.add('hidden');

            spChoiceExerciseAreaEl.querySelectorAll('.button-choices button').forEach(button => {
                button.addEventListener('click', () => checkSpChoiceAnswer(button.dataset.pronoun, q.correct));
            });
        } else {
            subjectPronounChoiceSectionEl.classList.add('hidden');
            document.getElementById('subject-pronoun-picture-section').classList.remove('hidden');
            displaySpPictureQuestion(); // Move to next part (Subject Pronoun with Picture)
        }
    }

    /**
     * Checks the answer for Subject Pronoun Choice (Part 1).
     * @param {string} selected - The pronoun selected by the user.
     * @param {string} correct - The correct pronoun.
     */
    function checkSpChoiceAnswer(selected, correct) {
        spChoiceExerciseAreaEl.querySelectorAll('.button-choices button').forEach(btn => btn.disabled = true);
        const placeholder = spChoiceExerciseAreaEl.querySelector('.pronoun-placeholder');
        
        if (selected === correct) {
            spChoiceFeedbackEl.textContent = 'Correct!';
            spChoiceFeedbackEl.className = 'feedback-subsection feedback-correct visible';
            playSound(correctSound);
            if(placeholder) placeholder.textContent = correct;
        } else {
            spChoiceFeedbackEl.textContent = `Incorrect. The answer is ${correct}.`;
            spChoiceFeedbackEl.className = 'feedback-subsection feedback-incorrect visible';
            playSound(incorrectSound);
            if(placeholder) placeholder.innerHTML = `<span style="color:red; text-decoration: line-through;">${selected}</span> <strong style="color:green;">${correct}</strong>`;
        }
        nextSpChoiceBtn.classList.remove('hidden');
    }

    if(nextSpChoiceBtn) {
        nextSpChoiceBtn.addEventListener('click', () => {
            currentSpChoiceIndex++;
            displaySpChoiceQuestion();
        });
    }


    // --- Part 2: Subject Pronoun with Picture (SB p18 Ex2) ---
    const spPictureData = [
        { image: "../assets/images/grammar/scene_excited.png", sentenceEnd: "are excited!", options: ["He", "She", "They"], correct: "They" },
        { image: "../assets/images/grammar/scene_teacher.png", sentenceEnd: "is a teacher.", options: ["He", "It", "We"], correct: "He" },
        { image: "../assets/images/grammar/scene_twenty.png", sentenceEnd: "are twenty.", options: ["You", "They", "I"], correct: "They" },
        { image: "../assets/images/grammar/scene_late.png", sentenceEnd: "am late.", options: ["I", "She", "It"], correct: "I" },
        { image: "../assets/images/grammar/scene_scared.png", sentenceEnd: "are scared.", options: ["He", "They", "We"], correct: "They" },
        { image: "../assets/images/grammar/scene_car.png", sentenceEnd: "is a nice car.", options: ["It", "She", "They"], correct: "It" },
        { image: "../assets/images/grammar/scene_london.png", sentenceEnd: "is from London.", options: ["He", "We", "It"], correct: "He" }
    ];
    let currentSpPictureIndex = 0;
    const spPictureImageEl = document.getElementById('sp-picture-image');
    const spPictureSentenceEl = document.getElementById('sp-picture-sentence');
    const spPictureOptionsEl = document.getElementById('sp-picture-options');
    const spPictureFeedbackEl = document.getElementById('sp-picture-feedback');
    const nextSpPictureBtn = document.getElementById('next-sp-picture-btn');
    const subjectPronounPictureSectionEl = document.getElementById('subject-pronoun-picture-section');

    /**
     * Displays the current question for Subject Pronoun with Picture (Part 2).
     */
    function displaySpPictureQuestion() {
        if (!spPictureImageEl || !spPictureSentenceEl || !spPictureOptionsEl || !spPictureFeedbackEl || !nextSpPictureBtn || !subjectPronounPictureSectionEl) {
            console.error("Missing critical elements for SP Picture section.");
            return;
        }
        if (currentSpPictureIndex < spPictureData.length) {
            const q = spPictureData[currentSpPictureIndex];
            spPictureImageEl.src = q.image;
            spPictureImageEl.alt = q.sentenceEnd.replace(/[.!?]/g, ''); // Simple alt text
            spPictureSentenceEl.innerHTML = `<span class="pronoun-placeholder">___</span> ${q.sentenceEnd}`;
            
            spPictureOptionsEl.innerHTML = ''; // Clear previous options
            q.options.forEach(opt => {
                const button = document.createElement('button');
                button.dataset.pronoun = opt;
                button.textContent = opt;
                button.onclick = () => checkSpPictureAnswer(opt, q.correct);
                spPictureOptionsEl.appendChild(button);
            });
            
            spPictureFeedbackEl.textContent = '';
            spPictureFeedbackEl.className = 'feedback-subsection';
            nextSpPictureBtn.classList.add('hidden');
        } else {
            subjectPronounPictureSectionEl.classList.add('hidden');
            document.getElementById('be-positive-section').classList.remove('hidden');
            displayBePositiveQuestion(); // Move to next part ('Be' Positive Gap Fill)
        }
    }

    /**
     * Checks the answer for Subject Pronoun with Picture (Part 2).
     * @param {string} selected - The pronoun selected by the user.
     * @param {string} correct - The correct pronoun.
     */
    function checkSpPictureAnswer(selected, correct) {
        spPictureOptionsEl.querySelectorAll('button').forEach(btn => btn.disabled = true);
        const placeholder = spPictureSentenceEl.querySelector('.pronoun-placeholder');

        if (selected === correct) {
            spPictureFeedbackEl.textContent = 'Correct!';
            spPictureFeedbackEl.className = 'feedback-subsection feedback-correct visible';
            playSound(correctSound);
            if(placeholder) placeholder.textContent = correct;
        } else {
            spPictureFeedbackEl.textContent = `Incorrect. The answer is ${correct}.`;
            spPictureFeedbackEl.className = 'feedback-subsection feedback-incorrect visible';
            playSound(incorrectSound);
            if(placeholder) placeholder.innerHTML = `<span style="color:red; text-decoration: line-through;">${selected}</span> <strong style="color:green;">${correct}</strong>`;
        }
        nextSpPictureBtn.classList.remove('hidden');
    }
    if(nextSpPictureBtn) {
        nextSpPictureBtn.addEventListener('click', () => {
            currentSpPictureIndex++;
            displaySpPictureQuestion();
        });
    }

    // --- Part 3: 'Be' Positive Gap Fill (SB p18 Ex3) ---
    const bePositiveData = [
        // Each object is a "set" of sentences or a paragraph.
        // `textParts` array holds text segments. Blanks occur *after* a textPart if `blanksInSet` indicates.
        // `correctForms` array corresponds one-to-one with the blanks.
        { 
            textParts: [
                "Hi, I'm Elina and I ", 
                " thirteen now. My pencil case ", 
                " blue. This is my friend, Bobby. He ", 
                " from Manchester. We ", 
                " in Year 8 at school."
            ], 
            blanksInSet: 4, 
            correctForms: ["am", "is", "is", "are"] 
        },
        { 
            textParts: [
                "Hello! I'm Shelly and this is Dean. We ", 
                " in Year 7. Look at our bags! They ", 
                " purple. Purple is our favourite colour!"
            ], 
            blanksInSet: 2, 
            correctForms: ["are", "are"] 
        }
    ];
    let currentBePositiveSetIndex = 0;
    let currentBlankInSet = 0; // Tracks which blank within the current set we are filling
    const bePositiveSentenceEl = document.getElementById('be-positive-sentence');
    const bePositiveOptionsEl = document.getElementById('be-positive-options');
    const bePositiveFeedbackEl = document.getElementById('be-positive-feedback');
    const nextBePositiveBtn = document.getElementById('next-be-positive-btn');
    const bePositiveSectionEl = document.getElementById('be-positive-section');
    const activityCompletionMessageEl = document.getElementById('activity-completion-message');
    const beVerbOptions = ["am", "is", "are"];

    /**
     * Displays the current sentence and options for 'Be' Positive Gap Fill (Part 3).
     */
    function displayBePositiveQuestion() {
        if (!bePositiveSentenceEl || !bePositiveOptionsEl || !bePositiveFeedbackEl || !nextBePositiveBtn || !bePositiveSectionEl || !activityCompletionMessageEl) {
            console.error("Missing critical elements for 'Be' Positive section.");
            return;
        }

        if (currentBePositiveSetIndex < bePositiveData.length) {
            const currentSet = bePositiveData[currentBePositiveSetIndex];
            if (currentBlankInSet < currentSet.blanksInSet) {
                let sentenceHTML = "";
                // Iterate through textParts. A blank follows each textPart up to blanksInSet.
                for (let i = 0; i < currentSet.textParts.length; i++) {
                    sentenceHTML += currentSet.textParts[i];
                    if (i < currentSet.blanksInSet) { // If a blank is expected after this textPart
                        if (i === currentBlankInSet) { // This is the current blank to fill
                            sentenceHTML += ` <span class="verb-placeholder">___</span> `;
                        } else if (i < currentBlankInSet) { // This blank was already filled correctly
                            sentenceHTML += ` <strong style="color:green;">${currentSet.correctForms[i]}</strong> `;
                        } else { // This is a future blank in the current set
                            sentenceHTML += ` <span class="verb-placeholder">___</span> `;
                        }
                    }
                }
                bePositiveSentenceEl.innerHTML = sentenceHTML;

                bePositiveOptionsEl.innerHTML = ''; // Clear previous options
                beVerbOptions.forEach(opt => {
                    const button = document.createElement('button');
                    button.dataset.verb = opt;
                    button.textContent = opt;
                    button.onclick = () => checkBePositiveAnswer(opt, currentSet.correctForms[currentBlankInSet]);
                    bePositiveOptionsEl.appendChild(button);
                });
                
                bePositiveFeedbackEl.textContent = '';
                bePositiveFeedbackEl.className = 'feedback-subsection';
                nextBePositiveBtn.classList.add('hidden');

            } else { // All blanks in current set are filled, move to next set
                currentBePositiveSetIndex++;
                currentBlankInSet = 0; // Reset blank counter for the new set
                displayBePositiveQuestion(); 
            }
        } else { // All sets complete
            bePositiveSectionEl.classList.add('hidden');
            activityCompletionMessageEl.classList.remove('hidden');
        }
    }
    
    /**
     * Checks the answer for 'Be' Positive Gap Fill (Part 3).
     * @param {string} selectedVerb - The verb selected by the user.
     * @param {string} correctVerb - The correct verb for the current blank.
     */
    function checkBePositiveAnswer(selectedVerb, correctVerb) {
        bePositiveOptionsEl.querySelectorAll('button').forEach(btn => btn.disabled = true);
        
        if (selectedVerb === correctVerb) {
            bePositiveFeedbackEl.textContent = 'Correct!';
            bePositiveFeedbackEl.className = 'feedback-subsection feedback-correct visible';
            playSound(correctSound);
            // The displayBePositiveQuestion will re-render with the correct word filled in.
        } else {
            bePositiveFeedbackEl.textContent = `Incorrect. The answer is ${correctVerb}.`;
            bePositiveFeedbackEl.className = 'feedback-subsection feedback-incorrect visible';
            playSound(incorrectSound);
        }
        nextBePositiveBtn.classList.remove('hidden'); // Show "Next" to fill next blank or move to next sentence
    }

    if(nextBePositiveBtn) {
        nextBePositiveBtn.addEventListener('click', () => {
            // Logic to advance: if correct, currentBlankInSet would have been incremented by the check function
            // If incorrect, we still move to the next logical step (either next blank or next sentence if they choose to proceed)
            const currentSet = bePositiveData[currentBePositiveSetIndex];
            if (bePositiveFeedbackEl.classList.contains('feedback-correct')) { // Only advance blank if correct
                 currentBlankInSet++;
            } else {
                // If incorrect, user clicks "Next" to see the next blank or sentence *without* currentBlankInSet advancing
                // This means they effectively skip filling the current blank if they got it wrong and click next.
                // To force them to get it right or to re-present the same blank, more complex logic is needed.
                // For simplicity, we advance the state.
                 currentBlankInSet++; // Or, you could re-call displayBePositiveQuestion() to try the same blank again.
                                   // For now, we just move on.
            }
            displayBePositiveQuestion();
        });
    }

    // Initial Start of the entire multi-part activity
    if (subjectPronounChoiceSectionEl) { // Check if the first section exists
        displaySpChoiceQuestion(); 
    } else {
        console.error("Initial section for 'Be Verb Practice' not found.");
    }
});