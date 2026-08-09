import os
import json
from typing import AsyncGenerator
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import SystemMessage
from app.schemas import ScriptRequest

class SSEScriptGeneratorService:
    def __init__(self):
        model_name = os.getenv("OLLAMA_MODEL", "llama3.2:1b")
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

        self.llm = ChatOllama(
            model=model_name,
            base_url=base_url,
            temperature=0.2  # Lower temperature improves JSON structure adherence
        )

    def _build_streaming_prompt_template(self) -> ChatPromptTemplate:
        json_template = """{
  "title": "Script Title Here",
  "hook": "Attention grabbing hook...",
  "body": [
    {
      "timestamp": "00:00 - 00:03",
      "spoken": "Spoken dialogue here",
      "visual": "Visual description here"
    }
  ],
  "cta": "Call to action text",
  "hashtags": ["#tag1", "#tag2"]
}"""

        system_prompt = (
            "You are an expert short-form video scriptwriter.\n"
            "You MUST output ONLY a valid JSON object following this EXACT structure:\n\n"
            f"{json_template}\n\n"
            "CRITICAL RULES:\n"
            "1. Do NOT include '$defs', 'properties', or schema metadata anywhere in the output.\n"
            "2. Break the body array into short timestamped scenes.\n"
            "3. Output ONLY raw JSON text. No markdown fences, no conversational text."
        )

        user_prompt = (
            "Topic: {topic}\n"
            "Platform: {platform}\n"
            "Tone: {tone}\n"
            "Target Audience: {target_audience}\n"
        )

        # Using SystemMessage avoids template parsing issues with raw JSON braces
        return ChatPromptTemplate.from_messages([
            SystemMessage(content=system_prompt),
            ("user", user_prompt)
        ])

    async def generate_script_stream(self, request: ScriptRequest) -> AsyncGenerator[str, None]:
        prompt_template = self._build_streaming_prompt_template()
        chain = prompt_template | self.llm

        inputs = {
            "topic": request.topic,
            "platform": request.platform,
            "tone": request.tone,
            "target_audience": request.target_audience,
        }

        async for chunk in chain.astream(inputs):
            if chunk.content:
                payload = json.dumps({"token": chunk.content})
                yield f"data: {payload}\n\n"

        yield "data: [DONE]\n\n"