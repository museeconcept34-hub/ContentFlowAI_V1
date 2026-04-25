import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const ContentFlowAI = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const processContent = () => {
    if (!input) return;
    setLoading(true);
    
    setTimeout(() => {
      const sentences = input.split(/[.!?]/).filter(s => s.trim().length > 0);
      const title = sentences[0] || "Yeni İçerik";
      
      setResults({
        hook: sentences[0]?.toUpperCase() || "BUNU MUTLAKA İZLEYİN!",
        voiceover: `🎙️ SESLENDİRME METNİ:\n\n"Hey! ${sentences[0]}. Peki ${sentences[1] || 'bunu biliyor muydunuz?'} İşte detaylar: ${input.substring(0, 150)}..."`,
        scenes: `🎬 VİDEO KURGU PLANI:\n\n1. SAHNE: (0-3sn) Ekranda "${title}" yazısı yanıp sönsün.\n2. SAHNE: (3-10sn) Konuyla ilgili hızlı stok görüntüler.\n3. SAHNE: (10-15sn) Alt yazı: "Takip etmeyi unutma!"`,
        prompt: `🎨 AI GÖRSEL KOMUTU:\n\n"Hyper-realistic cinematic scene, futuristic style, related to ${title.substring(0, 20)}, 8k, neon lighting --v 6.0"`
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '30px 15px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', background: 'linear-gradient(to right, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2.5rem' }}>ContentFlow <span style={{color: '#fff', WebkitTextFillColor: '#fff'}}>Shorts</span></h1>
        
        <div style={{ background: '#1e293b', borderRadius: '20px', padding: '20px', marginTop: '20px', border: '1px solid #334155' }}>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Senaryonuzu buraya bırakın..."
            style={{ width: '100%', height: '120px', background: 'transparent', border: 'none', color: 'white', fontSize: '16px', outline: 'none', resize: 'none' }}
          />
          <button 
            onClick={processContent}
            disabled={loading}
            style={{ width: '100%', padding: '15px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
          >
            {loading ? '⚡ Video Stratejisi Hazırlanıyor...' : '🚀 Viral Videoya Dönüştür'}
          </button>
        </div>

        {results && !loading && (
          <div style={{ marginTop: '20px', animation: 'fadeIn 0.5s' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #ef4444', marginBottom: '10px' }}>
              <h4 style={{ color: '#ef4444', margin: '0 0 5px 0' }}>🔥 VİRAL KANCA (Hook)</h4>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{results.hook}</p>
            </div>
            <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
              <h4 style={{ color: '#a78bfa', margin: '0 0 5px 0' }}>🎙️ SESLENDİRME (Script)</h4>
              <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{results.voiceover}</p>
            </div>
            <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px' }}>
              <h4 style={{ color: '#3b82f6', margin: '0 0 5px 0' }}>🎬 KURGU PLANI</h4>
              <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{results.scenes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<ContentFlowAI />);
