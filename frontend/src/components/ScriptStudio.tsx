import React, { useState } from 'react';
import { ScriptRequest, ScriptResponse } from '../types/scripts';
import { Sparkles, Loader2, Video, MessageSquare, Eye, Copy, Check, Film } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api/v1/scripts';

export const ScriptStudio: React.FC = () => {
    const [formData, setFormData] = useState<ScriptRequest>({
        topic: '',
        targetAudience: 'Developers',
        tone: 'Humorous',
        platform: 'Instagram Reels',
    });

    const [script, setScript] = useState<ScriptResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Server returned status ${response.status}`);
            }

            const data: ScriptResponse = await response.json();
            setScript(data);
        } catch (err: any) {
            setError(err.message || 'Failed to generate script. Please check your backend.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyScript = () => {
        if (!script) return;
        const fullText = `TITLE: ${script.title}\nHOOK: ${script.hook}\n\nBODY:\n` +
            script.body.map(s => `[${s.timestamp}] Spoken: ${s.spoken_text} | Visual: ${s.visual_description}`).join('\n') +
            `\n\nCTA: ${script.call_to_action}\nHASHTAGS: ${script.suggested_hashtags.join(' ')}`;

        navigator.clipboard.writeText(fullText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
            <header className="max-w-7xl mx-auto mb-8 flex items-center gap-3 border-b border-slate-800 pb-5">
                <Film className="w-8 h-8 text-indigo-500" />
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Creator Studio AI
                    </h1>
                    <p className="text-xs text-slate-400">Generate structured video scripts with local AI</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Input Form */}
                <section className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-5 text-slate-200">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        Script Parameters
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Topic / Idea</label>
                            <input
                                type="text"
                                name="topic"
                                required
                                placeholder="e.g. Calisthenics Routine for Coders"
                                value={formData.topic}
                                onChange={handleInputChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Target Audience</label>
                            <input
                                type="text"
                                name="targetAudience"
                                required
                                placeholder="e.g. Software Engineers"
                                value={formData.targetAudience}
                                onChange={handleInputChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Tone</label>
                                <select
                                    name="tone"
                                    value={formData.tone}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                                >
                                    <option value="Humorous">Humorous</option>
                                    <option value="Educational">Educational</option>
                                    <option value="Energetic">Energetic</option>
                                    <option value="Inspiring">Inspiring</option>
                                    <option value="Serious">Serious</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Platform</label>
                                <select
                                    name="platform"
                                    value={formData.platform}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                                >
                                    <option value="Instagram Reels">Instagram Reels</option>
                                    <option value="TikTok">TikTok</option>
                                    <option value="YouTube Shorts">YouTube Shorts</option>
                                    <option value="Longform YouTube">Longform YouTube</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating Script...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Generate Script
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 bg-red-950/50 border border-red-800 rounded-lg text-red-300 text-xs">
                            {error}
                        </div>
                    )}
                </section>

                {/* RIGHT COLUMN: Timeline & Teleprompter Viewer */}

                <section className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                    {loading ? <div> loading...</div> :
                        script ? (
                            <div className="space-y-6">
                                {/* Header Info */}
                                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                                    <div>
                                        <span className="inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 rounded-md mb-2">
                                            {script.platform} • {script.tone}
                                        </span>
                                        <h2 className="text-xl font-bold text-slate-100">{script.title}</h2>
                                    </div>
                                    <button
                                        onClick={handleCopyScript}
                                        className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-1.5 text-xs transition-colors"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied' : 'Copy All'}
                                    </button>
                                </div>

                                {/* Hook */}
                                <div className="bg-slate-950/80 border-l-4 border-indigo-500 p-4 rounded-r-xl">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">Hook</span>
                                    <p className="text-sm font-medium text-slate-200 mt-1">{script.hook}</p>
                                </div>

                                {/* Timeline Segments */}
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                                        Timeline Segments ({script.body?.length || 0})
                                    </h3>

                                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                                        {script.body?.map((segment, index) => (
                                            <div
                                                key={index}
                                                className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row gap-3 items-start hover:border-slate-700 transition-colors"
                                            >
                                                <span className="bg-slate-800 text-indigo-300 font-mono text-xs px-2.5 py-1 rounded-md shrink-0">
                                                    {segment.timestamp}
                                                </span>

                                                <div className="space-y-2 flex-1 text-xs">
                                                    {segment.spoken_text && (
                                                        <div className="flex items-start gap-2">
                                                            <MessageSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                                            <p className="text-slate-200 leading-relaxed font-normal">
                                                                {segment.spoken_text}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {segment.visual_description && (
                                                        <div className="flex items-start gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-slate-400">
                                                            <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                                            <p className="italic leading-relaxed">{segment.visual_description}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Call To Action & Hashtags */}
                                <div className="pt-4 border-t border-slate-800 space-y-3">
                                    {script.call_to_action && (
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-slate-400">Call To Action</span>
                                            <p className="text-xs text-indigo-300 mt-0.5">{script.call_to_action}</p>
                                        </div>
                                    )}

                                    {script.suggested_hashtags && script.suggested_hashtags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {script.suggested_hashtags.map((tag, i) => (
                                                <span key={i} className="text-[11px] text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                                                    {tag.startsWith('#') ? tag : `#${tag}`}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500 space-y-3 text-center">
                                <Video className="w-12 h-12 stroke-[1.2] text-slate-700" />
                                <div>
                                    <p className="text-sm font-medium text-slate-400">No script generated yet</p>
                                    <p className="text-xs">Fill in the parameters on the left and hit Generate.</p>
                                </div>
                            </div>
                        )}
                </section>

            </main>
        </div>
    );
};