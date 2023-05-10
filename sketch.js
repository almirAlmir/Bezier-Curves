window.addEventListener("features", (Event) => Event.preventDefault());
let curves;
let width = 800;
let height = 400;
let curve = 0;
let Evaluation = [5, 10, 20, 80];
let evalIndex = 3;

//-----------------------------
//UI
let buttonAdd;
let buttonDel;
let buttonNEvaluations;
let buttonSelectcurve;
let checkDot;
let checkPoligon;
let checkCurves;
let selectBox;
function setup() {
  // put setup code here
  createCanvas(width, height);

  curves = [
    {
      //index: 0,
      color: [0, 0, 255], // redish
      bezier: [],
      points: [],
    },
  ];


  let div = document.createElement("DIV");
  let divCheck = document.createElement("DIV");
  let container = document.createElement("DIV");
  
  document.body.appendChild(div);
  document.body.appendChild(divCheck);
  document.body.appendChild(container);

  div.id = "buttons";
  divCheck.id = "checks";
  container.id = "container";
  container.appendChild(divCheck)

  buttonAdd = createButton("ADD");
  buttonDel = createButton("DEL");
  buttonNEvaluations = createButton("Nº Eval"+ Evaluation[evalIndex]);
  buttonSelectcurve = createButton("Select");

  buttonAdd.parent('buttons');
  buttonDel.parent('buttons');
  buttonNEvaluations.parent('buttons');
  buttonSelectcurve.parent('buttons');

  checkDot = createCheckbox("Hide Dots", false);
  checkPoligon = createCheckbox("Hide Poligons", false);
  checkCurves = createCheckbox("Hide Curves", false);

  checkDot.parent('checks');
  checkPoligon.parent('checks');
  checkCurves.parent('checks');

  selectBox = createSelect();
  selectBox.option(1);
  selectBox.option(2);
  selectBox.option(3);
  selectBox.option(4);
  selectBox.option(5);
  selectBox.option(6);
  selectBox.option(7);
  selectBox.option(8);
  selectBox.option(9);
  selectBox.option(10);
  selectBox.parent('container')
  //Actions
  buttonAdd.mouseClicked(() => {
    CurveAdd();
    curve = curves.length-1;

  });

  buttonSelectcurve.mouseClicked(() => {
    curve = selectBox.value()-1;
  })

  buttonDel.mouseClicked(() => {
    curves.splice(curve, 1);
    if(curves.length <= 1){
      CurveAdd();
    }
    
  })

  buttonNEvaluations.mouseClicked(() => {
    evalIndex = (evalIndex+1) % (4);
  })

}

function draw() {
  // put drawing code here
  clear();
  background(200);
  /*stroke(20, 20, 20);
  strokeWeight(15);
  point(40, 40);
  point(197, 280);
  stroke(200, 150, 200);
  strokeWeight(3);
  line(40, 40, 197, 280);*/
  addBezier();
  for(let i = 0; i <= curves.length-1; i++){
  
    for(let j = 0; j<=curves[i].points.length-1; j++){
      stroke(curves[i].color[0]-30, curves[i].color[1]-30, curves[i].color[2]-30);
      strokeWeight(20);
      if(!checkDot.checked()) point(curves[i].points[j].x, curves[i].points[j].y);
    }
    for(let j = 0; j<=curves[i].points.length-2; j++){

      stroke(curves[i].color[0], curves[i].color[1], curves[i].color[2], 100);
      strokeWeight(5);
      if(!checkPoligon.checked()) line(curves[i].points[j].x, curves[i].points[j].y, curves[i].points[j+1].x, curves[i].points[j+1].y);
    }
    stroke(curves[i].color[0]-30, curves[i].color[1]-30, curves[i].color[2]-30);
    strokeWeight(5);
    for(let j = 0; j<=curves[i].bezier.length-2; j++){
      if(!checkCurves.checked()) line(curves[i].bezier[j].x, curves[i].bezier[j].y, curves[i].bezier[j+1].x, curves[i].bezier[j+1].y);
    }

  }        
        

}

//Funcoes usadas pra auxiliar implementacao

function interpolate(t, p0, p1) {
  const pResult = new Point((1-t)*p0.x+t*p1.x, (1-t)*p0.y+t*p1.y);
  return pResult;
}
function deCasteljau(points, nEvaluations) {
  if (points === undefined || points.length < 1) return [];
        result = [];
        start = points[0];
        for (let t = 0; t <= 1; t += 1 / nEvaluations) {
          controls = points;

          while (controls.length > 1) {
            aux = [];

            for (i = 0; i < controls.length - 1; i++) {
              aux[i] = interpolate(t, controls[i], controls[i + 1]);
            }
            controls = aux;
          }

          result.push(controls[0]);
        }
        return result;
}
function addBezier(){

  for (let i = 0; i < curves.length; i++) {
    curves[i].bezier = deCasteljau(
      curves[i].points,
      Evaluation[evalIndex]
    );
  }

}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
//Project implementation


function mousePressed(){

  if(mouseX > width || mouseY > height || mouseY < height-400) return;

  pointSelected = false;
  for(j = 0; j<curves[curve].points.length ; j++){

    if(dist(mouseX, mouseY,
      curves[curve].points[j].x, curves[curve].points[j].y) <= 20){

        pointSelected = true;
      }
  }

  if(pointSelected) return;

  const newpoint = new Point(mouseX, mouseY);
  curves[curve].points.push(newpoint);

}

function doubleClicked(){

  pointSelected = false;
  removeIndex = -1;
  for(let j = 0; j<curves[curve].points.length ; j++){

    if(dist(mouseX, mouseY,
      curves[curve].points[j].x, curves[curve].points[j].y) <= 20){

        pointSelected = true;
        removeIndex = j;
      }
  }

  if(pointSelected){

    curves[curve].points.splice(removeIndex, 1);
    return;
  }
}

function mouseReleased(){
  return;
}

function mouseDragged(){

  pointSelected = false;
  moveIndex = -1;
  for(let j = 0; j<curves[curve].points.length ; j++){

    if(dist(mouseX, mouseY,
      curves[curve].points[j].x, curves[curve].points[j].y) <= 20){

        pointSelected = true;
        moveIndex = j;
      }
  }

  if(pointSelected){
    curves[curve].points[moveIndex].x = mouseX;
    curves[curve].points[moveIndex].y = mouseY;
  }
}

function selectCurve(curveIndex){

  curve = curveIndex;
}

function CurveAdd(){
  
  const newcurve = {
   //index : indexCurve,
    color : [getRandomArbitrary(1, 255), getRandomArbitrary(1, 255), getRandomArbitrary(1, 255)],
    bezier : [],
    points : [],
  }

  curves.push(newcurve);
}

class Point{
  constructor(coordX, coordY) {
    this.x = coordX;
    this.y = coordY;
  }
}
class Curve{
  constructor(){

    this.index = indexCurve;
    this.color = [getRandomArbitrary(1, 255), getRandomArbitrary(1, 255), getRandomArbitrary(1, 255)];
    this.bezier = [];
    this.points = [];
  }
}

