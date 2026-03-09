## YES! TextWebSocketHandler can handle websocket, and also STOMP-websocket?
Yes, a TextWebSocketHandler in Spring can handle WebSocket connections, including those using the STOMP (Simple Text Oriented Messaging Protocol) protocol. Here's how it works:
```java
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
}
```

### WebSocket vs. STOMP

#### 1. WebSocket
   WebSocket is a protocol that enables two-way communication between a client and a server. It allows the server to push updates to the client in real-time, offering a persistent connection.
   Using Spring's TextWebSocketHandler, you can manage basic WebSocket connections. It allows you to handle onOpen, onMessage, onClose, and onError methods.

#### 2. STOMP

   STOMP is a framing protocol that defines an interaction model for messaging. It is built on top of WebSocket, which means it uses WebSocket as a transport layer.
   STOMP allows you to send and receive messages in a more structured way, providing additional features such as subscriptions to message queues, message acknowledgment, 
   and the ability to broadcast messages to multiple clients.
   ##### Using STOMP with Spring
   To handle STOMP messages over WebSocket in Spring, you typically use the following steps:
   * Configuration: Set up your WebSocket configuration to enable STOMP support by using a @EnableWebSocketMessageBroker annotation in your configuration class.
   * Controller: Create a controller that uses @MessageMapping to define methods that handle STOMP messages sent to specific destinations (similar to how you configure HTTP request mappings).
   * Client: Use a STOMP client (like the STOMP.js library) to connect to your WebSocket endpoint. You can then send and subscribe to messages.

* STOMP over Websocket-configuration:
```java
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }
}
```

* Controller for STOMP over Websocket 
```java
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public Message sendMessage(Message message) {
        return message;
    }
}
```

# css topic
* button.on { ... } 
  * This selector targets any <button> element that has the class on.
* button:hover { ... }
    * This is a pseudo-class selector that applies styles to a <button> element when the user hovers over it with their mouse cursor. 
    * Purpose: Enhance the button's interactivity by providing visual feedback when the user hovers over it.
    * This means any time the mouse pointer is over the button, the styles defined in this rule will be applied, 
    typically to give users a visual indication that the button is interactive.
    * ```css
      button:hover {
       filter: brightness(0.90); /* Darkens the button slightly on hover */
      }
      ```
* div span { ... } 
  * ! The CSS selector div span targets any <span> elements that are inside a <div>. 
  * This means any <span> within a <div> will receive the styles defined in this rule.  
  * ```html
    <div class="container">
        <span>This is a span inside a div.</span>
        <span>This is another span inside the same div.</span>
    </div>
    ```

  * ```
    div span {  // or may be: .container span {
        color: blue;         
        font-weight: bold;   
        background-color: yellow;
        padding: 5px;         /* Padding around the text */
        border-radius: 3px;   /* Rounded corners */
    }
    ```
    
* `transform: translateY(2px);` transformation to the element, specifically moving it vertically.
* The transform property in CSS allows you to apply various 2D and 3D transformations to an element, including:
  * translation, rotation, scaling, and skewing.
* The translateY() function is used to move an element along the Y-axis (- is up and + is down), 
* as if the button is being physically pressed down

### insertAdjacentHTML js method
* `<div id="messageContainer" th:utext="${messages}">`
* messageContainer.insertAdjacentHTML('afterbegin', `<p>${formattedMessage}</p>`);
* insertAdjacentHTML('afterbegin', ...): This method allows you to insert HTML at a specified position in the DOM. 
* The 'afterbegin' position indicates that the new message should be inserted as the first child of the messageContainer, 
* effectively making it appear above any existing messages.