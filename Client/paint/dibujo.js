
	var ArrayDibujo = new Array();
	var UltimoPaso = 0;
function IniciarNuevoBorrado(x, y, isDown) {
		if (isDown) {
			ctx.beginPath();
			ctx.strokeStyle = curColor;
			ctx.lineWidth = $('#grosorPincel').val();
			ctx.lineJoin = "round";
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(x, y);
			ctx.closePath();
			ctx.stroke();
		}
		lastX = x;
		lastY = y;
	}
	function deshacer() {
		if (cStep > 0) {
			cStep--;
			var canvasPic = new Image();
			canvasPic.src = cPushArray[cStep];
			canvasPic.onload = function() {
				ctx.drawImage(canvasPic, 0, 0);
			}
			document.title = cStep + ":" + cPushArray.length;
		}
	}
	function rehacer() {
		if (cStep < cPushArray.length - 1) {
			cStep++;
			var canvasPic = new Image();
			canvasPic.src = cPushArray[cStep];
			canvasPic.onload = function() {
				ctx.drawImage(canvasPic, 0, 0);
			}
			document.title = cStep + ":" + cPushArray.length;
		}
	}
function NuevoFondo() {
		var image = new Image();
		image.src = 'imagenes/fondo.jpg';
		$(image).load(function() {
			ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
			cPush();
		});
}