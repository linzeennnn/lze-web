package com.linzeen.lzeWeb.service.bok;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.linzeen.lzeWeb.dto.bok.del.rec_del;
import com.linzeen.lzeWeb.common.*;
import java.nio.file.Files;
@Service
public class del_service {
    @Autowired global global_data;
    public ResponseEntity<String> del(rec_del rec_data){
        user user_data=new user();
       boolean permit= user_data.check_permission(rec_data.getUser(),rec_data.getToken(), "bok", "delete");
        if(permit){
           String path=global_data.path_map.get("bok")+rec_data.getName();
           try {
               Files.deleteIfExists(java.nio.file.Paths.get(path));
               return common.response(201, null);
           } catch (Exception e) {
               return common.response(500, e.getMessage());
           }
        }
        else{
            return common.response(401,null);
        }
    }   
}
