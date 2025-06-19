package com.linzeen.lzeWeb.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.linzeen.lzeWeb.common.*;
@Configuration
public class source_path implements WebMvcConfigurer{
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String path="file:"+common.get_work_path()+"web/";
        registry.addResourceHandler("/**")
                .addResourceLocations(path); 
    }
}
