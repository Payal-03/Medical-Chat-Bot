import { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import custom CSS

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    setInput('');
    setIsBotTyping(true);

    try {
      const response = await axios.post('http://localhost:5000/chat', {
        message: input
      });
      const botMessage = { sender: 'bot', text: response.data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const botMessage = { sender: 'bot', text: 'Error contacting server.' };
      setMessages(prev => [...prev, botMessage]);
    }

    setIsBotTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <h1 className="header">Medical Assistant Chatbot</h1>

      <div className="chat-box">
        <div className="message-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}`}>
              <span className="message-text">{msg.text}</span>
            </div>
          ))}

          {isBotTyping && (
            <div className="message bot typing">
              <span className="message-text">...</span>
            </div>
          )}
        </div>

        <div className="input-container">
          <input
            className="chat-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
          />
          <button className="send-btn" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
