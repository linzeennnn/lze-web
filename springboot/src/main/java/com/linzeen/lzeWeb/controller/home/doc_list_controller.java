package com.linzeen.lzeWeb.controller.home;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import com.linzeen.lzeWeb.dto.home.doc_list.*; 
import com.linzeen.lzeWeb.service.home.doc_list_service;
@RestController
@RequestMapping("/server")
public class doc_list_controller {
    @Autowired
    doc_list_service service;
    @PostMapping("/home/doc_list")
    public send_doc_list send(@RequestBody rec_doc_list data){
        return service.doc_list(data);
    }
}
