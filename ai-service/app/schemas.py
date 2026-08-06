from pydantic import BaseModel, Field
from typing import List

class VisualCue(BaseModel):
    timestamp: str = Field(description="Estimated timerange for the scene, e.g., '00:00 - 00:03'")
    spoken_text: str = Field(description="The exact spoken dialogue or voiceover text for this scene")
    visual_description: str = Field(description="Visual cues, B-Roll suggestions, or on-screen text overlays")

class ScriptResponse(BaseModel):
    title: str = Field(description="Catchy, high-converting video title")
    hook: str = Field(description="First 3-5 seconds attention grabber (The Hook)")
    body: List[VisualCue] = Field(description="Main video scenes broken down chronologically with visual cues")
    call_to_action: str = Field(description="Clear ending call-to-action (CTA)")
    suggested_hashtags: List[str] = Field(description="List of 3-5 relevant hashtags for algorithmic reach")

class ScriptRequest(BaseModel):
    topic: str = Field(description="Main topic or topic idea for the script")
    target_audience: str = Field(default="Developers & Content Creators", description="Target audience demographic")
    tone: str = Field(default="Engaging & Educational", description="Tone of voice for the speaker")
    platform: str = Field(default="Instagram Reels", description="Target short-form video platform")
    