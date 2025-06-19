package com.linzeen.lzeWeb.controller;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.linzeen.lzeWeb.service.not.*;
import com.linzeen.lzeWeb.dto.not.add.*;
import com.linzeen.lzeWeb.dto.not.del.*;
import com.linzeen.lzeWeb.dto.not.list.send_list;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
@RestController
@RequestMapping ("/server/not")
public class not_controller { 
// 添加
    @Autowired
    private not_add_service add_service;
    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody rec_add rec_data) {
        return add_service.add(rec_data,"newnote");
    }
// 删除
    @Autowired
    private not_del_service del_service;
    @PostMapping("/del")
    public ResponseEntity<String> send(@RequestBody rec_del data) {
        return del_service.del(data);
    }
// 扫描文件
    @Autowired
    not_list_service service;
    @GetMapping("/list")
    public send_list send() {
        return service.list();
    }
// 保存
    @Autowired
    private not_add_service save_service;
    @PostMapping("/save")
    public ResponseEntity<String> save(@RequestBody rec_add rec_data) {
        return save_service.add(rec_data,"edit");
    }

}
