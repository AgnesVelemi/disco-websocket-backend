let socket = null;

const button = document.getElementById("wsButton");
const legend = document.getElementById("wsLegend");
const fieldset = document.getElementById("wsFieldset");

// Set initial button color
button.style.backgroundColor = "olive";
button.textContent = "Connect";

function connect() {

    socket = new WebSocket("ws://localhost:8080/ws/dashboard");

    socket.onopen = function () {
        legend.textContent = "websocket-on";
        button.textContent = "Disconnect";
        button.style.backgroundColor = "peru"; // Change to peru color
        button.classList.remove("off");
        button.classList.add("pressed");
    };

    socket.onclose = function () {
        legend.textContent = "websocket-off";
        button.textContent = "Connect";
       button.style.backgroundColor = "olive"; // Change back to olive
        button.classList.remove("pressed");
    };
}

function disconnect() {
    if (socket !== null) {
        socket.close();
        socket = null;
    }
}

button.addEventListener("click", function () {

    if (socket === null || socket.readyState === WebSocket.CLOSED) {
        connect();
    } else {
        disconnect();
    }
});