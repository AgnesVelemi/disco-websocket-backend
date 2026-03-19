package dev.siample.dashboard.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class DashboardStompHandler {

    private final WebSocketStatusService statusService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/greet") // Maps to /app/greet
    @SendTo("/topic/greetings") // Direct return pattern, directbroadcast to all subscribers
    public StompMsgToClientDTO handleStompMessage(@Payload WSMessageFromClientDTO wSMessageFromClientDTO,
            Message<?> message) {

        // Log the payload message
        String payload = wSMessageFromClientDTO.getPayload();
        System.out.println("STOMP Message arrived from ws-client: " + payload);

        // Log the headers
        Map<String, Object> headers = message.getHeaders();
        System.out.println("STOMP Headers received: " + headers.toString());

        // Retrieve the client-type from nativeHeaders
        Map<String, Object> nativeHeaders = (Map<String, Object>) headers.get("nativeHeaders");
        String clientType = null;

        if (nativeHeaders != null) {
            List<String> clientTypes = (List<String>) nativeHeaders.get("client-type");
            if (clientTypes != null && !clientTypes.isEmpty()) {
                clientType = clientTypes.get(0);
                System.out.println("Client Type: " + clientType);
            } else {
                System.out.println("Client Type header not found.");
            }
        }

        // Update dashboard stats
        statusService.incrementMessages();

        // Simulating processing delay - Caution: This still blocks the thread, but
        // we'll leave it for now as per original code context.
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        // Return the DTO directly; Spring handles the conversion and sending to @SendTo
        // destination
        return new StompMsgToClientDTO(
                payload,
                OffsetDateTime.now(),
                clientType);
    }

    @MessageMapping("/archive")
    public void archiveMessages(@Payload List<ArchiveMessageDTO> archiveMessages) {
        System.out.println("--- Archiving 10 messages ---");
        for (ArchiveMessageDTO msg : archiveMessages) {
            System.out.println("[" + msg.getArrivalNumber() + "] " + msg.getSentFrom() + ": " 
                + msg.getSentFromTimezone() + ":" + msg.getTimestamp() + " ip:" + msg.getSentFromIP() 
                + " | message: " + msg.getOutMessage());
        }
        System.out.println("--- End of Archive ---");
    }
}
