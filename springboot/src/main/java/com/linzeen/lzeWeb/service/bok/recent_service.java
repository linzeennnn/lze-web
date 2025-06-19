package com.linzeen.lzeWeb.service.bok;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.linzeen.lzeWeb.common.global;
import com.linzeen.lzeWeb.dto.bok.recent.rec_recent;
@Service
public class recent_service {
    @Autowired global global_data;
    public void recent(rec_recent rec_recent) {
        Path filePath = Paths.get(global_data.path_map.get("bok")+rec_recent.getFilename()); 

        try {
            FileTime now = FileTime.fromMillis(System.currentTimeMillis());
            Files.setLastModifiedTime(filePath, now);
        } catch (IOException e) {
            System.err.println("设置时间失败: " + e.getMessage());
        }
    }
}
