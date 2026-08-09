import React, { useState } from 'react';
import { useScriptStream } from '../hooks/useScriptStream';

export const ScriptGenerator = () => {
    const [topic, setTopic] = useState('Moroccan Baghrir Hack');
    const [platform, setPlatform] = useState('Reels');
    const [tone, setTone] = useState('Energetic & Engaging');
    const [targetAudience, setTargetAudience] = useState('Foodies & Home Cooks');
    const [activeTab, setActiveTab] = useState('formatted'); // 'formatted' | 'raw'
    const [copied, setCopied] = useState(false);

    const { rawText, parsedScript, isStreaming, error, generateStream, stopStream } = useScriptStream();

    const handleSubmit = (e) => {
        e.preventDefault();
        generateStream({
            topic,
            platform,
            tone,
            target_audience: targetAudience,
        });
    };

    const getFormattedPlainText = () => {
        if (!parsedScript) return '';
        const script = normalizeScript(parsedScript);
        let text = `TITLE: ${script.title || ''}\n`;
        text += `HOOK: ${script.hook || ''}\n\n`;
        text += `BODY:\n`;

        if (Array.isArray(script.body)) {
            script.body.forEach((scene) => {
                text += `[${scene.timestamp || '00:00'}] Spoken: ${scene.spoken || ''} | Visual: ${scene.visual || ''}\n`;
            });
        }

        text += `\nCTA: ${script.cta || ''}\n`;

        const hashtags = Array.isArray(script.hashtags)
            ? script.hashtags.join(' ')
            : script.hashtags || '';

        text += `HASHTAGS: ${hashtags}`;
        return text;
    };

    const handleCopy = () => {
        const textToCopy = getFormattedPlainText();
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const normalizeScript = (raw) => {
        if (!raw) return null;

        // Handle body scenes even if $defs wrapper is present
        const cleanBody = Array.isArray(raw.body)
            ? raw.body.map((item) => {
                // Extract from nested $defs.VisualCue.properties if hallucinated
                const props = item?.$defs?.VisualCue?.properties || item;
                return {
                    timestamp: props.timestamp || item.timestamp || '00:00',
                    spoken: props.spoken_text || props.spoken || item.spoken || item.body || '',
                    visual: props.visual_description || props.visual || item.visual || '',
                };
            })
            : [];

        return {
            title: raw.title || '',
            hook: raw.hook || '',
            body: cleanBody,
            cta: raw.cta || raw.call_to_action || '',
            hashtags: raw.hashtags || raw.suggested_hashtags || [],
        };
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="border-b border-slate-800 pb-4">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                        AI Short-Form Script Generator
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Generates real-time SSE structured scripts powered by Ollama & Spring Boot.
                    </p>
                </div>

                {/* Form Controls */}
                <form onSubmit={handleSubmit} className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">TOPIC</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">TARGET AUDIENCE</label>
                            <input
                                type="text"
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">PLATFORM</label>
                            <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="TikTok">TikTok</option>
                                <option value="Reels">Instagram Reels</option>
                                <option value="YouTube Shorts">YouTube Shorts</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">TONE</label>
                            <input
                                type="text"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isStreaming}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isStreaming ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                                    Generating Script...
                                </>
                            ) : (
                                'Generate Script'
                            )}
                        </button>

                        {isStreaming && (
                            <button
                                type="button"
                                onClick={stopStream}
                                className="px-5 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-medium rounded-lg text-sm transition"
                            >
                                Stop Generation
                            </button>
                        )}
                    </div>
                </form>

                {error && (
                    <div className="p-4 bg-red-950/50 border border-red-500/50 text-red-300 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {/* Output Container */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

                    {/* View Controls & Copy Bar */}
                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-900/50">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('formatted')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${activeTab === 'formatted'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                Formatted Output
                            </button>
                            <button
                                onClick={() => setActiveTab('raw')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${activeTab === 'raw'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                Raw JSON Stream
                            </button>
                        </div>

                        {parsedScript && activeTab === 'formatted' && (
                            <button
                                onClick={handleCopy}
                                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition"
                            >
                                {copied ? 'Copied to Clipboard!' : 'Copy Formatted Text'}
                            </button>
                        )}
                    </div>

                    {/* View Content */}
                    <div className="p-6 font-mono text-sm leading-relaxed min-h-[400px]">
                        {activeTab === 'formatted' ? (
                            parsedScript ? (
                                <div className="space-y-5">
                                    {/* Title */}
                                    {parsedScript.title && (
                                        <div>
                                            <span className="font-bold text-yellow-400">TITLE: </span>
                                            <span className="text-slate-200">{parsedScript.title}</span>
                                        </div>
                                    )}

                                    {/* Hook */}
                                    {parsedScript.hook && (
                                        <div>
                                            <span className="font-bold text-red-400">HOOK: </span>
                                            <span className="text-slate-200">{parsedScript.hook}</span>
                                        </div>
                                    )}

                                    {/* Body */}
                                    {Array.isArray(parsedScript.body) && parsedScript.body.length > 0 && (
                                        <div>
                                            <span className="font-bold text-blue-400">BODY:</span>
                                            <div className="mt-2 space-y-2">
                                                {parsedScript.body.map((scene, idx) => (
                                                    <div key={idx} className="text-slate-300">
                                                        <span className="text-slate-400">[{scene.timestamp || '00:00'}]</span>{' '}
                                                        <span className="font-semibold text-emerald-400">Spoken:</span> {scene.spoken || ''} |{' '}
                                                        <span className="font-semibold text-purple-400">Visual:</span> {scene.visual || ''}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* CTA */}
                                    {parsedScript.cta && (
                                        <div>
                                            <span className="font-bold text-green-400">CTA: </span>
                                            <span className="text-slate-200">{parsedScript.cta}</span>
                                        </div>
                                    )}

                                    {/* Hashtags */}
                                    {parsedScript.hashtags && (
                                        <div>
                                            <span className="font-bold text-cyan-400">HASHTAGS: </span>
                                            <span className="text-cyan-200">
                                                {Array.isArray(parsedScript.hashtags)
                                                    ? parsedScript.hashtags.join(' ')
                                                    : parsedScript.hashtags}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-slate-500 italic">
                                    {isStreaming ? 'Connecting to AI model...' : 'Generated script will render live here...'}
                                </div>
                            )
                        ) : (
                            /* Raw JSON View */
                            <pre className="text-green-400 whitespace-pre-wrap break-all">
                                {rawText || (isStreaming ? 'Receiving token stream...' : 'Raw SSE stream output will appear here...')}
                            </pre>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};