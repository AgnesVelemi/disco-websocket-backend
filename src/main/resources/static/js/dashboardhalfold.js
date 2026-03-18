let socket = null;
const button = document.getElementById("wsButton");
const legend = document.getElementById("wsLegend");
const btnSendWSMsg = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const messageContainer = document.getElementById("messageContainer");

document.addEventListener("DOMContentLoaded", () => {
    updateUI(false);
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
        button.style.backgroundColor = "peru";
        button.classList.remove("off");
        button.classList.add("pressed");
        btnSendWSMsg.style.backgroundColor = "royalblue";
        btnSendWSMsg.style.color = "black";
        messageInput.disabled = false;
        btnSendWSMsg.disabled = false;
    } else {
        legend.textContent = "websocket-off";
        button.textContent = "Connect";
        button.style.backgroundColor = "royalblue";
        btnSendWSMsg.style.backgroundColor = "lightgrey";
        button.classList.remove("pressed");
        button.classList.add("off");
        btnSendWSMsg.style.color = "darkgrey";
        messageInput.disabled = true;
        btnSendWSMsg.disabled = true;
    }
}

function connect() {
    socket = new WebSocket("ws://localhost:8080/ws/dashboard");

    socket.onopen = function () {
        console.log("WebSocket connection established.");
        updateUI(true);
    };

    socket.onclose = function () {
        console.log("WebSocket connection closed.");
        updateUI(false);
    };

    socket.onerror = function (error) {
        console.error("WebSocket Error: ", error);
    };

    socket.onmessage = function (event) {
        handleIncomingMessage(event.data);
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

function sendWSMessageFromBackend() {
    const message = messageInput.value.trim();
    if (message && socket.readyState === WebSocket.OPEN) {
        const messageData = {
            sentFrom: "BE",
            sentFromIP: "192.168.1.10:8080",
            message: message,
            timestamp: new Date().toLocaleString('en-US', { timeZone: 'CET', hour12: false }),
            sentFromTimezone: "CET"
        };

        socket.send(JSON.stringify(messageData));
        messageInput.value = ""; // Clear the input field after sending
    } else {
        console.warn("WebSocket is not open. Current state: " + socket.readyState);
        alert("WebSocket is not open!");
    }
}

function handleIncomingMessage(data) {
    console.log("Message received from server:", data); // Log received messages
    try {
        const messageData = JSON.parse(data);
        const formattedMessage = formatMessage(messageData);
        displayMessage(formattedMessage); // Display all messages
    } catch (error) {
        console.error("Error parsing message:", error);
    }
}

function formatMessage(data) {
    return `${data.sentFrom}: ${data.message} | ${data.timestamp} ${data.sentFromTimezone} ip: ${data.sentFromIP}`;
}

function displayMessage(formattedMessage) {
    messageContainer.insertAdjacentHTML('afterbegin', `<p>${formattedMessage}</p>`);
}
