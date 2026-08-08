@echo off
echo Starting All Services for Creator Studio AI...

:: 1. Start Python AI Engine (vLLM / FastAPI on Port 8000)
start "Python AI Engine" cmd /k "cd /d C:\Users\ayman\Desktop\Personel\project\creator-studio-ai\ai-service && .venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

start "Spring Boot Backend" cmd /k "cd /d C:\Users\ayman\Desktop\Personel\project\creator-studio-ai\backend && mvnw spring-boot:run"

:: 3. Start React Frontend (Port 3000 / 5173)
start "React Frontend" cmd /k "cd /d C:\Users\ayman\Desktop\Personel\project\creator-studio-ai\frontend && npm run dev"

echo All 3 services are launching in separate windows!