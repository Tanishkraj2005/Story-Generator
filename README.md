# ✨ AI Story Generator

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Google Gemini" />
</div>

<br/>

**AI Story Generator** is an interactive, browser-based application that harnesses the power of the **Google Gemini API** to weave beautifully crafted narratives based on your prompts. Just select your preferred genre, tone, and length, type an idea, and watch the magic unfold!

No build tools or heavy frameworks required—just pure vanilla web technologies combined with a high-end, dynamic UI.

---

## 🚀 Features

- **🧠 Intelligent Storytelling**: Uses Google's state-of-the-art `gemini-2.5-flash` model (and fallbacks) to generate creative, complete stories.
- **🎛️ Total Creative Control**: Customize the **Genre** (Fantasy, Sci-Fi, Horror, etc.), **Length** (Short, Medium, Long), and **Tone** (Dramatic, Humorous, Dark, etc.).
- **🔒 Secure & Private**: Bring your own API key! Your Gemini API key is stored locally in your browser and never leaves your device.
- **🌗 Beautiful UI/UX**: Includes a sleek, modern responsive design with **Dark** and **Light** modes, smooth micro-interactions, CSS animations, and gradient text effects.
- **🛡️ Robust Error Handling**: Gracefully handles rate limits, invalid API keys, network issues, and Gemini's safety filters with user-friendly alerts.
- **⚡ Zero Setup**: No Node.js, no `npm install`, no build process. Just pure HTML, CSS, and JS.

## 🗂️ Project Structure

```text
📁 Story-Generator
├── 📄 index.html    # The main structural markup and application layout
├── 📄 style.css     # Premium styling, animations, themes, and responsiveness
├── 📄 index.js      # Core application logic, UI state, and Gemini API integration
└── 📄 README.md     # Project documentation
```

## 🔧 Setup & Usage

Since it's built with vanilla technologies, running the app is completely hassle-free!

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tanishkraj2005/Story-Generator.git
   cd Story-Generator
   ```
2. **Launch the application:**
   - Double-click `index.html` to open it in your default web browser.
   - Alternatively, you can use a local server like VS Code's **Live Server** extension for an optimal experience.
3. **API Key Setup:**
   - The app includes a default test key, but it may run out of quota rapidly.
   - For an uninterrupted experience, grab your own **FREE** API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Click the **"Change API Key"** button in the app and paste your secure key.
4. **Generate a Story:**
   - Adjust the genre, length, and tone dropdowns.
   - Type in a prompt (e.g., _"A detective finds a notebook that predicts crimes"_).
   - Press **Create Story** or hit <kbd>Enter</kbd>!

## 💻 Tech Stack & Customization

The underlying architecture relies strictly on modern web standards:

- **Semantic HTML5** for accessibility and layout.
- **Vanilla CSS3** using CSS Variables (`:root`) to handle theme switching seamlessly. You can easily adjust the aesthetics by tweaking `--clr-bg`, `--clr-accent`, etc. inside `style.css`.
- **Vanilla JavaScript (ES6+)** utilizing `async/await` and the native `fetch` API to communicate via REST with Google's Generative Language API.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](https://github.com/Tanishkraj2005/Story-Generator/issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open-source and created for educational and demonstration purposes. Feel free to use the code, learn from it, and build your own incredible AI applications!

---
<div align="center">
  <p>Crafted with 💜 and powered by Gemini</p>
</div>
