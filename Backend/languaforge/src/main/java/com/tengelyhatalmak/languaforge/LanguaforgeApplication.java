package com.tengelyhatalmak.languaforge;


import com.tengelyhatalmak.languaforge.config.CorsConfig;
import com.tengelyhatalmak.languaforge.model.LoginData;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;


@SpringBootApplication
public class LanguaforgeApplication {

//    @Configuration //for testing purposes only, to be removed later
//    public class SecurityConfig {
//
//
//        @Bean
//        public SecurityFilterChain securityFilterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
//            http
//                    .cors(cors ->cors.configurationSource(corsConfigurationSource))
//                    .csrf(csrf -> csrf.disable())
//                    .authorizeHttpRequests(auth -> auth
//                            .anyRequest().permitAll()
//                    );
//
//            return http.build();
//        }
//    }



	public static void main(String[] args) {

        SpringApplication.run(LanguaforgeApplication.class, args);


	}

}
