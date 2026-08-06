package com.studio.creator.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SegmentResponse {
    private String timestamp;
    @JsonProperty("spoken_text")
    private String spokenText;
    @JsonProperty("visual_description")
    private String visualDescription;
}
