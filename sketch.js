window.addEventListener("features", (Event) => Event.preventDefault());
//Comment added by testing windows 8.1
// SECTION: VARS
let curves;
let width = 1200;
let height = 600;
let curve = 0;
let switchIndex = 0;
let Evaluation; //* input field

//¢ UI

let input;
let evalDiv;
let buttonEvalDiv;
let slider;
let sliderLabel;
let sliderInFocus = false;
let buttonAdd;
let buttonDel;
let buttonSelectCurve;
let checkDot;
let checkPolygon;
let checkCurves;

//! SECTION

function setup() {
  createCanvas(width, height);

  curves = [
    {
      color: [0, 0, 255],
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
  container.appendChild(divCheck);

  // SECTION: BUTTONS & INPUT FIELD


  buttonAdd = createButton("ADD");
  buttonDel = createButton("DEL");
  buttonSelectCurve = createButton("Switch Curve");
  buttonAdd.parent("buttons");
  buttonDel.parent("buttons");
  buttonSelectCurve.parent("buttons");
  //?
  input = createInput();
  input.attribute("placeholder", "# of evaluations");
  evalDiv = createDiv();
  evalDiv.id("inputField");
  evalDiv.parent("buttons");
  evalDiv.style("display", "flex");
  evalDiv.style("align-items", "center");
  evalDiv.style("margin-top", "10px");
  evalDiv.style("padding-left", "6px");
  input.parent("inputField");
  input.style("width", "132px");


  input.elt.addEventListener("focus", onFocusIF);

  buttonEvalDiv = createButton("OK");
  buttonEvalDiv.style("width", "30px");
  buttonEvalDiv.style("height", "20px");
  buttonEvalDiv.style("margin-left", "10px");
  buttonEvalDiv.parent("inputField");

  // !SECTION

  // SECTION: SLIDER

  sliderLabel = createP("--");
  sliderLabel.style("color", "#ffffff");
  sliderLabel.style("margin-right", "15px");
  slider = createSlider(0, 200, 20, 1);
  slider.style("width", "180px");

  slider.elt.addEventListener("focus", () => {
    sliderInFocus = true;
  });

  slider.elt.addEventListener("blur", () => {
    sliderInFocus = false;
  });

  // !SECTION

  // SECTION: CHECKBOXES & BUTTONS/CONTROLS

  checkDot = createCheckbox("Hide Control Points", false);
  checkPolygon = createCheckbox("Hide Polygons", false);
  checkCurves = createCheckbox("Hide Curves", false);

  checkDot.parent("checks");
  checkPolygon.parent("checks");
  checkCurves.parent("checks");

  buttonAdd.mouseClicked(() => {
    CurveAdd();
    curve = curves.length - 1;
  });

  buttonEvalDiv.mouseClicked(() => {
    Evaluation = input.value();
    if (Evaluation < 0) Evaluation = 0;
    if (Evaluation > 200) Evaluation = 200;
    slider.value(Evaluation);
    sliderLabel.html("Evaluations: " + slider.value());
  });

  document.addEventListener("keydown", (event) => {
    if (sliderInFocus) return;
    if (event.key === "ArrowLeft") {
      switchIndex = (switchIndex - 1 + curves.length) % curves.length;
      curve = switchIndex;
    } else if (event.key === "ArrowRight") {
      switchIndex = (switchIndex + 1) % curves.length;
      curve = switchIndex;
    }
  });

  buttonSelectCurve.mouseClicked(() => {
    switchIndex = (switchIndex + 1) % curves.length;
    curve = switchIndex;
  });

  buttonDel.mouseClicked(() => {
    curves.splice(curve, 1);
    switchIndex--;
    curve = switchIndex;
    if (curves.length <= 0) {
      CurveAdd();
    }
  });
}

function draw() {
  clear();
  background(200);

  // SECTION: UI, SLIDER, INPUT FIELD & CURVE DRAWINGS

  sliderLabel.html("Evaluations: " + slider.value());
  Evaluation = input.value();

  addBezier();
  for (let i = 0; i <= curves.length - 1; i++) {
    if (i === curve) {
      for (let j = 0; j <= curves[i].points.length - 1; j++) {
        stroke(
          curves[i].color[0] - 60,
          curves[i].color[1] - 60,
          curves[i].color[2] - 60
        );
        strokeWeight(20);
        if (!checkDot.checked())
          point(curves[i].points[j].x, curves[i].points[j].y);
      }
      for (let j = 0; j <= curves[i].points.length - 2; j++) {
        stroke(curves[i].color[0], curves[i].color[1], curves[i].color[2], 100);
        strokeWeight(5);
        if (!checkPolygon.checked())
          line(
            curves[i].points[j].x,
            curves[i].points[j].y,
            curves[i].points[j + 1].x,
            curves[i].points[j + 1].y
          );
      }
      stroke(
        curves[i].color[0] - 60,
        curves[i].color[1] - 60,
        curves[i].color[2] - 60
      );
      strokeWeight(5);
      for (let j = 0; j <= curves[i].bezier.length - 2; j++) {
        if (!checkCurves.checked())
          line(
            curves[i].bezier[j].x,
            curves[i].bezier[j].y,
            curves[i].bezier[j + 1].x,
            curves[i].bezier[j + 1].y
          );
      }
    } else {
      for (let j = 0; j <= curves[i].points.length - 1; j++) {
        stroke(
          curves[i].color[0] - 30,
          curves[i].color[1] - 30,
          curves[i].color[2] - 30
        );
        strokeWeight(8);
        if (!checkDot.checked())
          point(curves[i].points[j].x, curves[i].points[j].y);
      }
      for (let j = 0; j <= curves[i].points.length - 2; j++) {
        stroke(curves[i].color[0], curves[i].color[1], curves[i].color[2], 100);
        strokeWeight(5);
        if (!checkPolygon.checked())
          line(
            curves[i].points[j].x,
            curves[i].points[j].y,
            curves[i].points[j + 1].x,
            curves[i].points[j + 1].y
          );
      }
      stroke(
        curves[i].color[0] - 30,
        curves[i].color[1] - 30,
        curves[i].color[2] - 30
      );
      strokeWeight(3);
      for (let j = 0; j <= curves[i].bezier.length - 2; j++) {
        if (!checkCurves.checked())
          line(
            curves[i].bezier[j].x,
            curves[i].bezier[j].y,
            curves[i].bezier[j + 1].x,
            curves[i].bezier[j + 1].y
          );
      }
    }
  }
  highlight();

  // !SECTION
}

// SECTION: HELPER FUNCTIONS

function interpolate(t, p0, p1) {
  const pResult = new Point(
    (1 - t) * p0.x + t * p1.x,
    (1 - t) * p0.y + t * p1.y
  );
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
function addBezier() {
  for (let i = 0; i < curves.length; i++) {
    curves[i].bezier = deCasteljau(curves[i].points, slider.value());
  }
}

function highlight() {
  if (curves[switchIndex] === undefined) {
    return;
  }
  for (let j = 0; j <= curves[switchIndex].points.length - 1; j++) {
    stroke(
      curves[switchIndex].color[0] - 60,
      curves[switchIndex].color[1] - 60,
      curves[switchIndex].color[2] - 60
    );
    strokeWeight(20);
    if (!checkDot.checked())
      point(curves[switchIndex].points[j].x, curves[switchIndex].points[j].y);
  }
  for (let j = 0; j <= curves[switchIndex].points.length - 2; j++) {
    stroke(
      curves[switchIndex].color[0],
      curves[switchIndex].color[1],
      curves[switchIndex].color[2],
      100
    );
    strokeWeight(5);
    if (!checkPolygon.checked())
      line(
        curves[switchIndex].points[j].x,
        curves[switchIndex].points[j].y,
        curves[switchIndex].points[j + 1].x,
        curves[switchIndex].points[j + 1].y
      );
  }
  stroke(
    curves[switchIndex].color[0] - 60,
    curves[switchIndex].color[1] - 60,
    curves[switchIndex].color[2] - 60
  );
  strokeWeight(5);
  for (let j = 0; j <= curves[switchIndex].bezier.length - 2; j++) {
    if (!checkCurves.checked())
      line(
        curves[switchIndex].bezier[j].x,
        curves[switchIndex].bezier[j].y,
        curves[switchIndex].bezier[j + 1].x,
        curves[switchIndex].bezier[j + 1].y
      );
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// !SECTION

// SECTION: PI :: (MOUSE EVENTS, FOCUS EVENTS, SELECTORS, BOUNDARIES)

function onFocusIF() {
  input.value("");
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  pointSelected = false;
  for (j = 0; j < curves[curve].points.length; j++) {
    if (
      dist(
        mouseX,
        mouseY,
        curves[curve].points[j].x,
        curves[curve].points[j].y
      ) <= 20
    ) {
      pointSelected = true;
    }
  }

  if (pointSelected) return;

  const newPoint = new Point(mouseX, mouseY);
  curves[curve].points.push(newPoint);
}

function doubleClicked() {
  pointSelected = false;
  removeIndex = -1;
  for (let j = 0; j < curves[curve].points.length; j++) {
    if (
      dist(
        mouseX,
        mouseY,
        curves[curve].points[j].x,
        curves[curve].points[j].y
      ) <= 20
    ) {
      pointSelected = true;
      removeIndex = j;
    }
  }

  if (pointSelected) {
    curves[curve].points.splice(removeIndex, 1);
    return;
  }
}

function mouseReleased() {
  return;
}

function mouseDragged() {
  pointSelected = false;
  moveIndex = -1;
  for (let j = 0; j < curves[curve].points.length; j++) {
    if (
      dist(
        mouseX,
        mouseY,
        curves[curve].points[j].x,
        curves[curve].points[j].y
      ) <= 20
    ) {
      pointSelected = true;
      moveIndex = j;
    }
  }

  if (pointSelected) {
    curves[curve].points[moveIndex].x = mouseX;
    curves[curve].points[moveIndex].y = mouseY;
  }
}

function selectCurve(curveIndex) {
  curve = curveIndex;
}

function CurveAdd() {
  const newCurve = {
    //index : indexCurve,
    color: [
      getRandomArbitrary(1, 255),
      getRandomArbitrary(1, 255),
      getRandomArbitrary(1, 255),
    ],
    bezier: [],
    points: [],
  };

  curves.push(newCurve);
}

// SECTION: CLASSES

class Point {
  constructor(coordX, coordY) {
    this.x = coordX;
    this.y = coordY;
  }
}
class Curve {
  constructor() {
    this.index = indexCurve;
    this.color = [
      getRandomArbitrary(1, 255),
      getRandomArbitrary(1, 255),
      getRandomArbitrary(1, 255),
    ];
    this.bezier = [];
    this.points = [];
  }
}

//! SECTION
