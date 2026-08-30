package vn.edu.crs.apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class AuthHeaderFilter implements GlobalFilter, Ordered {

    private static final List<String> OPEN_PATHS = List.of(
            "/api/auth/login",
            "/api/public/courses"
    );

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            GatewayFilterChain chain
    ) {

        ServerHttpRequest request = exchange.getRequest();

        String path = request.getURI().getPath();

        /*
         * 1. Cho phép request OPTIONS đi qua.
         * Đây là request preflight của CORS.
         */
        if (request.getMethod() == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        /*
         * 2. Các API public không cần JWT.
         */
        boolean isOpen = OPEN_PATHS
                .stream()
                .anyMatch(path::startsWith);

        /*
         * GET /api/courses là public.
         */
        boolean isPublicCourseRead =
                path.startsWith("/api/courses")
                        && request.getMethod() == HttpMethod.GET;

        if (isOpen || isPublicCourseRead) {
            return chain.filter(exchange);
        }

        /*
         * 3. Lấy Authorization Header.
         */
        String authorization = request
                .getHeaders()
                .getFirst("Authorization");

        /*
         * Không có Authorization Header
         * -> 401 Unauthorized
         */
        if (authorization == null || authorization.isBlank()) {
            return unauthorized(exchange);
        }

        /*
         * Header phải có dạng:
         *
         * Authorization: Bearer <token>
         */
        if (!authorization.startsWith("Bearer ")) {
            return unauthorized(exchange);
        }

        /*
         * 4. Lấy token sau chữ Bearer.
         */
        String token = authorization
                .substring(7)
                .trim();

        if (token.isBlank()) {
            return unauthorized(exchange);
        }

        /*
         * 5. JWT hợp lệ về mặt cấu trúc phải có 3 phần:
         *
         * header.payload.signature
         *
         * Ví dụ:
         *
         * eyJ...eyJ...abc...
         *
         * Token rác như:
         *
         * abc123-token-sai
         *
         * không có 3 phần => trả 401 ngay tại Gateway.
         */
        String[] tokenParts = token.split("\\.", -1);

        if (tokenParts.length != 3
                || tokenParts[0].isBlank()
                || tokenParts[1].isBlank()
                || tokenParts[2].isBlank()) {

            return unauthorized(exchange);
        }

        /*
         * Token có cấu trúc JWT thì cho request
         * đi tiếp tới microservice.
         */
        return chain.filter(exchange);
    }

    /**
     * Trả HTTP 401 Unauthorized.
     */
    private Mono<Void> unauthorized(ServerWebExchange exchange) {

        exchange
                .getResponse()
                .setStatusCode(HttpStatus.UNAUTHORIZED);

        return exchange
                .getResponse()
                .setComplete();
    }

    @Override
    public int getOrder() {
        return -1;
    }
}