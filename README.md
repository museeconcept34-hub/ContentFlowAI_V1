# 🚀 ContentFlow AI

> İçeriğini **tek tıkla** TikTok / Reels senaryosu, Instagram Carousel ve X (Twitter) Thread'e dönüştür.  
> Powered by **Claude claude-sonnet-4-20250514** · Deployed on **Vercel**

---

## ✨ Özellikler

| Bileşen | Açıklama |
|---|---|
| `AIContentPlanner` | Claude API ile gerçek zamanlı AI dönüşümü |
| `ContentFlowAI` | API gerektirmeyen, kural tabanlı yerel dönüşüm |

---

## 📁 Proje Yapısı

```
contentflow-ai/
├── api/
│   └── chat.js          ← Vercel Serverless — API anahtarını gizler
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx           ← Hangi bileşenin gösterileceğini seçin
│   ├── main.jsx
│   ├── AIContentPlanner.jsx   ← AI destekli versiyon
│   └── ContentFlowAI.jsx      ← Yerel kural tabanlı versiyon
├── .env.example          ← API anahtarı şablonu
├── .gitignore
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

---

## ⚡ Vercel'e Tek Tıkla Deploy

### Adım 1 — GitHub'a yükle

```bash
git init
git add .
git commit -m "feat: ContentFlow AI ilk commit"
# GitHub'da yeni bir repo oluşturun, ardından:
git remote add origin https://github.com/KULLANICI/contentflow-ai.git
git push -u origin main
```

### Adım 2 — Vercel'e bağla

1. [vercel.com/new](https://vercel.com/new) adresine gidin
2. **"Import Git Repository"** → az önce oluşturduğunuz repo'yu seçin
3. Framework: **Vite** (otomatik algılanır)
4. **"Deploy"** butonuna tıklayın — ilk deploy başlar

### Adım 3 — API Anahtarını Ekle (Kritik!)

Deploy tamamlandıktan sonra:

1. Vercel Dashboard → Projeniz → **Settings** → **Environment Variables**
2. Yeni değişken ekleyin:

| Name | Value |
|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxxxxxxxxx` |

3. **"Save"** → ardından **Deployments** sekmesinden **"Redeploy"** yapın

> 🔑 API anahtarınızı [console.anthropic.com](https://console.anthropic.com) adresinden alabilirsiniz.

---

## 💻 Yerel Geliştirme

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. .env dosyasını oluştur
cp .env.example .env.local
# .env.local dosyasını düzenleyip ANTHROPIC_API_KEY değerini girin

# 3. Geliştirme sunucusunu başlat
npm run dev
# → http://localhost:5173 adresinde açılır
```

---

## 🔄 Bileşen Seçimi

`src/App.jsx` dosyasını açın ve kullanmak istediğiniz bileşeni import edin:

```jsx
// AI destekli versiyon (API anahtarı gerektirir):
import App from "./AIContentPlanner";

// Yerel kural tabanlı versiyon (API gerektirmez):
import App from "./ContentFlowAI";
```

---

## 🔒 Güvenlik Notları

- `api/chat.js` → Anthropic API anahtarı **yalnızca sunucu tarafında** kullanılır, istemciye asla gönderilmez
- `.env.local` dosyası `.gitignore` ile Git'ten hariç tutulmuştur
- Vercel üzerindeki ortam değişkenleri şifreli olarak saklanır

---

## 🛠 Teknik Stack

- **React 18** + **Vite 5**
- **lucide-react** — ikonlar
- **Vercel Serverless Functions** — güvenli API proxy
- **Anthropic Claude claude-sonnet-4-20250514** — içerik dönüşümü

---

## 📝 Sık Sorulan Sorular

**Deploy sonrası uygulama çalışıyor ama AI dönüşümü hata veriyor?**  
→ `ANTHROPIC_API_KEY` ortam değişkenini eklemeyi ve Redeploy yapmayı unutmuş olabilirsiniz.

**Ücretsiz Vercel planıyla çalışır mı?**  
→ Evet, Vercel'in ücretsiz planı bu proje için yeterlidir.

**Özel domain ekleyebilir miyim?**  
→ Vercel Dashboard → Settings → Domains bölümünden ekleyebilirsiniz.

---

*ContentFlow AI © 2025 — Powered by Claude*
