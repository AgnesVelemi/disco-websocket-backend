package dev.siample.dashboard.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;

import java.time.OffsetDateTime;

@Controller
@RequiredArgsConstructor
public class DashboardStompHandler {

    private final WebSocketStatusService statusService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/greet") // Maps to /app/send (with ApplicationDestinationPrefix)
    // @SendTo("/topic/messages") // Broadcast responses to subscribers on /topic/messages
    // public String handleStompMessage(WSMessageFromClientDTO wSMessageFromClientDTO) {
    public void handleStompMessage(WSMessageFromClientDTO wSMessageFromClientDTO) {

        System.out.println("STOMP Message arrived from ws-client or ws-server: " + wSMessageFromClientDTO.getPayload());

        // Update dashboard stats
        statusService.incrementMessages();

        try {
            Thread.sleep(1000); // Ez blokkolja a WebSocket thread-et, inkkább: ScheduledExecutorService kéne.
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        WSMessageToClientDTO wSMessageToClientDTO = new WSMessageToClientDTO(
                '"' + wSMessageFromClientDTO.getPayload() + '"', OffsetDateTime.now());

        // BROADCAST TO ALL SUBSCRIBERS
        messagingTemplate.convertAndSend("/topic/greetings", wSMessageToClientDTO);
        // return new WSMessageToClientDTO('"' + wSMessageFromClientDTO.getPayload() +
        // '"', OffsetDateTime.now());
        // Process the message and send a response back to subscribed clients

        //return message; // Echoing back the message as an example
    }
}
