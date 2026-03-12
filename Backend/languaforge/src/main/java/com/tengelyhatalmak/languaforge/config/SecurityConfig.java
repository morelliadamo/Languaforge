package com.tengelyhatalmak.languaforge.config;


import com.tengelyhatalmak.languaforge.security.JWTAuthFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JWTAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"))
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/register", "/auth/activate", "/auth/login", "/auth/refresh", "/ws", "/exerciseLogic/evaluateSpeech",
                                "/lessonprogresses/count/completed","/courses/count", "/users/count","/courses/courseWith/mostUsers",
                                        "/userXachievements/user/0","/users/count", "/courses/courseWith/bestReviews","/courses/14","/lessonprogresses/count/completed","/users/avatars/**").permitAll()
                        .requestMatchers("/**").authenticated().anyRequest().permitAll()
//                                .requestMatchers("/**").permitAll() //for testing only


                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
