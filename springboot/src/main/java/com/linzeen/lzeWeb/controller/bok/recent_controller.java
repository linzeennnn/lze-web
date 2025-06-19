package com.linzeen.lzeWeb.controller.bok;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.linzeen.lzeWeb.dto.bok.recent.rec_recent;
import com.linzeen.lzeWeb.service.bok.recent_service;
@RestController
@RequestMapping("/server")
public class recent_controller {
    @Autowired 
    recent_service service;
    @PostMapping("/bok/recent")
    public void recent(@RequestBody rec_recent rec_recent) {
        service.recent(rec_recent);
    }    
}
