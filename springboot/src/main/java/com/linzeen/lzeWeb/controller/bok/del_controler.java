package com.linzeen.lzeWeb.controller.bok;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.linzeen.lzeWeb.dto.bok.del.*;
import com.linzeen.lzeWeb.service.bok.del_service;
@RestController
@RequestMapping("/server")
public class del_controler {
    @Autowired del_service service;
    @PostMapping("/bok/del")
    public ResponseEntity<String> send(@RequestBody rec_del data) {
        return service.del(data);
    }
}
