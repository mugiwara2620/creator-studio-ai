import { useState, useRef } from 'react';
import { jsonrepair } from 'jsonrepair';

export const useScriptStream = () => {
    const [rawText, setRawText] = useState('');
    const [parsedScript, setParsedScript] = useState(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    const generateStream = async (requestData) => {
        setRawText('');
        setParsedScript(null);
        setError(null);
        setIsStreaming(true);

        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch('http://localhost:8080/api/v1/scripts/generate/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let accumulatedBuffer = '';
            let accumulatedRawText = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                accumulatedBuffer += decoder.decode(value, { stream: true });
                const lines = accumulatedBuffer.split('\n\n');
                accumulatedBuffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const dataStr = line.replace(/^data:\s*/, '').trim();

                        if (dataStr === '[DONE]') {
                            setIsStreaming(false);
                            return;
                        }

                        let extractedToken = '';
                        try {
                            const parsedTokenObj = JSON.parse(dataStr);
                            extractedToken = parsedTokenObj.token || '';
                        } catch {
                            extractedToken = dataStr;
                        }

                        if (extractedToken) {
                            accumulatedRawText += extractedToken;
                            setRawText(accumulatedRawText);

                            // Attempt real-time partial JSON repair & update UI
                            try {
                                const repairedJson = jsonrepair(accumulatedRawText);
                                const parsed = JSON.parse(repairedJson);
                                setParsedScript(parsed);
                            } catch {
                                // Ignore temporary syntax errors during chunk arrival
                            }
                        }
                    }
                }
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('Stream aborted by user.');
            } else {
                console.error('Streaming error:', err);
                setError(err.message);
            }
        } finally {
            setIsStreaming(false);
        }
    };

    const stopStream = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsStreaming(false);
        }
    };

    return { rawText, parsedScript, isStreaming, error, generateStream, stopStream };
};