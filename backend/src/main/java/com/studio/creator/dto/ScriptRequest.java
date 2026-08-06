package com.studio.creator.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScriptRequest {

    @NotBlank(message = "Topic is required")
    private String topic;

    @NotBlank(message = "Target audience is required")
    private String targetAudience;

    @NotBlank(message = "Tone is required")
    private String tone;

    @NotBlank(message = "Platform is required")
    private String platform;
}
