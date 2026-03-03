package com.tengelyhatalmak.languaforge;


import com.tengelyhatalmak.languaforge.config.CorsConfig;
import com.tengelyhatalmak.languaforge.model.LoginData;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;


@SpringBootApplication
@EnableAsync
public class LanguaforgeApplication {




	public static void main(String[] args) {

        SpringApplication.run(LanguaforgeApplication.class, args);


	}

}
