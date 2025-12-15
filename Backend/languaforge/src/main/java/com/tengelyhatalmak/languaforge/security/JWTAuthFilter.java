package com.tengelyhatalmak.languaforge.security;

import com.tengelyhatalmak.languaforge.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        System.out.println("=== JWT Filter Debug ===");
        System.out.println("Request Path: " + request.getRequestURI());
        System.out.println("Authorization Header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("Token extracted: " + token.substring(0, Math.min(20, token.length())) + "...");

            if (jwtUtil.validateToken(token)) {
                System.out.println("Token is VALID");
                String username = jwtUtil.extractUsername(token);
                System.out.println("Extracted username: " + username);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("User loaded: " + userDetails.getUsername());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("Authentication set successfully");
            } else {
                System.out.println("Token is INVALID");
            }
        } else {
            System.out.println("No Bearer token found");
        }

        System.out.println("Current Authentication: " + SecurityContextHolder.getContext().getAuthentication());
        System.out.println("======================");

        filterChain.doFilter(request, response);
    }


}
