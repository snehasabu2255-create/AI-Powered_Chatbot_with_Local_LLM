# Local AI Assistant 🤖

A lightweight, modern, and highly responsive AI chatbot built with **Python (Flask)**, **LangChain**, and **Ollama**. This project provides a seamless conversational experience powered entirely by a locally hosted Large Language Model (`qwen3:1.7b`), ensuring 100% data privacy and zero reliance on external cloud APIs.

It features a ChatGPT-style real-time streaming interface and includes an **Embeddable Chat Widget** that can be injected into any external website.

---

## ✨ Key Features

- **Local LLM Execution**: Leverages LangChain and Ollama to process all natural language queries locally.
- **Real-Time Streaming**: Delivers answers instantly, token-by-token, minimizing perceived latency and providing a fluid typing effect.
- **Session Memory & Context**: Automatically tracks conversation history across multiple turns using unique session IDs, allowing continuous and context-aware interactions without external databases.
- **Modern UI**: Clean, responsive frontend built with Vanilla HTML5, CSS3, and JavaScript. Includes live Markdown rendering and code-block formatting via `marked.js`.
- **Embeddable Widget**: Provides a drop-in `<script>` snippet that seamlessly adds a floating chat widget to any third-party web page, powered securely by Flask-CORS.

## 🛠️ Technology Stack

- **Backend Framework**: Python, Flask, Flask-CORS
- **AI Orchestration**: LangChain, LangChain-Ollama
- **Language Model**: Ollama (`qwen3:1.7b` by default, easily swappable)
- **Frontend**: Vanilla JavaScript (ES6+), CSS3, HTML5

---

## 🚀 Getting Started

### Prerequisites

1. **Python 3.8+**
2. **Ollama**: Download and install [Ollama](https://ollama.com/) for your operating system.
3. Pull the required language model to your local machine:
   ```bash
   ollama pull qwen3:1.7b
   ```

### Installation

1. Clone this repository (or download the source):
   ```bash
   git clone https://github.com/yourusername/local-ai-assistant.git
   cd local-ai-assistant
   ```

2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. Ensure your Ollama service is running in the background.
2. Start the Flask application:
   ```bash
   python app.py
   ```
3. Open your preferred web browser and navigate to `http://127.0.0.1:5000`. 

---

## 📦 Embedding the Widget

You can easily embed this AI Assistant into any external website. Simply copy and paste the following snippet into the `<body>` of your website's HTML:

```html
<!-- Include this single line of JavaScript to embed the AI Chat Widget -->
<script src="http://127.0.0.1:5000/static/widget.js"></script>
```

> **Note**: The backend uses `Flask-CORS` to securely accept cross-origin requests. If your backend is deployed to a remote server, update the `API_URL` variable in `static/widget.js` to match your remote domain.

---

## 🗂️ Project Structure

```text
.
├── app.py                   # Main Flask application and API routing
├── memory.py                # Lightweight session memory management logic
├── requirements.txt         # Python dependency list
├── templates/
│   └── index.html           # Main chat interface HTML
└── static/
    ├── style.css            # UI styling and responsive layouts
    ├── script.js            # Client-side streaming and DOM logic for main app
    └── widget.js            # Standalone embeddable floating widget logic
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
