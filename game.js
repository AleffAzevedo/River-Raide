// Configurações do jogo
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const gameSpeed = 1;
const initialSpeed = 2;
let speed = initialSpeed;
let score = 0;
let gameover = false;

// Classe do avião
class Plane {
  constructor() {
    this.x = 225;
    this.y = 420;
    this.width = 60;
    this.height = 60;
    this.speed = 1000; // 10x mais rápido que o jogo
    this.image = new Image();
    this.image.src = "img/nave.svg"; // Substitua pelo caminho do seu arquivo SVG de avião
  }

  update() {
    this.draw();
  }

  draw() {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  moveLeft() {
    if (this.x > 0) {
      this.x -= this.speed;
    }
  }

  moveRight() {
    if (this.x < canvas.width - this.width) {
      this.x += this.speed;
    }
  }
}

// Classe dos obstáculos
class Obstacle {
  constructor(x, width) {
    this.x = x;
    this.y = -10; // Tamanho menor
    this.width = width;
    this.height = 10; // Tamanho menor
  }

  update() {
    this.y += speed;
    this.draw();
    this.checkCollision();
  }

  draw() {
    context.fillStyle = "blue";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision() {
    if (
      plane.x < this.x + this.width &&
      plane.x + plane.width > this.x &&
      plane.y < this.y + this.height &&
      plane.y + plane.height > this.y
    ) {
      gameover = true;
    }
  }
}

// Array de obstáculos
const obstacles = [];

// Criação do avião
const plane = new Plane();

// Função para criar obstáculos aleatórios
function createObstacle() {
  const obstacleWidth = Math.floor(Math.random() * 100); // Tamanho menor
  const obstacleX = Math.floor(Math.random() * (canvas.width - obstacleWidth));
  obstacles.push(new Obstacle(obstacleX, obstacleWidth));
}

// Função para atualizar o jogo
function update() {
  if (!gameover) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].update();
      if (obstacles[i].y > canvas.height) {
        obstacles.splice(i, 1);
        i--;
        score++;
      }
    }

    plane.update();

    if (score % 10 === 0 && score !== 0) {
      speed += 0.005;
      if (speed > 5) {
        speed = 5; // Velocidade máxima de 5
      }
    }

    context.fillStyle = "black";
    context.font = "24px Arial";
    context.fillText("Score: " + score, 10, 30);

    requestAnimationFrame(update);
  } else {
    context.fillStyle = "black";
    context.font = "48px Arial";
    context.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
    document.getElementById("restartButton").style.display = "block";
  }
}

// Função para controlar o avião com as setas do teclado
function control(e) {
  if (e.keyCode === 37 && plane.x > 0) {
    plane.x -= 10;
  } else if (e.keyCode === 39 && plane.x < canvas.width - plane.width) {
    plane.x += 10;
  }
}

// Função para reiniciar o jogo
function restartGame() {
  obstacles.length = 0; // Limpa o array de obstáculos
  score = 0;
  gameover = false;
  speed = initialSpeed;
  plane.x = 225;
  plane.y = 450;
  document.getElementById("restartButton").style.display = "none";
  update(); // Reinicia o loop do jogo
}

// Adiciona evento de clique ao botão de reinício
document.getElementById("restartButton").addEventListener("click", restartGame);

// Adiciona evento de controle
window.addEventListener("keydown", control);

// Cria obstáculo a cada 1 segundo
setInterval(createObstacle, 1000);

// Inicia o jogo
update();
