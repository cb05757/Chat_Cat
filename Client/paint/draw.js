

$(document).ready(function() {
	InitThis();
	var mousePressed = false;
	var lastX, lastY;
	var ctx;
	var canvasWidth = 800;
	var canvasHeight = 400;
	var text = "no";
	var toolTip = "no";
	var sizeSmall = 3;
	var sizeMedium = 8;
	var sizeBig = 12;
	var sizeHuge = 18;
	var curSize = sizeSmall;

	$('#colorpicker').farbtastic('#color');

	var div1 = document.getElementById('myCanvas');

	function posicion(posicion) {
		var fontSize = $("#colorFuente").val();
		var fontSize = $('#tamanoFuente').val();
		var cuadro = document.getElementById("cuadro");
		cuadro.style.color = "#" + fontSize;
		cuadro.style.fontSize = fontSize + "px";
		cuadro.style.fontFamily = "Arial";
		cuadro.style.display = "table";
		cuadro.innerHTML = textoTextoPoner;
		cuadro.style.left = posicion.clientX + 1 + "px";
		cuadro.style.top = posicion.clientY - 25 + "px";

		this.onclick = function() {
			ctx.fillStyle = "#" + fontSize;
			ctx.font = "bold " + fontSize + " Arial";
			mostrar = "no";
			return;
		}
	}

	$("#btnDelete").click(function() {
		cDelete();
	});

	$(document).keypress(function (e) { // should be in the websocket
      if (e.which == 13) {
            sendToServer();
      }
	});

	function InitThis() {

		ctx = document.getElementById('myCanvas').getContext("2d");
		$('#myCanvas').mousedown(function(e) {
			mousePressed = true;
				Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
		});

		$('#myCanvas').mousemove(function(e) {
			if (mousePressed) {
				if (text == "no") {
					Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
				}
				if (text == "si") {
				}
			}
		});

		$('#myCanvas').mouseup(function(e) {
			if (mousePressed) {
				mousePressed = false;
				cPush();
			}
		});

		$('#myCanvas').mouseleave(function(e) {
			if (mousePressed) {
				mousePressed = false;
				cPush();
			}
		});

	}



	function Draw(x, y, isDown) {
		if (isDown) {
			ctx.beginPath();
			ctx.strokeStyle = curColor;
			ctx.lineWidth = $('#brushThick').val();
			ctx.lineJoin = "round";
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(x, y);
			ctx.closePath();
			ctx.stroke();
		}
		lastX = x;
		lastY = y;
	}

	var cPushArray = new Array();
	var cStep = -1;

	function cPush() {
		cStep++;
		if (cStep < cPushArray.length) {
			cPushArray.length = cStep;
		}
		cPushArray.push(document.getElementById('myCanvas').toDataURL());

	}

	function eraser(){

	}

	function cDelete(){
    	var box=confirm("Are you sure you want to clear the canvas?");
    	if(box==true){
        	ctx.fillStyle="#FFFFFF";
			ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
		}
      
	}

});
