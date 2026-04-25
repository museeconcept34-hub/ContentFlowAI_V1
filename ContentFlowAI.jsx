import { useState, useEffect, useRef, useCallback } from "react";
import {
  Copy, Check, Zap, Video, Hash, Clock, AlertCircle, Sparkles,
  X, Instagram, Twitter, ChevronRight, FileText, Layers,
  RefreshCw, Eye, TrendingUp, BookOpen, BarChart2, Play,
  Camera, MessageSquare, Flame
} from "lucide-react";

/* ─────────────────────────── MOCK DATA ──────────────────────────────── */
const MOCK_CONTENT = `BÖLÜM 3: "Ayna Kırıkları" — Psikoloji Drama Serisi

[KARAKTER: Dr. Mira Aydın — Travma Psikologu]
[SAHNE: Gece 23:47. Klinik, şehrin ışıkları camdan süzülüyor.]
[ATMOSFER: Sessizlik. Alçak müzik. Kahve fincanı masada soğuyor.]

Bugün size gerçek bir vakanın hikayesini anlatacağım. İsimler değiştirildi, ama duygular — duygular aynen korundu.

Hasta, ona "Emre" diyelim — 34 yaşında, başarılı bir mimar. Şehrin en prestijli firmalarından birinde çalışıyordu. Bir gün bana geldi, ellerini masaya koydu ve dedi ki:

"Doktor, ben neden her şeyi sabote ediyorum?"

Bu soru aslında binlerce insanın içinde taşıdığı soruyu sesli hale getirmesiydi. Ve cevap, ta çocukluğuna kadar uzanıyordu.

7 yaşındayken babasının söylediği bir cümle: "Sen hiçbir zaman yeterince iyi olmayacaksın." O cümle, bir inanç sistemi olarak Emre'nin zihnine kazındı. Psikoloji buna "Temel İnançlar" diyor. Ve bu inançlar, hayatımızın en önemli kararlarında gizlice kumanda koluna geçiyor.

Emre terfi aldığında ne hissetti biliyor musunuz? Korku. Çünkü başarı, onun için "yakalanma" anlamına geliyordu. Hak etmediği bir şeyi almış gibi hissediyordu.

Bu bir paradoks: Başarmak için çalışıyorsunuz ama içinizde bir ses sürekli "Sen bunu hak etmiyorsun" diyor.

Buna Psikolojide "Sahtekarlık Sendromu" veya "Imposter Syndrome" deniyor. Araştırmalar, yüksek başarılı bireylerin yüzde yetmişinin hayatlarının bir döneminde bunu yaşadığını gösteriyor.

Emre'ye şunu sordum: "O ses tam olarak ne zaman başlıyor?"

Cevap verdi: "Bir şeyi hak ettiğimi hissetmeye başladığımda."

Peki ya siz? Hayatınızda böyle bir ses var mı? Hak etmediğinizi düşündüğünüz bir şey?`;

const MOCK_EPISODE = "03";
const MOCK_VISUAL = "Karanlık klinik + şehir ışıkları bokeh. Dr. Mira: şefkatli ama kararlı bakış açısı. Renk paleti: derin mor, gece mavisi, amber şehir ışıkları. Yavaş kamera kaydırması.";

/* ─────────────────────────── TRANSFORM FNS ─────────────────────────── */
const toTikTok = (text, ep, visual) => {
  const lines = text.split("\n").filter((l) => l.trim() && !l.startsWith("["));
  const quoteMatch = text.match(/"([^"]{20,80})"/);
  const hook = quoteMatch ? quoteMatch[1] : lines[0]?.slice(0, 70) || "";
  const bodyLines = lines.filter((l) => l.length > 30).slice(0, 8);

  return `🎬 BÖLÜM ${ep || "01"} | TikTok / Reels Senaryosu
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ KANCA — 0 ile 3. Saniye Arası
"${hook.slice(0, 75)}..."
[Kamera yüze yakın. Ses alçak ve yavaş. 1 saniyelik duraklama.]

📌 PROBLEMİ KUR — 3 ile 15. Saniye
${bodyLines[1]?.slice(0, 140) || "Ana problemi ortaya koy, izleyiciyi içine çek."}

🧠 KİLİT KAVRAM — 15 ile 40. Saniye
${bodyLines[3]?.slice(0, 150) || "Psikolojik kavramı en sade dille açıkla."}

${bodyLines[4]?.slice(0, 120) || ""}

💡 FARKINDALIK ANIĞI — 40 ile 55. Saniye
"Bunu duyduğunuzda içinizde bir şey sarsıldıysa — bu tesadüf değil."
[Ses biraz yüksek. Göz teması. Mikro duraklama.]

📢 CALL TO ACTION — 55 ile 60. Saniye
"Devam görmek istiyorsanız kaydedin 💾 Yoruma 'DEVAM' yazın 👇"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 GÖRSEL PROMPT NOTLARI:
${visual || "Görsel prompt notu eklenmedi."}

🏷️ ÖNERİLEN HASHTAG'LER:
#psikoloji #dramaseri #imposter #zihinsel #travma
#kendinisabote #drmiraydin #bölüm${ep || "01"} #anlatı`;
};

const toCarousel = (text, ep, visual) => {
  const lines = text.split("\n").filter((l) => l.trim() && !l.startsWith("["));
  const quoteMatch = text.match(/"([^"]{20,80})"/);
  const firstQuote = quoteMatch ? `"${quoteMatch[1]}"` : lines[0]?.slice(0, 100);
  const conceptLine = lines.find((l) => l.includes("Temel İnanç") || l.includes("inanç") || l.includes("Psikoloji"));
  const imposterLine = lines.find((l) => l.includes("Sahtekarlık") || l.includes("Imposter") || l.includes("paradoks"));
  const questionLine = lines.find((l) => l.includes("ya siz") || l.includes("ya sen") || l.includes("siz?") || l.includes("musun?"));
  const nextEp = String(Number(ep || 1) + 1).padStart(2, "0");

  const slides = [
    { no: "01", tag: "HOOK", emoji: "●", title: "Seni durduracak bir soru...", body: firstQuote || lines[0]?.slice(0, 120), note: "Bold tipografi. Karanlık arka plan. Merak uyandırsın. Metin büyük ve merkezi." },
    { no: "02", tag: "KARAKTER", emoji: "▲", title: `Bölüm ${ep || "01"}: Emre'nin Hikayesi`, body: lines.find((l) => l.includes("Emre") && l.length > 40)?.slice(0, 130) || lines[2]?.slice(0, 130), note: "Karakter tanıtımı. Okuyucu kendini görmeli. Fotoğraf veya siluet kullan." },
    { no: "03", tag: "KAVRAM", emoji: "◆", title: "Temel İnançlar Nedir?", body: conceptLine?.slice(0, 150) || "Psikoloji buna Temel İnançlar diyor. Bir çocuğun zihnine kazınan cümleler, onlarca yıl kararlarını yönetiyor.", note: "Teknik terimi sade sun. İnfografik tarz. Kavramı bir kutu içinde göster." },
    { no: "04", tag: "PARADOKS", emoji: "⬟", title: "Imposter Syndrome", body: imposterLine?.slice(0, 150) || "Başarmak için çalışıyorsunuz ama içinizde bir ses 'Sen bunu hak etmiyorsun' diyor. Yüksek başarılıların %70'i bunu yaşıyor.", note: "Yüzde istatistiği büyük yazılsın. Kontrast renk kullan. Sarı vurgu." },
    { no: "05", tag: "SORU", emoji: "○", title: "Peki ya sen?", body: questionLine?.slice(0, 130) || "Hayatınızda böyle bir ses var mı? Hak etmediğinizi düşündüğünüz bir şey?", note: "Etkileşim sorusu. Sade beyaz arka plan. Emoji ile bitirilsin. Yorum yağmuru hedefi." },
    { no: "06", tag: "CTA", emoji: "★", title: "Devam Ediyoruz...", body: `Bölüm ${ep || "01"} tamamlandı. Bölüm ${nextEp}'de bu inançların nasıl yeniden yazılabileceğini konuşacağız.\n\n💾 Seriyi KAYDET — kaçırma!\n👇 Yorumuna yaz: bu sesi duyuyor musun?`, note: "Mor/gradient arka plan. Kaydet + Yorum aksiyonları. Seriyi takip et butonu." }
  ];

  return slides.map((s) =>
    `╔══ SLIDE ${s.no} ● [${s.tag}] ══════════════════════════╗
║
║  ${s.emoji}  ${s.title}
║  ─────────────────────────────────────────
║  ${(s.body || "").slice(0, 115)}${(s.body || "").length > 115 ? "..." : ""}
║
╠══ TASARIMCI NOTU ══════════════════════════════╣
║  ${s.note}
╚════════════════════════════════════════════════╝`
  ).join("\n\n");
};

const toThread = (text, ep) => {
  const epNum = ep || "01";
  const nextEp = String(Number(epNum) + 1).padStart(2, "0");
  return [
    { no: 1, text: `🧵 Bölüm ${epNum}: "Ayna Kırıkları" — Psikoloji Drama Serisi\n\nBugün gerçek bir vakanın hikayesini anlatacağım. İsimler değiştirildi, duygular değil.\n\n(Thread) ↓` },
    { no: 2, text: `Hasta — ona "Emre" diyelim — 34 yaşında başarılı bir mimar.\n\nİlk seansta ellerini masaya koydu ve dedi ki:\n\n"Doktor, neden her şeyi sabote ediyorum?"` },
    { no: 3, text: `Bu soru binlerce kişinin içinde taşıdığı soruyu sesli hale getirmesiydi.\n\nCevap: 7 yaşında duyulan bir cümle.\n\n"Sen hiçbir zaman yeterince iyi olmayacaksın." 🔴` },
    { no: 4, text: `Psikoloji buna TEMEL İNANÇLAR diyor.\n\nBir çocuğun beyni bu cümleyi gerçek olarak kodluyor.\n\nVe o inanç, onlarca yıl boyunca kararlarını sessizce yönetiyor. 🧠` },
    { no: 5, text: `Emre terfi aldığında ne hissetti?\n\nKORKU.\n\nBaşarı, onun için "yakalanma" anlamına geliyordu.\n\nBu paradoksu tanıyor musunuz?` },
    { no: 6, text: `Buna IMPOSTER SYNDROME deniyor.\n\nAraştırmalara göre yüksek başarılı bireylerin %70'i bunu yaşıyor.\n\nYalnız değilsiniz. 💙` },
    { no: 7, text: `Emre'ye şunu sordum:\n\n"O ses tam olarak ne zaman başlıyor?"\n\nCevabı:\n\n"Bir şeyi hak ettiğimi hissetmeye başladığımda."` },
    { no: 8, text: `Peki ya sen?\n\nBöyle bir ses var mı?\n\nBölüm ${nextEp}'de bu inançların nasıl yeniden yazılabileceğini konuşacağız.\n\n♻️ RT atarsan daha fazla kişiye ulaşır\n💬 Yoruma yaz: hangi başarını hak etmedin?\n\n#psikoloji #imposter #bölüm${epNum}` }
  ];
};

/* ─────────────────────────── HELPERS ───────────────────────────────── */
const readTime = (t) => `${Math.max(1, Math.ceil((t.trim().split(/\s+/).length || 1) / 180))} dk`;
const fmtNum = (n) => n.toLocaleString("tr-TR");

/* ─────────────────────────── SMALL COMPONENTS ──────────────────────── */
const Toast = ({ msg, onClose }) =>
  msg ? (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 9999,
      background: "rgba(10,10,25,0.97)",
      border: "1px solid rgba(239,68,68,0.55)",
      borderRadius: 14, padding: "13px 18px",
      display: "flex", alignItems: "center", gap: 10,
      backdropFilter: "blur(24px)",
      boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.1)",
      maxWidth: 360, animation: "cfToast 0.3s ease"
    }}>
      <AlertCircle size={15} color="#f87171" />
      <span style={{ fontSize: 13, color: "#fca5a5", flex: 1, lineHeight: 1.5 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 2, display: "flex" }}>
        <X size={14} />
      </button>
    </div>
  ) : null;

const Badge = ({ icon: Icon, label, val, color = "purple" }) => {
  const c = {
    purple: { bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.28)", text: "#c084fc" },
    cyan: { bg: "rgba(34,211,238,0.1)", border: "rgba(34,211,238,0.25)", text: "#67e8f9" },
    amber: { bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.28)", text: "#fde68a" },
    green: { bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.25)", text: "#86efac" },
  }[color];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 11px", borderRadius: 20, background: c.bg, border: `1px solid ${c.border}`, fontSize: 11, color: c.text, fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
      <Icon size={10} />{label}: {val}
    </span>
  );
};

const CopyBtn = ({ text }) => {
  const [ok, setOk] = useState(false);
  const handle = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 2200); });
  }, [text]);
  return (
    <button onClick={handle} style={{
      display: "flex", alignItems: "center", gap: 6, padding: "7px 15px", borderRadius: 9, cursor: "pointer",
      border: `1px solid ${ok ? "rgba(74,222,128,0.45)" : "rgba(168,85,247,0.4)"}`,
      background: ok ? "rgba(74,222,128,0.09)" : "rgba(168,85,247,0.1)",
      color: ok ? "#4ade80" : "#c084fc", fontSize: 12, fontWeight: 700,
      transition: "all 0.2s", letterSpacing: "0.03em", whiteSpace: "nowrap", outline: "none"
    }}>
      {ok ? <Check size={12} /> : <Copy size={12} />}
      {ok ? "Kopyalandı!" : "Kopyala"}
    </button>
  );
};

const TabBtn = ({ active, onClick, icon: Icon, label, color }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, cursor: "pointer",
    border: active ? `1px solid ${color}55` : "1px solid rgba(255,255,255,0.08)",
    background: active ? `${color}18` : "rgba(255,255,255,0.03)",
    color: active ? color : "#6b7280", fontSize: 12, fontWeight: 600,
    transition: "all 0.2s", letterSpacing: "0.01em", whiteSpace: "nowrap", outline: "none"
  }}>
    <Icon size={13} />{label}
  </button>
);

const GLASS = {
  background: "rgba(255,255,255,0.028)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 16,
  backdropFilter: "blur(20px)",
  boxShadow: "0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)"
};

/* ─────────────────────────── MAIN APP ──────────────────────────────── */
export default function ContentFlowAI() {
  const [content, setContent] = useState(MOCK_CONTENT);
  const [episode, setEpisode] = useState(MOCK_EPISODE);
  const [visual, setVisual] = useState(MOCK_VISUAL);
  const [tab, setTab] = useState("tiktok");
  const [outputs, setOutputs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [spinDeg, setSpinDeg] = useState(0);
  const spinRef = useRef(null);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 4200); };

  const handleTransform = useCallback(() => {
    if (!content.trim()) { showToast("Lütfen dönüştürülecek bir içerik girin."); return; }
    setLoading(true);
    setTimeout(() => {
      setOutputs({ tiktok: toTikTok(content, episode, visual), carousel: toCarousel(content, episode, visual), thread: toThread(content, episode) });
      setLoading(false);
    }, 1100);
  }, [content, episode, visual]);

  // Spin animation for loading
  useEffect(() => {
    if (loading) {
      spinRef.current = setInterval(() => setSpinDeg((d) => (d + 8) % 360), 16);
    } else {
      clearInterval(spinRef.current);
    }
    return () => clearInterval(spinRef.current);
  }, [loading]);

  const TABS = [
    { id: "tiktok", label: "TikTok / Reels", icon: Video, color: "#c084fc" },
    { id: "carousel", label: "Instagram Carousel", icon: Instagram, color: "#67e8f9" },
    { id: "thread", label: "X (Twitter) Flood", icon: Twitter, color: "#93c5fd" },
  ];

  const threadText = outputs?.thread?.map((t) => t.text).join("\n\n---\n\n") || "";
  const currentText = outputs ? (tab === "thread" ? threadText : outputs[tab]) : "";
  const metrics = { chars: currentText.length, rt: readTime(currentText) };

  const inputStyle = {
    width: "100%", padding: "10px 13px", borderRadius: 10, outline: "none",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", transition: "border 0.2s"
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(150deg,#06060e 0%,#090918 45%,#06060e 100%)", fontFamily: "'DM Sans',system-ui,sans-serif", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{margin:0}
        textarea{resize:vertical;font-family:inherit}
        @keyframes cfToast{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cfPulse{0%,100%{box-shadow:0 4px 20px rgba(124,58,237,0.35),0 0 0 0 rgba(124,58,237,0.15)}50%{box-shadow:0 4px 32px rgba(124,58,237,0.55),0 0 0 6px rgba(124,58,237,0)}}
        @keyframes cfShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(168,85,247,0.3);border-radius:2px}
        .cf-tab-bar{scrollbar-width:none}
        .cf-tab-bar::-webkit-scrollbar{display:none}
        .cf-textarea:focus{border-color:rgba(168,85,247,0.5)!important;box-shadow:0 0 0 3px rgba(168,85,247,0.08)}
        .cf-input:focus{border-color:rgba(168,85,247,0.4)!important}
        .cf-transform-btn{transition:all 0.2s}
        .cf-transform-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 36px rgba(124,58,237,0.55)!important}
        .cf-transform-btn:active:not(:disabled){transform:translateY(0)}
      `}</style>

      {/* ── Ambient Background ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 5% 5%,rgba(124,58,237,0.07) 0%,transparent 55%), radial-gradient(ellipse 60% 40% at 95% 95%,rgba(6,182,212,0.05) 0%,transparent 55%)" }} />

      <Toast msg={toast} onClose={() => setToast("")} />

      {/* ── Header ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(168,85,247,0.13)", background: "rgba(6,6,14,0.88)", backdropFilter: "blur(28px)", padding: "13px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#0e7490)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(124,58,237,0.5)" }}>
            <Sparkles size={17} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              ContentFlow{" "}
              <span style={{ background: "linear-gradient(90deg,#a855f7,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
            </div>
            <div style={{ fontSize: 9.5, color: "#52525b", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginTop: 1 }}>İçerik Dönüştürme Platformu</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {outputs && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", fontSize: 11, color: "#86efac", fontWeight: 700 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
              Dönüştürüldü
            </div>
          )}
          <span style={{ padding: "3px 11px", borderRadius: 20, background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.28)", fontSize: 10, color: "#a78bfa", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>PRO</span>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ position: "relative", zIndex: 1, padding: "20px", maxWidth: 1380, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: 20, alignItems: "start" }}>

          {/* ════════════════ LEFT PANEL ════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Section label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={13} color="#7c3aed" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#52525b", letterSpacing: "0.09em", textTransform: "uppercase" }}>İçerik Girişi</span>
            </div>

            {/* Episode + Visual row */}
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 10.5, color: "#6b7280", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>Bölüm / No</label>
                <input className="cf-input" value={episode} onChange={(e) => setEpisode(e.target.value)} placeholder="01" style={{ ...inputStyle, fontFamily: "'DM Mono',monospace", fontWeight: 600, fontSize: 15, textAlign: "center", letterSpacing: "0.05em" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10.5, color: "#6b7280", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>Görsel Prompt Notları</label>
                <input className="cf-input" value={visual} onChange={(e) => setVisual(e.target.value)} placeholder="Sahne açıklaması, renk paleti, kamera notları..." style={{ ...inputStyle }} />
              </div>
            </div>

            {/* Textarea card */}
            <div style={GLASS}>
              <div style={{ padding: "13px 15px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <BookOpen size={13} color="#a78bfa" />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#d1d5db" }}>Ana İçerik</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 10.5, color: content.length === 0 ? "#ef4444" : "#4b5563", fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>
                    {fmtNum(content.length)} kr
                  </span>
                  <button onClick={() => setContent("")} title="Temizle" style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5563", display: "flex", padding: 2 }}>
                    <X size={12} />
                  </button>
                </div>
              </div>
              <textarea
                className="cf-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="YouTube senaryo metninizi, blog yazınızı veya herhangi bir uzun içeriği buraya yapıştırın..."
                style={{ ...inputStyle, minHeight: 340, padding: "15px 16px", background: "transparent", border: "none", color: "#e2e8f0", fontSize: 13.5, lineHeight: 1.75, borderRadius: 0 }}
              />
            </div>

            {/* Transform Button */}
            <button
              className="cf-transform-btn"
              onClick={handleTransform}
              disabled={loading}
              style={{
                width: "100%", minHeight: 52, borderRadius: 13, border: "none",
                cursor: loading ? "wait" : "pointer",
                background: loading
                  ? "linear-gradient(135deg,rgba(124,58,237,0.35),rgba(79,70,229,0.25))"
                  : "linear-gradient(135deg,#6d28d9 0%,#7c3aed 40%,#4f46e5 100%)",
                color: "white", fontSize: 15, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: loading ? "none" : "0 4px 24px rgba(124,58,237,0.4)",
                animation: loading ? "none" : "cfPulse 3.5s ease infinite",
                fontFamily: "'Syne',sans-serif", letterSpacing: "-0.01em", outline: "none"
              }}>
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.25)", borderTopColor: "white", borderRadius: "50%", transform: `rotate(${spinDeg}deg)` }} />
                  Dönüştürülüyor...
                </>
              ) : (
                <>
                  <Zap size={17} />
                  İçeriği Dönüştür
                  <ChevronRight size={16} style={{ opacity: 0.7 }} />
                </>
              )}
            </button>

            {/* Tip */}
            <div style={{ fontSize: 11, color: "#374151", textAlign: "center", lineHeight: 1.7 }}>
              💡 İçerikler oturum boyunca bellekte korunur · Sayfa yenilenmesinde örnek veri geri yüklenir
            </div>

            {/* Stats summary */}
            {content.trim() && (
              <div style={{ ...GLASS, padding: "12px 15px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge icon={Hash} label="Giriş" val={`${fmtNum(content.length)} kr`} color="purple" />
                <Badge icon={Clock} label="Tahmini" val={readTime(content)} color="cyan" />
                <Badge icon={BarChart2} label="Kelime" val={fmtNum(content.trim().split(/\s+/).length)} color="amber" />
              </div>
            )}
          </div>

          {/* ════════════════ RIGHT PANEL ════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Section label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Layers size={13} color="#22d3ee" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#52525b", letterSpacing: "0.09em", textTransform: "uppercase" }}>Dönüştürülmüş Çıktılar</span>
            </div>

            {/* Tab bar */}
            <div className="cf-tab-bar" style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
              {TABS.map((t) => <TabBtn key={t.id} active={tab === t.id} onClick={() => setTab(t.id)} icon={t.icon} label={t.label} color={t.color} />)}
            </div>

            {/* Output area */}
            {!outputs ? (
              <div style={{ ...GLASS, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 500, gap: 20, padding: "48px 32px", textAlign: "center" }}>
                {/* Animated icon */}
                <div style={{ position: "relative", width: 72, height: 72 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(124,58,237,0.2)", animation: "cfPulse 3s ease infinite" }} />
                  <div style={{ width: 72, height: 72, borderRadius: 18, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={30} color="#7c3aed" />
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16.5, fontWeight: 700, color: "#d1d5db", marginBottom: 10, letterSpacing: "-0.02em" }}>
                    Dönüştürülmüş içerik burada görünecek
                  </div>
                  <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.8 }}>
                    Sol paneldeki içeriğinizi yazın ya da<br />örnek veriyi kullanarak başlayın.
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
                  {["TikTok / Reels Senaryosu", "Instagram Carousel", "X Thread Flood"].map((p) => (
                    <span key={p} style={{ padding: "5px 13px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 11.5, color: "#52525b", fontWeight: 600 }}>{p}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                {/* Metrics bar */}
                <div style={{ ...GLASS, padding: "11px 15px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    <Badge icon={Hash} label="Karakter" val={fmtNum(metrics.chars)} color="purple" />
                    <Badge icon={Clock} label="Okuma" val={metrics.rt} color="cyan" />
                    {tab === "thread" && <Badge icon={Twitter} label="Tweet" val={outputs.thread.length} color="amber" />}
                    {tab === "carousel" && <Badge icon={Instagram} label="Slide" val={6} color="green" />}
                  </div>
                  <CopyBtn text={currentText} />
                </div>

                {/* Platform label banner */}
                <div style={{ padding: "10px 15px", borderRadius: 10, background: tab === "tiktok" ? "rgba(192,132,252,0.07)" : tab === "carousel" ? "rgba(103,232,249,0.06)" : "rgba(147,197,253,0.06)", border: `1px solid ${tab === "tiktok" ? "rgba(192,132,252,0.2)" : tab === "carousel" ? "rgba(103,232,249,0.18)" : "rgba(147,197,253,0.18)"}`, display: "flex", alignItems: "center", gap: 10 }}>
                  {tab === "tiktok" && <Video size={14} color="#c084fc" />}
                  {tab === "carousel" && <Instagram size={14} color="#67e8f9" />}
                  {tab === "thread" && <Twitter size={14} color="#93c5fd" />}
                  <span style={{ fontSize: 12, fontWeight: 600, color: tab === "tiktok" ? "#c084fc" : tab === "carousel" ? "#67e8f9" : "#93c5fd" }}>
                    {tab === "tiktok" && "TikTok & Instagram Reels — 60 Saniye Format"}
                    {tab === "carousel" && "Instagram Carousel — 6 Slide Yapısı"}
                    {tab === "thread" && `X (Twitter) Thread — ${outputs.thread.length} Tweet Dizisi`}
                  </span>
                </div>

                {/* Content output */}
                <div style={{ ...GLASS, padding: "16px", overflow: "hidden" }}>
                  {tab === "thread" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {outputs.thread.map((t) => {
                        const over280 = t.text.length > 280;
                        const warn240 = t.text.length > 240;
                        return (
                          <div key={t.no} style={{ padding: "12px 14px", borderRadius: 11, background: over280 ? "rgba(234,179,8,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${over280 ? "rgba(234,179,8,0.35)" : "rgba(255,255,255,0.07)"}` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, gap: 8, alignItems: "center" }}>
                              <span style={{ fontSize: 10, fontWeight: 800, fontFamily: "'DM Mono',monospace", padding: "2px 8px", borderRadius: 5, background: "rgba(99,102,241,0.15)", color: "#818cf8", letterSpacing: "0.04em" }}>#{t.no}</span>
                              <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", fontWeight: 700, color: over280 ? "#fbbf24" : warn240 ? "#f97316" : "#4b5563" }}>
                                {t.text.length}/280{over280 ? " ⚠" : ""}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: "#e2e8f0", whiteSpace: "pre-wrap" }}>{t.text}</p>
                            {over280 && (
                              <div style={{ marginTop: 9, padding: "6px 11px", borderRadius: 7, background: "rgba(234,179,8,0.09)", border: "1px solid rgba(234,179,8,0.22)", fontSize: 11, color: "#fcd34d", display: "flex", alignItems: "center", gap: 6 }}>
                                <AlertCircle size={11} />
                                {t.text.length - 280} karakter fazla! Bu tweeti kısaltın.
                              </div>
                            )}
                            <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
                              <CopyBtn text={t.text} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <pre style={{ margin: 0, fontSize: 13, lineHeight: 1.75, color: "#e2e8f0", whiteSpace: "pre-wrap", fontFamily: tab === "carousel" ? "'DM Mono',monospace" : "'DM Sans',sans-serif", overflowX: "auto" }}>
                      {outputs[tab]}
                    </pre>
                  )}
                </div>

                {/* Regenerate */}
                <button onClick={handleTransform} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#6b7280", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", outline: "none" }}>
                  <RefreshCw size={12} />
                  Yeniden Dönüştür
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "16px 20px", display: "flex", justifyContent: "center", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        {[{ icon: Video, label: "TikTok / Reels" }, { icon: Instagram, label: "Instagram" }, { icon: Twitter, label: "X Thread" }].map((p) => (
          <span key={p.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#374151", fontWeight: 600 }}>
            <p.icon size={11} color="#52525b" />{p.label}
          </span>
        ))}
        <span style={{ color: "#1c1c2e", fontSize: 11 }}>·</span>
        <span style={{ fontSize: 11, color: "#1c1c2e", fontWeight: 600 }}>ContentFlow AI © 2025</span>
      </footer>
    </div>
  );
}
