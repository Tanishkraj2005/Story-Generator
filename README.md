# AI Story Generator

This is a simple frontend web application that lets users generate AI-powered stories using Google Gemini. Choose a genre, length, and tone — then enter a story idea and the app uses the Gemini API to return a creative narrative.

## 🚀 Features

- Generate stories in multiple genres (fantasy, sci-fi, mystery, horror, etc.)
- Choose length (short, medium, long) and tone (dramatic, humorous, dark, whimsical, suspenseful)
- Stores optional user Gemini API key in browser local storage
- Dark/light theme toggle
- Responsive, accessible interface with keyboard support (press Enter to submit)
- Built with plain HTML, CSS and vanilla JavaScript; no build step required

## 🗂️ Project Structure

```
index.html    # Main UI markup
index.js      # Application logic and Gemini API calls
style.css     # Styling and theming
```

All files live in the project root so you can just open `index.html` in a browser.

## 🔧 Setup & Usage

1. **Clone or download** this repository to your machine.
2. **Open** `index.html` in a modern browser (Chrome, Edge, Firefox, etc.).
3. On first visit the app shows an API key modal:
   - The app has a built-in default Gemini key for quick testing, but it may run out of quota.
   - You can obtain your own free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and paste it into the modal. The key is stored locally and never sent to any server other than Gemini.
   - Click **Change API Key** in the top‑right at any time to swap keys.
4. Select a **genre**, **length**, and **tone** from the dropdowns.
5. Type a story idea into the input field and press **Create Story** or hit `Enter`.
6. The generated story will appear in the chat area. Scroll to read previous messages.

> Tip: The validation logic prevents very short inputs and obvious code snippets.

## 📁 How It Works

- `index.js` handles UI interactions, theme persistence, and API communication.
- `getStoryFromGemini()` constructs a prompt controlling word count, structure and language
  and tries several Gemini models (`gemini-2.5-flash`, etc.).
- API responses are parsed and displayed; common errors (invalid key, rate limits, safety
  blocks) are handled with user-friendly messages.
- Local storage is used for the API key and theme preference.

## ⚙️ Customization

- You can adjust available genres, tones, and lengths by editing the `<select>` elements
  in `index.html` and corresponding logic in `index.js`.
- The CSS variables in `style.css` allow you to tweak colors, radius, and shadows.

## 📝 Notes

- This is a client‑side demo; the API key is held in the browser and requests are sent
  directly to Google's servers.
- The included default API key is for convenience but may have limited quota. If the app
  fails due to rate limits, add your own key.
- Performance and safety rely on Gemini; the app does not perform additional moderation.

## 📄 License

This project is provided for educational/demo purposes and has no explicit license.
Feel free to adapt and reuse the code.
