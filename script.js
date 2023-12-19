const startButton = document.getElementById('start-btn');
const questionContainer = document.getElementById('question-container');
const endContainer = document.getElementById('end-container');
const questionElement = document.getElementById('question');
const answerButtons = document.querySelectorAll('.answer-btn');
const initialsForm = document.getElementById('initials-form');
const initialsInput = document.getElementById('initials');
const finalScore = document.getElementById('final-score');
const countdownDisplay = document.getElementById('countdown');
const playAgainButton = document.getElementById('play-again-btn');

let currentQuestionIndex = 0;
let time = 100; // in seconds
let score = 0;
let timer;

// Questions array

const questions = [
  {
    question: 'What symbol is used for comments in JavaScript?',
    answers: [
      { text: '//', correct: true },
      { text: '/* */', correct: false },
      { text: '--', correct: false },
      { text: '**', correct: false }
    ]
  },
  {
    question: 'Which function is used to print content in the console in JavaScript?',
    answers: [
      { text: 'console.log()', correct: true },
      { text: 'print()', correct: false },
      { text: 'display()', correct: false },
      { text: 'log()', correct: false }
    ]
  },
  {
    question: 'What does HTML stand for?',
    answers: [
      { text: 'Hyper Trainer Marking Language', correct: false },
      { text: 'Hyper Text Markup Language', correct: true },
      { text: 'Hyperlinks and Text Markup Language', correct: false },
      { text: 'Home Tool Markup Language', correct: false }
    ]
  },
  {
    question: 'Which HTML tag is used for creating an unordered list?',
    answers: [
      { text: '<ul>', correct: true },
      { text: '<ol>', correct: false },
      { text: '<li>', correct: false },
      { text: '<list>', correct: false }
    ]
  },
  {
    question: 'Which CSS property is used to change the text color of an element?',
    answers: [
      { text: 'color', correct: true },
      { text: 'text-color', correct: false },
      { text: 'font-color', correct: false },
      { text: 'text-style', correct: false }
    ]
  },
  {
    question: 'In JavaScript, what is a variable?',
    answers: [
      { text: 'A method', correct: false },
      { text: 'A data type', correct: false },
      { text: 'A container for storing data values', correct: true },
      { text: 'A function', correct: false }
    ]
  },
  {
    question: 'Which symbol is used to access jQuery?',
    answers: [
      { text: '$', correct: true },
      { text: '#', correct: false },
      { text: '.', correct: false },
      { text: '@', correct: false }
    ]
  },
  {
    question: 'What is the correct syntax for an if statement in JavaScript?',
    answers: [
      { text: 'if i = 5 then', correct: false },
      { text: 'if (i == 5)', correct: true },
      { text: 'if i = 5', correct: false },
      { text: 'if i == 5 then', correct: false }
    ]
  },
  {
    question: 'Which operator is used for strict equality comparison in JavaScript?',
    answers: [
      { text: '==', correct: false },
      { text: '===', correct: true },
      { text: '=', correct: false },
      { text: '!=', correct: false }
    ]
  },
  {
    question: 'What is the purpose of the `href` attribute in HTML?',
    answers: [
      { text: 'To define the header of a page', correct: false },
      { text: 'To specify the style of an element', correct: false },
      { text: 'To indicate the hypertext link destination', correct: true },
      { text: 'To create a horizontal rule', correct: false }
    ]
  },
  // Add more questions...
];
startButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', restartGame);
initialsForm.addEventListener('submit', saveScore);

function startGame() {
  startButton.classList.add('hide');
  questionContainer.classList.remove('hide');
  score = 0;
  time = 100;
  currentQuestionIndex = 0;
  showQuestion();
  updateTimerDisplay();
  timer = setInterval(updateTimer, 1000);
}

function showQuestion() {
  resetState();
  displayQuestion(questions[currentQuestionIndex]);
}

function displayQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach((answer, index) => {
    const button = answerButtons[index];
    button.innerText = answer.text;
    button.classList.remove('hide');
    button.onclick = () => selectAnswer(answer.correct);
  });
}

function resetState() {
  answerButtons.forEach(button => {
    button.classList.add('hide');
    button.classList.remove('correct', 'incorrect');
  });
}

function selectAnswer(correct) {
  if (correct) {
    score += 10;
  } else {
    time -= 10;
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endGame();
  }
}

function updateTimer() {
  time--;
  if (time <= 0) {
    clearInterval(timer);
    endGame();
  }
  updateTimerDisplay();
}

function updateTimerDisplay() {
  countdownDisplay.innerText = time;
}

function endGame() {
  clearInterval(timer);
  questionContainer.classList.add('hide');
  endContainer.classList.remove('hide');
  finalScore.innerText = score;
  playAgainButton.classList.remove('hide');
  displayScoreboard();
}

function restartGame() {
  startGame();
  endContainer.classList.add('hide');
  initialsInput.value = '';
}

function saveScore(event) {
  event.preventDefault();
  console.log("Form submitted"); // Debug log

  const initials = initialsInput.value.trim();
  console.log("Initials:", initials); // Debug log

  if (!initials) {
    alert("Please enter your initials.");
    return;
  }

  const savedScores = JSON.parse(localStorage.getItem('quizScores')) || [];
  const currentScore = { initials: initials, score: score, timestamp: new Date().getTime() };
  
  savedScores.push(currentScore);

  // Keep only the last 6 scores
  if (savedScores.length > 6) {
    savedScores.sort((a, b) => b.timestamp - a.timestamp);
    savedScores.splice(6);
  }

  localStorage.setItem('quizScores', JSON.stringify(savedScores));
  
  displayScoreboard();
}

function displayScoreboard() {
  const savedScores = JSON.parse(localStorage.getItem('quizScores')) || [];

  // Sort scores by highest to lowest
  savedScores.sort((a, b) => b.score - a.score);

  const scoreboard = document.createElement('ol');
  scoreboard.classList.add('scoreboard');

  savedScores.slice(0, 6).forEach(scoreEntry => {
    console.log("Score entry:", scoreEntry); // Log the entire score entry for debugging

    if (scoreEntry && typeof scoreEntry === 'object' && 'initials' in scoreEntry && 'score' in scoreEntry) {
      const scoreItem = document.createElement('li');
      scoreItem.textContent = `${scoreEntry.initials}: ${scoreEntry.score}`;
      scoreboard.appendChild(scoreItem);
    } else {
      console.log("Invalid score entry:", scoreEntry);
    }
  });

  const scoreboardContainer = document.getElementById('scoreboard');
  scoreboardContainer.innerHTML = '';
  scoreboardContainer.appendChild(scoreboard);
  scoreboardContainer.classList.remove('hide');
}
