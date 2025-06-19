package com.linzeen.lzeWeb.controller.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import com.linzeen.lzeWeb.common.common;
import com.linzeen.lzeWeb.dto.login.login.*;
import com.linzeen.lzeWeb.service.login.login_service;
@RestController
@RequestMapping("/server")
public class login_controller {
    @Autowired private login_service service;
    @PostMapping("/login/login")
    public Object send(@RequestBody rec_login data) {
        send_login send_data=service.login(data);
        if(send_data != null) {
            return send_data;
        } 
        else {
            return common.response(401, null);
        }
    }
}
