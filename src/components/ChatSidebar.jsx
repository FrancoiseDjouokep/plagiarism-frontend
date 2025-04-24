import React from 'react';

const ChatSidebar = ({ conversations, onSelect, onNew, selected }) => {
  return (
    <div className="chat-sidebar">
      <button onClick={onNew} className="new-chat-btn">+ Nouvelle conversation</button>
      <ul className="chat-history">
        {conversations.map((_, i) => (
          <li
            key={i}
            className={selected === i ? 'active' : ''}
            onClick={() => onSelect(i)}
          >
            Conversation {i + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
