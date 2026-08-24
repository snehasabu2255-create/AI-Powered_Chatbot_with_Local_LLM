"""
Helper module for Chat History / Memory Management.
Handles storing and retrieving session memory per user/session.
"""
from typing import List, Dict
import logging
from collections import defaultdict

# Dictionary to store memory for multiple sessions.
# Format: { 'session_id': [{'role': 'user', 'content': '...'}, ...] }
_sessions: Dict[str, List[Dict[str, str]]] = defaultdict(list)

def get_history_context(session_id: str = "default") -> str:
    """
    Retrieves the formatted chat history context for a specific session.
    Returns an empty string if history is empty.
    """
    try:
        session_memory = _sessions.get(session_id, [])
        if not session_memory:
            return ""
        
        context = "--- Conversation History ---\n"
        for msg in session_memory:
            role = "User" if msg["role"] == "user" else "Assistant"
            context += f"{role}: {msg['content']}\n"
        context += "---------------------------\n"
        return context
    except Exception as e:
        logging.error(f"Failed to get history context for session {session_id}: {e}")
        return ""

def add_message(role: str, content: str, session_id: str = "default") -> None:
    """
    Appends a new message to the session memory.
    Keeps only the most recent 20 messages per session.
    """
    try:
        if role not in ["user", "assistant"]:
            return
            
        session_memory = _sessions[session_id]
        session_memory.append({"role": role, "content": content})
        
        # Trim history if it gets too long
        while len(session_memory) > 20:
            session_memory.pop(0)
    except Exception as e:
        logging.error(f"Failed to add message to history for session {session_id}: {e}")
