package com.studio.creator.service;

import com.studio.creator.dto.ScriptRequest;
import com.studio.creator.dto.ScriptResponse;
import com.studio.creator.dto.SegmentResponse;
import com.studio.creator.model.ScriptEntity;
import com.studio.creator.model.ScriptSegmentEntity;
import com.studio.creator.repository.ScriptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScriptService {

    private final WebClient aiServiceWebClient;
    private final ScriptRepository scriptRepository;

    @Transactional
    public ScriptResponse generateAndSaveScript(ScriptRequest request) {
        // 1. Send asynchronous POST request to FastAPI AI service
        ScriptResponse aiResponse = aiServiceWebClient.post()
                .uri("/generate-script")
                .bodyValue(request)
                .retrieve() // kkk
                .bodyToMono(ScriptResponse.class)
                .block(); // Blocking call to wait for the complete AI generation

        if (aiResponse == null) {
            throw new RuntimeException("Failed to obtain script response from AI service");
        }

        // 2. Map DTO to Database Entity
        ScriptEntity scriptEntity = ScriptEntity.builder()
                .topic(request.getTopic())
                .targetAudience(request.getTargetAudience())
                .tone(request.getTone())
                .platform(request.getPlatform())
                .title(aiResponse.getTitle())
                .hook(aiResponse.getHook())
                .callToAction(aiResponse.getCallToAction())
                .suggestedHashtags(aiResponse.getSuggestedHashtags())
                .build();

        // 3. Attach segments to parent Script entity
        if (aiResponse.getBody() != null) {
            List<ScriptSegmentEntity> segments = aiResponse.getBody().stream()
                    .map(seg -> ScriptSegmentEntity.builder()
                            .timestamp(seg.getTimestamp())
                            .spokenText(seg.getSpokenText())
                            .visualDescription(seg.getVisualDescription())
                            .build())
                    .collect(Collectors.toList());

            segments.forEach(scriptEntity::addSegment);
        }

        // 4. Save to PostgreSQL
        ScriptEntity savedEntity = scriptRepository.save(scriptEntity);

        // 5. Return mapped Response DTO
        return mapToResponseDto(savedEntity);
    }

    @Transactional(readOnly = true)
    public List<ScriptResponse> getAllScripts() {
        return scriptRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ScriptResponse getScriptById(Long id) {
        ScriptEntity entity = scriptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Script not found with id: " + id));
        return mapToResponseDto(entity);
    }

    // Helper mapper entity -> dto
    private ScriptResponse mapToResponseDto(ScriptEntity entity) {
        List<SegmentResponse> segments = entity.getBody() == null ? List.of() : entity.getBody().stream()
                .map(seg -> SegmentResponse.builder()
                        .timestamp(seg.getTimestamp())
                        .spokenText(seg.getSpokenText())
                        .visualDescription(seg.getVisualDescription())
                        .build())
                .collect(Collectors.toList());

        return ScriptResponse.builder()
                .id(entity.getId())
                .topic(entity.getTopic())
                .targetAudience(entity.getTargetAudience())
                .tone(entity.getTone())
                .platform(entity.getPlatform())
                .title(entity.getTitle())
                .hook(entity.getHook())
                .body(segments)
                .callToAction(entity.getCallToAction())
                .suggestedHashtags(entity.getSuggestedHashtags())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}