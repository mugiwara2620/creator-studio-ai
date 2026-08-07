package com.studio.creator.controller;

import com.studio.creator.dto.ScriptRequest;
import com.studio.creator.dto.ScriptResponse;
import com.studio.creator.service.ScriptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/scripts")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ScriptController {

    private final ScriptService scriptService;

    /**
     * Triggers AI script generation via FastAPI and saves the result to PostgreSQL.
     */
    @PostMapping("/generate")
    public ResponseEntity<ScriptResponse> generateScript(@Valid @RequestBody ScriptRequest request) {
        ScriptResponse response = scriptService.generateAndSaveScript(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Retrieves all saved scripts from PostgreSQL.
     */
    @GetMapping
    public ResponseEntity<List<ScriptResponse>> getAllScripts() {
        return ResponseEntity.ok(scriptService.getAllScripts());
    }

    /**
     * Retrieves a single script by its primary key ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ScriptResponse> getScriptById(@PathVariable Long id) {
        return ResponseEntity.ok(scriptService.getScriptById(id));
    }
}
