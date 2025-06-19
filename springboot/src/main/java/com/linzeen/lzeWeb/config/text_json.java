package com.linzeen.lzeWeb.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
@Configuration
public class text_json  implements WebMvcConfigurer {
    @Override
    public void extendMessageConverters(java.util.List<org.springframework.http.converter.HttpMessageConverter<?>> converters) {
        for (org.springframework.http.converter.HttpMessageConverter<?> converter : converters) {
            if (converter instanceof MappingJackson2HttpMessageConverter) {
                MappingJackson2HttpMessageConverter jsonConverter = (MappingJackson2HttpMessageConverter) converter;
                // 添加 text/plain 支持
                jsonConverter.setSupportedMediaTypes(Arrays.asList(
                    MediaType.APPLICATION_JSON,
                    MediaType.TEXT_PLAIN // 支持 text/plain 当成 json 解析
                ));
            }
        }
    }
}
