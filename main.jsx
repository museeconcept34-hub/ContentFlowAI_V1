import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const ContentFlowAI = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);

  const processContent = () => {
    if (!input) return;
    
    // ÜCRETSİZ ZEKÂ MANTIĞI: Metni analiz et ve parçala
    const sentences = input.split(/[.!?]/).filter(s => s.trim().length > 0);
    const title = sentences[0] || "Yeni İçerik";
    const hook = sentences[1] || "Bunu sonuna kadar izleyin!";
    
    setResults({
      tiktok: `🎬 TIKTOK / REELS PLANI\n\n📌 KANCA: ${hook.toUpperCase()}\n\n📝 ÖZET: ${sentences.slice(0, 3).join('. ')}.\n\n💡 İPUCU: Videoda görsel olarak içeriği destekleyen stok videolar kullan.\n\n#içeriküretimi #viral #yapayzeka`,
      instagram: `📸 INSTAGRAM POST\n\n🖼️ GÖRSEL: ${title}\n\n💬 AÇIKLAMA: ${input.substring(0, 150)}...\n\n👉 Devamı için takipte kal!\n\n#kesfet #instagramtips`,
      x: `🐦 X (TWITTER) FLOOD\n\n1/ ${title}\n\n2/ ${sentences[2] || 'Daha fazla bilgi profilimdeki linkte!'} #twitter #threads`
    });
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#a78bfa', marginBottom: '10px' }}>✨ ContentFlow AI Pro</h1>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8', marginBottom: '30px' }}>İçeriğinizi saniyeler içinde platformlara dönüştürün.</p>
        
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="İçeriğinizi buraya yapıştırın (Örn: Bir hikaye veya makale)..."
            style={{ width: '100%', height: '150px', backgroundColor: '#334155', border: 'none', borderRadius: '12px', padding: '15px', color: 'white', fontSize: '16px', marginBottom: '15px', outline: 'none' }}
          />
          <button 
            onClick={processContent}
            style={{ width: '100%', padding: '15px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
          >
            🚀 İçeriği Akıllı Dönüştür
          </button>
        </div>

        {results && (
          <div style={{ marginTop: '30px' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '16px', marginBottom: '15px', borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ color: '#ef4444', marginTop: 0 }}>🎥 TikTok & Reels</h3>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6' }}>{results.tiktok}</pre>
            </div>
            <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '16px', marginBottom: '15px', borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ color: '#3b82f6', marginTop: 0 }}>📸 Instagram</h3>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>{results.instagram}</pre>
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
