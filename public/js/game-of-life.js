var squareWidth = 32;
var squareHeight = 32;
var prisonWidth = 512;
var prisonHeight = 512;

var prisonCanvas;
var prisonContext;

var firstSquare;
var painted = [];

function Square(row, column) {
  this.row = row;
  this.column = column;
};

$(function () {
  prisonCanvas = $("#game");
  prisonCanvas[0].width = prisonWidth + 1;
  prisonCanvas[0].height = prisonHeight + 1;
  prisonCanvas.on("mousedown", prisonMouseDown);
  prisonCanvas.on("mouseup", prisonMouseUp);
  prisonCanvas.on("mouseout", prisonMouseUp);
  prisonContext = prisonCanvas[0].getContext("2d");

  drawLines();
});

function drawLines() {
  drawVerticalLines();
  drawHorizontalLines();
  prisonContext.strokeStyle = "#ccc";
  prisonContext.stroke();
};

function drawVerticalLines() {
  for (var x = 0; x <= prisonWidth; x += squareWidth) {
    prisonContext.moveTo(0.5 + x, 0);
    prisonContext.lineTo(0.5 + x, prisonHeight);
  }
};

function drawHorizontalLines() {
  for (var y = 0; y <= prisonHeight; y += squareHeight) {
    prisonContext.moveTo(0, 0.5 + y);
    prisonContext.lineTo(prisonWidth, 0.5 + y);
  }
};

function paintSquare(square, isTemporary) {
  prisonContext.beginPath();
  prisonContext.fillStyle = isTemporary ? "#33FF00" : "#000";
  prisonContext.fillRect(getX(square), getY(square), squareWidth, squareHeight);
};

function prisonMouseDown(e) {
  if (e.button === 0 || e.which === 3) {
    var square = getSquare(e);
    firstSquare = square;

    paintSquare(square, true);
  } else {}
};

function prisonMouseUp(e) {
  if (e.button === 0 || e.which === 3) {
    var square = getSquare(e);
    if (firstSquare != null && square.row === firstSquare.row && square.column === firstSquare.column && e.button ===
      0) {
      painted = painted.concat(square);
    } else {
      clearSquare(square);
    }

    redraw();
    firstSquare = null;
  } else {}
};

function clearSquare(square) {
  for (var i = painted.length - 1; i >= 0; --i) {
    if (painted[i].row === square.row && painted[i].column == square.column) {
      painted.splice(i, 1);
      return;
    }
  }
};

function redraw() {
  prisonCanvas[0].height = prisonCanvas[0].height;
  drawLines();
  drawSquares();
};

function drawSquares() {
  for (var i = 0; i < painted.length; i++) {
    paintSquare(painted[i]);
  }
};

function getY(square) {
  return square.row * squareWidth;
};

function getX(square) {
  return square.column * squareHeight;
};

function getSquare(e) {
  var x;
  var y;
  if (e.pageX !== undefined && e.pageY !== undefined) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  x -= prisonCanvas[0].offsetLeft;
  y -= prisonCanvas[0].offsetTop;
  x = Math.min(x, prisonWidth);
  y = Math.min(y, prisonHeight);
  return new Square(Math.floor(y / squareHeight), Math.floor(x / squareWidth));
};