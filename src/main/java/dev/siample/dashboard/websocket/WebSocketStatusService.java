package dev.siample.dashboard.websocket;

import dev.siample.dashboard.dto.DashboardStatusDto;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class WebSocketStatusService {

    private final AtomicInteger connectedClients = new AtomicInteger(0);
    private final AtomicLong totalMessages = new AtomicLong(0);
    private final ZonedDateTime serverStartTime = ZonedDateTime.now();

    private volatile OffsetDateTime lastMessageTimestamp;

    public void incrementClients() {
        connectedClients.incrementAndGet();
        updateLastActivity();
    }

    public void decrementClients() {
        int current;
        do {
            current = connectedClients.get();
            if (current == 0) {
                return; // prevent negative values
            }
        } while (!connectedClients.compareAndSet(current, current - 1));

        updateLastActivity();
    }

    public int getConnectedClients() {
        return connectedClients.get();
    }

    public void updateLastActivity() {
        lastMessageTimestamp = OffsetDateTime.now();
    }

    public void incrementMessages() {
        totalMessages.incrementAndGet();
        updateLastActivity();
    }

    public DashboardStatusDto getCurrentStats() {
        return DashboardStatusDto.builder()
                .connectedClients(connectedClients.get())
                .totalMessages(totalMessages.get())
                .serverStartTime(serverStartTime)
                .timestamp(LocalDateTime.now())
                .build();
    }

    private String formatTimestamp(OffsetDateTime timestamp) {
        if (timestamp == null) {
            return "Waiting...";
        }
        return timestamp.format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }
}