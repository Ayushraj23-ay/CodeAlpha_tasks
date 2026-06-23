import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ────────────────────────────────────────────────────────────────────────────
// FAQ KNOWLEDGE BASE
// ────────────────────────────────────────────────────────────────────────────
const FAQS = [
  { id: 1, category: "Getting Started", icon: "🚀", question: "What is artificial intelligence?", answer: "Artificial Intelligence (AI) is the simulation of human intelligence in machines programmed to think, learn, and problem-solve. It covers machine learning, natural language processing, and computer vision — letting systems recognize speech, identify images, make decisions, and translate languages.", tags: ["AI", "basics", "definition"] },
  { id: 2, category: "Getting Started", icon: "🚀", question: "What is machine learning?", answer: "Machine Learning (ML) is a subset of AI where computers learn from data without being explicitly programmed. Instead of hard-coded rules, ML models find patterns in data and improve over time. Types include supervised learning (labeled data), unsupervised learning (unlabeled data), and reinforcement learning (reward-based).", tags: ["ML", "basics", "learning"] },
  { id: 3, category: "Getting Started", icon: "🚀", question: "What is deep learning?", answer: "Deep Learning is a subset of machine learning using neural networks with many layers to model complex patterns. Inspired by the brain, these networks learn hierarchical representations automatically. It powers image recognition, speech processing, and large language models like GPT and Claude.", tags: ["deep learning", "neural networks", "basics"] },
  { id: 4, category: "Getting Started", icon: "🚀", question: "What is natural language processing?", answer: "Natural Language Processing (NLP) is the branch of AI enabling computers to understand, interpret, and generate human language. It powers chatbots, translation tools, sentiment analysis, and voice assistants. Key techniques include tokenization, stemming, named entity recognition, and transformer models like BERT and GPT.", tags: ["NLP", "language", "text"] },
  { id: 5, category: "Python & Programming", icon: "🐍", question: "What Python libraries are used in AI and machine learning?", answer: "Key libraries: NumPy (numerical computing), Pandas (data manipulation), Matplotlib/Seaborn (visualization), Scikit-learn (classical ML), TensorFlow and PyTorch (deep learning), NLTK and SpaCy (NLP), OpenCV (computer vision), and Keras (high-level neural network API).", tags: ["Python", "libraries", "tools"] },
  { id: 6, category: "Python & Programming", icon: "🐍", question: "How do I install Python libraries for machine learning?", answer: "Use pip or conda, e.g. `pip install numpy pandas scikit-learn matplotlib tensorflow torch`. Use a virtual environment: `python -m venv venv` then activate it. For GPU support with PyTorch, check pytorch.org for the right install command based on your CUDA version.", tags: ["Python", "installation", "setup"] },
  { id: 7, category: "Python & Programming", icon: "🐍", question: "What is the difference between Python 2 and Python 3?", answer: "Python 2 reached end-of-life in January 2020 and is unsupported. Python 3 is current. Key differences: `print()` as a function, true integer division by default, better Unicode support, improved exception syntax, and type hints. All modern AI/ML libraries require Python 3.7+.", tags: ["Python", "versions", "basics"] },
  { id: 8, category: "Neural Networks", icon: "🧠", question: "What is a neural network?", answer: "A neural network is a computational model inspired by the brain, with interconnected neurons in layers: input, hidden, and output. Each connection has a weight adjusted during training. The network learns via forward propagation, computing error, then backpropagation using gradient descent.", tags: ["neural network", "deep learning", "architecture"] },
  { id: 9, category: "Neural Networks", icon: "🧠", question: "What is backpropagation?", answer: "Backpropagation is the algorithm used to train neural networks. After a forward pass computes output and loss, backprop calculates the gradient of loss with respect to each weight using the chain rule. These gradients let optimizers like Adam or SGD update weights to minimize loss.", tags: ["backpropagation", "training", "gradient"] },
  { id: 10, category: "Neural Networks", icon: "🧠", question: "What are activation functions?", answer: "Activation functions add non-linearity to neural networks. ReLU is most popular for hidden layers — fast and simple. Sigmoid outputs 0-1 for binary classification. Softmax outputs probabilities summing to 1 for multi-class output. Tanh outputs -1 to 1. Leaky ReLU fixes the dying ReLU problem.", tags: ["activation", "relu", "sigmoid"] },
  { id: 11, category: "Neural Networks", icon: "🧠", question: "What is overfitting and how to prevent it?", answer: "Overfitting happens when a model memorizes training data instead of learning general patterns. Prevention: Dropout (randomly disabling neurons), L1/L2 regularization (penalizing large weights), data augmentation, early stopping, and using more training data.", tags: ["overfitting", "regularization", "dropout"] },
  { id: 12, category: "Computer Vision", icon: "👁️", question: "What is a convolutional neural network (CNN)?", answer: "A CNN is a deep learning architecture for grid-like data such as images. Convolutional layers automatically learn spatial features like edges and shapes by sliding filters over the input, followed by pooling layers and fully connected layers for classification. Famous CNNs: AlexNet, VGG, ResNet, EfficientNet.", tags: ["CNN", "computer vision", "image recognition"] },
  { id: 13, category: "Computer Vision", icon: "👁️", question: "What is YOLO and how does object detection work?", answer: "YOLO (You Only Look Once) is a real-time object detection algorithm that processes an entire image in one forward pass, making it extremely fast. It divides the image into a grid and predicts bounding boxes and class probabilities simultaneously. YOLOv8 achieves state-of-the-art speed and accuracy.", tags: ["YOLO", "object detection", "computer vision"] },
  { id: 14, category: "Large Language Models", icon: "💬", question: "What is a large language model (LLM)?", answer: "A Large Language Model (LLM) is trained on massive text datasets to understand and generate human language. LLMs use the Transformer architecture and are pre-trained on hundreds of billions of tokens. Examples: GPT-4, Claude, Gemini, LLaMA. They power chatbots, code generation, summarization, and translation.", tags: ["LLM", "GPT", "Claude", "transformer"] },
  { id: 15, category: "Large Language Models", icon: "💬", question: "What is a transformer model?", answer: "The Transformer is a neural network architecture from the 2017 paper 'Attention Is All You Need'. It uses self-attention to process sequences in parallel, unlike RNNs. Components: multi-head self-attention, positional encoding, feed-forward layers, layer normalization. It's the backbone of GPT, BERT, T5, and vision transformers.", tags: ["transformer", "attention", "architecture"] },
  { id: 16, category: "Large Language Models", icon: "💬", question: "What is prompt engineering?", answer: "Prompt engineering is crafting effective inputs to get the best outputs from AI language models. Techniques: zero-shot (direct question), few-shot (providing examples), chain-of-thought (step-by-step reasoning), role prompting (assigning a persona), and ReAct (reasoning plus acting). Good prompts are specific and provide clear context.", tags: ["prompt engineering", "LLM", "ChatGPT"] },
  { id: 17, category: "Data Science", icon: "📊", question: "What is the difference between supervised and unsupervised learning?", answer: "Supervised learning uses labeled input-output pairs to predict outputs for new inputs — like spam detection or price prediction. Unsupervised learning uses unlabeled data to find hidden structure, like clustering with K-Means or dimensionality reduction with PCA. Supervised is more common; unsupervised helps when labeling is expensive.", tags: ["supervised", "unsupervised", "ML"] },
  { id: 18, category: "Data Science", icon: "📊", question: "What is cross-validation?", answer: "Cross-validation evaluates model performance and reduces overfitting risk. In k-fold cross-validation, the dataset splits into k folds; the model trains on k-1 folds and tests on the remaining one, repeated k times. The averaged score gives a more reliable estimate than a single train-test split.", tags: ["cross-validation", "evaluation", "overfitting"] },
  { id: 19, category: "Data Science", icon: "📊", question: "What is feature engineering?", answer: "Feature engineering transforms raw data into meaningful input features. Techniques: normalization/standardization, one-hot encoding for categories, feature extraction, handling missing values, log transformation for skewed data, and polynomial features for non-linear relationships. Good features often matter more than the model choice.", tags: ["feature engineering", "preprocessing", "ML"] },
  { id: 20, category: "CodeAlpha", icon: "🏢", question: "What is CodeAlpha?", answer: "CodeAlpha is a software development company driving innovation across emerging technologies. They offer internship programs giving students hands-on experience in AI, web development and more — interns work on real projects, get mentorship, and earn verified completion certificates with QR codes.", tags: ["CodeAlpha", "internship", "company"] },
  { id: 21, category: "CodeAlpha", icon: "🏢", question: "What are the requirements to complete the CodeAlpha internship?", answer: "Complete a minimum of 2-3 tasks (1 task is incomplete). Upload source code to GitHub as CodeAlpha_ProjectName. Post a video explanation on LinkedIn tagging @CodeAlpha with your GitHub link. Share your internship status on LinkedIn. Submit via the official form shared in the WhatsApp group.", tags: ["CodeAlpha", "requirements", "certificate"] },
  { id: 22, category: "CodeAlpha", icon: "🏢", question: "What perks does the CodeAlpha internship offer?", answer: "Perks include: an Internship Offer Letter, QR-Verified Completion Certificate, Unique ID Certificate, a Letter of Recommendation based on performance, Job Opportunities and Placement Support, and Resume Building Support.", tags: ["CodeAlpha", "perks", "internship"] },
  { id: 23, category: "General Tech", icon: "⚙️", question: "What is the difference between RAM and storage?", answer: "RAM is temporary, fast memory for currently active tasks — volatile, lost on power off. Storage (HDD/SSD) is permanent memory for files, OS, and apps — slower but persistent. More RAM lets more programs run simultaneously; more storage holds more files. For AI/ML, more RAM means handling bigger datasets in memory.", tags: ["hardware", "RAM", "storage"] },
  { id: 24, category: "General Tech", icon: "⚙️", question: "What is an API?", answer: "An API (Application Programming Interface) lets different software applications communicate. It defines what requests can be made and what responses to expect. REST APIs use HTTP methods (GET, POST, PUT, DELETE) and typically return JSON. Example: a weather app calling a weather API for forecast data.", tags: ["API", "REST", "web"] },
  { id: 25, category: "General Tech", icon: "⚙️", question: "What is Git and GitHub?", answer: "Git is a distributed version control system tracking code changes, enabling collaboration. Key commands: git init, add, commit, push, pull, branch. GitHub is a cloud platform built on Git hosting repositories with pull requests and code review. For CodeAlpha, upload your project as CodeAlpha_ProjectName.", tags: ["git", "github", "version control"] },
];

const CATEGORIES = [...new Set(FAQS.map(f => f.category))].map(name => ({
  name,
  icon: FAQS.find(f => f.category === name).icon,
  count: FAQS.filter(f => f.category === name).length,
}));

const SUGGESTED = [
  "What is machine learning?",
  "How does YOLO work?",
  "What is backpropagation?",
  "What Python libraries are used in AI?",
  "What is the CodeAlpha internship?",
  "What is a transformer model?",
  "How do I prevent overfitting?",
  "What is prompt engineering?",
];

// ────────────────────────────────────────────────────────────────────────────
// NLP ENGINE — Tokenization, stopword removal, stemming, TF-IDF, cosine similarity
// ────────────────────────────────────────────────────────────────────────────
const STOPWORDS = new Set("a an the and but if or because as until while of at by for with about against between into through during before after above below to from up down in out on off over under again further then once here there all both each few more most other some such only own same so than too very can will just should now".split(" "));

function stem(word) {
  // Lightweight Porter-style suffix stripping
  if (word.length <= 3) return word;
  if (word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.endsWith("ing") && word.length > 5) return word.slice(0, -3);
  if (word.endsWith("ed") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("es")) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 1);
}

function preprocess(text) {
  return tokenize(text)
    .filter(t => !STOPWORDS.has(t))
    .map(stem);
}

function buildBigrams(tokens) {
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i++) bigrams.push(tokens[i] + "_" + tokens[i + 1]);
  return bigrams;
}

// Build TF-IDF corpus once
function buildCorpus(faqs) {
  const docs = faqs.map(f => {
    const uni = preprocess(`${f.question} ${f.answer} ${f.tags.join(" ")}`);
    return [...uni, ...buildBigrams(uni)];
  });

  const df = new Map(); // document frequency per term
  docs.forEach(doc => {
    new Set(doc).forEach(term => df.set(term, (df.get(term) || 0) + 1));
  });

  const N = docs.length;
  const idf = new Map();
  df.forEach((count, term) => idf.set(term, Math.log((N + 1) / (count + 1)) + 1));

  const vectors = docs.map(doc => {
    const tf = new Map();
    doc.forEach(term => tf.set(term, (tf.get(term) || 0) + 1));
    const vec = new Map();
    tf.forEach((count, term) => {
      const tfWeight = 1 + Math.log(count); // sublinear tf
      vec.set(term, tfWeight * (idf.get(term) || 0));
    });
    return vec;
  });

  return { vectors, idf };
}

function vectorize(text, idf) {
  const uni = preprocess(text);
  const tokens = [...uni, ...buildBigrams(uni)];
  const tf = new Map();
  tokens.forEach(term => tf.set(term, (tf.get(term) || 0) + 1));
  const vec = new Map();
  tf.forEach((count, term) => {
    if (idf.has(term)) {
      const tfWeight = 1 + Math.log(count);
      vec.set(term, tfWeight * idf.get(term));
    }
  });
  return vec;
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0, magA = 0, magB = 0;
  vecA.forEach((val, key) => {
    magA += val * val;
    if (vecB.has(key)) dot += val * vecB.get(key);
  });
  vecB.forEach(val => { magB += val * val; });
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function extractKeywords(text) {
  const tokens = tokenize(text).filter(t => !STOPWORDS.has(t));
  return [...new Set(tokens)].slice(0, 5);
}

// Intent detection via regex patterns
const INTENTS = [
  { name: "greeting", pattern: /\b(hi|hello|hey|howdy|greetings|good\s*(morning|afternoon|evening))\b/i },
  { name: "farewell", pattern: /\b(bye|goodbye|see\s*you|cya|exit|quit)\b/i },
  { name: "thanks", pattern: /\b(thank|thanks|thx|ty|appreciate|grateful)\b/i },
  { name: "help", pattern: /\b(help|assist|support|guide|how\s*to\s*use|what\s*can\s*you\s*do)\b/i },
  { name: "name", pattern: /\b(your\s*name|who\s*are\s*you|what\s*are\s*you|introduce)\b/i },
  { name: "creator", pattern: /\b(who\s*(made|built|created|coded)|your\s*creator|author|developer)\b/i },
];

const INTENT_RESPONSES = {
  greeting: ["Hey there! I'm NexBot, your AI assistant. Ask me anything about AI, ML, Python, or CodeAlpha!", "Hello! I'm ready to help. You can ask about machine learning, deep learning, NLP, or anything tech-related.", "Hi! Great to see you. I specialize in AI, Python, and CodeAlpha internship questions."],
  farewell: ["Goodbye! Keep building amazing things. All the best for your CodeAlpha internship!", "See you later! Good luck with your projects.", "Bye! Feel free to come back anytime."],
  thanks: ["You're very welcome! Happy to help — ask me anything else.", "Anytime! That's what I'm here for.", "Glad I could help!"],
  help: ["I can answer questions on AI/ML concepts, Python libraries, Neural Networks, Computer Vision, LLMs & Transformers, and the CodeAlpha internship. Just type your question naturally!"],
  name: ["I'm NexBot — an intelligent FAQ chatbot built by Ayush Raj for the CodeAlpha AI Internship (Task 2). I use real NLP — TF-IDF vectorization and cosine similarity — to find the best answers, all running client-side in your browser."],
  creator: ["I was built by Ayush Raj as part of the CodeAlpha AI Internship Task 2, using React with a custom from-scratch NLP engine (tokenization, stemming, TF-IDF, cosine similarity) — no external API calls needed."],
};

function detectIntent(text) {
  for (const { name, pattern } of INTENTS) {
    if (pattern.test(text)) return name;
  }
  return null;
}

// ────────────────────────────────────────────────────────────────────────────
// UI SUBCOMPONENTS
// ────────────────────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "12px 16px" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: "#9b95e8",
          animation: `bounce 1.2s ${i * 0.15}s infinite ease-in-out`,
        }} />
      ))}
      <style>{`@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); opacity: .4; } 30% { transform: translateY(-5px); opacity: 1; } }`}</style>
    </div>
  );
}

function ConfidenceTag({ confidence, label }) {
  const colors = {
    high: { bg: "#e8f5e9", fg: "#2e7d32" },
    medium: { bg: "#fff8e1", fg: "#a86b00" },
    low: { bg: "#fdeceb", fg: "#c0392b" },
  };
  const c = colors[confidence] || colors.medium;
  return (
    <span style={{ background: c.bg, color: c.fg, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
      {label}
    </span>
  );
}

function formatBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────────────────────────────────
export default function NexBot() {
  const corpus = useMemo(() => buildCorpus(FAQS), []);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "bot",
      type: "welcome",
      text: "Hi! I'm NexBot, an AI-powered FAQ assistant built using real NLP — TF-IDF vectorization and cosine similarity, computed live in your browser.",
      suggestions: SUGGESTED.slice(0, 4),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Wait for the browser to finish layout/paint of the new message before
    // measuring scrollHeight, otherwise it scrolls to the previous (stale) height.
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    });
    return () => cancelAnimationFrame(raf1);
  }, [messages, isTyping]);

  const findMatches = useCallback((query, topK = 3) => {
    const qVec = vectorize(query, corpus.idf);
    const scored = FAQS.map((faq, i) => ({
      faq,
      score: cosineSimilarity(qVec, corpus.vectors[i]),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.filter(s => s.score > 0.04).slice(0, topK);
  }, [corpus]);

  const handleSend = useCallback((rawText) => {
    const text = (rawText ?? input).trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now() + "-u", role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const delay = 450 + Math.random() * 500;
    setTimeout(() => {
      const intent = detectIntent(text);
      let botMsg;

      if (intent) {
        const responses = INTENT_RESPONSES[intent];
        botMsg = {
          id: Date.now() + "-b",
          role: "bot",
          type: "intent",
          text: responses[Math.floor(Math.random() * responses.length)],
          suggestions: intent === "greeting" || intent === "help" ? SUGGESTED.sort(() => 0.5 - Math.random()).slice(0, 3) : null,
        };
      } else {
        const matches = findMatches(text);
        if (matches.length === 0) {
          botMsg = {
            id: Date.now() + "-b",
            role: "bot",
            type: "no_match",
            text: "I couldn't find a good answer for that. Try rephrasing, or ask about AI, ML, Python, neural networks, or CodeAlpha!",
            suggestions: SUGGESTED.sort(() => 0.5 - Math.random()).slice(0, 3),
          };
        } else {
          const best = matches[0];
          const pct = Math.round(best.score * 100);
          const confidence = pct >= 35 ? "high" : pct >= 15 ? "medium" : "low";
          const label = confidence === "high" ? `High confidence (${pct}%)` : confidence === "medium" ? `Good match (${pct}%)` : `Possible match (${pct}%)`;

          botMsg = {
            id: Date.now() + "-b",
            role: "bot",
            type: "faq",
            text: best.faq.answer,
            matchedQuestion: best.faq.question,
            category: best.faq.category,
            icon: best.faq.icon,
            confidence,
            label,
            tags: best.faq.tags,
            keywords: extractKeywords(text),
            related: matches.slice(1).filter(m => m.score > 0.08).map(m => ({
              question: m.faq.question,
              score: Math.round(m.score * 100),
              icon: m.faq.icon,
            })),
          };
        }
      }

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  }, [input, isTyping, findMatches]);

  const handleCategoryClick = (catName) => {
    handleSend(`Tell me about ${catName}`);
  };

  const handleClear = () => {
    setMessages([messages[0]]);
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return findMatches(searchQuery, 5).map(m => ({
      question: m.faq.question,
      icon: m.faq.icon,
      score: Math.round(m.score * 100),
    }));
  }, [searchQuery, findMatches]);

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: "grid",
      gridTemplateColumns: "240px 1fr",
      height: 640,
      maxWidth: 920,
      margin: "0 auto",
      background: "#ffffff",
      borderRadius: 18,
      overflow: "hidden",
      border: "1px solid #e8e6f5",
      boxShadow: "0 4px 30px rgba(108,95,208,0.08)",
    }}>

      {/* ── Sidebar ───────────────────────────────────────── */}
      <div style={{ background: "#faf9ff", borderRight: "1px solid #ece9fb", display: "flex", flexDirection: "column", padding: "20px 16px", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#6c5fd0,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>NexBot</div>
            <div style={{ fontSize: 11, color: "#888" }}>AI FAQ Assistant</div>
          </div>
        </div>

        <div style={{ background: "#ede8ff", color: "#5a4fc0", fontSize: 10.5, fontWeight: 600, padding: "4px 10px", borderRadius: 14, display: "inline-block", marginBottom: 12, letterSpacing: "0.04em" }}>
          CODEALPHA TASK 2
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #ece9fb", borderRadius: 10, padding: "8px 10px", marginBottom: 16 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#6c5fd0,#3b82f6)", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>AR</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a2e" }}>Ayush Raj</div>
            <div style={{ fontSize: 10, color: "#999" }}>AI Intern</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
          <div style={{ background: "#fff", border: "1px solid #ece9fb", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#6c5fd0" }}>{FAQS.length}</div>
            <div style={{ fontSize: 9.5, color: "#999" }}>FAQs</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #ece9fb", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#6c5fd0" }}>{CATEGORIES.length}</div>
            <div style={{ fontSize: 9.5, color: "#999" }}>Topics</div>
          </div>
        </div>

        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
          Browse topics
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.name} onClick={() => handleCategoryClick(cat.name)} style={{
              display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #ece9fb",
              borderRadius: 9, padding: "7px 10px", fontSize: 11.5, cursor: "pointer", textAlign: "left", color: "#444",
              transition: "all .15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#ede8ff"; e.currentTarget.style.borderColor = "#c9c0f5"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#ece9fb"; }}
            >
              <span>{cat.icon}</span>
              <span style={{ flex: 1, fontWeight: 500 }}>{cat.name}</span>
              <span style={{ color: "#bbb", fontSize: 10 }}>{cat.count}</span>
            </button>
          ))}
        </div>

        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
          NLP engine
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
          {["TF-IDF", "Cosine similarity", "Stemming", "Intent detection"].map(t => (
            <span key={t} style={{ fontSize: 10, background: "#fff", border: "1px solid #ece9fb", borderRadius: 12, padding: "3px 9px", color: "#777" }}>{t}</span>
          ))}
        </div>

        <button onClick={handleClear} style={{
          marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          background: "#fff", border: "1px solid #ece9fb", borderRadius: 9, padding: "8px", fontSize: 11.5,
          fontWeight: 600, color: "#666", cursor: "pointer",
        }}>
          ✕ New conversation
        </button>
      </div>

      {/* ── Chat main ─────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, height: "100%" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: "1px solid #f0eefb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2ecc71", display: "inline-block", boxShadow: "0 0 0 3px rgba(46,204,113,0.2)" }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#444" }}>NexBot is online</span>
          </div>
          <div style={{ position: "relative" }}>
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              placeholder="🔍 Quick search FAQs…"
              style={{
                fontSize: 12, padding: "6px 12px", borderRadius: 16, border: "1px solid #ece9fb",
                outline: "none", width: 170, fontFamily: "inherit", background: "#faf9ff",
              }}
            />
            {searchOpen && searchQuery.trim() && (
              <div style={{
                position: "absolute", top: 32, right: 0, width: 260, background: "#fff", border: "1px solid #ece9fb",
                borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 20, maxHeight: 220, overflow: "auto",
              }}>
                {searchResults.length === 0 ? (
                  <div style={{ padding: 14, fontSize: 12, color: "#999", textAlign: "center" }}>No matches found</div>
                ) : searchResults.map((r, i) => (
                  <div key={i} onMouseDown={() => { handleSend(r.question); setSearchQuery(""); setSearchOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", fontSize: 12, cursor: "pointer",
                    borderBottom: i < searchResults.length - 1 ? "1px solid #f5f3fc" : "none",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#faf9ff"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    <span>{r.icon}</span>
                    <span style={{ flex: 1, color: "#333" }}>{r.question}</span>
                    <span style={{ fontSize: 10, color: "#aaa" }}>{r.score}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", gap: 9, alignItems: "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, background: msg.role === "user" ? "linear-gradient(135deg,#6c5fd0,#3b82f6)" : "#f0effa",
                color: msg.role === "user" ? "#fff" : undefined, fontWeight: 700,
              }}>
                {msg.role === "user" ? "AR" : "🤖"}
              </div>

              <div style={{
                maxWidth: "78%", padding: "10px 14px", borderRadius: 14,
                background: msg.role === "user" ? "linear-gradient(135deg,#6c5fd0,#3b82f6)" : "#f7f6fd",
                color: msg.role === "user" ? "#fff" : "#1a1a2e",
                fontSize: 13.5, lineHeight: 1.55,
                borderTopRightRadius: msg.role === "user" ? 4 : 14,
                borderTopLeftRadius: msg.role === "user" ? 14 : 4,
              }}>
                {msg.role === "user" ? (
                  <span>{msg.text}</span>
                ) : (
                  <>
                    {msg.type === "faq" && (
                      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10.5, background: "#ede8ff", color: "#5a4fc0", padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>
                          {msg.icon} {msg.category}
                        </span>
                        <ConfidenceTag confidence={msg.confidence} label={msg.label} />
                      </div>
                    )}
                    {msg.type === "faq" && (
                      <div style={{ fontSize: 11, color: "#999", marginBottom: 6, fontStyle: "italic" }}>
                        Matched: "{msg.matchedQuestion}"
                      </div>
                    )}
                    <div>{formatBold(msg.text)}</div>

                    {msg.type === "faq" && msg.tags?.length > 0 && (
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 9 }}>
                        {msg.tags.map(t => (
                          <span key={t} style={{ fontSize: 10, color: "#9b95d0", background: "#fff", border: "1px solid #ece9fb", padding: "2px 8px", borderRadius: 10 }}>#{t}</span>
                        ))}
                      </div>
                    )}

                    {msg.type === "faq" && msg.related?.length > 0 && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #e8e6f5" }}>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#999", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          You might also ask
                        </div>
                        {msg.related.map((r, i) => (
                          <div key={i} onClick={() => handleSend(r.question)} style={{
                            display: "flex", alignItems: "center", gap: 7, padding: "6px 9px", background: "#fff",
                            border: "1px solid #ece9fb", borderRadius: 8, fontSize: 11.5, cursor: "pointer", marginBottom: 5, color: "#444",
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = "#faf9ff"}
                            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                          >
                            <span>{r.icon}</span>
                            <span style={{ flex: 1 }}>{r.question}</span>
                            <span style={{ fontSize: 9.5, color: "#bbb" }}>{r.score}%</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.suggestions && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                        {msg.suggestions.map((s, i) => (
                          <button key={i} onClick={() => handleSend(s)} style={{
                            fontSize: 11, background: "#fff", border: "1px solid #ece9fb", borderRadius: 16,
                            padding: "5px 12px", cursor: "pointer", color: "#5a4fc0", fontFamily: "inherit", fontWeight: 500,
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#ede8ff"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f0effa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🤖</div>
              <div style={{ background: "#f7f6fd", borderRadius: 14, borderTopLeftRadius: 4 }}>
                <TypingDots />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: "12px 18px 16px", borderTop: "1px solid #f0eefb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#faf9ff", border: "1px solid #ece9fb", borderRadius: 14, padding: "4px 4px 4px 14px" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
              placeholder="Type your question… (e.g. What is machine learning?)"
              maxLength={500}
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13.5,
                padding: "9px 0", fontFamily: "inherit", color: "#1a1a2e",
              }}
            />
            <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} style={{
              width: 34, height: 34, borderRadius: 10, border: "none", flexShrink: 0,
              background: input.trim() && !isTyping ? "linear-gradient(135deg,#6c5fd0,#3b82f6)" : "#e6e4f2",
              color: "#fff", cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10.5, color: "#bbb" }}>
            <span>Press <kbd style={{ background: "#f0eefb", padding: "1px 5px", borderRadius: 4, fontSize: 9.5 }}>Enter</kbd> to send · NLP runs 100% client-side</span>
            <span>{input.length}/500</span>
          </div>
        </div>
      </div>
    </div>
  );
}
