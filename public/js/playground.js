/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!************************************!*\
  !*** ./resources/js/playground.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
window.onload = function () {
  var channel = window.Echo.channel('public.playground.pusher');

  // Definitions
  var canvas = document.getElementById("paint-canvas");
  var context = canvas.getContext("2d");
  var bounding = canvas.getBoundingClientRect();

  // Specifications
  var mouseX = 0;
  var mouseY = 0;
  context.strokeStyle = 'black'; // initial brush color
  context.lineWidth = 1; // initial brush width
  var isDrawing = false;
  if (window.location.port === '8000') {
    channel.subscribed(function () {
      console.log('subscribed to channel.');
    }).listen('.playground', function (event) {
      // console.log(event);
      mouseX = event.x_val;
      mouseY = event.y_val;
      context.strokeStyle = event.color;
      if (event.start === 1)
        // mousedown event from publisher
        {
          context.beginPath();
          context.moveTo(mouseX, mouseY);
        } else if (event.end === 1)
        // mouseup event from publisher
        {
          isDrawing = false;
        } else
        // mousemove event from publisher
        {
          context.lineTo(mouseX, mouseY);
          context.stroke();
        }
    });
  }

  // Handle Colors
  var colors = document.getElementsByClassName('colors')[0];
  colors.addEventListener('click', function (event) {
    context.strokeStyle = event.target.value || 'black';
  });

  // Handle Brushes
  var brushes = document.getElementsByClassName('brushes')[0];
  brushes.addEventListener('click', function (event) {
    context.lineWidth = event.target.value || 1;
  });

  // Mouse Down Event
  canvas.addEventListener('mousedown', function (event) {
    setMouseCoordinates(event);
    isDrawing = true;

    // Start Drawing
    context.beginPath();
    context.moveTo(mouseX, mouseY);
    if (window.location.port === '8002') {
      publishMessage(1, 0);
    }
  });

  // Mouse Move Event
  canvas.addEventListener('mousemove', function (event) {
    setMouseCoordinates(event);
    if (isDrawing) {
      context.lineTo(mouseX, mouseY);
      context.stroke();
      if (window.location.port === '8002') {
        publishMessage(0, 0);
      }
    }
  });

  // Mouse Up Event
  canvas.addEventListener('mouseup', function (event) {
    setMouseCoordinates(event);
    isDrawing = false;
    if (window.location.port === '8002') {
      publishMessage(0, 1);
    }
  });

  // Handle Mouse Coordinates
  function setMouseCoordinates(event) {
    mouseX = event.clientX - bounding.left;
    mouseY = event.clientY - bounding.top;
  }

  // publish message to redis
  function publishMessage(beginPath, endPath) {
    var data = {
      x_val: mouseX,
      y_val: mouseY,
      color: context.strokeStyle,
      start: beginPath,
      end: endPath
    };
    var jsonData = JSON.stringify(data);
    fetch("http://localhost:".concat(window.location.port, "/api/publish"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    }).then(function (response) {
      if (response.ok) {
        console.log('Data sent');
      }
    })["catch"](function (error) {
      console.error('Error:', error);
    });
  }

  // Handle Clear Button
  var clearButton = document.getElementById('clear');
  clearButton.addEventListener('click', function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Handle Save Button
  // let saveButton = document.getElementById('save');
  //
  // saveButton.addEventListener('click', function() {
  //     let imageName = prompt('Please enter image name');
  //     let canvasDataURL = canvas.toDataURL();
  //     let a = document.createElement('a');
  //     a.href = canvasDataURL;
  //     a.download = imageName || 'drawing';
  //     a.click();
  // });
};
/******/ })()
;