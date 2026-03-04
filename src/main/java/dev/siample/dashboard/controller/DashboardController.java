package dev.siample.dashboard.controller;

import dev.siample.dashboard.websocket.DashboardWebSocketHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    private final DashboardWebSocketHandler handler;

    public DashboardController(DashboardWebSocketHandler handler) {
        this.handler = handler;
    }

    @GetMapping({"/dashboard", "/", "/index"})
    public String dashboard(Model model) {

        boolean wsConnected = handler.isConnected();
        model.addAttribute("wsConnected", wsConnected);

        return "dashboard";
    }
}
