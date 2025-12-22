var objects = [];
var objectstoadd = [];
function createRandomObject() {
  let v = {
    x:random(0,400),
    y:random(0,400),
    r:random(8,15),
    cr:random(0,255),
    cg:random(0,255),
    cb:random(0,255),
    vx:random(-0.02,0.02),
    vy:random(-0.02,0.02)
  }
  objects.push(v)
}
var dn = 0.01;
function newton() {
  for(let i = 0; i < objects.length;i++) {
    
    //friction does not exist in space
    //objects[i].vx *= 0.97;
    //objects[i].vy *= 0.97;
    
    objects[i].x += objects[i].vx ;
    objects[i].y += objects[i].vy ; 
    
    let m1 = objects[i].r * objects[i].r * PI * dn; 
    for(let j = i+1; j < objects.length;j++) {
      let m2 = objects[j].r * objects[j].r * PI * dn; 
      
      //F=G* m1*m2/(r^2)
      
      let dx = objects[j].x - objects[i].x;
      let dy = objects[j].y - objects[i].y;
      
      let r = dist(objects[i].x,objects[i].y,objects[j].x,objects[j].y);
      
      let nx = dx/r;
      let ny = dy/r;
      if(r < 0.03) {
        r = 0.05
      }
      let F = (m1 * m2) / (r*r)
      //console.log(F);
      //console.log(r);
      
      if(F == NaN) {
        //console.log("a");
      }
      objects[i].vx += F * nx/m1;
      objects[i].vy += F * ny/m1;
      
      
      
      objects[j].vx += F * (nx*-1)/m2;
      objects[j].vy += F * (ny*-1)/m2;
      
    }
  }
}
function detectFutureCollision(a,b) {//a and b are balls
  //a'nın velocitysi b'den uzun ise a ile b'nin uzaklığı kadar uzun olacak şekilde kısaltıp ucunun b'nin içinde olup olmadığına bakarak sonraki framelerde içine girip girmeyeceğini tespit edebiliriz. sonrasında topu b'nin sınırının ucunda olacak şekilde updateleyebiliriz.
  
}
function handleCollisions() {
  for(let i = 0; i < objects.length;i++) {
    
    for(let j = i+1; j < objects.length;j++) {
      var r = dist(objects[i].x,objects[i].y,objects[j].x,objects[j].y);
      if(r < objects[i].r + objects[j].r) { // collision
        let nmldx = objects[j].x - objects[i].x;
        let nmldy = objects[j].y - objects[i].y;
        
        let nmlr = dist(objects[i].x,objects[i].y,objects[j].x,objects[j].y)
        
        let nmlx = nmldx/nmlr;
        let nmly = nmldy/nmlr;
        
        let normalangle =  atan2(nmly,nmlx);
        
        let incangle1 = atan2(objects[i].vely,objects[i].velx);
        let incangle2 = atan2(objects[j].vely,objects[j].velx);
        
        let ba1 = 2* normalangle - incangle1;
        let ba2 = 2* (normalangle + PI) - incangle2;
        
        let m1 = sqrt(objects[i].velx * objects[i].velx + objects[i].vely * objects[i].vely)
        let mi = objects[i].r*objects[i].r*3*dn;
        let mj= objects[j].r * objects[j].r * 3 * dn;
        objects[i].velx = m1 * mj *cos(ba1)
        objects[i].vely = m1 * mj *sin(ba1)
        
        let m2 = sqrt(objects[j].velx * objects[j].velx + objects[j].vely * objects[j].vely)
        objects[j].velx = m2*mi* cos(ba2)
        objects[j].vely = m2*mi *sin(ba2)
        
        let overlap = (objects[i].r + objects[j].r) - nmlr

        
        objects[i].x -= nmlx * overlap / 2;
        objects[i].y -= nmly * overlap / 2;
        
        objects[j].x += nmlx * overlap / 2;
        objects[j].y += nmly * overlap / 2;

        
        
      }
      
      
    }
  }
}

function getCenterOfMass() {
  let sumx = 0;
  let sumy = 0;
  let sumvx = 0;
  let sumvy = 0;
  for(let i = 0; i < objects.length;i++) {
    sumx += objects[i].x;
    sumvx += objects[i].vx;
    sumy += objects[i].y;
    sumvy += objects[i].vy;
  }
  /*console.log({
    x:sumx/objects.length,
    y:sumy/objects.length,
    vx:sumvx/objects.length,
    vy:sumvy/objects.length,
    
  })*/
  fill(122)
  ellipse(sumx/objects.length,sumy/objects.length,10)
}
function renderObjects() {
  for(let i = 0; i < objects.length;i++) {
    if(objects[i].cr != null && objects[i].cg != null && objects[i].cb != null) {
      fill(objects[i].cr,objects[i].cg,objects[i].cb);
    } else {
      fill(255);
    }
    
    ellipse(objects[i].x,objects[i].y,objects[i].r*2);
    color(120)
    line(objects[i].x, objects[i].y, objects[i].x + objects[i].vx*5, objects [i].y + objects[i].vy*5)
    
  }
}
function setup() {
  frameRate(60)
  createCanvas(400, 400);
  objects.push(
  {
    x:200,
    y:200,
    r:10.3,
    vx:0.065,
    vy:-0.093
  })
  objects.push(
  {
    x:100,
    y:130,
    r:10,
    vx:-0.065,
    vy:0.093
  })

  
  
  let n = 0;
  for(let i = 0; i < n; i++) {
    createRandomObject()
  }
}
var mc = false;
function draw() {
  background(200);
  renderObjects()
  handleCollisions()
  newton();
  
  fill(255,120,120)
  text("balls: "+ objects.length,10,15)
  if(mc) {
    let n = 1;
    for(let i = 0; i < n; i++ ) {
  let v = {
    x:random(mouseX-0.3,mouseX+0.3),
    y:random(mouseY-0.3,mouseY+0.3),
    r:random(8,15),
    cr:random(0,255),
    cg:random(0,255),
    cb:random(0,255),
    vx:random(-0.02,0.02),
    vy:random(-0.02,0.02)
  }
  objects.push(v)
   }
      // createRandomObject();
  mc = false
  }
  
 getCenterOfMass();
}

function mouseClicked() {
  mc = true;
}