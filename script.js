var canvas = document.getElementById('drawing');

var context = canvas.getContext('2d');
var lineWidth = 5;

var pen = document.getElementById('pen');
var eraser = document.getElementById('eraser');
var clear = document.getElementById('clear');
var download = document.getElementById('download');

var red = document.getElementById('red');
var green = document.getElementById('green');
var blue = document.getElementById('blue');

var eraserEnabled = false;

autoSetCanvasSize(canvas);

listenToUser(canvas);


pen.onclick = function() {
  eraserEnabled = false;
  this.classList.add('active');
  eraser.classList.remove('active');
  clear.classList.remove('active');
  download.classList.remove('active');
  
}

eraser.onclick = function() {
  eraserEnabled = true;
  this.classList.add('active');
  pen.classList.remove('active');
  clear.classList.remove('active');
  download.classList.remove('active');
}

clear.onclick = function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  this.classList.add('active');
  eraser.classList.remove('active');
  pen.classList.remove('active');
  download.classList.remove('active');
}

download.onclick = function() {
  eraserEnabled = false;
  this.classList.add('active');
  pen.classList.remove('active');
  clear.classList.remove('active');  
  eraser.classList.remove('active');
  var url = canvas.toDataURL('image/png');
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.download = '绘图';
  a.target = '_blank';
  a.click(); 
}

red.onclick = function() {
  context.fillStyle = 'red';
  context.strokeStyle = 'red';
  red.classList.add('active');
  green.classList.remove('active');
  blue.classList.remove('active');
}

green.onclick = function() {
  context.fillStyle = 'green';
  context.strokeStyle = 'green';
  red.classList.remove('active');
  green.classList.add('active');
  blue.classList.remove('active');
}


blue.onclick = function() {
  context.fillStyle = 'blue';
  context.strokeStyle = 'blue';
  red.classList.remove('active');
  green.classList.remove('active');
  blue.classList.add('active');
}

thin.onclick = function() {
  lineWidth = 5;
}

thick.onclick = function() {
  lineWidth = 10;
}

function setCanvasSize(canvas) {
  var pageWidth = document.documentElement.clientWidth;
  var pageHeight = document.documentElement.clientHeight;

  canvas.width = pageWidth;
  canvas.height = pageHeight;
}

function autoSetCanvasSize(canvas) {
  setCanvasSize(canvas);
  window.onresize = function() {
    setCanvasSize(canvas);
  };
}

function drawCirle(x, y, radius) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, false);
  context.fill();
}

function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineWidth = lineWidth;
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

function listenToUser(canvas) {
  var using = false;
  var lastPoint = {
    x: undefined,
    y: undefined,
  }
  if (document.body.ontouchstart !== undefined) {
    canvas.ontouchstart = function(event) {
      var x = event.touches[0].clientX;
      var y = event.touches[0].clientY;
      using = true;
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10);
      } else {
        lastPoint = { x, y };
      }
    }

    canvas.ontouchmove = function(event) {
      var x = event.touches[0].clientX;
      var y = event.touches[0].clientY;
      
      if (!using) return;
  
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10);
      } else {
        var newPoint = { x, y };
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    }

    canvas.ontouchend = function() {
      using = false;
    }
  } else {
    canvas.onmousedown = function(event) {
      var x = event.clientX;
      var y = event.clientY;

      using = true;

      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10);
      } else {
        lastPoint = { x, y };
      }
    }
    
    canvas.onmousemove = function(event) {
      var x = event.clientX;
      var y = event.clientY;

      if (!using) return;

      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10);
      } else {
        var newPoint = { x, y };
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    }

    canvas.onmouseup = function(event) {
      using = false;
    }
  }
}
