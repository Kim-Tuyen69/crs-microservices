package vn.edu.crs.apigateway.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

import java.util.Map;

@Component
public class AuthServiceClient {

    private final WebClient webClient;

    public AuthServiceClient(
            WebClient.Builder webClientBuilder,
            @Value("${auth-service.base-url:http://localhost:8081}")
            String authServiceBaseUrl
    ) {

        this.webClient = webClientBuilder
                .baseUrl(authServiceBaseUrl)
                .build();
    }

    public Mono<Boolean> isValidForScope(
            String key,
            String scope
    ) {

        return webClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/internal/api-keys/validate")
                        .queryParam("key", key)
                        .queryParam("scope", scope)
                        .build()
                )
                .retrieve()
                .bodyToMono(Map.class)
                .map(res ->
                        Boolean.TRUE.equals(
                                res.get("valid")
                        )
                )

                // Neu auth-service hong / mat ket noi:
                // tu choi quyen thay vi cho qua.
                .onErrorReturn(false);
    }
}