let socket = null;
const button = document.getElementById("wsButton");
const legend = document.getElementById("wsLegend");
const btnSendWSMsg = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");

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
        btnSendWSMsg.style.backgroundColor = "royalblue";
        btnSendWSMsg.style.color = "black";
        messageInput.disabled = false;
        btnSendWSMsg.disabled = false;

    } else {
        legend.textContent = "websocket-off";
        button.textContent = "Connect";
        button.style.backgroundColor = "royalblue"; // Change back to royalblue
        btnSendWSMsg.style.backgroundColor = "lightgrey";
        button.classList.remove("pressed");
        button.classList.add("off");
        btnSendWSMsg.style.color = "darkgrey";
        messageInput.disabled = true;
        btnSendWSMsg.disabled = true;
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
       updateDashboard(event.data);

       const message = JSON.parse(event.data);
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

// END connnect
//////////////////////////////////////////////////////////////////////////
// START of ws-message

    // Üzenetküldő gomb eseménykezelője
    document.getElementById("sendWSMessageFromBackend").addEventListener("click", function() {
        const messageInput = document.getElementById("messageInput");
        const message = messageInput.value;
        console.log(message);

        if (message) {
            if (socket.readyState === WebSocket.OPEN) {
                // Üzenet küldése a WebSocket-en
                socket.send(message);
                displayMessage(`BE: ${message} | ${getCurrentTime()}`); // Üzenet megjelenítése a kiírás szerint
                messageInput.value = ""; // Bemenet törlése
                System.out.println("bármi");
            } else {
                console.warn("WebSocket is not open. Current state: " + socket.readyState);
                alert("WebSocket is not open!");
            }
        }
    });

    function updateDashboard(data) {
        displayMessage(data);
    }

    // Üzenet megjelenítése a dashboardon
    function displayMessage(formattedMessage) {
        const messageContainer = document.getElementById("messageContainer");
        messageContainer.innerHTML += `<p>${formattedMessage}</p>`;
    }