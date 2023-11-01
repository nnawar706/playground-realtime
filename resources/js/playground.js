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

    if(window.location.port !== '8002') {
        const channel = window.Echo.channel('public.playground.pusher');

        channel.subscribed(() => {
            console.log('subscribed to channel.');
        }).listen('.playground', (event) => {
            // console.log(event);
            mouseX = event.x_val;
            mouseY = event.y_val;
            context.strokeStyle = event.color;

            if (event.start === 1) // mousedown event from publisher
            {
                context.beginPath();
                context.moveTo(mouseX, mouseY);
            }
            else if (event.end === 1) // mouseup event from publisher
            {
                isDrawing = false;
            }
            else // mousemove event from publisher
            {
                context.lineTo(mouseX, mouseY);
                context.stroke();
            }
        });
    }

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

        if (window.location.port === '8002') {
            publishMessage(1, 0)
        }
    });

    // Mouse Move Event
    canvas.addEventListener('mousemove', function(event) {
        setMouseCoordinates(event);

        if(isDrawing) {

            context.lineTo(mouseX, mouseY);
            context.stroke();

            if (window.location.port === '8002') {
                publishMessage(0, 0)
            }
        }
    });

    // Mouse Up Event
    canvas.addEventListener('mouseup', function(event) {
        setMouseCoordinates(event);
        isDrawing = false;

        if (window.location.port === '8002') {
            publishMessage(0, 1)
        }
    });

    // Handle Mouse Coordinates
    function setMouseCoordinates(event) {
        mouseX = event.clientX - bounding.left;
        mouseY = event.clientY - bounding.top;
    }

    // publish message to redis
    function publishMessage(beginPath, endPath) {
        let data = {
            x_val: mouseX,
            y_val: mouseY,
            color: context.strokeStyle,
            start: beginPath,
            end: endPath
        }

        let jsonData = JSON.stringify(data);

        fetch(`http://localhost:${window.location.port}/api/publish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData
        })
            .then(response => {
                if (response.ok) {
                    console.log('Data sent');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
