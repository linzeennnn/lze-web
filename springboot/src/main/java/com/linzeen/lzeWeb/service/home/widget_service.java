package com.linzeen.lzeWeb.service.home;
import java.io.File;
import java.util.Arrays;
import java.util.Comparator;

import org.springframework.beans.factory.annotation.Autowired;

import com.linzeen.lzeWeb.common.*;
import com.linzeen.lzeWeb.dto.home.widget.rec_widget_dto;
import com.linzeen.lzeWeb.dto.home.widget.send_widget_dto;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.node.ObjectNode;
@Service
public class widget_service {
@Autowired
global global_data;
    public send_widget_dto  widget(rec_widget_dto data){
    user user_data=new user();
    String username;
    send_widget_dto send_data=new send_widget_dto();
        // mon
        username=data.getUser();
        user_data.set_user(username);
        send_data.setMon1(user_data.getTokentime());
        send_data.setMon2(user_data.token_remain_time(user_data.getToken(),user_data.getTokentime()));
        ObjectNode control_node=global_data.user_config_node;
        JsonNode control_list=control_node.get("control");
        String control_json_str=common.node_to_json((ObjectNode)control_list);
        int count=0,index=0;
        while ((index=control_json_str.indexOf(username,index))!=-1) {
            count++;
            index+=username.length();
        }
        send_data.setMon3(count);
        // doc
        File[] doc_file=list_dir(global_data.path_map.get("doc"));
        send_data.setDoc1(is_null_file(doc_file[0]));
        send_data.setDoc2(is_null_file(doc_file[1]));
        send_data.setDoc3(is_null_file(doc_file[2]));
        // pic
        File[] pic_file=list_dir(global_data.path_map.get("pic"));
        send_data.setPic1(is_null_file(pic_file[0]));
        // not
        File[] not_file=list_dir(global_data.path_map.get("not"));
        send_data.setNot1(is_null_file(not_file[0]));
        send_data.setNot2(is_null_file(not_file[1]));
        send_data.setNot3(is_null_file(not_file[2]));
        // bok
        File[] bok_file=list_dir(global_data.path_map.get("bok"));
        send_data.setBok1(is_null_file(bok_file[0]));
        // tra
        File[] tra_file=list_dir(global_data.path_map.get("tra"));
        send_data.setTra1(is_null_file(tra_file[0]));
        // disk
        File root = File.listRoots()[0];
        long totalDisk= root.getTotalSpace();
        long usedDisk= totalDisk- root.getUsableSpace();
        totalDisk=totalDisk/1024;
        usedDisk=usedDisk/1024;
        send_data.setTotal(totalDisk);  
        send_data.setUsed(usedDisk);
        return send_data;
    }   

        private File[] list_dir(String path){
        File[] files=common.scan_dir(path);
        if(files!=null&&files.length > 0){
            Arrays.sort(files, Comparator.comparingLong(File::lastModified).reversed());
            int list_length=files.length;
            if(list_length<3){
                for(int i=list_length;i<3;i++){
                    files=Arrays.copyOf(files, 3);
                    files[i]=null;
                }
            }
        }
            else
            {
                files= new File[] {null, null, null};
            }
        return files;
        }

        private String is_null_file(File file){
            if(file==null)
            return "null";
        else
            return file.getName();
        }
}
