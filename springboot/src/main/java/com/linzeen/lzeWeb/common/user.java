package com.linzeen.lzeWeb.common;
import java.util.concurrent.ThreadLocalRandom;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
public class user {
private global global_data=holder.getBean(global.class);
private String name;
private String token;
private String tokentime;
private String password;
public String getName() {
    return name;
}
public String getPassword() {
    return password;
}
public String getToken() {
    return token;
}

public String getTokentime() {
    return tokentime;
}
 public void set_user(String username){
            if(username.equals("visitor")||(!username.equals("admin")&&!username.equals("lze"))){
                this.name="visitor";
                this.token="";
                this.tokentime="";
            }
            else{
            JsonNode root=global_data.user_config_node;
            JsonNode user_list=root.get("user");
            JsonNode user_node=user_list.get(username);
            this.name=username;
            this.token=user_node.get("token").asText();
            this.tokentime=user_node.get("tokentime").asText();
            this.password=user_node.get("password").asText();
            }
        }   
// 检查token
public boolean chaeck_token(String token){
    if(this.name.equals("visitor"))
        return true;
    else
        {
            if(token.equals(this.token))
                return true;
            else
                return false;
        }    
}
// 检查token过期
public boolean check_date(){
    if(this.name.equals("visitor"))
        return true;
    else
        {
            if(this.tokentime.equals("never"))
                return true;
            else if(this.token == null || this.token.isEmpty())
                return false;
            else{
                if(token_remain_time(token, tokentime)<0)
                    return false;
                else
                    return true;
            }
        }
}
// token剩余时间计算
public long token_remain_time(String token,String tokentime){
    if(token==null||tokentime==null||token.isEmpty()||tokentime.isEmpty())
        return 0;
    if(tokentime.equals("never"))
        return 0;
    else
    {
    String [] tkoen_part=this.token.split("_");
                long start_time=Long.parseLong(tkoen_part[1]);
                char unit=this.tokentime.charAt(tokentime.length()-1);
                String login_time_str=this.tokentime.substring(0, tokentime.length()-1);
                long login_time=Long.parseLong(login_time_str);
                switch (unit) {
                    case 'y':
                        login_time=login_time*24*365;
                        break;
                    case 'm':
                        login_time=login_time*24*30;
                        break;
                    case 'd':
                        login_time=login_time*24;
                        break;
                    default:
                        break;
                }
                long now=common.get_timestamp();
                long remain_time=start_time+login_time-now;
                return remain_time;
            }
            }
// 生成token
public String gen_token(){
    char[] chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".toCharArray();
    int i;
    String front_token="";
    for(int j=0;j<32;j++){
        i=ThreadLocalRandom.current().nextInt(0, 62);
            front_token=front_token+chars[i];
        }
        String back_token=String.valueOf(common.get_timestamp());
        String token=front_token+"_"+back_token;
        this.token=token;
        ObjectNode root=global_data.user_config_node;
        JsonNode user_list=root.get("user");
        ObjectNode user_mes=(ObjectNode)user_list.get(this.name);
        user_mes.put("token", token);
        global_data.update_user_config();
        return token;
    }

// 权限检查
    public  boolean check_permission(String name,String token,String type, String action) {
        set_user(name);
        if(chaeck_token(token)) {
            ObjectNode root = global_data.user_config_node;
            JsonNode control_list= root.get("control");
            JsonNode control_type=control_list.get(type);
            JsonNode action_content=control_type.get("action");
            JsonNode action_mes=action_content.get(action);
            ArrayNode user_list = (ArrayNode) action_mes.get("user");
            boolean is_user=false;
                for (JsonNode node : user_list) {
                    if (node.isTextual() && node.asText().equals(this.name)) {
                        is_user=true;
                        break;
                    }
                    }
            return is_user;
            }
        else {
            return false;
        }
    }
}