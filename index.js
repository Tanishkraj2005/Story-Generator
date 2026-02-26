const LOCAL_KEY = "gemini_api_key";

const DEFAULT_API_KEY = "AIzaSyD2mXZlWeWxYU-WdVYGcPTsYQU4gjJdK2A";

const modalOverlay = document.getElementById("api-modal-overlay");
const apiKeyInput = document.getElementById("api-key-input");
const saveApiKeyBtn = document.getElementById("save-api-key-btn");
const showKeyToggle = document.getElementById("show-key-toggle");
const apiKeyError = document.getElementById("api-key-error");
const changeApiBtn = document.getElementById("change-api-btn");

const storyBox = document.getElementById("chat-container");
const promptInput = document.getElementById("user-input");
const storyButton = document.getElementById("send-button");
const genreDropdown = document.getElementById("genre-select");
const lengthDropdown = document.getElementById("length-select");
const toneDropdown = document.getElementById("tone-select");


function getStoredKey() {
  return localStorage.getItem(LOCAL_KEY) || DEFAULT_API_KEY;
}

function hasUserOwnKey() {
  return !!localStorage.getItem(LOCAL_KEY);
}

function saveKey(key) {
  localStorage.setItem(LOCAL_KEY, key.trim());
}

function openModal() {
  apiKeyInput.value = getStoredKey();
  apiKeyError.textContent = "";
  modalOverlay.classList.remove("hidden");
  setTimeout(() => apiKeyInput.focus(), 100);
}

function closeModal() {
  modalOverlay.classList.add("hidden");
}

window.addEventListener("load", () => {
  if (!getStoredKey()) {
    openModal();
  } else {
    closeModal();
    showWelcome();
  }
});

saveApiKeyBtn.addEventListener("click", handleSaveKey);
apiKeyInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSaveKey();
});

function handleSaveKey() {
  const key = apiKeyInput.value.trim();
  if (!key) {
    apiKeyError.textContent = "⚠️ Please paste your API key before continuing.";
    apiKeyInput.focus();
    return;
  }
  if (!key.startsWith("AIza")) {
    apiKeyError.textContent = "⚠️ That doesn't look like a valid Gemini API key (should start with 'AIza').";
    return;
  }
  apiKeyError.textContent = "";
  saveKey(key);
  closeModal();
  showWelcome();
}

showKeyToggle.addEventListener("click", () => {
  const isPassword = apiKeyInput.type === "password";
  apiKeyInput.type = isPassword ? "text" : "password";
  showKeyToggle.textContent = isPassword ? "🙈 Hide" : "👁 Show";
});

changeApiBtn.addEventListener("click", openModal);


const themeToggleBtn = document.getElementById("theme-toggle-btn");
const THEME_KEY = "story_gen_theme";

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light");
    themeToggleBtn.textContent = "☀️ Light";
  } else {
    document.body.classList.remove("light");
    themeToggleBtn.textContent = "🌙 Dark";
  }
}

applyTheme(localStorage.getItem(THEME_KEY) || "dark");


themeToggleBtn.addEventListener("click", () => {
  const isLight = document.body.classList.contains("light");
  const newTheme = isLight ? "dark" : "light";
  localStorage.setItem(THEME_KEY, newTheme);
  applyTheme(newTheme);
});


function showWelcome() {
  if (storyBox.querySelector(".welcome")) return; 
  showBotMessage(
    "✨ Welcome to the AI Story Generator!\n\nPick a genre, length & tone — then type your story idea and hit Create Story.",
    "welcome"
  );
}


storyButton.addEventListener("click", makeStory);
promptInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") makeStory();
});

async function makeStory() {
  const idea = promptInput.value.trim();
  if (!validateIdea(idea)) return;

  const apiKey = getStoredKey();
  if (!apiKey) {
    openModal();
    return;
  }

  const genre = genreDropdown.value;
  const length = lengthDropdown.value;
  const tone = toneDropdown.value;

  showUserMessage(`🎭 ${capitalise(genre)} · ${capitalise(tone)}: ${idea}`);
  promptInput.value = "";

  // Disable button while generating
  storyButton.disabled = true;
  const loading = showLoadingMessage();

  try {
    const story = await getStoryFromGemini(idea, genre, length, tone, apiKey);
    storyBox.removeChild(loading);
    showBotMessage(story);
  } catch (err) {
    storyBox.removeChild(loading);
    console.error("Story generation error:", err);

    let msg = "⚠️ Something went wrong.";
    const errText = err.message || "";

    if (
      errText.includes("API_KEY_INVALID") ||
      errText.includes("INVALID_ARGUMENT") ||
      errText.includes("401") ||
      errText.includes("API key not valid")
    ) {
      msg = "🔑 API key is invalid or revoked.\n\nClick \"Change API Key\" in the top-right and enter your own key from https://aistudio.google.com/app/apikey — it's free!";
    } else if (errText.includes("429") || errText.includes("RESOURCE_EXHAUSTED") || errText.includes("quota")) {
      msg = "⏳ Rate limit / quota reached.\n\nThis usually means the API key's free quota is used up for today.\n\n✅ Fix: Click \"Change API Key\" and enter YOUR OWN free API key from https://aistudio.google.com/app/apikey";
    } else if (errText.includes("Failed to fetch") || errText.includes("NetworkError") || errText.includes("network")) {
      msg = "🌐 Network error. Check your internet connection and try again.";
    } else if (errText.includes("SAFETY") || errText.includes("safety filter")) {
      msg = "🛡️ Your idea was blocked by safety filters. Try rephrasing it.";
    } else {
      msg = `⚠️ Error: ${errText}`;
    }
    showBotMessage(msg, "error");
  } finally {
    storyButton.disabled = false;
  }
}


function validateIdea(idea) {
  if (!idea) {
    showBotMessage("❌ Please type a story idea first!", "error");
    promptInput.focus();
    return false;
  }

  const forbidden = [
    /SELECT|INSERT|DELETE|UPDATE|FROM|WHERE|DROP/i,
    /<[^>]+>/,
    /function\s*\(|=>|console\.log|let\s+|const\s+|var\s+/i,
    /#include|System\.out\.println|public\s+class/i,
  ];

  if (forbidden.some((p) => p.test(idea))) {
    showBotMessage("⚠️ That looks like code. Please enter a plain story idea.", "error");
    return false;
  }

  if (idea.split(" ").length < 3) {
    showBotMessage("❌ Too short! Try: \"A detective finds a notebook that predicts crimes.\"", "error");
    return false;
  }

  return true;
}

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-001"
];

async function callGeminiModel(modelName, prompt, wordCount, apiKey) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.75,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,  // fixed high budget — gemini-2.5-flash uses thinking tokens internally
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
      ]
    })
  });

  const text = await response.text();

  if (!response.ok) {
    let detail = text;
    try {
      const parsed = JSON.parse(text);
      detail = parsed?.error?.message || text;
    } catch (_) { }
    return { ok: false, status: response.status, detail };
  }

  const json = JSON.parse(text);
  return { ok: true, json };
}

async function getStoryFromGemini(idea, genre, length, tone, apiKey) {
  const wordCount =
    length === "short" ? 300 :
      length === "medium" ? 600 : 1000;

  const paragraphs =
    length === "short" ? 5 :
      length === "medium" ? 8 : 12;

  const prompt =
    `You are a creative story writer. Write a complete ${tone} ${genre} story inspired by this idea:\n` +
    `"${idea}"\n\n` +
    `REQUIREMENTS (follow ALL of them strictly):\n\n` +
    `WORD COUNT: The story MUST be approximately ${wordCount} words long. This is very important. Do not write less than ${Math.round(wordCount * 0.85)} words. Do not stop until you have told the full story.\n\n` +
    `STRUCTURE: Divide the story into about ${paragraphs} paragraphs. Each paragraph = one scene or moment. Include:\n` +
    `  - Opening: introduce the character and setting\n` +
    `  - Middle: something happens, there is a problem or adventure\n` +
    `  - End: the problem is solved, the story finishes properly\n\n` +
    `LANGUAGE: Use simple, everyday English only. Write like you are telling a story to a friend. Use short sentences. Never use difficult or rare words.\n\n` +
    `TONE: Make the whole story feel ${tone}.\n\n` +
    `FORMAT: Write only the story text. No title. No heading. No comments. Start the first word of the story immediately.\n\n` +
    `Remember: write the FULL story — all ${wordCount} words — before stopping.`;

  let lastError = "Unknown error";

  for (const model of GEMINI_MODELS) {
    console.log(`Trying model: ${model}`);
    const result = await callGeminiModel(model, prompt, wordCount, apiKey);

    if (!result.ok) {
      lastError = `${result.status} – ${result.detail}`;
      console.warn(`Model ${model} failed: ${lastError}`);

      if (result.status === 400 || result.status === 401 || result.status === 403 || result.status === 429) {
        throw new Error(lastError);
      }
      continue;
    }

    const json = result.json;
    const candidate = json?.candidates?.[0];
    if (!candidate) throw new Error("No candidates returned by Gemini.");

    const finishReason = candidate.finishReason;
    console.log(`Finish reason: ${finishReason}`);
    if (finishReason === "SAFETY") {
      throw new Error("Content was blocked by safety filters. Please try a different idea.");
    }
    if (finishReason === "MAX_TOKENS") {
      console.warn("Story was cut off at token limit — consider reducing length or story complexity.");
    }

    const content = candidate?.content?.parts?.[0]?.text;
    if (!content) throw new Error("Empty response from Gemini.");

    console.log(`✅ Story generated using model: ${model}`);
    return content.trim();
  }

  throw new Error(lastError);
}


function showUserMessage(text) {
  const div = document.createElement("div");
  div.className = "message user-message";
  div.textContent = text;
  storyBox.appendChild(div);
  storyBox.scrollTop = storyBox.scrollHeight;
}

function showBotMessage(text, extraClass = "") {
  const div = document.createElement("div");
  div.className = `message bot-message${extraClass ? " " + extraClass : ""}`;
  div.textContent = text;
  storyBox.appendChild(div);
  storyBox.scrollTop = storyBox.scrollHeight;
  return div;
}

function showLoadingMessage() {
  const div = document.createElement("div");
  div.className = "message bot-message";
  div.innerHTML = `<span class="loading-dots"><span>●</span><span>●</span><span>●</span></span> Crafting your story…`;
  storyBox.appendChild(div);
  storyBox.scrollTop = storyBox.scrollHeight;
  return div;
}

function capitalise(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}