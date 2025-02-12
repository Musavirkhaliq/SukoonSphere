
// Chat.js (Main Component)
import React, { useState } from 'react';
import{
  ChatSidebar,  
  ChatHeader,
  ChatInput,
  ChatMessages,} from '../../components/index.jsx'

const Chat = () => {
  const [activeConversation, setActiveConversation] = useState(4);
  
  // Sample data - Replace with your actual data
  const conversations = [
    { id: 1, name: 'Ralph Hitman', message: 'Lorem ipsum simply dummy text', online: true },
    { id: 2, name: 'Deisy Fernandus', message: 'Lorem ipsum simply dummy text', online: false, unread: true },
    { id: 3, name: 'Luther Bin', message: 'Lorem ipsum simply dummy text', online: true },
    { id: 4, name: 'Ram Kumar', message: 'Lorem ipsum simply dummy text', online: true },
  ];

  const messages = [
    { id: 1, content: 'Hi.. Prem, How are you doing?', isSent: false },
    { id: 2, content: "Hy Ram ki... I'm good! How about You?", isSent: true },
    { id: 3, type: 'audio', duration: '3:44', isSent: true },
  ];

  const activeUser = conversations.find(conv => conv.id === activeConversation);

  const handleSendMessage = (message) => {
    console.log('Sending message:', message);
    // Add your message sending logic here
  };

  return (
    <div className="flex h-screen bg-gray-50 p-4">
      <div className="flex w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <ChatSidebar
          conversations={conversations}
          activeId={activeConversation}
          onSelectConversation={setActiveConversation}
        />
        <div className="flex-1 flex flex-col">
          <ChatHeader activeUser={activeUser} />
          <ChatMessages messages={messages} />
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chat;