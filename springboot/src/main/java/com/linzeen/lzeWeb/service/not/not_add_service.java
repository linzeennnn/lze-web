package com.linzeen.lzeWeb.service.not;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.linzeen.lzeWeb.common.*;
import com.linzeen.lzeWeb.dto.not.add.rec_add;

@Service
public class not_add_service {
    @Autowired
    global global_data;
    public ResponseEntity<String> add(rec_add rec_data,String type) {
        user user_data = new user();
        if(user_data.check_permission(rec_data.getUser(), rec_data.getToken(), "not", type)) {
            String path=global_data.path_map.get("not") ;
            String file_name=common.unique_name(path, rec_data.getNewTitle() + ".txt");
            common.write_text(rec_data.getNewContent(), path+file_name);
            return common.response(200, null);
            
        } else {
           return common.response(401, null);
        }
    }
}
