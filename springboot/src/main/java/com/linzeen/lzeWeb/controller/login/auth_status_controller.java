package com.linzeen.lzeWeb.controller.login;
import com.linzeen.lzeWeb.dto.login.auth_status.*;
import com.linzeen.lzeWeb.service.login.auth_status_service;

import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
    @RestController
    @RequestMapping("/server")
public class auth_status_controller {
@Autowired
private auth_status_service service;
 @PostMapping("/login/auth_status")
public ResponseEntity<String> send(@RequestBody rec_auth_status data){
    return service.login_status(data);
}
}
