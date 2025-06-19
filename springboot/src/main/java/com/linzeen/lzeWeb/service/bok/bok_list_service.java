package com.linzeen.lzeWeb.service.bok;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.File;
import com.linzeen.lzeWeb.common.*;
import com.linzeen.lzeWeb.dto.bok.list.send_list;
@Service
public class bok_list_service {
    @Autowired
    global global_data;
    public send_list[] list() {
        String bok_path = global_data.path_map.get("bok");
        File[] file = common.scan_dir(bok_path);
        send_list[] send_list = new send_list[file.length];
        for (int i = 0; i < file.length; i++) {
            send_list[i] = new send_list();
            send_list[i].setName(file[i].getName());
            send_list[i].setContent(common.read_text(bok_path + "/"+file[i].getName()));
        }
        return send_list;
    }
}
