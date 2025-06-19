package com.linzeen.lzeWeb.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import com.linzeen.lzeWeb.dto.home.doc_list.*; 
import com.linzeen.lzeWeb.service.home.doc_list_service;
import com.linzeen.lzeWeb.dto.home.widget.*;
import com.linzeen.lzeWeb.service.home.widget_service;

@RestController
@RequestMapping("/server/home")
public class home_controller {
//文件管理列表 
    @Autowired
    doc_list_service doc_service;
    @PostMapping("/doc_list")
    public send_doc_list send(@RequestBody rec_doc_list data){
        return doc_service.doc_list(data);
    }
// 组件信息

    @Autowired widget_service widget_service;
    @PostMapping("/widget")
    public send_widget_dto send(@RequestBody rec_widget_dto data){
        return widget_service.widget(data);
    }
}
