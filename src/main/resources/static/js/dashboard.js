let socket = null;
const button = document.getElementById("wsButton");
const legend = document.getElementById("wsLegend");

// Set initial button color
 button.style.backgroundColor = "royalblue";


// Function to update UI based on connection state
function updateUI(isConnected) {
    if (isConnected) {
        legend.textContent = "websocket-on";
        button.textContent = "Disconnect";
        button.style.backgroundColor = "peru"; // Change to peru color
        button.classList.remove("off");
        button.classList.add("pressed");
    } else {
        legend.textContent = "websocket-off";
        button.textContent = "Connect";
        button.style.backgroundColor = "royalblue"; // Change back to royalblue
        button.classList.remove("pressed");
        button.classList.add("off");
    }
}
// WebSocket setup
function connect() {
  socket = new WebSocket("ws://localhost:8080/ws/dashboard");

     socket.onopen = function () { // Websocket onopen event happened --> do things logic
       updateUI(true); // Update UI on successful connection
           };

     // Websocket onclose logic need here to tie/setup to the websocket what will should happen after/onto "socket.close();"
     socket.onclose = function () {
       updateUI(false); // Update UI on disconnection
     };

     socket.onerror = function (error) {
       console.error("WebSocket Error: ", error);
     };

     // Handle incoming messages it needs to be set up each time a new WebSocket connection (tied to it) is established
     socket.onmessage = function (event) {
        const message = JSON.parse(event.data);
         // Update the UI with the message
         console.log("message: ", message);
     };
}

function disconnect() {
  if (socket !== null) {
    socket.close();
    socket = null;
  }
}

button.addEventListener("click", function () { // onto button click do these things:
  if (socket === null || socket.readyState === WebSocket.CLOSED) {
     connect();
  } else {
     disconnect();
  }
});

// Optionally: Automatically connect when page loads 1st time, or F5 refresh
document.addEventListener("DOMContentLoaded", () => {
    updateUI(false); // here if you want to set the UI to "off" on load
});