package com.febuki.tool.server;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.febuki.tool.server.entity")
@MapperScan(basePackages = "com.febuki.tool.server.mapper")
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
        System.out.println("启动成功");
        System.out.println("swagger-ui 路径：http://localhost:8080/swagger-ui/index.html");
    }

}
