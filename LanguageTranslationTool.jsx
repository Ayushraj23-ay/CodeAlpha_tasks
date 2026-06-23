import { useState, useRef, useCallback } from "react";

const LANGUAGES = [
  { code: "auto", name: "Detect language", flag: "🌐" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "bn", name: "Bengali", flag: "🇧🇩" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
];

const TARGET_LANGS = LANGUAGES.filter((l) => l.code !== "auto");

const QUICK_PHRASES = [
  "Hello, how are you?",
  "Thank you very much!",
  "Where is the nearest hospital?",
  "I don't understand.",
  "Can you help me please?",
  "What is your name?",
];

function LanguageSelect({ value, onChange, options, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "#f8f8fa",
          border: "1.5px solid #e0e0e8",
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 15,
          fontWeight: 500,
          color: "#1a1a2e",
          cursor: "pointer",
          outline: "none",
          appearance: "none",
          WebkitAppearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: 36,
        }}
      >
        {options.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      title="Copy translation"
      style={{
        background: copied ? "#e8f5e9" : "#f0f0f8",
        border: "none",
        borderRadius: 8,
        padding: "6px 14px",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        color: copied ? "#2e7d32" : "#555",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.2s",
      }}
    >
      {copied ? "✓ Copied!" : "⎘ Copy"}
    </button>
  );
}

function SpeakButton({ text, lang }) {
  const [speaking, setSpeaking] = useState(false);
  const speak = () => {
    if (!window.speechSynthesis || !text) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  };
  return (
    <button
      onClick={speak}
      title={speaking ? "Stop speaking" : "Listen to translation"}
      style={{
        background: speaking ? "#fff3e0" : "#f0f0f8",
        border: "none",
        borderRadius: 8,
        padding: "6px 14px",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        color: speaking ? "#e65100" : "#555",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.2s",
      }}
    >
      {speaking ? "⏹ Stop" : "🔊 Listen"}
    </button>
  );
}

function CharCounter({ count, max }) {
  const pct = count / max;
  const color = pct > 0.9 ? "#e53935" : pct > 0.75 ? "#fb8c00" : "#aaa";
  return (
    <span style={{ fontSize: 12, color, fontVariantNumeric: "tabular-nums" }}>
      {count}/{max}
    </span>
  );
}

function HistoryItem({ item, onSelect }) {
  return (
    <div
      onClick={() => onSelect(item)}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        background: "#f8f8fa",
        cursor: "pointer",
        border: "1px solid #eee",
        transition: "background 0.15s",
        marginBottom: 8,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#ededf5")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#f8f8fa")}
    >
      <div style={{ fontSize: 11, color: "#888", marginBottom: 4, display: "flex", gap: 8 }}>
        <span>{item.srcLang.flag} {item.srcLang.name}</span>
        <span>→</span>
        <span>{item.tgtLang.flag} {item.tgtLang.name}</span>
      </div>
      <div style={{ fontSize: 13, color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {item.inputText}
      </div>
      <div style={{ fontSize: 12, color: "#6c5fd0", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {item.translatedText}
      </div>
    </div>
  );
}

export default function TranslationTool() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("hi");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [detectedLang, setDetectedLang] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [confidence, setConfidence] = useState(null);
  const MAX_CHARS = 500;
  const abortRef = useRef(null);

  const translate = useCallback(async (text, src, tgt) => {
    if (!text.trim()) { setTranslatedText(""); setError(""); return; }
    if (abortRef.current) abortRef.current = false;
    setIsLoading(true);
    setError("");
    setDetectedLang(null);
    setConfidence(null);

    const srcLangObj = LANGUAGES.find((l) => l.code === src) || LANGUAGES[0];
    const tgtLangObj = TARGET_LANGS.find((l) => l.code === tgt) || TARGET_LANGS[0];
    const srcLabel = src === "auto" ? "auto-detected language" : srcLangObj.name;

    const systemPrompt = `You are a professional translator. Translate the given text accurately and naturally.
Respond ONLY with a JSON object in this exact format (no markdown, no extra text):
{"translation":"<translated text>","detected_language":"<ISO 639-1 code if input was auto-detect, else null>","confidence":<0.0-1.0 float>}`;

    const userPrompt = `Translate this text from ${srcLabel} to ${tgtLangObj.name}:\n\n${text}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.map((b) => b.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (abortRef.current) return;

      setTranslatedText(parsed.translation || "");
      setConfidence(parsed.confidence != null ? Math.round(parsed.confidence * 100) : null);
      if (parsed.detected_language) {
        const dl = LANGUAGES.find((l) => l.code === parsed.detected_language);
        setDetectedLang(dl || { code: parsed.detected_language, name: parsed.detected_language, flag: "🌐" });
      }

      const entry = {
        id: Date.now(),
        inputText: text.slice(0, 80) + (text.length > 80 ? "…" : ""),
        translatedText: (parsed.translation || "").slice(0, 80),
        srcLang: srcLangObj,
        tgtLang: tgtLangObj,
      };
      setHistory((h) => [entry, ...h.slice(0, 9)]);
    } catch (e) {
      setError("Translation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSwap = () => {
    if (sourceLang === "auto") return;
    const prevSrc = sourceLang;
    const prevTgt = targetLang;
    const prevTranslated = translatedText;
    setSourceLang(prevTgt);
    setTargetLang(prevSrc);
    setInputText(prevTranslated);
    setTranslatedText("");
    if (prevTranslated.trim()) translate(prevTranslated, prevTgt, prevSrc);
  };

  const handleTranslate = () => translate(inputText, sourceLang, targetLang);

  const handleQuickPhrase = (phrase) => {
    setInputText(phrase);
    translate(phrase, sourceLang, targetLang);
  };

  const handleHistorySelect = (item) => {
    setInputText(item.inputText);
    setTranslatedText(item.translatedText);
    setSourceLang(item.srcLang.code);
    setTargetLang(item.tgtLang.code);
    setShowHistory(false);
  };

  const tgtLangObj = TARGET_LANGS.find((l) => l.code === targetLang);

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", maxWidth: 780, margin: "0 auto", padding: "24px 16px", color: "#1a1a2e" }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 26 }}>🌍</span>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, background: "linear-gradient(90deg,#6c5fd0,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Lingua AI
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#888" }}>
            AI-powered translation · Built by <strong style={{ color: "#6c5fd0" }}>Ayush Raj</strong> · CodeAlpha Task 1
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setShowHistory((s) => !s)}
            style={{
              background: showHistory ? "#6c5fd0" : "#f0f0f8",
              color: showHistory ? "#fff" : "#555",
              border: "none",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            🕐 History ({history.length})
          </button>
        )}
      </div>

      {/* History Panel */}
      {showHistory && (
        <div style={{ background: "#fff", border: "1.5px solid #e0e0e8", borderRadius: 14, padding: "16px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 12 }}>Recent translations</div>
          {history.map((item) => (
            <HistoryItem key={item.id} item={item} onSelect={handleHistorySelect} />
          ))}
        </div>
      )}

      {/* Language Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "end", marginBottom: 16 }}>
        <LanguageSelect value={sourceLang} onChange={setSourceLang} options={LANGUAGES} label="From" />
        <button
          onClick={handleSwap}
          disabled={sourceLang === "auto"}
          title={sourceLang === "auto" ? "Cannot swap with auto-detect" : "Swap languages"}
          style={{
            background: sourceLang === "auto" ? "#f0f0f0" : "#6c5fd0",
            color: sourceLang === "auto" ? "#bbb" : "#fff",
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            fontSize: 18,
            cursor: sourceLang === "auto" ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s",
            marginBottom: 0,
          }}
        >
          ⇄
        </button>
        <LanguageSelect value={targetLang} onChange={setTargetLang} options={TARGET_LANGS} label="To" />
      </div>

      {/* Detected language tag */}
      {detectedLang && (
        <div style={{ marginBottom: 10, fontSize: 12, color: "#6c5fd0", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ background: "#ede8ff", borderRadius: 6, padding: "2px 10px", fontWeight: 500 }}>
            {detectedLang.flag} Detected: {detectedLang.name}
          </span>
          {confidence != null && (
            <span style={{ background: "#e8f5e9", color: "#2e7d32", borderRadius: 6, padding: "2px 10px", fontWeight: 500 }}>
              {confidence}% confident
            </span>
          )}
        </div>
      )}

      {/* Translation Panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        {/* Input Panel */}
        <div style={{ background: "#fff", border: "1.5px solid #e0e0e8", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "8px 14px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>
              {LANGUAGES.find((l) => l.code === sourceLang)?.flag} Source text
            </span>
            <CharCounter count={inputText.length} max={MAX_CHARS} />
          </div>
          <textarea
            value={inputText}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setInputText(e.target.value);
            }}
            placeholder="Type or paste text to translate…"
            style={{
              width: "100%",
              minHeight: 160,
              padding: "14px",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 15,
              lineHeight: 1.6,
              color: "#1a1a2e",
              background: "transparent",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
          <div style={{ padding: "8px 14px", borderTop: "1px solid #eee", display: "flex", gap: 8 }}>
            {inputText && (
              <button
                onClick={() => { setInputText(""); setTranslatedText(""); setDetectedLang(null); setConfidence(null); }}
                style={{ background: "#f5f5f5", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", color: "#666" }}
              >
                ✕ Clear
              </button>
            )}
            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isLoading}
              style={{
                marginLeft: "auto",
                background: inputText.trim() && !isLoading ? "linear-gradient(135deg, #6c5fd0, #3b82f6)" : "#e0e0e8",
                color: inputText.trim() && !isLoading ? "#fff" : "#aaa",
                border: "none",
                borderRadius: 10,
                padding: "8px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: inputText.trim() && !isLoading ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {isLoading ? (
                <>
                  <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span>
                  Translating…
                </>
              ) : "Translate →"}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div style={{ background: translatedText ? "#faf9ff" : "#fff", border: "1.5px solid #e0e0e8", borderRadius: 14, overflow: "hidden", transition: "background 0.3s" }}>
          <div style={{ padding: "8px 14px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>
              {tgtLangObj?.flag} Translation
            </span>
            {translatedText && (
              <div style={{ display: "flex", gap: 6 }}>
                <CopyButton text={translatedText} />
                <SpeakButton text={translatedText} lang={targetLang} />
              </div>
            )}
          </div>
          <div
            style={{
              minHeight: 160,
              padding: "14px",
              fontSize: 15,
              lineHeight: 1.6,
              color: translatedText ? "#1a1a2e" : "#bbb",
              fontStyle: translatedText ? "normal" : "italic",
            }}
          >
            {isLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 8 }}>
                {[80, 60, 70, 45].map((w, i) => (
                  <div key={i} style={{ height: 14, borderRadius: 6, background: "#e8e6f8", width: `${w}%`, animation: "pulse 1.5s ease-in-out infinite", animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            ) : error ? (
              <span style={{ color: "#e53935", fontSize: 13 }}>⚠ {error}</span>
            ) : translatedText || "Translation will appear here…"}
          </div>
          {translatedText && (
            <div style={{ padding: "8px 14px", borderTop: "1px solid #eee" }}>
              <span style={{ fontSize: 11, color: "#aaa" }}>Translated to {tgtLangObj?.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Phrases */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
          Quick phrases
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {QUICK_PHRASES.map((phrase) => (
            <button
              key={phrase}
              onClick={() => handleQuickPhrase(phrase)}
              style={{
                background: "#f0f0f8",
                border: "1px solid #e0e0ee",
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 12,
                cursor: "pointer",
                color: "#444",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#ede8ff"; e.currentTarget.style.color = "#6c5fd0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f0f0f8"; e.currentTarget.style.color = "#444"; }}
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 8 }}>
        Powered by Claude AI · CodeAlpha Internship · Ayush Raj
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        select:hover { border-color: #6c5fd0 !important; }
        textarea:focus { outline: none; }
      `}</style>
    </div>
  );
}
