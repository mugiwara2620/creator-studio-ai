export interface ScriptRequest {
    topic: string,
    targetAudience: string,
    tone: string,
    platform: string,
}

export interface ScriptResponse {
    id: number,
    topic: string,
    targetAudience: string,
    tone: string,
    platform: string,
    title: string,
    hook: string,
    body: SegmentResponse[],
    call_to_action: string,
    suggested_hashtags: string[],
    createdAt: string,
}

export interface SegmentResponse {
    timestamp: string,
    spoken_text: string,
    visual_description: string,
}