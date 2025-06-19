package com.linzeen.lzeWeb.service.bok;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.linzeen.lzeWeb.common.common;
import com.linzeen.lzeWeb.common.global;
import com.linzeen.lzeWeb.common.user;
import com.linzeen.lzeWeb.dto.bok.add.rec_add;
@Service
public class add_service {
    @Autowired
    global global_data;
    public ResponseEntity<String> add(rec_add rec_data) {
        user user_data = new user();
        if(user_data.check_permission(rec_data.getUser(), rec_data.getToken(), "bok", "newbok")) {
            String path=global_data.path_map.get("bok") + rec_data.getName();
            common.write_text(rec_data.getText(), path);
            return common.response(201, null);
            
        } else {
           return common.response(401, null);
        }
    }
}
