import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ScriptRequest, ScriptResponse
from app.services import ScriptGeneratorService

app = FastAPI(
    title="Creator Studio AI",
    version="1.0.0",
    description="Microservices responsible for LLM script generation using Ollama and structured Pydantic outputs."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the script generation service instance
script_service = ScriptGeneratorService()

@app.get("/", tags=["Health Check"])
async def health_check():
    """Verify that the FastAPI service is running.

    Returns: 
        dict: A success message indicating that the service is operational.
    """
    return {
        "status": "online",
        "service":"Creator Studio AI Service",
        "version":"1.0.0"
        }

@app.post(
    "/generate-script",
    response_model=ScriptResponse,
    status_code=status.HTTP_200_OK,
    tags=["Script Generation"]
)
async def generate_script(request: ScriptRequest):
    """Generate a structured video script using LLM"""
    try:
        response  = await script_service.generate_script(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate script via Ollama: {str(e)}"
        )
    return response
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="[IP_ADDRESS]", port=8000, reload=True)

    
        