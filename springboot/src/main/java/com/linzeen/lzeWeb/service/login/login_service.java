package com.linzeen.lzeWeb.service.login;
import com.linzeen.lzeWeb.dto.login.login.*;

import org.springframework.stereotype.Service;
import com.linzeen.lzeWeb.common.*;
@Service
public class login_service {
    public send_login login(rec_login data) {
    String password;
    user user_data=new user();
    send_login send_data=new send_login();
        password = data.getPassword();
        user_data.set_user(data.getName());
        if(password.equals(user_data.getPassword())){
            if(user_data.check_date()){
                send_data.setToken(user_data.getToken());
            }
            else
                send_data.setToken(user_data.gen_token());
            return send_data;
            }
        else{
            return null;
        }

    }
  
}
