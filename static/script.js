document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');

    // Add initial greeting on load
    addMessage("Hello! I'm your AI assistant running locally. How can I help you today?", 'ai');

    // Generate a unique session ID for the main chat interface
    const sessionId = 'session_' + Math.random().toString(36).substring(2, 15);

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const messageText = messageInput.value.trim();
        if (!messageText) return;

        // 1. Render User Message
        addMessage(messageText, 'user');
        messageInput.value = '';

        // 2. Render empty AI message bubble for streaming
        const messageId = 'msg-' + Date.now();
        const messageDiv = createMessageBubble('', 'ai', messageId);
        
        // 3. Render typing indicator while waiting for first byte
        const loadingId = addLoadingIndicatorToBubble(messageDiv);

        try {
            // 4. Send AJAX/Fetch POST Request
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText, session_id: sessionId }),
            });

            if (!response.ok) {
                removeElement(loadingId);
                messageDiv.textContent = 'Error connecting to the server.';
                return;
            }
            
            removeElement(loadingId);

            // 5. Read the stream using ReadableStream
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            let accumulatedMessage = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                
                // Accumulate text and parse as Markdown
                accumulatedMessage += chunk;
                messageDiv.innerHTML = marked.parse(accumulatedMessage);
                
                // Scroll to bottom as text arrives
                scrollToBottom(true);
            }
        } catch (error) {
            removeElement(loadingId);
            messageDiv.textContent = 'Error connecting to the server. Please ensure the Flask app and Ollama are running.';
        }
    });

    /**
     * Creates and appends a message bubble, returning the inner message element.
     */
    function createMessageBubble(text, sender, id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${sender}`;
        if (id) wrapper.id = id + '-wrapper';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        if (id) messageDiv.id = id;
        messageDiv.textContent = text;
        
        wrapper.appendChild(messageDiv);
        chatMessages.appendChild(wrapper);
        scrollToBottom(true);
        
        return messageDiv;
    }

    /**
     * Appends a static message bubble to the chat container.
     */
    function addMessage(text, sender) {
        createMessageBubble(text, sender);
    }

    /**
     * Adds an animated typing indicator inside a message bubble.
     */
    function addLoadingIndicatorToBubble(messageDiv) {
        const id = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = id;
        loadingDiv.className = 'typing-indicator';
        loadingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messageDiv.appendChild(loadingDiv);
        return id;
    }

    /**
     * Removes an element by its ID.
     */
    function removeElement(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    /**
     * Scrolls the chat view to the bottom.
     * @param {boolean} smooth - Whether to use smooth scrolling.
     */
    function scrollToBottom(smooth = false) {
        if (smooth) {
            chatMessages.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        } else {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
});
