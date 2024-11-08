document.getElementById('generateTrivia').addEventListener('click', generateTrivia);
document.getElementById('submitAnswers').addEventListener('click', submitAnswers);
document.getElementById('newTrivia').addEventListener('click', newTrivia);

async function generateTrivia() {
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const url = `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=${type}&category=${category}`;

    const response = await fetch(url);
    const data = await response.json();
    displayQuestions(data.results);
}

function displayQuestions(questions) {
    const questionsContainer = document.getElementById('questions');
    questionsContainer.innerHTML = '';
    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <h3>${question.question}</h3>
            ${question.incorrect_answers.map((answer, i) => `
                <label>
                    <input type="radio" name="question${index}" value="${answer}">
                    ${answer}
                </label>
            `).join('')}
            <label>
                <input type="radio" name="question${index}" value="${question.correct_answer}">
                ${question.correct_answer}
            </label>
        `;
        questionsContainer.appendChild(questionElement);
    });
    document.getElementById('triviaContainer').classList.remove('hidden');
    document.getElementById('submitAnswers').classList.remove('hidden');
}

function submitAnswers() {
    const questionsContainer = document.getElementById('questions');
    const questionElements = questionsContainer.querySelectorAll('div');
    let score = 0;

    questionElements.forEach((questionElement, index) => {
        const correctAnswer = questionElement.querySelector(`input[value="${questionElement.getAttribute('data-correct')}"]`);
        const userAnswer = questionElement.querySelector(`input[name="question${index}"]:checked`);
        if (userAnswer && userAnswer.value === correctAnswer.value) {
            score += 100;
        }
    });

    displayScore(score);
}

function displayScore(score) {
    document.getElementById('score').textContent = `Tu puntaje es: ${score}`;
    document.getElementById('scoreContainer').classList.remove('hidden');
    document.getElementById('triviaContainer').classList.add('hidden');
    document.getElementById('submitAnswers').classList.add('hidden');
}

function newTrivia() {
    document.getElementById('scoreContainer').classList.add('hidden');
    document.getElementById('triviaContainer').classList.add('hidden');
    document.getElementById('config').classList.remove('hidden');
}
