package com.linzeen.lzeWeb.dto.login.auth_status;

public class rec_auth_status {

    private String name;
    private String token;
    public String getName(){
        return this.name;
    }
    public void setName(String rec_name){
        this.name=rec_name;
    }
    public String getToken(){
        return this.token;
    }
    public void setToken(String rec_token){
        this.token=rec_token;
    }
}
