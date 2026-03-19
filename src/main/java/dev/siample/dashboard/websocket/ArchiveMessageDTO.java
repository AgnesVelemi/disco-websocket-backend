package dev.siample.dashboard.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArchiveMessageDTO {
    private int arrivalNumber;
    private String sentFrom;
    private String sentFromIP;
    private String outMessage;
    private String timestamp;
    private String sentFromTimezone;
}
