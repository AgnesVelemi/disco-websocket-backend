let socket = null;
let stompClient = null;
const button = document.getElementById("wsButton");
const legend = document.getElementById("wsLegend");
const btnSendWSMsg = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const messageContainer = document.getElementById("messageContainer");

let messageCount = 0; // Count of messages
let messages = []; // Global array for all received messages (WS and STOMP)

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

      // Transform incoming STOMP data to the standard dashboard format
      const transformedData = {
        sentFrom: messageData.clientType === 'frontend' ? 'FE' : messageData.clientType,
        sentFromIP: "192.168.1.10:8080", // Hardcoded as per requirement
        outMessage: messageData.outMessage,
        timestamp: formatTimestamp(messageData.timestamp), // Unified format: '2026.03.18. 08:13:19'
        sentFromTimezone: "CET" // Hardcoded as per requirement
      };

      // Store in global array (raw Message-copy)
      transformedData.arrivalNumber = ++messageCount;
      messages.push(transformedData);
      console.log("Stored in global messages array:", transformedData);

      // Display in messageContainer using existing logic
      const formattedMessage = formatMessage(transformedData);
      displayMessage(formattedMessage);

      // Dispatch a custom event for other parts of the app to react to
      window.dispatchEvent(new CustomEvent('stompMessageReceived', { detail: transformedData }));
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
      outMessage: message,
      timestamp: formatTimestamp(),
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
  console.log("Message received from local raw WebSocket server:", data);
  /*Message received from server: 
       {"sentFrom":"BE",
        "sentFromIP":"192.168.1.10:8080",
        "message":"tututu",
        "timestamp":"3/16/2026, 05:46:19",
        "sentFromTimezone":"CET"}*/

  try {
    const messageData = JSON.parse(data);

    // Store in global array (raw Message-copy)
    messageData.arrivalNumber = ++messageCount;
    messages.push(messageData);
    console.log("Stored in global messages array:", messageData);

    const formattedMessage = formatMessage(messageData);
    displayMessage(formattedMessage);
  } catch (error) {
    console.error("Error parsing message:", error);
  }
}

function formatMessage(data) { // to format the message for display
  return `[${data.arrivalNumber}] ${data.sentFrom}: ${data.sentFromTimezone}:${data.timestamp}  ip:${data.sentFromIP} <b>| message: ${data.outMessage}</b>`;
}

function displayMessage(formattedMessage) {
  // messageContainer.innerHTML += `<p>${formattedMessage}</p>`;
  messageContainer.insertAdjacentHTML('afterbegin', `<p>${formattedMessage}</p>`);
}
function updateDashboard(data) {
  displayMessage(data);
}


/**
 * Formats a date object or timestamp string/number into the desired dashboard format:
 * "YYYY.MM.DD. HH:mm:ss" (e.g., 2026.03.18. 22:25:37)
 * @param {Date|string|number} [date=new Date()] 
 * @returns {string}
 */
function formatTimestamp(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}.${month}.${day}. ${hours}:${minutes}:${seconds}`;
}

// Function to render all messages from the global array into the container
function renderMessages() {
  messageContainer.innerHTML = ""; // Clear existing
  messages.forEach(msg => {
    const formatted = formatMessage(msg);
    displayMessage(formatted);
  });
}

