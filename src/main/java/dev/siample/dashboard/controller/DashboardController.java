package dev.siample.dashboard.controller;

import dev.siample.dashboard.dto.DashboardStatusDto;
import dev.siample.dashboard.websocket.DashboardWebSocketHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Controller
public class DashboardController {

    private final DashboardWebSocketHandler handler;
    private DashboardStatusDto dashboardStatusDto;

    public DashboardController(DashboardWebSocketHandler handler, DashboardStatusDto dashboardStatusDto) {
        this.handler = handler;
        this.dashboardStatusDto = dashboardStatusDto;
    }

    @GetMapping({"/dashboard", "/", "/index"})
    public String dashboard(Model model) {

        boolean wsConnected = handler.isConnected();
        model.addAttribute("wsConnected", wsConnected);

        model.addAttribute("environment", "DEV (default)");
        model.addAttribute("username", "Guest (default)");
        model.addAttribute("serverTimeZone", dashboardStatusDto.getTheTimeZones());
        model.addAttribute("serverStartTime", dashboardStatusDto.getServerStartTimeAsString());


        return "dashboard";
    }
}
