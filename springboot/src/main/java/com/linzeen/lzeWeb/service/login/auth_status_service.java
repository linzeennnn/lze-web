package com.linzeen.lzeWeb.service.login;
import com.linzeen.lzeWeb.dto.login.auth_status.*;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import com.linzeen.lzeWeb.common.*;
@Service
public class auth_status_service {
    public ResponseEntity<String> login_status(rec_auth_status data){
        user auth_user=new user();
        auth_user.set_user(data.getName());
       if(auth_user.chaeck_token(data.getToken())&&auth_user.check_date())
            return common.response(200, null) ;
        else
            return common.response(401, "登陆过期");
    }
}