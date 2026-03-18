let socket = null;
const button = document.getElementById("wsButton");
const legend = document.getElementById("wsLegend");
const btnSendWSMsg = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const messageContainer = document.getElementById("messageContainer");

let messageCount = 0; // Count of messages
let messages = []; // Array to hold messages

button.style.backgroundColor = "royalblue"; // Set initial button color

document.addEventListener("DOMContentLoaded", () => { // First webpage load or F5 refresh
    updateUI(false);
        // Add event listener for Enter key only after the DOM is fully loaded
        messageInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                sendWSMessageFromBackend();
            }
        });
});

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

  socket.onopen = function () { // Update UI on successful connection
    console.log("WebSocket connection established.");
    updateUI(true);
  };

  socket.onclose = function () {
    console.log("WebSocket connection closed.");
    updateUI(false); // Update UI on disconnection
  };

  socket.onerror = function (error) {
    console.error("WebSocket Error: ", error);
  };

  socket.onmessage = function (event) {
    handleIncomingMessage(event.data);

    //   updateDashboard(event.data);
    //   const message = JSON.parse(event.data);
    //   console.log("message: ", message);
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




// Event listener for incoming messages from the WebSocket
socket.addEventListener("message", function(event) {
    console.log("Message received from server:", event.data); // Check the raw data

    try {
        // Parse the received JSON string. Make sure event.data is a valid JSON string.
        const messageData = JSON.parse(event.data);

        // Check the client-type from the headers
        const clientType = messageData?.headers?.['client-type'];

        // Format the message for display
        let formattedMessage;
        if (clientType === 'frontend') {
            formattedMessage = formatMessage({
                ...messageData, // Átvétele Spread all existing properties from messageData. The spread operator simplifies the process of merging or copying properties from one object to another while allowing you to modify specific keys as needed.
                sentFrom: 'FE frontend', // Change `sentFrom` value
            });
        } else {
            // Format the message for display
            formattedMessage = formatMessage(messageData);
        }



        // Display the formatted message in messageContainer
        displayMessage(formattedMessage);
    } catch (error) {
        console.error("Error parsing message:", error);
    }
});
//btnSendWSMsg.addEventListener("click", sendWSMessageFromBackend); // Üzenetküldő gomb eseménykezelője
function sendWSMessageFromBackend() { // Üzenetküldő gomb eseménykezelője
    console.log("Button clicked!");
    const message = messageInput.value.trim();
    console.log("Taken typed BE message: " + message);

     if (message && socket.readyState === WebSocket.OPEN) {
        // Create the JSON object
        const messageData = {
            sentFrom: "BE",
            sentFromIP: "192.168.1.10:8080", // Replace with the actual IP if necessary
            message: message,
            timestamp: new Date().toLocaleString('en-US', { timeZone: 'CET', hour12: false }),
            sentFromTimezone: "CET"
        };

        socket.send(JSON.stringify(messageData)); // Send JSON object to server

        // messageCount++;
        // const formattedMessage = formatMessage(messageData);
        // messages.push(formattedMessage);  // Store formatted message
        // displayMessage(formattedMessage); // Display the latest message
        // Check if we need to log and reset
        //  if (messageCount === 10) {  logAndResetMessages(); }

        messageInput.value = ""; // Clear the input field after sending
          console.log("Message sent to socket:", messageData);

     } else {
         console.warn("WebSocket is not open. Current state: " + socket.readyState);
         alert("WebSocket is not open!");
     }
}

messageInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendWSMessageFromBackend();
    }
});

function handleIncomingMessage(data) {
    console.log("Message received from server:", data);

    try {
        const messageData = JSON.parse(data);
        const formattedMessage = formatMessage(messageData);
        displayMessage(formattedMessage);
    } catch (error) {
        console.error("Error parsing message:", error);
    }
}

function formatMessage(data) { // to format the message, that will be displayed in the messageContainer
    return `${data.sentFrom}: ${data.message} | ${data.timestamp} ${data.sentFromTimezone} ip: ${data.sentFromIP}`;
}

function displayMessage(formattedMessage) {
  // messageContainer.innerHTML += `<p>${formattedMessage}</p>`;
  messageContainer.insertAdjacentHTML('afterbegin', `<p>${formattedMessage}</p>`);
}
function updateDashboard(data) {
  displayMessage(data);
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleString('hu-HU', { timeZone: 'Europe/Budapest', hour12: false });
}

