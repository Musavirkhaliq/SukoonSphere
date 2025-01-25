// import React, { useState } from "react";
// import "./Chatbot.css";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const handleSend = async () => {
//     if (!input) return;
//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     // Call ChatGPT API
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer YOUR_API_KEY",
//       },
//       body: JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: input }],
//       }),
//     });
//     const data = await response.json();
//     const botMessage = { sender: "bot", text: data.choices[0].message.content };
//     setMessages((prev) => [...prev, botMessage]);
//   };

//   return (
//     <div className="chatbot">
//       <div className="chat-history">
//         {messages.map((msg, index) => (
//           <div key={index} className={msg.sender}>
//             {msg.text}
//           </div>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyPress={(e) => e.key === "Enter" && handleSend()}
//         placeholder="Type your message..."
//       />
//       <button onClick={handleSend}>Send</button>
//     </div>
//   );
// };

// export default Chatbot;

// Chatbot Component (Updated)
import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response for demonstration purposes
    setTimeout(() => {
      const botMessage = { sender: "bot", text: `You said: ${input}` };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="chatbot">
      <div className="chat-header">Chat with Us 🤖</div>
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
