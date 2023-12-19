const startButton = document.getElementById('start-btn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const resultElement = document.getElementById('result');
const endScreen = document.getElementById('end-screen');
const initialsInput = document.getElementById('initials');
const submitForm = document.getElementById('submit-form');
const timerElement = document.getElementById('timer');
const remainingQuestionsElement = document.getElementById('remaining-questions');
const playAgainButton = document.getElementById('play-again-btn');
const scoreboardButton = document.getElementById('scoreboard-btn');

let currentQuestionIndex = 0;
let time = 60; // Initial time in seconds
let timer;

startButton.addEventListener('click', startQuiz);
submitForm.addEventListener('submit', saveScore);
playAgainButton.addEventListener('click', playAgain);
scoreboardButton.addEventListener('click', displayScoreboard);

function startQuiz() {
  startButton.style.display = 'none';
  questionContainer.style.display = 'block';
  showQuestion();
  updateTimerDisplay();
  timer = setInterval(updateTimer, 1000);
  endScreen.style.display = 'none'; // Hide the 'Game Over' screen initially
  playAgainButton.style.display = 'none'; // Hide the "Play Again" button
}

function showQuestion() {
  resetOptions();
  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
    question.options.forEach(option => {
      const button = document.createElement('button');
      button.textContent = option;
      button.classList.add('option-btn');
      button.addEventListener('click', checkAnswer);
      optionsElement.appendChild(button);
    });
    updateRemainingQuestions();
  } else {
    endQuiz();
  }
}

function checkAnswer(event) {
  const selectedOption = event.target;
  const correct = questions[currentQuestionIndex].answer === selectedOption.textContent;
  
  if (correct) {
    resultElement.textContent = 'Correct!';
  } else {
    resultElement.textContent = 'Wrong!';
    time -= 20; // Penalty for wrong answer, subtract 20 seconds
    if (time < 0) {
      time = 0; // Ensure the timer doesn't go below zero
    }
  }

  resultElement.style.display = 'block';
  setTimeout(() => {
    resultElement.style.display = 'none';
    currentQuestionIndex++;
    optionsElement.innerHTML = ''; // Clear previous options
    showQuestion();
  }, 1000);
}

function updateTimer() {
  time--;
  if (time <= 0) {
    endQuiz();
  }
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function endQuiz() {
  clearInterval(timer);
  questionContainer.style.display = 'none';
  endScreen.style.display = 'block';
  playAgainButton.style.display = 'block'; // Display the "Play Again" button

  const finalScore = calculateScore();
  const totalQuestions = questions.length;
  const scoreDisplay = document.createElement('p');
  scoreDisplay.textContent = `Your final score: ${finalScore} out of ${totalQuestions * 10}`;
  endScreen.appendChild(scoreDisplay);

  saveScoreToLocal(finalScore);
}

function calculateScore() {
  let totalScore = 0;

  questions.forEach(question => {
    const selectedOption = document.querySelector('.option-btn.selected');
    const correctAnswer = question.answer;

    if (selectedOption) {
      const timeTaken = 60 - time; // Calculate time taken for each question
      let questionScore = 10 - Math.floor(timeTaken / 6); // Calculate question score
      questionScore = questionScore < 0 ? 0 : questionScore; // Ensure minimum score is 0
      totalScore += selectedOption.textContent === correctAnswer ? questionScore : 0;
    }
  });

  return totalScore;
}

function saveScoreToLocal(score) {
  const scores = JSON.parse(localStorage.getItem('quizScores')) || [];
  scores.push(score);
  localStorage.setItem('quizScores', JSON.stringify(scores));
}

function displayScoreboard() {
  const scores = JSON.parse(localStorage.getItem('quizScores')) || [];
  console.log('Saved Scores:', scores);
}

function resetOptions() {
  optionsElement.innerHTML = '';
}

function updateRemainingQuestions() {
  const remaining = questions.length - currentQuestionIndex;
  remainingQuestionsElement.textContent = `${remaining} ${remaining === 1 ? 'question' : 'questions'} remaining`;
}

function playAgain() {
  currentQuestionIndex = 0;
  time = 60;
  startQuiz();
}
