package com.linzeen.lzeWeb.service.home;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.linzeen.lzeWeb.common.common;
import com.linzeen.lzeWeb.common.global;
import com.linzeen.lzeWeb.dto.home.doc_list.*;
@Service
public class doc_list_service {
    @Autowired
    global global_data;
    public send_doc_list doc_list(rec_doc_list data) {
        String file_path;
        String type;
        send_doc_list send_data=new send_doc_list();
        file_path =global_data.path_map.get("doc")+"/"+data.getName();
        type = common.get_file_type(file_path);
        if(type.equals("dir")||type.equals("dir_link")){
            send_data.setType("dir");
            send_data.setList(common.get_file_string_list(file_path));
        }
        else if(type.equals("file")||type.equals("file_link")){
            send_data.setType("file");
        }
        else{
            send_data.setType("unknown");
        }
        return send_data;
    }
}
