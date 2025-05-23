let zombies = [];
let zombieRadius = 30;
let spawnInterval = 60;
let maxscore = 0;
let lastSpawn = 0;
let score = 0;
let gameover = false;
let player = {
    x: 400,
    y: 300,
    radius: 20,
    speed: 5
}
function setup() {
    var c = createCanvas(800, 600);
    gameover = false;
    frameRate(60);
}

function draw() {
    if(gameover == false) {
    background(220);
    renderZombies();
    handleZombieSpawn();
    fill(0, 255, 0);
    ellipse(player.x, player.y, player.radius * 2);
    fill(0);
    zombiesThink();
    textSize(20);
    text("Score: " + score, 10, 20);
    text("Highscore: " + maxscore, 10, 40);
}
}
function mouseClicked() {
    let mouseX = event.clientX - canvas.offsetLeft;
    let mouseY = event.clientY - canvas.offsetTop;
    for(let i = 0; i < zombies.length; i++) {
        let z = zombies[i];
        if(dist(mouseX, mouseY, z.x, z.y) < z.radius) {
            zombies.splice(i, 1);
            score++;
            if(score > maxscore) {
                maxscore = score;
            }
            break;
        }
    }
    if(gameover == true) {
        //alert("a");
        zombies = [];
        score = 0;
        gameover = false;
        player.x = 400;
        player.y = 300;
        lastSpawn = 0;
        frameCount = 0;
        spawnInterval = 60;
        zombieRadius = 30;
        setup();
    }
}
function zombiesThink() {
    for(let i = 0; i < zombies.length; i++) {
        let z = zombies[i];
        let dx = player.x - z.x;
        let dy = player.y - z.y;
        let distToPlayer = Math.sqrt(dx * dx + dy * dy);
        if(distToPlayer > 0) {
            z.x += (dx / distToPlayer) * z.speed;
            z.y += (dy / distToPlayer) * z.speed;
        }
        if(distToPlayer < player.radius + z.radius) {
            textSize(50);
            text("You lost, click the canvas to restart.", 0, 400);
            gameover = true;
        }
    }
}
function renderZombies() {
    console.log(zombies.length);
    for(let i = 0; i < zombies.length; i++) {
        let z = zombies[i];
        fill(255, 0, 0);
        ellipse(z.x, z.y, z.radius * 2);
    }
}
function handleZombieSpawn() {
    frameCount++;
    
    if(frameCount % spawnInterval != 0) {
        return;
    }

    let deg = random(0, 2 * PI);
        let newZombie = {
            x: player.x+ Math.cos(deg) * 399,
            y: player.y+Math.sin(deg) * 300,
            radius: zombieRadius,
            speed: random(1, 3)
        };
        zombies.push(newZombie);
        lastSpawn = frameCount;
    return;
}