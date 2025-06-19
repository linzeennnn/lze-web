package com.linzeen.lzeWeb.controller.bok;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.linzeen.lzeWeb.dto.bok.list.send_list;
import com.linzeen.lzeWeb.service.bok.bok_list_service;
@RestController
@RequestMapping("/server")
public class bok_list_controller {
    @Autowired
    bok_list_service service;
    @GetMapping("/bok/list")
    public send_list[] send(){
        return service.list();
    }
}
