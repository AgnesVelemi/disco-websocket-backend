package dev.siample.dashboard.websocket;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class WSMessageFromClientDTO {

    /**
     * Angular has sent body: JSON.stringify({ payload: 'kukorica' }) --> Spring converts JSON → Java object
     */
    private String payload;

}