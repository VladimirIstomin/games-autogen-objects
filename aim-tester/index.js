const CIRCLE_DIAMETER = { min: 10, max: 40 }
const COLORS = ['#5d1451', '#2f416d', '#14868c', '#94ceca', '#ef6c57', '#7ed3b2', '#b9e6d3', '#f2f2f2'];

// helpers
const getRandomNumberBetween = (min, max) => Math.random() * (max - min) + min;
const formatTimeUnit = timeUnit => timeUnit >= 10 ? timeUnit : `0${ timeUnit }`;
const getRandomElementFromList = list => list[Math.floor(Math.random() * list.length)];

// DOM objects
const startButton = document.querySelector('.start');
const restartButton = document.querySelector('#restart');
const timeButtons = document.querySelectorAll('#time-btn');
const screens = document.querySelectorAll('.screen');
const board = document.querySelector('#board');
const clock = document.querySelector('#time');
const scoreInfo = document.querySelector('#score');

startButton.addEventListener('click', () => slideScreen(screens[0]));

timeButtons.forEach(timeButton => timeButton.addEventListener('click', configureGame({
  board,
  screens,
  clock,
  scoreInfo,
  colors: COLORS,
  circleDiameter: CIRCLE_DIAMETER,
  slideScreen,
  decreaseTimeOnClock,
  createRandomCircle,
  finishGame,
  callback: initializeGame
})));

restartButton.addEventListener('click', () => restartGame(screens, board));


function slideScreen(screen) {
  screen.classList.add('up');
} 


function configureGame({ screens, slideScreen, callback, ...params }) {
  return function(timeChoiceEvent) {
    const timeSeconds = parseInt(timeChoiceEvent.target.getAttribute('data-time-seconds'));
    slideScreen(screens[1]);
    callback({ timeSeconds, screens, slideScreen, ...params });
  }
}


function initializeGame({ timeSeconds, screens, slideScreen, clock, decreaseTimeOnClock, scoreInfo, finishGame, ...params }) {
  let score = 0;

  const addScore = () => score++; 
  const timer = setInterval(decreaseTimeOnClock({ clock, timeSeconds, decreaseBySeconds: 1 }), 1000);

  createRandomCircle({ removalCallback: createRandomCircle, addScore, ...params });

  setTimeout(() => {
    finishGame({ screens, slideScreen, scoreInfo, score });
    clearInterval(timer);
  }, timeSeconds * 1000);
};


function decreaseTimeOnClock({ clock, timeSeconds, decreaseBySeconds }) {
  return function() {
    timeSeconds -= decreaseBySeconds;
    const clockMinutes = Math.floor(timeSeconds / 60);
    const clockSeconds = timeSeconds - clockMinutes * 60;

    clock.textContent = `${ formatTimeUnit(clockMinutes) }:${ formatTimeUnit(clockSeconds) }`;
  }
}


function createRandomCircle({ circleDiameter, colors, removalCallback, addScore, board }) {
  const circle = document.createElement('div');
  circle.classList.add('circle');

  const circleDiameterPrecise = getRandomNumberBetween(circleDiameter.min, circleDiameter.max);
  circle.style.width = circle.style.height = `${ circleDiameterPrecise }px`;

  const { width, height } = board.getBoundingClientRect();
  circle.style.top = `${ getRandomNumberBetween(circleDiameterPrecise, height - circleDiameterPrecise) }px`;
  circle.style.left = `${ getRandomNumberBetween(circleDiameterPrecise, width - circleDiameterPrecise) }px`;

  circle.style.backgroundColor = getRandomElementFromList(colors);

  circle.addEventListener('click', e => {
    e.target.remove();
    addScore();

    removalCallback({ board, circleDiameter, colors, removalCallback, addScore });
  });

  board.append(circle);
}


function finishGame({ screens, slideScreen, scoreInfo, score }) {
  scoreInfo.textContent = score;
  slideScreen(screens[2]);
}


function restartGame(screens, board) {
  board.innerHTML = null;
  screens.forEach((screen, index) => index !== 0 ? screen.classList.remove('up') : null);
}
