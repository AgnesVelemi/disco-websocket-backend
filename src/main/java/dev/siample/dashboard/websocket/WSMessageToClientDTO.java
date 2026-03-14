package dev.siample.dashboard.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class WSMessageToClientDTO {

    private String outMessage;
    private OffsetDateTime timestamp;

}

