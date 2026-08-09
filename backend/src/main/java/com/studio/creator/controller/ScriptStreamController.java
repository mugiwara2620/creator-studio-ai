package com.studio.creator.controller;

import com.studio.creator.dto.ScriptRequest;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/v1/scripts")
@CrossOrigin(origins = "*")
public class ScriptStreamController {

    private final WebClient aiWebClient;
    private final ExecutorService executor = Executors.newCachedThreadPool();

    public ScriptStreamController(WebClient aiWebClient) {
        this.aiWebClient = aiWebClient;
    }

    @PostMapping(value = "/generate/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamScript(@RequestBody ScriptRequest request) {
        SseEmitter emitter = new SseEmitter(180000L); // Timeout 3 دقائق

        executor.execute(() -> {
            try {
                Flux<String> stream = aiWebClient.post()
                        .uri("/generate-script/stream")
                        .bodyValue(request)
                        .accept(MediaType.TEXT_EVENT_STREAM)
                        .retrieve()
                        .bodyToFlux(String.class);

                stream.subscribe(
                        chunk -> {
                            try {
                                emitter.send(SseEmitter.event().data(chunk));
                            } catch (IOException e) {
                                emitter.completeWithError(e);
                            }
                        },
                        error -> {
                            emitter.completeWithError(error);
                        },
                        () -> {
                            emitter.complete();
                        });
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        });

        emitter.onTimeout(emitter::complete);
        emitter.onError(e -> emitter.complete());

        return emitter;
    }
}