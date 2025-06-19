package com.linzeen.lzeWeb.service.not;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.File;
import com.linzeen.lzeWeb.common.common;
import com.linzeen.lzeWeb.common.global;
import com.linzeen.lzeWeb.dto.not.list.*;
@Service
public class not_list_service {
    @Autowired
    global global_data;
    public send_list list(){
        File[] list_array=common.scan_dir(global_data.path_map.get("not"));
        int list_length=list_array.length;
        String[] file_list=new String[list_length];
        for(int i=0;i<list_length;i++){
            file_list[i]=list_array[i].getName();
        }
        send_list send_list=new send_list();
        send_list.setList(file_list);
        return send_list;
    }
}
