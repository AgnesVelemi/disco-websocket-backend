package dev.siample.dashboard.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

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
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/ws/dashboard")
                .setAllowedOrigins("*");
    }
}
