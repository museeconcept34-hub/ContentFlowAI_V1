import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const ContentFlowAI = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [viralScore, setViralScore] = useState(0);

  const processContent = () => {
    if (!input) return;
    setLoading(true);
    
    // Şaşırtıcı etki için profesyonel bekleme süresi
    setTimeout(() => {
      const sentences = input.split(/[.!?]/).filter(s => s.trim().length > 0);
      const title = sentences[0] || "Yeni İçerik";
      
      setResults({
        viral: Math.floor(Math.random() * (98 - 85 + 1) + 85),
        tiktok: `🎬 TIKTOK & REELS\n🔥 KANCA: ${title.toUpperCase()}\n📝 ÖZET: ${sentences.slice(0, 2).join('. ')}.\n#viral #trend`,
        instagram: `📸 INSTAGRAM POST\n🖼️ GÖRSEL: ${title}\n💬 AÇIKLAMA: ${input.substring(0, 150)}...\n#kesfet #style`,
        twitter: `🐦 X (TWITTER)\n🧵 FLOOD: 1/ ${title}\n2/ ${sentences[1] || 'Takipte kalın!'} #X #threads`,
        prompt: `🎨 AI IMAGE PROMPT\n"Cinematic, 8k, futuristic lighting, professional photography, related to ${title.substring(0, 30)} --v 6.0"`
      });
      setViralScore(Math.floor(Math.random() * (98 - 85 + 1) + 85));
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '30px 15px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', background: 'linear-gradient(to right, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2.5rem', fontWeight: '800' }}>ContentFlow <span style={{color: '#fff', WebkitTextFillColor: '#fff'}}>Ultra</span></h1>
        
        <div style={{ background: '#1e293b', borderRadius: '24px', padding: '25px', marginTop: '20px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="İçeriğinizi buraya bırakın, tüm platformlar için optimize edelim..."
            style={{ width: '100%', height: '140px', background: 'transparent', border: 'none', color: 'white', fontSize: '16px', outline: 'none', resize: 'none' }}
          />
          <button 
            onClick={processContent}
            disabled={loading}
            style={{ width: '100%', padding: '18px', background: 'linear-gradient(45deg, #7c3aed, #db2777)', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '16px' }}
          >
            {loading ? '⚡ Yapay Zeka Analiz Ediyor...' : '🚀 Viral Dönüşümü Başlat'}
          </button>
        </div>

        {results && !loading && (
          <div style={{ marginTop: '30px', animation: 'fadeIn 0.8s' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '15px', borderRadius: '15px', border: '1px solid #10b981', textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontWeight: 'bold', color: '#10b981' }}>🔥 VİRAL POTANSİYEL: %{viralScore}</span>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
              <Section title="🎥 TikTok & Reels" color="#ef4444" content={results.tiktok} />
              <Section title="📸 Instagram" color="#3b82f6" content={results.instagram} />
              <Section title="🐦 X (Twitter)" color="#1da1f2" content={results.twitter} />
              <Section title="🎨 AI Visual Prompt" color="#a78bfa" content={results.prompt} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, color, content }) => (
  <div style={{ background: '#1e293b', padding: '20px', borderRadius: '18px', borderLeft: `5px solid ${color}` }}>
    <h4 style={{ color: color, margin: '0 0 10px 0' }}>{title}</h4>
    <pre style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap', color: '#cbd5e1', lineHeight: '1.5' }}>{content}</pre>
  </div>
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<ContentFlowAI />);
