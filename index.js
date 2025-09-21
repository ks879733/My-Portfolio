const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize on window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ---- Stars ----
let stars = [];
for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2,
    alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.01
  });
}

// ---- Shooting Stars ----
let shootingStars = [];

// ---- Butterflies ----
class Butterfly {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.color = Math.random() > 0.5 ? "aqua" : "white";
    this.angle = 0;
    this.speed = 1 + Math.random() * 1.5;
  }
  update() {
    this.angle += 0.1;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed * 0.5;
    if (this.x > canvas.width || this.y > canvas.height || this.y < 0) {
      this.x = -10;
      this.y = Math.random() * canvas.height;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    // wings (small trails)
    ctx.beginPath();
    ctx.arc(this.x - 8, this.y - 3, 3, 0, Math.PI * 2);
    ctx.arc(this.x - 8, this.y + 3, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
let butterflies = Array.from({ length: 8 }, () => new Butterfly());

// ---- Animation Loop ----
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Stars blink
  stars.forEach(star => {
    star.alpha += star.speed * (Math.random() > 0.5 ? 1 : -1);
    if (star.alpha <= 0) star.alpha = 0.1;
    if (star.alpha > 1) star.alpha = 1;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
    ctx.fill();
  });

  // Shooting stars
  if (Math.random() < 0.005) {
    shootingStars.push({
      x: Math.random() * canvas.width,
      y: 0,
      len: Math.random() * 80 + 50,
      speed: Math.random() * 6 + 4
    });
  }

  shootingStars.forEach((s, i) => {
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.len, s.y + s.len / 2);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    s.x += -s.speed;
    s.y += s.speed / 2;

    if (s.x < -100 || s.y > canvas.height + 100) {
      shootingStars.splice(i, 1);
    }
  });

  // Butterflies
  butterflies.forEach(b => {
    b.update();
    b.draw();
  });

  requestAnimationFrame(animate);
}
animate();
