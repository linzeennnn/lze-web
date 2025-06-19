package com.linzeen.lzeWeb.controller.home;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.linzeen.lzeWeb.dto.home.widget.*;
import com.linzeen.lzeWeb.service.home.widget_service;
@RestController
@RequestMapping("/server")
public class widget_controller {
    @Autowired widget_service widget_service;
    @PostMapping("/home/widget")
    public send_widget_dto send(@RequestBody rec_widget_dto data){
        return widget_service.widget(data);
    }
}
