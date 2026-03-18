let socket = null;
let stompClient = null;
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
  connectStomp(); // Establish STOMP connection once on page load
  
  // Add event listener for Enter key only after the DOM is fully loaded
  messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendWSMessageFromBackend();
    }
  });
});


function connectStomp() {
  // Modern StompJs v7 Client is more robust and feature-rich than the older versions.
  stompClient = new StompJs.Client({
    brokerURL: "ws://localhost:8080/ws/stomp",
    connectHeaders: {
      "client-type": "frontend"
    },
    debug: function (str) {
      console.log("STOMP Debug:", str);   // ez írja ki a sok STOMP Debug: ... sorokat mindenfélét!!!!
      // pl. STOMP Debug: Opening Web Socket... 
      // pl. STOMP Debug: Heartbeat message received: 10@1742284535536
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = function (frame) {
    console.log('STOMP connection established: ' + frame);
    stompClient.subscribe("/topic/greetings", function (message) {
      const messageData = JSON.parse(message.body);
      console.log("Received from STOMP:", messageData);
      console.log("Payload:", messageData.outMessage); // Kiírja a payload-ot
      console.log("Client Type:", messageData.clientType); // Kiírja a client type-ot

      // Dispatch a custom event for other parts of the app to react to
      window.dispatchEvent(new CustomEvent('stompMessageReceived', { detail: messageData }));
    });
  };

  stompClient.onStompError = function (frame) {
    console.error('STOMP Error:', frame.headers['message']);
    console.error('Details:', frame.body);
  };

  stompClient.activate();
}

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

messageInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendWSMessageFromBackend();
  }
});

function handleIncomingMessage(data) { // itt tartok
  console.log("Message received from server:", data);
  /*Message received from server: 
       {"sentFrom":"BE",
        "sentFromIP":"192.168.1.10:8080",
        "message":"tututu",
        "timestamp":"3/16/2026, 05:46:19",
        "sentFromTimezone":"CET"}*/

  try {
    const messageData = JSON.parse(data);
    const formattedMessage = formatMessage(messageData);
    displayMessage(formattedMessage);
  } catch (error) {
    console.error("Error parsing message:", error);
  }
}

function formatMessage(data) { // to format the message for display
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

