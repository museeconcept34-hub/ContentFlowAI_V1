import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const ContentFlow = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState({ tiktok: '', instagram: '', x: '' });

  const handleConvert = () => {
    // Basit bölme mantığı (Yapay zeka anahtarı gerektirmez)
    setOutput({
      tiktok: "🎥 TikTok/Reels Özeti:\n\n" + input.substring(0, 200) + "...",
      instagram: "📸 Instagram İçeriği:\n\n" + input.substring(0, 150) + "\n\n#içerik #ai",
      x: "🐦 X (Twitter) Postu:\n\n" + input.substring(0, 100)
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <h1>ContentFlow AI - Çalışıyor! 🚀</h1>
      <textarea 
        style={{ width: '100%', height: '150px', borderRadius: '8px', padding: '10px', color: 'black' }}
        placeholder="Metninizi buraya yapıştırın..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button 
        onClick={handleConvert}
        style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#7c3aed', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer' }}
      >
        İçeriği Dönüştür
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
          <h3>TikTok/Reels</h3>
          <p>{output.tiktok}</p>
        </div>
      </div>
    </div>
  );
};

// Uygulamayı başlatan kısım
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<ContentFlow />);
