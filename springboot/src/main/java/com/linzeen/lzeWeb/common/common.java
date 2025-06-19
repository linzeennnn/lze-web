package com.linzeen.lzeWeb.common;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.File;
import org.springframework.boot.system.ApplicationHome;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectWriter;
public class common {
// 读取文本
    public static String read_text(String path){
        try {
            String content = Files.readString(Path.of(path));
            return content;
        } catch (IOException e) {
            System.err.println("无法读取文件: " + e.getMessage());
            return ""; 
     }
    }
// 写入文本
    public static void write_text(String new_content,String path){
        try{
            Files.write(Paths.get(path), new_content.getBytes(),
    StandardOpenOption.CREATE,              
    StandardOpenOption.TRUNCATE_EXISTING  
);
        }
         catch (IOException e) {
            e.printStackTrace();
        }
    }
// 将josn字符串解析为节点
    public static ObjectNode json_to_node(String str){
        ObjectMapper mapper =new ObjectMapper();
       try{ 
        JsonNode root=mapper.readTree(str);
       if (root instanceof ObjectNode node)
            return node;
        else
            return null;
       }
       catch    (JsonProcessingException e) {
            e.printStackTrace(); 
            return null;
        }
    }
// 将节点转为json字符串
    public static String node_to_json(ObjectNode node){
        ObjectMapper mapper =new ObjectMapper();
        try{
        String json_str= mapper.writeValueAsString(node);
        return json_str;
        }
        catch (JsonProcessingException e) {
            e.printStackTrace(); 
            return null;
        }
    }
// 获取时间戳
    public static long get_timestamp(){
        return ChronoUnit.HOURS.between(Instant.EPOCH, Instant.now());
    }
// 返回状态码
public static ResponseEntity<String> response(int statusCode, String content) {
        switch (statusCode) {
            case 200:
                return ResponseEntity.ok(content); // 200 OK
            case 201:
                return ResponseEntity.status(HttpStatus.CREATED).body(content); // 201 Created
            case 204:
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 204 No Content,无内容返回
            case 400:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(content); // 400 Bad Request
            case 401:
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(content); // 401 Unauthorized
            case 403:
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(content); // 403 Forbidden
            case 404:
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(content); // 404 Not Found
            case 500:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(content); // 500 Internal Server Error
            default:
                // 默认返回 200 OK
                return ResponseEntity.status(statusCode).body(content);
        }
    }
// 输出日志
    public static void output_log(Object content){
        String log_path=get_work_path()+"/lze-web.log";
        if(content==null)
            content="content is null";
        try {
            Path path = Paths.get(log_path);
            Files.createDirectories(path.getParent());
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(log_path, true))) {
                writer.write(String.valueOf(content));
                writer.newLine();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
// 获取jar路径
    public static String get_work_path(){
       ApplicationHome h = new ApplicationHome(common.class);
        File jarF = h.getSource();
        if(is_windows())
            return jarF.getParentFile().toString()+"\\";
        else
            return jarF.getParentFile().toString()+"/";
    }
// 判断是不是windows
    public static boolean is_windows(){
        return System.getProperty("os.name").toLowerCase().contains("win");
    }
// init path
    public static HashMap<String, String> init_path(String config_path){
        String file;
        String doc;
        String pic;
        String tra;
        String not;
        String bok;
        String path_config_conten=read_text(config_path);
        ObjectNode path_config_node=json_to_node(path_config_conten);
        file=path_config_node.get("file_path").asText();
        doc=path_config_node.get("doc_path").asText();   
        pic=path_config_node.get("pic_path").asText();
        tra=path_config_node.get("tra_path").asText();
        not=path_config_node.get("not_path").asText();
        bok=path_config_node.get("bok_path").asText();
        if(file.equals("default"))
            file=get_work_path()+"file/";
        if(doc.equals("default"))
            doc=file+"Documents/";
        if(pic.equals("default"))
            pic=file+"Pictures/";
        if(tra.equals("default"))
            tra=file+"trash/";
        if(not.equals("default"))
            not=file+"Note/";
        if(bok.equals("default"))
            bok=file+"Bookmark/";
        HashMap<String, String> map = new HashMap<>();
        map.put("file", file);
        map.put("doc", doc);
        map.put("pic", pic);
        map.put("tra", tra);
        map.put("not", not);
        map.put("bok", bok);
    return map;
    }
// 扫描目录
        public static File[] scan_dir(String path){
            File dir=new File(path);
        File[] files=dir.listFiles();
            Arrays.sort(files, Comparator.comparingLong(File::lastModified).reversed());
        return files;
        }
// 格式化JSON字符串
    public static String formatJson(String jsonStr) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Object json = mapper.readValue(jsonStr, Object.class);
            ObjectWriter writer = mapper.writerWithDefaultPrettyPrinter();
            return writer.writeValueAsString(json);
        } catch (Exception e) {
            return "Invalid JSON: " + e.getMessage();
        }
    }
// 判断文件类型
    public static String get_file_type(String pathStr){
         Path path = Paths.get(pathStr);

        try {
            if (Files.notExists(path)) {
                System.out.println("路径不存在！");
                return null;
            }

            if (Files.isSymbolicLink(path)) {
                Path realPath = Files.readSymbolicLink(path);
                Path absoluteRealPath = path.getParent().resolve(realPath).normalize();

                if (Files.isDirectory(absoluteRealPath)) {
                    return "dir_link";
                } else if (Files.isRegularFile(absoluteRealPath)) {
                    return "file_link";
                } else {
                    return "other_link";
                }

            } else {
                if (Files.isDirectory(path)) {
                    return "dir";
                } else if (Files.isRegularFile(path)) {
                    return "file";
                } else {
                    return "other";
                }
            }
        } catch (IOException e) {
            return null; 
        }
    }
// 返回文件列表的字符串数组
    public static String[] get_file_string_list(String path){
        File dir=new File(path);
        if(!dir.exists()||!dir.isDirectory())
            return null;
        File[] files=scan_dir(path);
        String[] file_list=new String[files.length];
        for(int i=0;i<files.length;i++){
            file_list[i]=files[i].getName();
        }
        return file_list;
    }
// 获取唯一文件名
    public static String unique_name(String path, String name) {
        File file = new File(path, name);
        if (!file.exists()) {
            return name; // 如果文件不存在，直接返回原始名称
        }

        String baseName = name;
        String extension = "";
        int dotIndex = name.lastIndexOf('.');
        if (dotIndex != -1) {
            baseName = name.substring(0, dotIndex);
            extension = name.substring(dotIndex); // 包含点
        }

        int counter = 1;
        while (file.exists()) {
            file = new File(path, baseName + "(" + counter + ")" + extension);
            counter++;
        }
        return file.getName(); // 返回唯一的文件名
    }
}