window.onload = function () {

    // Definitions
    let canvas = document.getElementById("paint-canvas");
    let context = canvas.getContext("2d");
    let bounding = canvas.getBoundingClientRect();

    // Specifications
    let mouseX = 0;
    let mouseY = 0;
    context.strokeStyle = 'black'; // initial brush color
    context.lineWidth = 1; // initial brush width
    let isDrawing = false;


    // Handle Colors
    let colors = document.getElementsByClassName('colors')[0];

    colors.addEventListener('click', function(event) {
        context.strokeStyle = event.target.value || 'black';
    });

    // Handle Brushes
    let brushes = document.getElementsByClassName('brushes')[0];

    brushes.addEventListener('click', function(event) {
        context.lineWidth = event.target.value || 1;
    });

    // Mouse Down Event
    canvas.addEventListener('mousedown', function(event) {
        setMouseCoordinates(event);
        isDrawing = true;

        // Start Drawing
        context.beginPath();
        context.moveTo(mouseX, mouseY);
    });

    // Mouse Move Event
    canvas.addEventListener('mousemove', function(event) {
        setMouseCoordinates(event);

        if(isDrawing) {
            console.log(context.strokeStyle, mouseX, mouseY)
            context.lineTo(mouseX, mouseY);
            context.stroke();
        }
    });

    // Mouse Up Event
    canvas.addEventListener('mouseup', function(event) {
        setMouseCoordinates(event);
        isDrawing = false;
    });

    // Handle Mouse Coordinates
    function setMouseCoordinates(event) {
        mouseX = event.clientX - bounding.left;
        mouseY = event.clientY - bounding.top;
    }

    // Handle Clear Button
    let clearButton = document.getElementById('clear');

    clearButton.addEventListener('click', function() {
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
