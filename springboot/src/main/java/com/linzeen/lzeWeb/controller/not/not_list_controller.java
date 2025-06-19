package com.linzeen.lzeWeb.controller.not;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.linzeen.lzeWeb.service.not.not_list_service;
import com.linzeen.lzeWeb.dto.not.list.send_list;
@RestController
@RequestMapping("/server")
public class not_list_controller {
    @Autowired
    not_list_service service;
    @GetMapping("/not/list")
    public send_list send() {
        return service.list();
    }
}
