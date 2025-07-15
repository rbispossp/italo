// js/activities/be_questions_practice.js
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

    // --- Part 1: Complete 'Be' Questions (SB p19 Ex 5) ---
    const cbqData = [
        { blankFirst: true, questionParts: ["", "you happy?"], correct: "Are" },
        { blankFirst: true, questionParts: ["", "he hungry?"], correct: "Is" },
        { blankFirst: true, questionParts: ["", "I late?"], correct: "Am" },
        { blankFirst: true, questionParts: ["", "they excited?"], correct: "Are" },
        { blankFirst: true, questionParts: ["", "we in the correct class?"], correct: "Are" },
        { blankFirst: true, questionParts: ["", "it Friday tomorrow?"], correct: "Is" }
    ];
    const qWordOptions = ["Am", "Is", "Are"];
    let currentCbqIndex = 0;
    const cbqExerciseAreaEl = document.getElementById('cbq-exercise-area');
    const cbqFeedbackEl = document.getElementById('cbq-feedback');
    const nextCbqBtn = document.getElementById('next-cbq-btn');
    const completeBeQuestionsSectionEl = document.getElementById('complete-be-questions-section');

    /**
     * Displays the current question for Part 1: Complete 'Be' Questions.
     */
    function displayCbqQuestion() {
        if (!cbqExerciseAreaEl || !cbqFeedbackEl || !nextCbqBtn || !completeBeQuestionsSectionEl) {
            console.error("Missing critical elements for 'Complete Be Questions' section.");
            return;
        }
        if (currentCbqIndex < cbqData.length) {
            const q = cbqData[currentCbqIndex];
            cbqExerciseAreaEl.innerHTML = `
                <p style="font-size: 1.2em; margin-bottom: 10px;">
                    <span class="question-word-placeholder">___</span> ${q.questionParts[1]}
                </p>
                <div class="button-choices">
                    ${qWordOptions.map(opt => `<button data-qword="${opt}">${opt}</button>`).join('')}
                </div>
            `;
            cbqFeedbackEl.textContent = '';
            cbqFeedbackEl.className = 'feedback-subsection'; // Clear 'visible'
            nextCbqBtn.classList.add('hidden');

            cbqExerciseAreaEl.querySelectorAll('.button-choices button').forEach(button => {
                button.addEventListener('click', () => checkCbqAnswer(button.dataset.qword, q.correct));
            });
        } else {
            completeBeQuestionsSectionEl.classList.add('hidden');
            document.getElementById('short-answers-section').classList.remove('hidden');
            displaySaQuestion(); // Move to Part 2
        }
    }

    /**
     * Checks the answer for Part 1: Complete 'Be' Questions.
     * @param {string} selected - The question word selected by the user.
     * @param {string} correct - The correct question word.
     */
    function checkCbqAnswer(selected, correct) {
        cbqExerciseAreaEl.querySelectorAll('.button-choices button').forEach(btn => btn.disabled = true);
        const placeholder = cbqExerciseAreaEl.querySelector('.question-word-placeholder');
        if (selected === correct) {
            cbqFeedbackEl.textContent = 'Correct!';
            cbqFeedbackEl.className = 'feedback-subsection feedback-correct visible';
            playSound(correctSound);
            if(placeholder) placeholder.textContent = correct;
        } else {
            cbqFeedbackEl.textContent = `Incorrect. The answer is ${correct}.`;
            cbqFeedbackEl.className = 'feedback-subsection feedback-incorrect visible';
            playSound(incorrectSound);
            if(placeholder) placeholder.innerHTML = `<span style="color:red; text-decoration: line-through;">${selected}</span> <strong style="color:green;">${correct}</strong>`;
        }
        nextCbqBtn.classList.remove('hidden');
    }
    if(nextCbqBtn) {
        nextCbqBtn.addEventListener('click', () => {
            currentCbqIndex++;
            displayCbqQuestion();
        });
    }

    // --- Part 2: Short Answers (SB p19 Ex 6) - Simplified to Multiple Choice ---
    const saData = [
        { question: "Are you happy?", givenAnswerPrompt: "Yes", options: ["I am", "you are", "I'm not"], correct: "I am" },
        { question: "Is he hungry?", givenAnswerPrompt: "No", options: ["he isn't", "he is", "I am"], correct: "he isn't" },
        { question: "Am I late?", givenAnswerPrompt: "Yes", options: ["I am", "you are", "you aren't"], correct: "you are" },
        { question: "Are they excited?", givenAnswerPrompt: "Yes", options: ["they are", "they aren't", "we are"], correct: "they are" },
        { question: "Are we in the correct class?", givenAnswerPrompt: "No", options: ["we aren't", "we are", "you are"], correct: "we aren't" },
        { question: "Is it Friday tomorrow?", givenAnswerPrompt: "Yes", options: ["it is", "it isn't", "I am"], correct: "it is" }
    ];
    let currentSaIndex = 0;
    const saQuestionTextEl = document.getElementById('sa-question-text');
    const saExerciseAreaEl = document.getElementById('sa-exercise-area'); 
    const saFeedbackEl = document.getElementById('sa-feedback');
    const nextSaBtn = document.getElementById('next-sa-btn');
    const shortAnswersSectionEl = document.getElementById('short-answers-section');
    
    /**
     * Displays the current question for Part 2: Short Answers.
     */
    function displaySaQuestion() {
        if (!saQuestionTextEl || !saExerciseAreaEl || !saFeedbackEl || !nextSaBtn || !shortAnswersSectionEl) {
            console.error("Missing critical elements for 'Short Answers' section.");
            return;
        }
        // Clear previous buttons if any
        const existingButtonChoices = saExerciseAreaEl.querySelector('.button-choices');
        if (existingButtonChoices) existingButtonChoices.remove();

        if (currentSaIndex < saData.length) {
            const q = saData[currentSaIndex];
            saQuestionTextEl.textContent = `${q.question} (${q.givenAnswerPrompt}, _______.)`;
            
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-choices';
            q.options.forEach(opt => {
                const button = document.createElement('button');
                button.textContent = opt;
                button.onclick = () => checkSaAnswer(opt, q.correct, q.question, q.givenAnswerPrompt);
                buttonContainer.appendChild(button);
            });
            // Append after the question text paragraph, not inside it.
            if (saQuestionTextEl.nextSibling) {
                saExerciseAreaEl.insertBefore(buttonContainer, saQuestionTextEl.nextSibling);
            } else {
                saExerciseAreaEl.appendChild(buttonContainer);
            }


            saFeedbackEl.textContent = '';
            saFeedbackEl.className = 'feedback-subsection';
            nextSaBtn.classList.add('hidden');
        } else {
            shortAnswersSectionEl.classList.add('hidden');
            document.getElementById('who-questions-section').classList.remove('hidden');
            displayWqQuestion(); // Move to Part 3
        }
    }

    /**
     * Checks the answer for Part 2: Short Answers.
     * @param {string} selected - The short answer part selected by the user.
     * @param {string} correct - The correct short answer part.
     * @param {string} originalQuestion - The full original question text.
     * @param {string} givenAnswerPrompt - The "Yes" or "No" part of the answer.
     */
    function checkSaAnswer(selected, correct, originalQuestion, givenAnswerPrompt) {
        saExerciseAreaEl.querySelectorAll('.button-choices button').forEach(btn => btn.disabled = true);
        if (selected === correct) {
            saFeedbackEl.textContent = 'Correct!';
            saFeedbackEl.className = 'feedback-subsection feedback-correct visible';
            playSound(correctSound);
            saQuestionTextEl.textContent = `${originalQuestion} (${givenAnswerPrompt}, ${correct}.)`;
        } else {
            saFeedbackEl.textContent = `Incorrect. The answer is ${correct}.`;
            saFeedbackEl.className = 'feedback-subsection feedback-incorrect visible';
            playSound(incorrectSound);
            saQuestionTextEl.textContent = `${originalQuestion} (${givenAnswerPrompt}, ___.) (Correct: ${correct}.)`;
        }
        nextSaBtn.classList.remove('hidden');
    }
    if(nextSaBtn) {
        nextSaBtn.addEventListener('click', () => {
            currentSaIndex++;
            displaySaQuestion();
        });
    }

    // --- Part 3: 'Who' Questions (SB p19 Ex 7) ---
    const wqData = [
        { answer: "He's Mark.", options: ["Who's he?", "What's he?", "Is he Mark?"], correct: "Who's he?" },
        { answer: "She's Mrs Page.", options: ["Who's she?", "Where is she?", "She's who?"], correct: "Who's she?" },
        { answer: "We're the new students.", options: ["Who are you?", "What are you?", "Are you students?"], correct: "Who are you?" },
        { answer: "I'm Frances.", options: ["What's your name?", "Who are you?", "Are you Frances?"], correct: "Who are you?" },
        { answer: "They're One Direction!", options: ["Who are they?", "What are they?", "Are they singers?"], correct: "Who are they?" }
    ];
    let currentWqIndex = 0;
    const wqAnswerTextEl = document.getElementById('wq-answer-text');
    const wqQuestionPromptEl = document.getElementById('wq-question-prompt');
    const wqExerciseAreaEl = document.getElementById('wq-exercise-area'); 
    const wqFeedbackEl = document.getElementById('wq-feedback');
    const nextWqBtn = document.getElementById('next-wq-btn');
    const whoQuestionsSectionEl = document.getElementById('who-questions-section');
    const activityCompletionMessageEl = document.getElementById('activity-completion-message');

    /**
     * Displays the current prompt for Part 3: 'Who' Questions.
     */
    function displayWqQuestion() {
        if(!wqAnswerTextEl || !wqQuestionPromptEl || !wqExerciseAreaEl || !wqFeedbackEl || !nextWqBtn || !whoQuestionsSectionEl || !activityCompletionMessageEl) {
            console.error("Missing critical elements for 'Who Questions' section.");
            return;
        }
        // Clear previous buttons if any
        const existingButtonChoices = wqExerciseAreaEl.querySelector('.button-choices');
        if (existingButtonChoices) existingButtonChoices.remove();

        if (currentWqIndex < wqData.length) {
            const q = wqData[currentWqIndex];
            wqAnswerTextEl.textContent = q.answer;
            wqQuestionPromptEl.textContent = `Form the question:`;
            
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-choices';
            q.options.forEach(opt => {
                const button = document.createElement('button');
                button.textContent = opt;
                button.onclick = () => checkWqAnswer(opt, q.correct);
                buttonContainer.appendChild(button);
            });
            // Append after the prompt paragraph
            if (wqQuestionPromptEl.nextSibling) {
                wqExerciseAreaEl.insertBefore(buttonContainer, wqQuestionPromptEl.nextSibling);
            } else {
                wqExerciseAreaEl.appendChild(buttonContainer);
            }

            wqFeedbackEl.textContent = '';
            wqFeedbackEl.className = 'feedback-subsection';
            nextWqBtn.classList.add('hidden');
        } else {
            whoQuestionsSectionEl.classList.add('hidden');
            activityCompletionMessageEl.classList.remove('hidden');
        }
    }
    
    /**
     * Checks the answer for Part 3: 'Who' Questions.
     * @param {string} selected - The question selected by the user.
     * @param {string} correct - The correct question.
     */
    function checkWqAnswer(selected, correct) {
        wqExerciseAreaEl.querySelectorAll('.button-choices button').forEach(btn => btn.disabled = true);
        if (selected === correct) {
            wqFeedbackEl.textContent = 'Correct!';
            wqFeedbackEl.className = 'feedback-subsection feedback-correct visible';
            playSound(correctSound);
            wqQuestionPromptEl.textContent = `Question: ${correct}`;
        } else {
            wqFeedbackEl.textContent = `Incorrect. The question is: ${correct}.`;
            wqFeedbackEl.className = 'feedback-subsection feedback-incorrect visible';
            playSound(incorrectSound);
            wqQuestionPromptEl.textContent = `Your choice: ${selected} (Correct: ${correct})`;
        }
        nextWqBtn.classList.remove('hidden');
    }
    if(nextWqBtn) {
        nextWqBtn.addEventListener('click', () => {
            currentWqIndex++;
            displayWqQuestion();
        });
    }

    // Initial Start of the entire multi-part activity
    if(completeBeQuestionsSectionEl) { // Check if the first section exists
         displayCbqQuestion();
    } else {
        console.error("Initial section for 'Be Questions Practice' not found.");
    }
});