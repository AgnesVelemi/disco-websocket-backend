package dev.siample.dashboard.websocket;

import com.fasterxml.jackson.databind.util.JSONPObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
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
        System.out.println("WebSocket connected with "
                + "sessionid: " + session.getId()
                + ", uri: " + session.getUri()
                + ", localaddr: " + session.getLocalAddress()
                + ", remoteAddr: " + session.getRemoteAddress()
        + ".");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        connected.set(false);
        System.out.println("WebSocket disconnected with "
                + "sessionid: " + session.getId()
                + ", uri: " + session.getUri()
                + ", localaddr: " + session.getLocalAddress()
                + ", remoteAddr: " + session.getRemoteAddress()
                + ".");
    }


    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Log the received message
        System.out.println("Message payload: " + message.getPayload());

        // The response to the client:
        session.sendMessage(new TextMessage(message.getPayload()));
    }

}
