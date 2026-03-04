package dev.siample.dashboard.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class DashboardWebSocketHandler extends TextWebSocketHandler {

    private final AtomicBoolean connected = new AtomicBoolean(false);

    public boolean isConnected() {
        return connected.get();
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        connected.set(true);
        System.out.println("WebSocket connected");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        connected.set(false);
        System.out.println("WebSocket disconnected");
    }
}
