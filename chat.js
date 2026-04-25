// api/chat.js
// Vercel Serverless Function — Anthropic API anahtarını güvenli tutar.
// Bu dosya istemci tarafında çalışmaz; yalnızca sunucu tarafında çalışır.

export default async function handler(req, res) {
  // Yalnızca POST isteklerine izin ver
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "ANTHROPIC_API_KEY ortam değişkeni tanımlanmamış." });
  }

  try {
    const { system, messages } = req.body;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        system,
        messages,
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return res.status(anthropicRes.status).json({ error: data.error?.message || "Anthropic API hatası" });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Sunucu hatası" });
  }
}
