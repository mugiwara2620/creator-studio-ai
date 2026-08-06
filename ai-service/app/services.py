import os
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from app.schemas import ScriptRequest, ScriptResponse

class ScriptGeneratorService:
    def __init__(self):
        # Initialize Ollama model running locally
        # Default model set to llama3.2:1b (or qwen2.5:1.5b)
        model_name = os.getenv("OLLAMA_MODEL", "llama3.2:1b")
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

        self.llm = ChatOllama(
            model=model_name,
            base_url=base_url,
            temperature=0.7
        )

        # Enforce Pydantic structured output contract
        self.structured_llm = self.llm.with_structured_output(ScriptResponse)

    async def generate_script(self, request: ScriptRequest) -> ScriptResponse:
        system_prompt = (
            "You are an elite short-form video content strategist and scriptwriter specializing in high-retention TikTok, Reels, and YouTube Shorts content.\n"
            "Your objective is to generate structured video scripts optimized for viral retention metrics.\n\n"
            "CRITICAL RULES:\n"
            "1. You MUST follow the requested Pydantic JSON schema strictly.\n"
            "2. The 'hook' must be visual/verbal cues designed to grab immediate attention in the first 3 seconds.\n"
            "3. Provide chronological 'body' cues with precise timestamps, spoken lines, and visual B-Roll instructions.\n"
            "4. End with an actionable Call-To-Action (CTA).\n"
            "5. Do NOT output markdown explanations, preambles, or postambles outside the JSON structure."
        )

        user_prompt = (
            f"Topic: {request.topic}\n"
            f"Target Audience: {request.target_audience}\n"
            f"Tone: {request.tone}\n"
            f"Platform: {request.platform}\n\n"
            "Generate a complete, high-converting script following the schema."
        )

        prompt_template = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", user_prompt)
        ])

        # Create LangChain Runnable Chain
        chain = prompt_template | self.structured_llm

        # Invoke chain asynchronously
        result = await chain.ainvoke({})
        return result