var squareWidth = 16;
var squareHeight = 16;
var prisonWidth = 512;
var prisonHeight = 512;

var prisonCanvas;
var prisonContext;

var firstSquare;
var painted = [];
var canvasPosition = {};
var shouldDrawLines = true;

function Square(row, column) {
  this.row = row;
  this.column = column;
};

$(function () {
  setupCanvas();

  $("#show-lines").click();
  $("input[name='lines-on-off']").on("change", toggleLines);

  $("#medium-cells").click();
  $("input[name='cell-size']").on("change", updateCellSize);
  $("#clear-board").on("click", resetBoard);

  $("#step-forward").click();

  $("#step-size").on("change", checkStepSize);
  $("#gol-url").val(document.URL + "step");

  $("#step-board").on("click", stepOne);
  $("#play-board").on("click", stepOne);

  drawLines();
});

function checkStepSize() {
  if ($("#step-size").val() < 1) {
    $("#step-size").val(1);
  }
};

function setupCanvas() {
  prisonCanvas = $("#game");
  prisonCanvas[0].width = prisonWidth + 1;
  prisonCanvas[0].height = prisonHeight + 1;
  prisonCanvas.on("mousedown", prisonMouseDown);
  prisonCanvas.on("mouseup", prisonMouseUp);
  prisonCanvas.on("mouseout", prisonMouseUp);
  prisonContext = prisonCanvas[0].getContext("2d");

  updateCanvasPosition();
  $(window).on("resize", updateCanvasPosition);
};

function updateCellSize(e) {
  switch (e.target.id) {
  case "small-cells":
    squareWidth = 8;
    squareHeight = 8;
    break;
  case "large-cells":
    squareWidth = 32;
    squareHeight = 32;
    break;
  case "medium-cells":
  default:
    squareWidth = 16;
    squareHeight = 16;
    break;
  }

  redraw();
};

function resetBoard() {
  painted.length = 0;
  redraw();
};

function toggleLines(e) {
  shouldDrawLines = e.target.id === "show-lines";
  redraw();
};

function updateCanvasPosition() {
  var x = 0;
  var y = 0;
  var ele = prisonCanvas[0];
  while (true) {
    x += ele.offsetLeft;
    y += ele.offsetTop;
    if (ele.offsetParent === null) {
      break;
    }
    ele = ele.offsetParent;
  }
  canvasPosition = {
    x: x,
    y: y
  };
};

function stepOne() {
  $.ajax({
    url: $("#gol-url").val(),
    data: {
      steps: $("#step-size").val(),
      direction: $("#step-forward").prop("checked") ? 1 : -1,
      cells: JSON.stringify(painted)
    },
    success: function (data) {
      painted = data;
      redraw();
    },
    error: function (xhr) {
      console.log(xhr);
    }
  });

  return false;
};

function drawLines() {
  if (shouldDrawLines) {
    drawVerticalLines();
    drawHorizontalLines();
  } else {
    drawLine(0.5, 0, 0.5, prisonHeight);
    drawLine(prisonWidth - 0.5, 0, prisonWidth - 0.5, prisonHeight);
    drawLine(0, 0.5, prisonWidth, 0.5);
    drawLine(0, prisonHeight - 0.5, prisonWidth, prisonHeight - 0.5);
  }
  prisonContext.strokeStyle = "#ccc";
  prisonContext.stroke();
};

function drawLine(startX, startY, endX, endY) {
  prisonContext.moveTo(startX, startY);
  prisonContext.lineTo(endX, endY);
};

function drawVerticalLines() {
  for (var x = 0; x <= prisonWidth; x += squareWidth) {
    drawLine(0.5 + x, 0, 0.5 + x, prisonHeight);
  }
};

function drawHorizontalLines() {
  for (var y = 0; y <= prisonHeight; y += squareHeight) {
    drawLine(0, 0.5 + y, prisonWidth, 0.5 + y);
  }
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

function paintSquare(square, isTemporary) {
  prisonContext.beginPath();
  prisonContext.fillStyle = isTemporary ? "#33FF00" : "#000";
  prisonContext.fillRect(getX(square), getY(square), squareWidth, squareHeight);
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
    x = e.clientX;
    y = e.clientY;
  }

  x -= canvasPosition.x;
  y -= canvasPosition.y;

  x = Math.min(x, prisonWidth);
  y = Math.min(y, prisonHeight);
  return new Square(Math.floor(y / squareHeight), Math.floor(x / squareWidth));
};