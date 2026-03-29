import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Download, Loader2, Video, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import { generateWarVideo, checkVideoStatus, fetchVideoBlob, VideoGenerationState } from '../services/VideoService';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const VIDEO_PARTS = [
  { id: 'general', part: 'Strategic Brief: GCC Crisis', prompt: 'A cinematic strategic brief video. It starts with a glowing map of the Gulf (Riyadh, Dubai, Abu Dhabi). It transitions to military icons turning into crowded hotels with a "45,000 Personnel" counter. A split screen shows a C-17 transport plane vs a digital hotel check-in. It ends with a falling tourism graph over the Dubai skyline and a red alert over the Vision 2030 logo. Dark corporate geopolitical aesthetic.' },
  { id: 'humanitarian', part: 'Humanitarian Cost', prompt: 'A somber, data-driven cinematic visualization of the humanitarian crisis. The camera pans over a vast landscape of displacement camps, with translucent digital counters floating in the air showing "51,847 Lives Lost" and "4.2M Displaced". The lighting is cold and atmospheric, emphasizing the scale of the human cost.' },
  { id: 'economic', part: 'Economic Impact', prompt: 'A high-stakes financial visualization of the Middle East economic shock. A digital map of the Strait of Hormuz is shown with glowing red shipping lanes. A large holographic graph in the foreground shows oil prices spiking to $114/barrel, while the Saudi Vision 2030 logo appears partially obscured by a digital "Risk" overlay.' },
  { id: 'infrastructure', part: 'Infrastructure Damage', prompt: 'A cinematic aerial timelapse of a city undergoing destruction. We see modern hospitals and school buildings being hit by digital glitches and transforming into ruins, with a counter showing "131,000 Structures Destroyed". The visual style is a mix of realistic drone footage and holographic data overlays.' }
];

export default function VideoGallery() {
  const [hasKey, setHasKey] = useState(false);
  const [videos, setVideos] = useState<VideoGenerationState[]>(
    VIDEO_PARTS.map(p => ({ ...p, status: 'idle' }))
  );
  const [isCheckingKey, setIsCheckingKey] = useState(true);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    try {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } catch (e) {
      console.error("Key check failed", e);
    } finally {
      setIsCheckingKey(false);
    }
  };

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    setHasKey(true); // Assume success as per guidelines
  };

  const startGeneration = async (id: string) => {
    const video = videos.find(v => v.id === id);
    if (!video || video.status === 'generating') return;

    setVideos(prev => prev.map(v => v.id === id ? { ...v, status: 'generating' } : v));

    try {
      const op = await generateWarVideo(video.prompt);
      const opName = (op as any).name;
      setVideos(prev => prev.map(v => v.id === id ? { ...v, operationId: opName } : v));
      if (opName) pollStatus(id, opName);
    } catch (error: any) {
      console.error("Generation error:", error);
      if (error.message?.includes("Requested entity was not found")) {
        setHasKey(false);
      }
      setVideos(prev => prev.map(v => v.id === id ? { ...v, status: 'error' } : v));
    }
  };

  const pollStatus = async (videoId: string, opId: string) => {
    const interval = setInterval(async () => {
      try {
        const op = await checkVideoStatus(opId);
        if (op.done) {
          clearInterval(interval);
          const uri = op.response?.generatedVideos?.[0]?.video?.uri;
          setVideos(prev => prev.map(v => v.id === videoId ? { 
            ...v, 
            status: 'done', 
            url: uri 
          } : v));
        }
      } catch (error) {
        console.error("Polling error:", error);
        clearInterval(interval);
        setVideos(prev => prev.map(v => v.id === videoId ? { ...v, status: 'error' } : v));
      }
    }, 10000);
  };

  const downloadVideo = async (url: string, filename: string) => {
    try {
      const blob = await fetchVideoBlob(url);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${filename}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  if (isCheckingKey) return null;

  return (
    <section id="visuals" className="px-6 md:px-10 py-20 border-b border-border bg-bg-secondary/30">
      <div className="flex items-center gap-4 mb-6 font-mono text-[10px] font-bold tracking-[0.15em] text-ink-tertiary">
        CINEMATIC VISUALIZATIONS (VEO 3.1)
        <div className="flex-1 h-px bg-border" />
      </div>

      {!hasKey ? (
        <div className="bg-bg border border-border p-10 rounded-xl text-center max-w-2xl mx-auto">
          <Key className="mx-auto mb-4 text-accent" size={32} />
          <h3 className="font-display text-2xl font-bold mb-4">Video Generation Requires a Paid API Key</h3>
          <p className="text-ink-secondary text-sm mb-8 leading-relaxed">
            To generate high-quality cinematic representations using Veo 3.1, you must select a paid Google Cloud API key. 
            Video generation can take several minutes and incurs costs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleSelectKey}
              className="bg-accent text-bg font-mono text-xs font-bold tracking-wider px-8 py-3 rounded-sm hover:opacity-80 transition-opacity"
            >
              Select API Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="text-ink-tertiary font-mono text-[10px] hover:text-ink transition-colors"
            >
              Learn about billing ↗
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((v) => (
            <div key={v.id} className="bg-bg border border-border rounded-xl overflow-hidden flex flex-col">
              <div className="aspect-video bg-bg-tertiary relative flex items-center justify-center group">
                {v.status === 'done' && v.url ? (
                  <video 
                    src={v.url} 
                    className="w-full h-full object-cover" 
                    controls 
                    poster={`https://picsum.photos/seed/${v.id}/1280/720`}
                  />
                ) : (
                  <div className="text-center p-8">
                    {v.status === 'generating' ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-accent" size={40} />
                        <div className="font-mono text-[10px] text-accent animate-pulse uppercase tracking-widest">
                          Generating Cinematic Sequence...
                        </div>
                        <p className="text-[11px] text-ink-tertiary max-w-[200px]">
                          This usually takes 2-5 minutes. Feel free to explore the ledger while you wait.
                        </p>
                      </div>
                    ) : v.status === 'error' ? (
                      <div className="flex flex-col items-center gap-2 text-accent-danger">
                        <AlertCircle size={32} />
                        <div className="font-mono text-[10px] uppercase">Generation Failed</div>
                        <button onClick={() => startGeneration(v.id)} className="text-[11px] underline mt-2">Try Again</button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <Video className="text-ink-tertiary opacity-20" size={48} />
                        <button 
                          onClick={() => startGeneration(v.id)}
                          className="bg-bg-tertiary border border-border text-ink font-mono text-[10px] font-bold tracking-widest px-6 py-2 hover:bg-accent hover:text-bg hover:border-accent transition-all"
                        >
                          GENERATE VISUAL
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-display font-bold text-lg">{v.part}</div>
                  {v.status === 'done' && (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-accent font-bold uppercase tracking-widest">Ready</span>
                      <CheckCircle2 size={14} className="text-accent" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed italic opacity-60 mb-4">
                  "{v.prompt}"
                </p>
                {v.status === 'done' && v.url && (
                  <button 
                    onClick={() => v.url && downloadVideo(v.url, v.id)}
                    className="mt-auto w-full flex items-center justify-center gap-2 bg-bg-tertiary border border-accent/30 text-accent font-mono text-[10px] font-bold tracking-widest py-3 hover:bg-accent hover:text-bg transition-all group"
                  >
                    <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                    DOWNLOAD MP4
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
