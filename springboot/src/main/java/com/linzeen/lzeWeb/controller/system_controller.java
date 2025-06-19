package com.linzeen.lzeWeb.controller;
import com.linzeen.lzeWeb.dto.system.system.*;
import com.linzeen.lzeWeb.service.system.system_service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
    @RestController
    @RequestMapping("/server")
public class system_controller {
    @Autowired
private system_service service;
@GetMapping("/system/system")
public send_system send(){
    return service.sys();
}
}
