package dev.siample.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Component
public class DashboardStatusDto {

    private int connectedClients;
    private long totalMessages;
    private  ZonedDateTime serverStartTime = ZonedDateTime.now();
    private  String serverStartTimeAsString = serverStartTime.format(DateTimeFormatter.ofPattern("yyyy-MMM-dd HH:mm:ss", Locale.ENGLISH));
    private  String TheTimeZones = serverStartTime.format(DateTimeFormatter.ofPattern("z", Locale.ENGLISH))
        + " = " + serverStartTime.format(DateTimeFormatter.ofPattern("zzzz", Locale.ENGLISH));
    private LocalDateTime timestamp;

}