(function() {
  // Inject CSS
  const style = document.createElement('style');
  style.innerHTML = `
    /* Floating Widget Styles */
    #ai-chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    #ai-chat-toggle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #60a5fa 0%, #c084fc 100%);
      color: white;
      border: none;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      margin-left: auto;
    }
    #ai-chat-toggle:hover {
      transform: scale(1.05);
    }
    #ai-chat-window {
      display: none;
      flex-direction: column;
      width: 350px;
      height: 500px;
      background-color: #0f172a;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
      margin-bottom: 15px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    #ai-chat-window.open {
      display: flex;
    }
    #ai-chat-header {
      background: rgba(30, 41, 59, 0.9);
      padding: 16px 20px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    #ai-chat-header h3 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 600;
    }
    #ai-chat-close {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0;
    }
    #ai-chat-messages {
      flex-grow: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    #ai-chat-messages::-webkit-scrollbar { width: 6px; }
    #ai-chat-messages::-webkit-scrollbar-track { background: transparent; }
    #ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
    .ai-msg-wrapper, .user-msg-wrapper {
      display: flex;
      width: 100%;
    }
    .user-msg-wrapper {
      justify-content: flex-end;
    }
    .ai-msg {
      background: #1e293b;
      color: #f8fafc;
      padding: 12px 16px;
      border-radius: 16px 16px 16px 4px;
      max-width: 85%;
      font-size: 0.9rem;
      line-height: 1.5;
      border: 1px solid rgba(255,255,255,0.05);
    }
    .user-msg {
      background: #3b82f6;
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 16px 16px 4px 16px;
      max-width: 85%;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    #ai-chat-input-area {
      padding: 16px 20px;
      background: rgba(30, 41, 59, 0.9);
      display: flex;
      gap: 12px;
      border-top: 1px solid rgba(255,255,255,0.05);
      margin: 0;
    }
    #ai-chat-input {
      flex-grow: 1;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 10px 16px;
      color: white;
      outline: none;
      font-size: 0.9rem;
    }
    #ai-chat-send {
      background: none;
      border: none;
      color: #60a5fa;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0;
      transition: transform 0.2s;
    }
    #ai-chat-send:hover {
      transform: scale(1.1);
    }
    .ai-msg pre { background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; overflow-x: auto; margin: 8px 0;}
    .ai-msg code { font-family: monospace; background: rgba(0,0,0,0.2); padding: 2px 4px; border-radius: 4px; font-size: 0.9em; }
    .ai-msg pre code { background: transparent; padding: 0; }
    .ai-msg p { margin: 0 0 8px 0; }
    .ai-msg p:last-child { margin: 0; }
    .ai-msg ul, .ai-msg ol { margin: 0 0 8px 0; padding-left: 20px; }
    .ai-msg ul:last-child, .ai-msg ol:last-child { margin: 0; }
  `;
  document.head.appendChild(style);

  // Inject HTML
  const widgetContainer = document.createElement('div');
  widgetContainer.innerHTML = `
    <div id="ai-chat-widget">
      <div id="ai-chat-window">
        <div id="ai-chat-header">
          <h3>AI Assistant</h3>
          <button id="ai-chat-close">✖</button>
        </div>
        <div id="ai-chat-messages"></div>
        <form id="ai-chat-input-area">
          <input type="text" id="ai-chat-input" placeholder="Type a message..." required autocomplete="off">
          <button type="submit" id="ai-chat-send">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
      <button id="ai-chat-toggle">
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>
    </div>
  `;
  document.body.appendChild(widgetContainer);

  // Load marked.js dynamically if not present, then initialize
  if (typeof marked === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    script.onload = initChat;
    document.head.appendChild(script);
  } else {
    initChat();
  }

  function initChat() {
    const toggleBtn = document.getElementById('ai-chat-toggle');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('ai-chat-close');
    const form = document.getElementById('ai-chat-input-area');
    const input = document.getElementById('ai-chat-input');
    const messagesDiv = document.getElementById('ai-chat-messages');
    
    const API_URL = 'http://127.0.0.1:5000/chat';
    
    // Generate a unique session ID for this instance of the widget
    const sessionId = 'session_' + Math.random().toString(36).substring(2, 15);

    toggleBtn.addEventListener('click', () => {
      chatWindow.classList.toggle('open');
      if (chatWindow.classList.contains('open')) {
        input.focus();
      }
    });
    closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));

    addMessage('Hello! How can I assist you today?', 'ai');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      
      addMessage(text, 'user');
      input.value = '';

      const msgDiv = addStreamingBubble();

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, session_id: sessionId })
        });

        if (!response.ok) {
          msgDiv.textContent = 'Error connecting to server.';
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          accumulated += decoder.decode(value, { stream: true });
          msgDiv.innerHTML = marked.parse(accumulated);
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
      } catch (err) {
        msgDiv.textContent = 'Failed to connect. Check if server is running.';
      }
    });

    function addMessage(text, sender) {
      const wrapper = document.createElement('div');
      wrapper.className = sender === 'ai' ? 'ai-msg-wrapper' : 'user-msg-wrapper';
      
      const msg = document.createElement('div');
      msg.className = sender === 'ai' ? 'ai-msg' : 'user-msg';
      
      if (sender === 'ai') {
        msg.innerHTML = marked.parse(text);
      } else {
        msg.textContent = text;
      }
      
      wrapper.appendChild(msg);
      messagesDiv.appendChild(wrapper);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function addStreamingBubble() {
      const wrapper = document.createElement('div');
      wrapper.className = 'ai-msg-wrapper';
      
      const msg = document.createElement('div');
      msg.className = 'ai-msg';
      msg.innerHTML = '<span style="opacity: 0.5;">...</span>'; 
      
      wrapper.appendChild(msg);
      messagesDiv.appendChild(wrapper);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
      
      return msg;
    }
  }
})();
