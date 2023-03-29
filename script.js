const score = document.querySelector('.score'),
  startBtn = document.querySelector('.game__start'),
  gameArea = document.querySelector('.gamearea'),
  car = document.createElement('div'),
  diffBtn = document.querySelectorAll('.difficulty__button'),
  diffSelected = document.querySelector('.difficulty-selected'),
  screens = document.querySelectorAll('.screen'),
  screenGame = document.querySelector('.screen_game'),
  screenStart = document.querySelector('.screen_start'),
  startMenu = document.querySelector('.start__menu');

const enemyStyles = ['enemy1', 'enemy2', 'enemy3', 'enemy4', 'enemy5'];

car.classList.add('car');

document.addEventListener('keydown', startGame);
document.addEventListener('keyup', stopGame);

const music = ['./audio/game-audio.mp3'];
const audio = new Audio();
audio.src = music[0];
audio.volume = 0.1;

const keys = {
  ArrowDown: false,
  ArrowUp: false,
  ArrowLeft: false,
  ArrowRight: false,
};

const settings = {
  start: false,
  score: 0,
  speed: 6,
  traffic: 3,
};

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function random(num) {
  return Math.floor(Math.random() * num);
}

diffBtn.forEach(item => {
  item.addEventListener('click', () => {
    if (item.classList.contains('easy')) {
      settings.speed = 5;
      settings.traffic = 3.5;
      diffSelected.textContent = 'Выбрана сложность: легкая';
      diffBtn.forEach(item => {
        item.classList.remove('active');
      });
      item.classList.add('active');
    } else if (item.classList.contains('medium')) {
      settings.speed = 8;
      settings.traffic = 3;
      diffSelected.textContent = 'Выбрана сложность: средняя';
      diffBtn.forEach(item => {
        item.classList.remove('active');
      });
      item.classList.add('active');
    } else if (item.classList.contains('hard')) {
      settings.speed = 10;
      settings.traffic = 2.5;
      diffSelected.textContent = 'Выбрана сложность: сложная';
      diffBtn.forEach(item => {
        item.classList.remove('active');
      });
      item.classList.add('active');
    }
  });
});

startBtn.addEventListener('click', () => {
  startMenu.classList.add('hide');
  gameArea.innerHTML = '';
  car.style.left = 'calc(50% - 25px)';
  car.style.bottom = '75px';
  screenGame.classList.add('screen-up')
  screenGame.classList.remove('screen_hide')
  screenStart.classList.remove('screen_show');
  for (let i = 0; i < getQuantityElements(80); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = i * 80 + 'px';
    line.y = i * 80;
    gameArea.appendChild(line);
  }

  for (let i = 0; i < getQuantityElements(80 * settings.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -100 * settings.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background =
      'rgba(0, 0, 0, 0) url(./image/' +
      enemyStyles[random(enemyStyles.length)] +
      '.png) center / cover no-repeat';
    gameArea.append(enemy);
    gameArea.appendChild(enemy);
  }
  settings.score = 0;
  settings.start = true;
  gameArea.appendChild(car);
  settings.x = car.offsetLeft;
  settings.y = car.offsetTop;
  audio.autoplay = true;
  audio.play();
  requestAnimationFrame(playGame);
});

function startGame(event) {
  event.preventDefault();
  keys[event.key] = true;
}

function playGame() {
  if (settings.start) {
    settings.score += settings.speed;
    score.innerHTML = 'Score <br>' + settings.score;
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && settings.x > 0) {
      settings.x -= settings.speed;
    }
    if (keys.ArrowRight && settings.x < gameArea.offsetWidth - car.offsetWidth) {
      settings.x += settings.speed;
    }
    if (keys.ArrowUp && settings.y > 0) {
      settings.y -= settings.speed;
    }
    if (keys.ArrowDown && settings.y < gameArea.offsetHeight - car.offsetHeight) {
      settings.y += settings.speed;
    }
    car.style.top = settings.y + 'px';
    car.style.left = settings.x + 'px';
    requestAnimationFrame(playGame);
  }
}

function stopGame(event) {
  event.preventDefault();
  keys[event.key] = false;
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function (line) {
    line.y += settings.speed;
    line.style.top = line.y + 'px';
    if (line.y >= document.documentElement.clientHeight) {
      line.y = -80;
    }
  });
}

function moveEnemy() {
  let enemies = document.querySelectorAll('.enemy');
  enemies.forEach(function (item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();
    if (
      carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top
    ) {
      settings.start = false;

      audio.pause();
      audio.currentTime = 0;
      audio.autoplay = false;
      startMenu.classList.remove('hide');
      settings.speed = 5;
      settings.traffic = 3;
      diffSelected.textContent = '';
      diffBtn.forEach(item => {
        item.classList.remove('active');
      });
    }
    item.y += settings.speed / 2;
    item.style.top = item.y + 'px';
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -80 * settings.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
      item.style.background =
        'rgba(0, 0, 0, 0) url(./image/' +
        enemyStyles[random(enemyStyles.length)] +
        '.png) center / cover no-repeat';
    }
  });
}
