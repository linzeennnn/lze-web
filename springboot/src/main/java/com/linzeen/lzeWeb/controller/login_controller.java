package com.linzeen.lzeWeb.controller;
import com.linzeen.lzeWeb.dto.login.auth_status.*;
import com.linzeen.lzeWeb.service.login.auth_status_service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.linzeen.lzeWeb.common.common;
import com.linzeen.lzeWeb.dto.login.login.*;
import com.linzeen.lzeWeb.service.login.login_service;
import org.springframework.http.ResponseEntity;

    @RestController
    @RequestMapping("/server/login")
public class login_controller {
//token过期验证
        @Autowired
        private auth_status_service auth_service;
        @PostMapping("/auth_status")
        public ResponseEntity<String> send(@RequestBody rec_auth_status data){
            return auth_service.login_status(data);
        }
// 登陆
    @Autowired private login_service login_service;
    @PostMapping("/login")
    public Object send(@RequestBody rec_login data) {
        send_login send_data=login_service.login(data);
        if(send_data != null) {
            return send_data;
        } 
        else {
            return common.response(401, null);
        }
    }
}
