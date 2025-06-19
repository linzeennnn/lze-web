package com.linzeen.lzeWeb.service.not;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.linzeen.lzeWeb.dto.not.del.rec_del;
import com.linzeen.lzeWeb.common.*;
import java.nio.file.Files;
@Service
public class not_del_service {
     @Autowired global global_data;
    public ResponseEntity<String> del(rec_del rec_data){
        user user_data=new user();
       boolean permit= user_data.check_permission(rec_data.getUser(),rec_data.getToken(), "not", "delete");
        if(permit){
           String path=global_data.path_map.get("not")+rec_data.getFileName();
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
