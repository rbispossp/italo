// js/activities/possessive_adjectives.js
document.addEventListener('DOMContentLoaded', () => {
    const rapLinesData = [
        { text: "This isn't <span class='possessive-word'>my</span> cat.", image: "../assets/images/grammar/possessives/my_cat_not.png" },
        { text: "It isn't <span class='possessive-word'>your</span> cat.", image: "../assets/images/grammar/possessives/your_cat_not.png" },
        { text: "It isn't <span class='possessive-word'>his</span> cat.", image: "../assets/images/grammar/possessives/his_cat_not.png" },
        { text: "Oh, no!", image: "../assets/images/ui/placeholder_image.png" },
        { text: "It's <span class='possessive-word'>her</span> cat.", image: "../assets/images/grammar/possessives/her_cat.png" },
        { text: "Yes, I'm <span class='possessive-word'>her</span> cat.", image: "../assets/images/grammar/possessives/her_cat_perspective.png" },
        { text: "This isn't <span class='possessive-word'>our</span> dog.", image: "../assets/images/grammar/possessives/our_dog_not.png" },
        { text: "It isn't <span class='possessive-word'>your</span> dog.", image: "../assets/images/grammar/possessives/your_dog_not_plural.png" },
        { text: "Of course not.", image: "../assets/images/ui/placeholder_image.png" },
        { text: "It's <span class='possessive-word'>their</span> dog.", image: "../assets/images/grammar/possessives/their_dog.png" },
        { text: "That's right,", image: "../assets/images/ui/placeholder_image.png" },
        { text: "I'm <span class='possessive-word'>their</span> dog.", image: "../assets/images/grammar/possessives/their_dog_perspective.png" },
        { text: "Woof, woof!", image: "../assets/images/grammar/possessives/dog_woof.png" }
    ];

    const lyricsAreaEl = document.getElementById('rap-lyrics-area');
    const startRapBtn = document.getElementById('start-rap-btn');
    const autoAdvanceBtn = document.getElementById('auto-advance-btn');
    
    const clickSound = document.getElementById('click-sound');
    const correctSoundQuiz = document.getElementById('correct-sound'); // Renamed for clarity
    const incorrectSoundQuiz = document.getElementById('incorrect-sound'); // Renamed for clarity

    let currentLineIndex = 0;
    let rapLineElements = [];
    let autoAdvanceInterval;
    let autoAdvanceActive = false;
    const AUTO_ADVANCE_INTERVAL_MS = 2200; // Adjust this timing for rap pace

    // Check for critical rap elements
    if (!lyricsAreaEl || !startRapBtn || !autoAdvanceBtn || !clickSound) {
        console.error("A critical element for the Rap section is missing from the DOM.");
        if(lyricsAreaEl) lyricsAreaEl.innerHTML = "<p style='color:red;'>Rap player error.</p>";
        // Disable buttons if elements are missing
        if(startRapBtn) startRapBtn.disabled = true;
        if(autoAdvanceBtn) autoAdvanceBtn.disabled = true;
        // return; // Don't stop the whole script if quiz part can still run
    }
    
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

    /**
     * Initializes or restarts the rap display.
     */
    function initializeRapDisplay() {
        if(!lyricsAreaEl) return;
        lyricsAreaEl.innerHTML = ''; 
        rapLineElements = [];
        currentLineIndex = 0;
        autoAdvanceActive = false;
        if (autoAdvanceInterval) clearInterval(autoAdvanceInterval);

        rapLinesData.forEach((line, index) => {
            const div = document.createElement('div');
            div.classList.add('rap-line');
            div.innerHTML = `<img src="${line.image}" alt="Rap line ${index + 1} visual"> <p>${line.text}</p>`;
            div.dataset.index = index;
            div.tabIndex = 0; // Make it focusable for keyboard interaction
            div.addEventListener('click', () => manualAdvance(index));
            div.addEventListener('keydown', (e) => { // Allow Enter/Space to advance
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    manualAdvance(index);
                }
            });
            lyricsAreaEl.appendChild(div);
            rapLineElements.push(div);
        });

        if(startRapBtn) startRapBtn.textContent = "Restart Rap";
        if(autoAdvanceBtn) {
            autoAdvanceBtn.disabled = false;
            autoAdvanceBtn.textContent = "Auto-Advance Lines";
            autoAdvanceBtn.style.backgroundColor = ""; // Reset color
        }
        if (rapLineElements.length > 0) highlightLine(0); 
    }

    if(startRapBtn) startRapBtn.addEventListener('click', initializeRapDisplay);

    /**
     * Manually advances the rap to a specific line.
     * @param {number} index - The index of the line to advance to.
     */
    function manualAdvance(index) {
        if (autoAdvanceActive || rapLineElements.length === 0) return; 
        playSound(clickSound);
        highlightLine(index);
        currentLineIndex = index; // Set current line to the clicked one

        if (currentLineIndex === rapLinesData.length - 1) { // Last line clicked
            if(autoAdvanceBtn) autoAdvanceBtn.disabled = true;
            setTimeout(showQuizSection, AUTO_ADVANCE_INTERVAL_MS / 2); // Shorter delay after last manual click
        }
    }
    
    if(autoAdvanceBtn) autoAdvanceBtn.addEventListener('click', () => {
        if (rapLineElements.length === 0) {
            alert("Please start the rap first by clicking 'Start Rap' or 'Restart Rap'.");
            return;
        }
        autoAdvanceActive = !autoAdvanceActive;
        if (autoAdvanceActive) {
            autoAdvanceBtn.textContent = "Stop Auto-Advance";
            autoAdvanceBtn.style.backgroundColor = "#d9534f"; // Red
            // currentLineIndex = 0; // Start from beginning or current highlighted line? Let's use current.
            if (currentLineIndex >= rapLinesData.length) currentLineIndex = 0; // If at end, restart from 0

            highlightLine(currentLineIndex);
            playSound(clickSound); 

            autoAdvanceInterval = setInterval(() => {
                currentLineIndex++;
                if (currentLineIndex < rapLinesData.length) {
                    highlightLine(currentLineIndex);
                    playSound(clickSound);
                } else {
                    clearInterval(autoAdvanceInterval);
                    autoAdvanceActive = false;
                    autoAdvanceBtn.textContent = "Auto-Advance Lines";
                    autoAdvanceBtn.style.backgroundColor = ""; 
                    autoAdvanceBtn.disabled = true;
                    showQuizSection();
                }
            }, AUTO_ADVANCE_INTERVAL_MS); 
        } else {
            clearInterval(autoAdvanceInterval);
            autoAdvanceBtn.textContent = "Auto-Advance Lines";
            autoAdvanceBtn.style.backgroundColor = ""; 
        }
    });

    /**
     * Highlights the specified rap line and scrolls it into view.
     * @param {number} index - The index of the line to highlight.
     */
    function highlightLine(index) {
        if (index < 0 || index >= rapLineElements.length) return;
        rapLineElements.forEach((el, i) => {
            if (i === index) {
                el.classList.add('active');
                el.focus(); // For keyboard navigation accessibility
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                el.classList.remove('active');
            }
        });
    }

    /**
     * Shows the quiz section after the rap.
     */
    function showQuizSection() {
        const quizSection = document.getElementById('possessive-quiz-section');
        if(quizSection) {
            quizSection.classList.remove('hidden');
            displayPossessiveQuizQuestion();
        }
    }

    // --- Part 2: Possessive Quiz ---
    const quizData = [
        { image: "../assets/images/grammar/possessives/her_cat.png", sentenceStart: "It's ", sentenceEnd: " cat.", options: ["my", "your", "her", "his"], correct: "her" },
        { image: "../assets/images/grammar/possessives/their_dog.png", sentenceStart: "It's ", sentenceEnd: " dog.", options: ["our", "your", "their", "my"], correct: "their" },
        { image: "../assets/images/grammar/possessives/my_cat_not.png", sentenceStart: "This isn't ", sentenceEnd: " cat.", options: ["my", "his", "her", "its"], correct: "my"},
        { image: "../assets/images/grammar/possessives/our_dog_not.png", sentenceStart: "This isn't ", sentenceEnd: " dog.", options: ["our", "your", "their", "his"], correct: "our"},
        { image: "../assets/images/grammar/possessives/his_cat_not.png", sentenceStart: "It isn't ", sentenceEnd: " cat.", options: ["my", "his", "her", "its"], correct: "his" },

    ];
    let currentQuizIndex = 0;
    const pqImageEl = document.getElementById('pq-image');
    const pqSentenceEl = document.getElementById('pq-sentence');
    const pqOptionsEl = document.getElementById('pq-options');
    const pqFeedbackEl = document.getElementById('pq-feedback');
    const nextPqBtn = document.getElementById('next-pq-btn');
    const pqExerciseAreaEl = document.getElementById('pq-exercise-area'); // Parent for image and sentence

    /**
     * Displays the current question for the Possessive Adjectives Quiz.
     */
    function displayPossessiveQuizQuestion() {
        if(!pqImageEl || !pqSentenceEl || !pqOptionsEl || !pqFeedbackEl || !nextPqBtn || !pqExerciseAreaEl) {
            console.error("Missing critical elements for Possessive Quiz section.");
            if(document.getElementById('possessive-quiz-section')) {
                 document.getElementById('possessive-quiz-section').innerHTML = "<p style='color:red;'>Quiz error.</p>";
            }
            return;
        }

        if (currentQuizIndex < quizData.length) {
            const q = quizData[currentQuizIndex];
            pqImageEl.src = q.image;
            pqImageEl.alt = "Possessive adjective scene";
            pqSentenceEl.innerHTML = `${q.sentenceStart} <span class="possessive-placeholder">___</span> ${q.sentenceEnd}`;
            
            pqOptionsEl.innerHTML = '';
            // Shuffle options
            const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
            shuffledOptions.forEach(opt => {
                const button = document.createElement('button');
                button.textContent = opt;
                button.onclick = () => checkPossessiveQuizAnswer(opt, q.correct);
                pqOptionsEl.appendChild(button);
            });

            pqFeedbackEl.textContent = '';
            pqFeedbackEl.className = 'feedback-subsection';
            nextPqBtn.classList.add('hidden');
        } else {
            // Quiz Complete
            if(pqExerciseAreaEl) pqExerciseAreaEl.innerHTML = ''; 
            if(pqOptionsEl) pqOptionsEl.innerHTML = '';
            if(pqImageEl) pqImageEl.classList.add('hidden');
            if(pqSentenceEl) pqSentenceEl.textContent = "Quiz Complete!";
            pqFeedbackEl.textContent = "Great job with possessives!";
            pqFeedbackEl.className = 'feedback-subsection feedback-correct visible';
            nextPqBtn.classList.add('hidden');
        }
    }

    /**
     * Checks the answer for the Possessive Adjectives Quiz.
     * @param {string} selected - The possessive adjective selected by the user.
     * @param {string} correct - The correct possessive adjective.
     */
    function checkPossessiveQuizAnswer(selected, correct) {
        if(!pqOptionsEl || !pqFeedbackEl || !pqSentenceEl || !nextPqBtn) return;
        pqOptionsEl.querySelectorAll('button').forEach(btn => btn.disabled = true);
        const placeholder = pqSentenceEl.querySelector('.possessive-placeholder');

        if (selected === correct) {
            pqFeedbackEl.textContent = 'Correct!';
            pqFeedbackEl.className = 'feedback-subsection feedback-correct visible';
            playSound(correctSoundQuiz);
            if (placeholder) placeholder.innerHTML = `<strong style="color:green;">${correct}</strong>`;
        } else {
            pqFeedbackEl.textContent = `Incorrect. The answer is ${correct}.`;
            pqFeedbackEl.className = 'feedback-subsection feedback-incorrect visible';
            playSound(incorrectSoundQuiz);
            if (placeholder) placeholder.innerHTML = `<span style="color:red; text-decoration: line-through;">${selected}</span> (Correct: <strong style="color:green;">${correct}</strong>)`;
        }
        nextPqBtn.classList.remove('hidden');
    }

    if(nextPqBtn) {
        nextPqBtn.addEventListener('click', () => {
            currentQuizIndex++;
            displayPossessiveQuizQuestion();
        });
    }

    // Don't start rap display automatically, wait for button click.
    // Don't show quiz section until rap is done or skipped.
});