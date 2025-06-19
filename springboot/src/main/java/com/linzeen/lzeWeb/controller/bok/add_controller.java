package com.linzeen.lzeWeb.controller.bok;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.linzeen.lzeWeb.service.bok.add_service;
import com.linzeen.lzeWeb.dto.bok.add.rec_add;
@RestController
@RequestMapping("/server")
public class add_controller {
    @Autowired
add_service service;
@PostMapping("/bok/add")
public ResponseEntity<String> send(@RequestBody rec_add rec_data) {
    return service.add(rec_data);   
}
        
}
