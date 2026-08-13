package vn.edu.crs.courseservice.config;

import vn.edu.crs.courseservice.security.JwtAuthFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf ->
                        csrf.disable()
                )

                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth ->
                        auth

                                // API nội bộ:
                                // registration-service gọi trực tiếp
                                .requestMatchers(
                                        "/internal/**"
                                )
                                .permitAll()

                                // Xem course -> public
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/courses/**"
                                )
                                .permitAll()

                                // Tạo course -> ADMIN
                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/courses/**"
                                )
                                .hasRole("ADMIN")

                                // Sửa course -> ADMIN
                                .requestMatchers(
                                        HttpMethod.PUT,
                                        "/courses/**"
                                )
                                .hasRole("ADMIN")

                                // Xóa course -> ADMIN
                                .requestMatchers(
                                        HttpMethod.DELETE,
                                        "/courses/**"
                                )
                                .hasRole("ADMIN")

                                // Những API khác cần đăng nhập
                                .anyRequest()
                                .authenticated()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}