import { useState, useEffect, useCallback } from "react";
import {
  Copy, Zap, Clock, Hash, Check, Video, Twitter,
  Sparkles, FileText, RefreshCw, AlertCircle,
  Layers, ImageIcon, BookOpen, Save, Eye, ChevronRight
} from "lucide-react";

// ═══════════════════════════════════════════════
// MOCK DATA — Psikoloji Temalı Drama Serisi
// ═══════════════════════════════════════════════
const MOCK_DATA = {
  mainContent: `[BÖLÜM 1 — KARANLIK BİLİNÇALTI]

İçerisi loştu. Dr. Ayşe Kaya elindeki dosyayı masaya koydu ve karşısındaki adama baktı. Mert — 34 yaşında, üç yıldır aynı kabusla uyanan, sabah ilk işi sigara içmek olan ama içmediğini sanan biri.

Dr. Ayşe: "Bugün sana bir şey anlatacağım, Mert. Ama önce şunu bil: Beynin seni korumak için bazı anıları siliyor olabilir. Buna 'psikolojik baskılama mekanizması' diyoruz."

Mert başını kaldırdı. Gözlerinde o tanıdık boşluk.

Mert: "Yani... yıllarca olmayan şeyleri mi yaşadım?"

Dr. Ayşe yavaşça: "Hayır. Tam tersi. Çok gerçek şeyler yaşadın. O kadar gerçek ki... beynin onu silmeyi tercih etti. Taşımak için fazla ağırdı."

Uzun bir sessizlik. Dışarıda yağmur başladı.

Mert ellerini yüzüne gömdü.

[PSİKOLOJİ NOTU — Carl Jung & Gölge Arketipi: Her bireyin bastırdığı, kabul etmek istemediği bir 'gölge benliği' vardır. Jung'a göre bu gölgeyi reddetmek yerine entegre etmek — onunla yüzleşmek — tek gerçek iyileşme yoludur. Mert'in hikayesi bu entegrasyon yolculuğudur.]

[VİZYON: Bu sahneyi siyah-beyaz çek. Sadece masadaki lamba sarı ışık versin. Metafor: karanlıkta tek bir gerçek noktası. Arka planda yağmur sesi.]`,
  seriesNo: "Bölüm 1 / 7 — Bilinçaltı Serisi",
  visualNotes: "Loş psikolog ofisi, yağmurlu pencere, düşük kontrast ışık, kitap rafları. Renk: koyu gri + derin mor. Sinematik çekim. Slow-motion yağmur damlaları."
};

// ═══════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════
const TABS = [
  { id: "tiktok", label: "TikTok / Reels", icon: Video, color: "#f43f5e" },
  { id: "carousel", label: "Instagram Carousel", icon: ImageIcon, color: "#a855f7" },
  { id: "twitter", label: "X (Twitter) Flood", icon: Twitter, color: "#38bdf8" },
];

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
const calcReadTime = (text) => {
  if (!text?.trim()) return "0 dk";
  const words = text.trim().split(/\s+/).length;
  return `~${Math.ceil(words / 200)} dk`;
};

function parseTweets(text) {
  if (!text) return [];
  const lines = text.split("\n");
  const tweets = [];
  let cur = "";
  for (const line of lines) {
    if (/^\d+\//.test(line.trim()) && cur.trim()) {
      tweets.push(cur.trim());
      cur = line;
    } else {
      cur += (cur ? "\n" : "") + line;
    }
  }
  if (cur.trim()) tweets.push(cur.trim());
  return tweets.filter((t) => t.trim().length > 0);
}

// ═══════════════════════════════════════════════
// AI API
// ═══════════════════════════════════════════════
const SYSTEM_PROMPTS = {
  tiktok: (seriesNo, visualNotes) => `Sen deneyimli bir sosyal medya içerik stratejistisin. Verilen içeriği TikTok ve Instagram Reels için 60-90 saniyelik güçlü bir video senaryosuna dönüştür. Türkçe yaz.

Kesinlikle şu formatı kullan:
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 HOOK — İlk 3 Saniye
━━━━━━━━━━━━━━━━━━━━━━━━━━
[İzleyiciyi hemen içine çeken, merak uyandıran açılış. 1-2 cümle max.]

━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 ANA HİKAYE — 45-60 Saniye  
━━━━━━━━━━━━━━━━━━━━━━━━━━
[Sahneyi dramatik şekilde anlat. Diyalogları koru. Duraksamaları [PAUSE] ile belirt. Nefes aldır.]

━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 PSİKOLOJİ NOTU — 15 Saniye
━━━━━━━━━━━━━━━━━━━━━━━━━━
[Sahnenin psikolojik arka planını kısaca açıkla. Güçlü, akılda kalıcı.]

━━━━━━━━━━━━━━━━━━━━━━━━━━
📣 CTA — Son 5 Saniye
━━━━━━━━━━━━━━━━━━━━━━━━━━
[Takip, kaydet veya yorum yaptır. "${seriesNo}" bilgisini ekle.]

Görsel Yön: ${visualNotes}`,

  carousel: (seriesNo) => `Sen Instagram carousel uzmanısın. Verilen içeriği 7-8 slaytlık sürükleyici bir carousel formatına dönüştür. Türkçe yaz.

Her slayt için bu formatı kullan:

━━ SLAYT 1 — KAPAK ━━
[Dikkat çekici başlık — max 6 kelime]
[Alt başlık — 1 cümle]

━━ SLAYT 2 ━━
[Güçlü başlık]
[İçerik — 2-3 kısa cümle]

[...devam et, 6-7 slayt arası içerik...]

━━ SON SLAYT — CTA ━━
[Güçlü eylem çağrısı]
[${seriesNo}]
[3 ilgili hashtag]

Her slayt kısa, odaklı ve görsel olarak hayal edilebilir olsun.`,

  twitter: (seriesNo) => `Sen viral X (Twitter) thread yazarısın. Verilen içeriği etkileşim odaklı bir thread formatına dönüştür. Türkçe yaz.

Kurallar:
- Her tweet maksimum 270 karakter
- Format: 1/ ... 2/ ... 3/ ... şeklinde
- İlk tweet: en güçlü hook, merak uyandırsın
- Her tweet bağımsız da anlam taşısın
- 8-12 tweet yaz
- Son tweet: güçlü CTA + "${seriesNo}" + 2-3 hashtag`,
};

async function callAI(content, seriesNo, visualNotes, platform) {
  const systemMap = {
    tiktok: SYSTEM_PROMPTS.tiktok(seriesNo, visualNotes),
    carousel: SYSTEM_PROMPTS.carousel(seriesNo),
    twitter: SYSTEM_PROMPTS.twitter(seriesNo),
  };

  // API anahtarı güvenliği için isteği doğrudan Anthropic'e değil,
  // kendi Vercel serverless fonksiyonumuza (api/chat.js) yönlendiriyoruz.
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system: systemMap[platform],
      messages: [{ role: "user", content: `Bu içeriği dönüştür:\n\n${content}` }],
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content.map((b) => b.text || "").join("\n");
}

// ═══════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════
function Toast({ toast }) {
  if (!toast) return null;
  const isErr = toast.type === "error";
  return (
    <div
      style={{
        position: "fixed", bottom: 28, left: "50%",
        transform: "translateX(-50%)", zIndex: 9999,
        animation: "toastIn 0.3s ease forwards",
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 20px", borderRadius: 14,
          background: isErr ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${isErr ? "rgba(239,68,68,0.35)" : "rgba(34,197,94,0.35)"}`,
          color: isErr ? "#fca5a5" : "#86efac",
          fontSize: 14, fontWeight: 500,
          boxShadow: `0 8px 32px ${isErr ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
          whiteSpace: "nowrap",
        }}
      >
        {isErr ? <AlertCircle size={15} /> : <Check size={15} />}
        {toast.message}
      </div>
    </div>
  );
}

function Badge({ icon: Icon, value, label }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "3px 10px", borderRadius: 999,
        background: "rgba(139,92,246,0.08)",
        border: "1px solid rgba(139,92,246,0.18)",
        color: "#a78bfa", fontSize: 12,
      }}
    >
      <Icon size={11} />
      <span style={{ fontWeight: 600 }}>{value}</span>
      <span style={{ color: "#4b5563" }}>{label}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[85, 100, 70, 90, 60].map((w, i) => (
        <div
          key={i}
          style={{
            height: 14, borderRadius: 6,
            background: "rgba(139,92,246,0.1)",
            width: `${w}%`,
            animation: `skelPulse 1.4s ease ${i * 0.12}s infinite`,
          }}
        />
      ))}
      <div style={{ height: 24 }} />
      {[100, 80, 95, 65].map((w, i) => (
        <div
          key={`b${i}`}
          style={{
            height: 14, borderRadius: 6,
            background: "rgba(139,92,246,0.07)",
            width: `${w}%`,
            animation: `skelPulse 1.4s ease ${0.6 + i * 0.12}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function TweetCard({ text, onCopy, isCopied }) {
  const len = text.length;
  const warn = len > 240 && len <= 270;
  const over = len > 270;
  const borderColor = over
    ? "rgba(239,68,68,0.5)"
    : warn
    ? "rgba(234,179,8,0.45)"
    : "rgba(139,92,246,0.12)";
  const glowColor = over
    ? "rgba(239,68,68,0.08)"
    : warn
    ? "rgba(234,179,8,0.06)"
    : "transparent";

  return (
    <div
      style={{
        background: "rgba(10,15,35,0.65)",
        border: `1px solid ${borderColor}`,
        borderRadius: 12, padding: "12px 14px",
        boxShadow: `0 0 16px ${glowColor}`,
        transition: "border-color 0.2s",
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <p
          style={{
            color: "#cbd5e1", fontSize: 13.5, lineHeight: 1.65,
            margin: 0, flex: 1, whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {text}
        </p>
        <button
          onClick={onCopy}
          style={{
            flexShrink: 0,
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: 8, padding: 6,
            cursor: "pointer", color: "#a78bfa",
            display: "flex", alignItems: "center",
            transition: "all 0.15s",
          }}
        >
          {isCopied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
        <span
          style={{
            fontSize: 11, fontWeight: 600,
            color: over ? "#f87171" : warn ? "#fbbf24" : "#374151",
          }}
        >
          {len}/270 {over ? "⚠ Limit aşıldı!" : warn ? "⚡ Sınıra yakın" : ""}
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        minHeight: 260, gap: 14,
      }}
    >
      <div
        style={{
          width: 64, height: 64, borderRadius: 20,
          background: "rgba(139,92,246,0.08)",
          border: "1px solid rgba(139,92,246,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Sparkles size={28} color="#7c3aed" style={{ opacity: 0.6 }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 4px" }}>
          İçeriğinizi hazırlayın
        </p>
        <p style={{ color: "#374151", fontSize: 13, margin: 0 }}>
          Sol panelde içerik girin, ardından{" "}
          <span style={{ color: "#a78bfa" }}>Dönüştür</span>'e basın
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════
export default function AIContentPlanner() {
  const [mainContent, setMainContent] = useState("");
  const [seriesNo, setSeriesNo] = useState("");
  const [visualNotes, setVisualNotes] = useState("");
  const [activeTab, setActiveTab] = useState("tiktok");
  const [outputs, setOutputs] = useState({ tiktok: "", carousel: "", twitter: "" });
  const [loading, setLoading] = useState(false);
  const [copiedTweet, setCopiedTweet] = useState(null);
  const [copiedFull, setCopiedFull] = useState(null);
  const [toast, setToast] = useState(null);
  const [transformed, setTransformed] = useState(false);
  const [storageOk, setStorageOk] = useState(false);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("acp-v1");
        if (res?.value) {
          const d = JSON.parse(res.value);
          setMainContent(d.mainContent ?? MOCK_DATA.mainContent);
          setSeriesNo(d.seriesNo ?? MOCK_DATA.seriesNo);
          setVisualNotes(d.visualNotes ?? MOCK_DATA.visualNotes);
        } else {
          setMainContent(MOCK_DATA.mainContent);
          setSeriesNo(MOCK_DATA.seriesNo);
          setVisualNotes(MOCK_DATA.visualNotes);
        }
        setStorageOk(true);
      } catch {
        setMainContent(MOCK_DATA.mainContent);
        setSeriesNo(MOCK_DATA.seriesNo);
        setVisualNotes(MOCK_DATA.visualNotes);
      }
    })();
  }, []);

  // Auto-save (debounced)
  useEffect(() => {
    if (!storageOk) return;
    const t = setTimeout(async () => {
      try {
        await window.storage.set(
          "acp-v1",
          JSON.stringify({ mainContent, seriesNo, visualNotes })
        );
      } catch {}
    }, 700);
    return () => clearTimeout(t);
  }, [mainContent, seriesNo, visualNotes, storageOk]);

  const showToast = useCallback((message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleCopyFull = useCallback(async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFull(id);
      setTimeout(() => setCopiedFull(null), 2200);
      showToast("İçerik panoya kopyalandı! ✓", "success");
    } catch {
      showToast("Kopyalama başarısız.", "error");
    }
  }, [showToast]);

  const handleCopyTweet = useCallback(async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTweet(idx);
      setTimeout(() => setCopiedTweet(null), 2000);
      showToast("Tweet kopyalandı!", "success");
    } catch {}
  }, [showToast]);

  const handleTransform = useCallback(async () => {
    if (!mainContent.trim()) {
      showToast("Lütfen dönüştürülecek bir içerik girin!", "error");
      return;
    }
    setLoading(true);
    setTransformed(true);
    setOutputs({ tiktok: "", carousel: "", twitter: "" });

    const [tiktok, carousel, twitter] = await Promise.all(
      ["tiktok", "carousel", "twitter"].map((p) =>
        callAI(mainContent, seriesNo, visualNotes, p).catch(
          () => "⚠ Dönüşüm sırasında bir hata oluştu. Lütfen tekrar deneyin."
        )
      )
    );

    setOutputs({ tiktok, carousel, twitter });
    setLoading(false);
    showToast("İçerik başarıyla dönüştürüldü! ✨", "success");
  }, [mainContent, seriesNo, visualNotes, showToast]);

  // Render right panel content
  const renderOutput = () => {
    if (loading) return <Skeleton />;
    if (!transformed) return <EmptyState />;

    const out = outputs[activeTab];
    if (!out) return <Skeleton />;

    if (activeTab === "twitter") {
      const tweets = parseTweets(out);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {tweets.length > 0
            ? tweets.map((tw, i) => (
                <TweetCard
                  key={i}
                  text={tw}
                  onCopy={() => handleCopyTweet(tw, i)}
                  isCopied={copiedTweet === i}
                />
              ))
            : (
              <pre style={{ color: "#cbd5e1", whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                {out}
              </pre>
            )}
        </div>
      );
    }

    return (
      <div
        style={{
          background: "rgba(8,12,28,0.5)",
          border: "1px solid rgba(139,92,246,0.1)",
          borderRadius: 14, padding: 16,
        }}
      >
        <pre
          style={{
            color: "#cbd5e1", whiteSpace: "pre-wrap",
            fontSize: 13.5, lineHeight: 1.8, margin: 0,
            fontFamily: "inherit",
          }}
        >
          {out}
        </pre>
      </div>
    );
  };

  const curOut = outputs[activeTab] || "";
  const tweets = activeTab === "twitter" ? parseTweets(curOut) : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020617; }

        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes skelPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.3), 0 4px 24px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 32px rgba(139,92,246,0.5), 0 4px 24px rgba(0,0,0,0.5); }
        }

        textarea, input { outline: none; }
        textarea:focus, input:focus {
          border-color: rgba(139,92,246,0.45) !important;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.12) !important;
        }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.25); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.45); }

        .transform-btn:hover:not(:disabled) {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 36px rgba(139,92,246,0.5) !important;
        }
        .transform-btn:active:not(:disabled) { transform: translateY(0) !important; }
        .tab-pill:hover { background: rgba(139,92,246,0.15) !important; }
        .action-btn:hover { background: rgba(139,92,246,0.18) !important; border-color: rgba(139,92,246,0.4) !important; }
        .panel-card { animation: fadeUp 0.45s ease both; }
      `}</style>

      {/* Root container */}
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #020617 0%, #0d0820 40%, #020617 100%)",
          fontFamily: "'Outfit', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow orbs */}
        <div
          style={{
            position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 15% 15%, rgba(124,58,237,0.07) 0%, transparent 70%), " +
              "radial-gradient(ellipse 50% 50% at 85% 80%, rgba(6,182,212,0.05) 0%, transparent 70%)",
          }}
        />
        {/* Grid lines */}
        <div
          style={{
            position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div
          style={{
            position: "relative", zIndex: 1,
            maxWidth: 1380, margin: "0 auto",
            padding: "20px 20px 40px",
          }}
        >
          {/* ── HEADER ── */}
          <header
            style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28, flexWrap: "wrap", gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 24px rgba(124,58,237,0.45)",
                  flexShrink: 0,
                }}
              >
                <Sparkles size={22} color="white" />
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "clamp(18px, 3vw, 22px)",
                    fontWeight: 800, color: "#f1f5f9",
                    letterSpacing: "-0.4px", lineHeight: 1.2,
                  }}
                >
                  AI İçerik Planlayıcı
                </h1>
                <p style={{ fontSize: 12, color: "#4b5563", marginTop: 2 }}>
                  İçeriğinizi tüm platformlara uygun formata dönüştürün
                </p>
              </div>
            </div>

            {/* Status pill */}
            <div
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 999,
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.18)",
              }}
            >
              <div
                style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: storageOk ? "#22c55e" : "#f59e0b",
                  boxShadow: storageOk ? "0 0 6px #22c55e" : "0 0 6px #f59e0b",
                }}
              />
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                {storageOk ? "Otomatik kayıt aktif" : "Yükleniyor..."}
              </span>
            </div>
          </header>

          {/* ── MAIN GRID ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
              gap: 20,
              alignItems: "start",
            }}
          >
            {/* ════ LEFT PANEL ════ */}
            <div
              className="panel-card"
              style={{
                background: "rgba(12,18,40,0.75)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(139,92,246,0.14)",
                borderRadius: 22,
                padding: "22px 20px",
                boxShadow:
                  "0 4px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Panel header */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 18,
                }}
              >
                <FileText size={15} color="#7c3aed" />
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 11, fontWeight: 700, color: "#64748b",
                    letterSpacing: "1px", textTransform: "uppercase",
                  }}
                >
                  Kaynak İçerik
                </span>
                <div
                  style={{
                    marginLeft: "auto",
                    fontSize: 11, color: "#374151",
                    background: "rgba(139,92,246,0.06)",
                    padding: "2px 8px", borderRadius: 999,
                    border: "1px solid rgba(139,92,246,0.1)",
                  }}
                >
                  {mainContent.length} kr
                </div>
              </div>

              {/* Main textarea */}
              <textarea
                value={mainContent}
                onChange={(e) => setMainContent(e.target.value)}
                placeholder="Senaryo, video metni veya ham içeriğinizi buraya yapıştırın…"
                style={{
                  width: "100%", minHeight: 240,
                  background: "rgba(2,6,23,0.7)",
                  border: "1px solid rgba(139,92,246,0.14)",
                  borderRadius: 12,
                  padding: "13px 15px",
                  color: "#cbd5e1", fontSize: 13.5, lineHeight: 1.75,
                  resize: "vertical",
                  fontFamily: "'Outfit', sans-serif",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              />

              {/* Series No */}
              <div style={{ marginTop: 12 }}>
                <label
                  style={{
                    display: "block", fontSize: 10, fontWeight: 600,
                    color: "#4b5563", textTransform: "uppercase",
                    letterSpacing: "0.8px", marginBottom: 6,
                  }}
                >
                  📁 Bölüm / Seri No
                </label>
                <input
                  value={seriesNo}
                  onChange={(e) => setSeriesNo(e.target.value)}
                  placeholder="Örn: Bölüm 1 / 7 — Bilinçaltı Serisi"
                  style={{
                    width: "100%",
                    background: "rgba(2,6,23,0.7)",
                    border: "1px solid rgba(139,92,246,0.14)",
                    borderRadius: 10, padding: "9px 13px",
                    color: "#cbd5e1", fontSize: 13,
                    fontFamily: "'Outfit', sans-serif",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
              </div>

              {/* Visual notes */}
              <div style={{ marginTop: 12 }}>
                <label
                  style={{
                    display: "block", fontSize: 10, fontWeight: 600,
                    color: "#4b5563", textTransform: "uppercase",
                    letterSpacing: "0.8px", marginBottom: 6,
                  }}
                >
                  🎨 Görsel Prompt Notları
                </label>
                <textarea
                  value={visualNotes}
                  onChange={(e) => setVisualNotes(e.target.value)}
                  placeholder="Atmosfer, renk paleti, çekim açısı, ışık..."
                  rows={3}
                  style={{
                    width: "100%",
                    background: "rgba(2,6,23,0.7)",
                    border: "1px solid rgba(139,92,246,0.14)",
                    borderRadius: 10, padding: "9px 13px",
                    color: "#cbd5e1", fontSize: 13,
                    resize: "none",
                    fontFamily: "'Outfit', sans-serif",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
              </div>

              {/* Transform button */}
              <button
                onClick={handleTransform}
                disabled={loading}
                className="transform-btn"
                style={{
                  width: "100%", marginTop: 16,
                  padding: "14px 20px", minHeight: 50,
                  background: loading
                    ? "rgba(124,58,237,0.25)"
                    : "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  borderRadius: 13,
                  color: "white", fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "'Syne', sans-serif",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s ease",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 24px rgba(124,58,237,0.35)",
                  animation: !loading && !transformed ? "glowPulse 2.5s ease infinite" : "none",
                }}
              >
                {loading ? (
                  <>
                    <RefreshCw
                      size={17}
                      style={{ animation: "spin 0.9s linear infinite" }}
                    />
                    AI dönüştürüyor…
                  </>
                ) : (
                  <>
                    <Zap size={17} />
                    İçeriği Dönüştür
                  </>
                )}
              </button>

              {/* Platform indicators */}
              <div
                style={{
                  display: "flex", gap: 6, marginTop: 12,
                  justifyContent: "center", flexWrap: "wrap",
                }}
              >
                {TABS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div
                      key={t.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        padding: "4px 10px", borderRadius: 999,
                        background: "rgba(15,23,42,0.6)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        fontSize: 11, color: "#374151",
                      }}
                    >
                      <Icon size={11} color={t.color} />
                      <span>{t.label.split(" ")[0]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ════ RIGHT PANEL ════ */}
            <div
              className="panel-card"
              style={{
                background: "rgba(12,18,40,0.75)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(139,92,246,0.14)",
                borderRadius: 22,
                padding: "22px 20px",
                boxShadow:
                  "0 4px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
                animationDelay: "0.1s",
              }}
            >
              {/* Tabs */}
              <div
                style={{
                  display: "flex", gap: 5,
                  overflowX: "auto", paddingBottom: 2,
                  marginBottom: 18,
                  scrollbarWidth: "none",
                }}
              >
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="tab-pill"
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 14px",
                        borderRadius: 10, border: "none",
                        background: active
                          ? "rgba(124,58,237,0.22)"
                          : "transparent",
                        color: active ? "#c4b5fd" : "#4b5563",
                        cursor: "pointer", fontSize: 13,
                        fontWeight: active ? 600 : 400,
                        whiteSpace: "nowrap",
                        transition: "all 0.15s ease",
                        outline: active
                          ? "1px solid rgba(139,92,246,0.35)"
                          : "1px solid transparent",
                        boxShadow: active
                          ? "0 0 12px rgba(124,58,237,0.2)"
                          : "none",
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      <Icon size={14} color={active ? tab.color : "#4b5563"} />
                      <span style={{ display: "inline" }}>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Output area */}
              <div
                style={{
                  minHeight: 280,
                  maxHeight: "calc(100vh - 380px)",
                  overflowY: "auto",
                  paddingRight: 2,
                }}
              >
                {renderOutput()}
              </div>

              {/* Bottom metrics + copy bar */}
              {transformed && curOut && !loading && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    marginTop: 16,
                    paddingTop: 14,
                    borderTop: "1px solid rgba(139,92,246,0.1)",
                  }}
                >
                  {/* Metrics */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Badge icon={Clock} value={calcReadTime(curOut)} label="okuma" />
                    <Badge icon={Hash} value={curOut.length} label="kr" />
                    {activeTab === "twitter" && tweets.length > 0 && (
                      <Badge icon={Layers} value={tweets.length} label="tweet" />
                    )}
                  </div>

                  {/* Copy all button */}
                  <button
                    onClick={() => handleCopyFull(curOut, activeTab)}
                    className="action-btn"
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "7px 14px",
                      background: "rgba(124,58,237,0.1)",
                      border: "1px solid rgba(139,92,246,0.25)",
                      borderRadius: 10,
                      color: "#a78bfa", cursor: "pointer",
                      fontSize: 13, fontWeight: 500,
                      transition: "all 0.15s",
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {copiedFull === activeTab ? (
                      <>
                        <Check size={13} /> Kopyalandı!
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Tümünü Kopyala
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: "center", marginTop: 32,
              fontSize: 11, color: "#1e293b",
            }}
          >
            AI İçerik Planlayıcı · Powered by Claude
          </div>
        </div>
      </div>

      <Toast toast={toast} />
    </>
  );
}
