
var p = {"x":0,"y":0,"r":15,"xvel":0,"yvel":0,"ammo":30,"reserve":120,"score":0};
var gameover = false;
var camx = 200
var camy = 200
var zombies = [];
var lastSpawn = 0;
var supplies = [];

var spawnInterval = 180;
var frameCount = 0;
var lastshot = 1;
var lastreloaded = 1;
var cam = {"x":0,"y":0}
function drawplayer() {
  fill(0,125,125)
  ellipse(p.x-camx,p.y-camy,p.r*2)
}

function drawzombies() {
  fill(255,0,0)
  for (let i = 0; i < zombies.length;i++) {
    ellipse(zombies[i].x-camx,zombies[i].y-camy,zombies[i].r*2);
  }
}
function drawsupplies() {
  
  for (let i = 0; i < supplies.length;i++) {
    fill(255,255,0)
    ellipse(supplies[i].x-camx,supplies[i].y-camy,supplies[i].r*2);
    fill(0,0,0)
    text(supplies[i].val,supplies[i].x-camx,supplies[i].y-camy)
  }
}
function len(x,y) {
  return sqrt(x*x+y*y);
}
function normalised(x,y) {
  let l = len(x,y);
  return {"x":x/l,"y":y/l};
}
function thinkzombies() {
  for (let i = 0; i < zombies.length;i++) {

    v = normalised(p.x - zombies[i].x,p.y-zombies[i].y);
    
    zombies[i].x += v.x * zombies[i].v;
    zombies[i].y += v.y * zombies[i].v;
    
    if(dist(p.x,p.y,zombies[i].x,zombies[i].y) < p.r + zombies[i].r) {
            textSize(20);
            text("You lost, click the canvas to restart.", 0, 200);
            gameover = true;
    }

  }
}

function spawnzombies() {
    //frameCount++;
    
    if(Math.round(frameCount) % spawnInterval != 0) {
        return;
    }

    let deg = random(0, 2 * PI);
        let newZombie = {
            x: p.x+ Math.cos(deg) * 200,
            y: p.y+Math.sin(deg) * 200,
            r: random(7,15),
            v: random(1, 3+sqrt(p.score/20))
        };
        zombies.push(newZombie);
        lastSpawn = frameCount;
    return;
}
function dozombies() {
  
  spawnzombies();
  thinkzombies();
  drawzombies()
}
function setup() {
  rmx = 0;
  rmy = 0;
  createCanvas(400, 400);
  p.highscore = 0;
  /*let v = {"x":300,"y":300,"r":"10","v":"3"}
  zombies.push(v)*/
}



function handleplayer() {
  
  p.x += p.xvel;
  p.y += p.yvel;
  
  p.yvel *= 0.97;
  p.xvel *=0.97
  drawplayer();
  moveplayer();
}


function handlesupplycoll() {
  for(let i = 0; i < supplies.length;) {
      if(dist(p.x,p.y,supplies[i].x,supplies[i].y) < p.r + supplies[i].r) {
        p.reserve+=supplies[i].val;
        supplies.splice(i,1)
    } else {
      i++
    }
  }
}
function draw() {
  if(!gameover) {
  rmx = mouseX + camx;
  rmy = mouseY + camy;
  background(220);
  strokeWeight(1);
  fill(255)
  ellipse(0-camx,0-camy,10)
  fill(125,0,0)
  strokeWeight(0);
  text("this is the center of the map!",0 - camx, 0-camy)
  
  text("you can move with wasd or arrow keys",0 - camx, 15-camy)
  text("you can reload with r",0 - camx, 30-camy)
  text("you can shoot by clicking",0 - camx, 45-camy)
  text("current enemy count is: "+zombies.length,0 - camx, 60-camy)
  
  strokeWeight(1);
  
  drawsupplies();
  handlesupplycoll();
  
  handleplayer();
  
  dozombies();
  
  strokeWeight(0);
  textSize(15);
  text("ammo: " + p.ammo +"/"+p.reserve,0,15)
  if(p.score > p.highscore) {
    p.highscore = p.score;
  }
  text("score: " + p.score + " highscore: "+p.highscore, 0,30)
  text("velocity: "+len(p.xvel,p.yvel).toFixed(2) +"p/second",0,45)
  strokeWeight(2);
  
  
  camx += (p.x-200 - camx)/10
  camy += (p.y-200 - camy)/10
  
}
}
function dp(x1,y1,x2,y2) {
  return (x1*x2+y1*y2)
}
function moveplayer() {
  
  line(mouseX,mouseY,p.x-camx,p.y-camy)
  //text("rmx:"+rmx.toFixed(2)+"rmy:"+rmy.toFixed(2),mouseX,mouseY)
  let wx = 0;
  let wy = 0;
  
  if(mouseIsPressed && lastshot > 4) {
    shoot();
    lastshot = 0;
  }

  
  
  if (keyIsDown(LEFT_ARROW) === true || keyIsDown(65) === true ) {
    wx -= 1;
  }

  if (keyIsDown(RIGHT_ARROW) === true || keyIsDown(68) === true ) {
    wx += 1;
  }

  if (keyIsDown(UP_ARROW) === true || keyIsDown(87) === true ) {
    wy -= 1;
  }

  if (keyIsDown(DOWN_ARROW) === true || keyIsDown(83) === true ) {
    wy += 1;
  }
  
  let len = sqrt(wx*wx+wy*wy);
  
  if(len != 0) {
  wx = wx/len;
  wy = wy/len;
  }
  
  let wspeed = 3;
  let current_speed = dp(wx,wy,p.xvel,p.yvel);
  let add_speed = wspeed - current_speed;
  
  line(p.x-camx,p.y-camy,p.x+wx*30-camx,p.y+wy*30-camy);
  line(p.x-camx,p.y-camy,p.x+p.xvel*30-camx,p.y+p.yvel*30-camy);
  
  let accel_speed = 1 * len;
  if(accel_speed > add_speed)
    accel_speed = add_speed;
  p.yvel += wy * accel_speed;
  p.xvel += wx * accel_speed;
}


function shoot() {
  if(p.ammo == 0) {
    return 0;
  }
  p.ammo--;
  stroke("yellow")
  strokeWeight(6);
  line(mouseX,mouseY,p.x-camx,p.y-camy)
  strokeWeight(1);
  stroke("black")
  let dx = rmx - p.x;
  let dy = rmy - p.y;
  let dnormalised = normalised(dx,dy);
  let shootlinex = dnormalised.x;
  let shootliney = dnormalised.y;
  
  for(let i =0; i < zombies.length;) {
    let distance = dist(p.x,p.y,zombies[i].x,zombies[i].y);


    
    let t = dist(shootlinex*distance+p.x,shootliney*distance+p.y,zombies[i].x,zombies[i].y);
    
    //line(p.x-camx,p.y-camy,shootlinex*distance+p.x,shootliney*distance+p.y)
    if(t < zombies[i].r) { 
      
      if(random(1,100) < 25) {
        rad=random(0,2* PI)
        let s = {
          val:ceil(zombies[i].v),
          x: zombies[i].x+ Math.cos(rad) * 10,
          y: zombies[i].y+ Math.sin(rad) * 10,
          r: random(7,15)
        }
        
          console.log(s.x)
        supplies.push(s);
      }
      
      zombies.splice(i,1)
      p.score++;
      
    } else {
      i++;
    }
  }
}
function mousePressed() {
  if(gameover) {
    gameover = false;
    zombies = []
    lastSpawn = 0;
    supplies = []
    p.x = 0;
    p.y = 0;
    p.xvel = 0;
    p.yvel = 0;
    p.ammo = 30;
    p.reserve = 120;
    p.score = 0;
  } else if(lastshot > 5) {
   shoot();
   lastshot=0;
  }
}
function keyPressed() {
  if(!gameover) {
  if (key === 'r') {
    p.reserve += p.ammo;
    p.ammo = 0;
    p.ammo =30;
    p.reserve -= 30;
  }
    if (key === 'n') {
    p.reserve = 120;
    p.ammo = 30;
    p.x = 200;
    p.y = 200;
  }
  if(key === "f") {
    p.xvel = 0;
    for(let i = 0; i < 1000; i++) {
          let deg = random(0, 1);
        let newZombie = {
            x: p.x+ Math.cos(deg) * 2000,
            y: p.y+Math.sin(deg) * 20000,
            r: random(7,15),
            v: 10
        };
        zombies.push(newZombie);
    }
  }
    if(key === "q") {
    p.xvel = 32000;
   
  }
  }
}

setInterval(function() {
  lastshot++;
  lastreloaded++;
},50)
  