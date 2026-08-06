package com.studio.creator.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScriptResponse {

    private Long id;
    private String topic;
    private String targetAudience;
    private String tone;
    private String platform;
    private String title;
    private String hook;
    private List<SegmentResponse> body;
    @JsonProperty("call_to_action")
    private String callToAction;
    @JsonProperty("suggested_hashtags")
    private List<String> suggestedHashtags;
    private LocalDateTime createdAt;
}