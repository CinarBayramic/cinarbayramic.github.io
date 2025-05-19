const clamp = (val, min, max) => Math.min(Math.max(val, min), max)
var b_x, b_y;
var b_r;
var b_vely;
var radiuscontroller;
function setup() {
  radiuscontroller = createSlider(4, 100);
  radiuscontroller.position(20,430)
  b_x = 200;
  b_y = 0;
  b_r = 30;
  b_vely = 1;
  createCanvas(400, 400);
  
}

function draw() {
  b_r = radiuscontroller.value();
  background(220);
  line(0,200,400,200);
  
  
  fill(122,122,255)
  rect(0,200,400,200);
  fill(255,255,255)
  ellipse(b_x, b_y%400, b_r, b_r);
  
  
  text("x="+mouseX+"y="+mouseY,mouseX,mouseY)
  b_y = clamp(b_y + b_vely,0, 400);
  
  //batmazlık = yoğunluk * yerçekimi * derinlik(aslında alan ama olsun :])
  if(b_y>200) {
    b_vely-= 1*0.01*(b_y-200);
  }
  b_vely+=0.1;
  b_vely=clamp(b_vely*0.99,-300,300)
  //b_vely += 9.3;
}