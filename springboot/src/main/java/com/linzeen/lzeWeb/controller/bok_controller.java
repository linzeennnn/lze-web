package com.linzeen.lzeWeb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.linzeen.lzeWeb.service.bok.bok_add_service;
import com.linzeen.lzeWeb.dto.bok.add.rec_add;
import com.linzeen.lzeWeb.dto.bok.recent.rec_recent;
import com.linzeen.lzeWeb.service.bok.recent_service;
import org.springframework.web.bind.annotation.GetMapping;
import com.linzeen.lzeWeb.dto.bok.list.send_list;
import com.linzeen.lzeWeb.service.bok.bok_list_service;
import com.linzeen.lzeWeb.dto.bok.del.*;
import com.linzeen.lzeWeb.service.bok.bok_del_service;

@RestController
@RequestMapping("/server/bok")
public class bok_controller {
// 最近访问
    @Autowired 
    recent_service recent_service;
    @PostMapping("/recent")
    public void recent(@RequestBody rec_recent rec_recent) {
        recent_service.recent(rec_recent);
    }    
// 书签列表
    @Autowired
    bok_list_service list_service;
    @GetMapping("/list")
    public send_list[] send(){
        return list_service.list();
    }
//删除书签 
    @Autowired bok_del_service del_service;
    @PostMapping("/del")
    public ResponseEntity<String> send(@RequestBody rec_del data) {
        return del_service.del(data);
    }
// 添加书签
        @Autowired
    bok_add_service add_service;
    @PostMapping("/add")
    public ResponseEntity<String> send(@RequestBody rec_add rec_data) {
        return add_service.add(rec_data);
    }
}
