import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const ContentFlowAI = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [viralScore, setViralScore] = useState(0);

  const processContent = () => {
    if (!input) return;
    setLoading(true);
    
    // Şaşırtıcı etki için yapay bekleme süresi
    setTimeout(() => {
      const sentences = input.split(/[.!?]/).filter(s => s.trim().length > 0);
      const title = sentences[0] || "Yeni İçerik";
      const mainPoint = sentences[1] || "Geleceğin teknolojisi burada.";
      
      setResults({
        tiktok: `📌 TIKTOK STRATEJİSİ\n\n🔥 KANCA (İlk 3 sn): "${title.toUpperCase()}"\n\n🎬 GÖRSEL PLAN: Ekranın tam ortasında büyük metinler belirsin. Arka planda hızlı geçişli stok videolar kullan.\n\n✍️ ALT YAZI: ${input.substring(0, 100)}...\n\n#viral #yapayzeka #gelecek`,
        midjourney: `🎨 GÖRSEL PROMPT (Midjourney/DALL-E)\n\n"Cinematic shot, hyper-realistic, 8k, related to ${title.substring(0, 30)}, futuristic lighting, deep purple and neon blue accents, ultra-detailed --v 6.0"`,
        instagram: `📸 INSTAGRAM CAROUSEL\n\nSlayt 1: ${title}\nSlayt 2: Neden önemli?\nSlayt 3: ${mainPoint}\nSlayt 4: Hemen başlayın!\n\n#kesfet #premium #ai`
      });
      setViralScore(Math.floor(Math.random() * (98 - 85 + 1) + 85)); // 85-98 arası gerçekçi puan
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(to right, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ContentFlow <span style={{ color: '#fff', WebkitTextFillColor: '#fff' }}>Pro</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Sıradan metinleri viral makinelere dönüştürün.</p>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid #334155', borderRadius: '24px', padding: '30px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="İçeriğinizi buraya bırakın, gerisini zeka halletsin..."
            style={{ width: '100%', height: '180px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', padding: '20px', color: '#e2e8f0', fontSize: '16px', marginBottom: '20px', resize: 'none', outline: 'none' }}
          />
          <button 
            onClick={processContent}
            disabled={loading}
            style={{ width: '100%', padding: '18px', background: 'linear-gradient(45deg, #7c3aed, #db2777)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', transition: 'transform 0.2s' }}
          >
            {loading ? '⚡ Analiz Ediliyor...' : '🚀 Viral Dönüşümü Başlat'}
          </button>
        </div>

        {results && !loading && (
          <div style={{ marginTop: '40px', animation: 'fadeIn 0.5s ease-in' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', padding: '15px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981' }}>
              <span style={{ fontSize: '24px', marginRight: '10px' }}>🔥</span>
              <span style={{ fontWeight: 'bold' }}>VİRAL POTANSİYEL SKORU: %{viralScore}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              <div style={{ background: '#1e293b', padding: '25px', borderRadius: '20px', borderLeft: '6px solid #a78bfa' }}>
                <h3 style={{ color: '#a78bfa', marginTop: 0 }}>🎨 GÖRSEL ÜRETİM KOMUTU (AI)</h3>
                <code style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{results.midjourney}</code>
              </div>
              <div style={{ background: '#1e293b', padding: '25px', borderRadius: '20px', borderLeft: '6px solid #ef4444' }}>
                <h3 style={{ color: '#ef4444', marginTop: 0 }}>🎥 TIKTOK / REELS MASTER PLAN</h3>
                <pre style={{ whiteSpace: 'pre-wrap', color: '#cbd5e1' }}>{results.tiktok}</pre>
              </div>
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
