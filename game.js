// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Clase Ball
class Ball {
  constructor(x, y, radius, speedX, speedY, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Rebote arriba y abajo
    if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
      this.speedY *= -1;
    }
  }
}

// Clase Paddle
class Paddle {
  constructor(x, y, width, height, color, isPlayer = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.isPlayer = isPlayer;
    this.speed = 6;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move(direction) {
    if (direction === "up" && this.y > 0) {
      this.y -= this.speed;
    } else if (direction === "down" && this.y + this.height < canvas.height) {
      this.y += this.speed;
    }
  }

  autoMove(ball) {
    if (ball.y < this.y + this.height / 2) {
      this.y -= this.speed;
    } else if (ball.y > this.y + this.height / 2) {
      this.y += this.speed;
    }
  }
}

// Clase Game
class Game {
  constructor() {
    // Varias pelotas de colores
    this.balls = [
      new Ball(200, 200, 8, 3, 2, "orange"),
      new Ball(400, 300, 15, -2, 3, "cyan"),
      new Ball(100, 500, 12, 2, -2, "blue"),
      new Ball(600, 150, 20, -3, 2, "gray"),
      new Ball(300, 400, 3, 4, -3, "white"),
    ];

    this.paddle1 = new Paddle(0, canvas.height / 2 - 50, 10, 100, "green", true);
    this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100, "red");

    this.keys = {};
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar paletas
    this.paddle1.draw();
    this.paddle2.draw();

    // Dibujar bolas
    this.balls.forEach((ball) => ball.draw());
  }

  update() {
    this.balls.forEach((ball) => {
      ball.move();

      // Colisiones con paleta 1
      if (
        ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
        ball.y >= this.paddle1.y &&
        ball.y <= this.paddle1.y + this.paddle1.height
      ) {
        ball.speedX *= -1;
      }

      // Colisiones con paleta 2
      if (
        ball.x + ball.radius >= this.paddle2.x &&
        ball.y >= this.paddle2.y &&
        ball.y <= this.paddle2.y + this.paddle2.height
      ) {
        ball.speedX *= -1;
      }

      // Si la pelota se sale
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        // reset al centro con dirección aleatoria
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speedX = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 3);
        ball.speedY = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 3);
      }
    });

    // Movimiento manual jugador
    if (this.keys["ArrowUp"]) this.paddle1.move("up");
    if (this.keys["ArrowDown"]) this.paddle1.move("down");

    // Movimiento automático CPU (usa la primera pelota para seguir)
    this.paddle2.autoMove(this.balls[0]);
  }

  handleInput() {
    window.addEventListener("keydown", (e) => (this.keys[e.key] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.key] = false));
  }

  run() {
    this.handleInput();
    const loop = () => {
      this.update();
      this.draw();
      requestAnimationFrame(loop);
    };
    loop();
  }
}

const game = new Game();
game.run();
