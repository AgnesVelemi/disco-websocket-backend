package dev.siample.dashboard.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
@EnableWebSocketMessageBroker  // Enable STOMP
// public class WebSocketConfig implements WebSocketConfigurer {
public class WebSocketConfig implements WebSocketConfigurer, WebSocketMessageBrokerConfigurer {

    private final DashboardWebSocketHandler handler;

    public WebSocketConfig(DashboardWebSocketHandler handler) {
        this.handler = handler;
    }

    /** This WebSocket architecture allows for real-time interactions without the overhead of HTTP requests,
     * which can significantly improve the user experience in applications like chat apps or live dashboards.
     * Data Flow:
     * 1. Client Connection: /ws/dashboard ULR is a WebSocket endpoint, through which clients connect to my WebSocket server.
     * 2. Sending Data: The client sends a message using the WebSocket connection.
     * 3. Processing: The handler processes the incoming message, potentially performs some logic (e.g., updating a database, computing a result).
     * 4. Sending Response: The server sends a response back to the client through the same WebSocket connection.
     * @param registry
     */
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) { // for local websocket client+server
        registry.addHandler(handler, "/ws/dashboard")
                .setAllowedOrigins("*");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) { // for STOMP over websocket server
        // Register STOMP endpoint
        registry.addEndpoint("/ws/stomp") // STOMP endpoint
                .setAllowedOrigins("http://localhost:4200", "http://localhost:1025", "http://localhost:8080", "*");
               // .withSockJS(); // Optional, for SockJS fallback support
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) { // for STOMP over websocket server
        // Enable simple broker
        config.enableSimpleBroker("/topic"); // For messaging for subscribed ws-clients
        config.setApplicationDestinationPrefixes("/app"); // For sending messages by clients to /app/<controller_endpoint>
    }
}
