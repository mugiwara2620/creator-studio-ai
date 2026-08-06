package com.studio.creator.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "scripts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScriptEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;
    private String targetAudience;
    private String tone;
    private String platform;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String hook;

    @Column(columnDefinition = "TEXT")
    private String callToAction;

    @ElementCollection
    @CollectionTable(name = "script_hashtags", joinColumns = @JoinColumn(name = "script_id"))
    @Column(name = "hashtag")
    @Builder.Default
    private List<String> suggestedHashtags = new ArrayList<>();

    @OneToMany(mappedBy = "script", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ScriptSegmentEntity> body = new ArrayList<>();

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Helper method segments add
    public void addSegment(ScriptSegmentEntity segment) {
        body.add(segment);
        segment.setScript(this);
    }
}