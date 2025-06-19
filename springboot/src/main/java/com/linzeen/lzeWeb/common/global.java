package com.linzeen.lzeWeb.common;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectWriter;

import java.util.HashMap;
@Component
public class global {
    public String log_str;
    private String user_config_path=common.get_work_path()+"config/user_config.json";
    private String user_config_content=common.read_text(user_config_path);
    public ObjectNode user_config_node=common.json_to_node(user_config_content);
    private String work_config_path=common.get_work_path()+"config/work_config.json";
    public HashMap<String, String> path_map=common.init_path(work_config_path);
    
    public String user_get_config_path(){
        return this.user_config_path;
    }
    public String user_get_path_conten(){
        return this.user_config_content;
    }
    public void user_set_path_conten(String new_content){
        this.user_config_content=new_content;
    }
    public void user_config_node_to_string(){
        ObjectMapper mapper =new ObjectMapper();
        try {
        this.user_config_content = mapper.writeValueAsString(this.user_config_node);
    } catch (JsonProcessingException e) {
        e.printStackTrace();
    }
    }
    public void update_user_config(){
        user_config_node_to_string();
        common.write_text(common.formatJson(user_config_content), user_config_path);
    }
}
