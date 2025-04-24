import React, { useState } from 'react';
import { handleLogout } from '../utils/api';
import { uploadDocument } from '../utils/api';
import '../styles/Home.css'
const Home = () => {
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [input, setInput] = useState('');
  const [selectedChatIndex, setSelectedChatIndex] = useState(null);

  

  const handleSend = async () => {
    if (!input.trim() && !uploadedFile) return;
  

    const tempMessage = {
      sender: 'user',
      text: input.trim() || (uploadedFile ? 'Envoi du fichier en cours...' : ''),
      file: null,
    };
  
    const updatedMessages = [...messages, tempMessage];
    setMessages(updatedMessages);
    setInput('');
  
    
    if (!uploadedFile) {
      updateHistory(updatedMessages);
      return;
    }
  
    try {
   
      const result = await uploadDocument(uploadedFile, input || 'Document sans titre');
  

      const apiMessage = {
        sender: 'user',
        text: `📄 **${result.title}**\nLangue détectée : ${result.language.toUpperCase()}\nNombre de mots : ${result.wordCount}\n\nAperçu :\n${result.content.slice(0, 200)}...`,
        file: null,
      };
  
      const finalMessages = [...updatedMessages.slice(0, -1), apiMessage];
      setMessages(finalMessages);
      setUploadedFile(null);
  
      updateHistory(finalMessages);
    } catch (error) {
      console.error('Erreur upload :', error);
      alert("Erreur lors de l'envoi du document.");
      setUploadedFile(null);
    }
  };
  

  const handleSelectHistory = (index) => {
    setSelectedChatIndex(index);
    setMessages(history[index].messages);
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedChatIndex(null);
    setUploadedFile(null);
  };


  return (
    <div className="chatboard">
      <div className="sidebar">
        <button onClick={handleNewChat} className="new-chat-btn">+ Nouvelle conversation</button>
        <ul className="chat-history">
          {history.map((chat, index) => (
            <li
              key={chat.id}
              className={index === selectedChatIndex ? 'active' : ''}
              onClick={() => handleSelectHistory(index)}
            >
              Conversation {index + 1}
              <br />
              <small>{chat.date}</small>
            </li>
          ))}
        </ul>
        <button onClick={handleLogout}>Deconnexion</button>
      </div>

      <div className="chat-area">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              {msg.text}
              {msg.file && (
                <div className="file-attachment">
                  <span>Fichier: {msg.file.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="chat-input-container">
  {uploadedFile && (
    <div className="file-preview">
      <span>{uploadedFile.name}</span>
      <button onClick={() => setUploadedFile(null)}>×</button>
    </div>
  )}
  
  <div className="chat-input">
    <input
      type="text"
      placeholder="Saisissez ou collez du texte..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
    />
    
    <div className="action-buttons">
      <label className="upload-btn">
        <input
          type="file"
          className="file-input"
          onChange={(e) => setUploadedFile(e.target.files[0])}
        />
        📎
      </label>
      <button className="send-btn" onClick={handleSend}>
        Send
      </button>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default Home;