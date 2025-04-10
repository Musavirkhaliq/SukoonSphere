import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useUser } from "../context/UserContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  FaRegCommentDots,
  FaPlus,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPaperPlane,
  FaVolumeUp,
  FaVolumeMute,
  FaCompressAlt,
  FaTrash,
  FaEllipsisV,
  FaDownload,
  FaCopy,
  FaUserCircle,
  FaRobot,
  FaHistory,
  FaChevronRight,
  FaChevronLeft,
  FaSpinner,
  FaMoon,
  FaSun,
  FaRegBookmark,
  FaBookmark,
  FaShare
} from "react-icons/fa";
import "./FullScreenChatbot.css";
import { IoMdClose } from "react-icons/io";

const FullScreenChatbot = ({
  onClose,
  initialMessages = [],
  onSendMessage,
  voiceGender = "female",
  onVoiceGenderChange,
  isHistoryLoaded = false,
  user
}) => {
  // Initialize with the passed messages if available
  const [messages, setMessages] = useState(initialMessages.length > 0 ? initialMessages : []);
  // State for managing speech synthesis
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  // Use the voiceGender prop if provided, otherwise use state
  const [localVoiceGender, setLocalVoiceGender] = useState(voiceGender);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showMessageActions, setShowMessageActions] = useState(null);
  const [savedMessages, setSavedMessages] = useState([]);

  // Use the user prop if provided, otherwise get from context
  const userContext = useUser();
  const currentUser = user || userContext.user;
  const chatHistoryRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const wasListeningRef = useRef(false);

  // Speech recognition support check
  const isSpeechRecognitionSupported = useRef(
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
  );

  // Load chat history when component mounts
  useEffect(() => {
    if (currentUser) {
      fetchChatHistory();
    }

    // Load saved messages from localStorage
    const saved = localStorage.getItem('savedChatbotMessages');
    if (saved) {
      setSavedMessages(JSON.parse(saved));
    }

    // Load dark mode preference
    const darkModePref = localStorage.getItem('chatbotDarkMode');
    if (darkModePref) {
      setDarkMode(darkModePref === 'true');
    }
  }, [user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (isSpeechRecognitionSupported.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (currentUtterance) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Fetch chat history and conversations from the server
  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);

      // Fetch conversations first
      try {
        const conversationsResponse = await customFetch.get("/chatbot/conversations");
        if (conversationsResponse.data.conversations && conversationsResponse.data.conversations.length > 0) {
          setConversations(conversationsResponse.data.conversations);

          // Set the active conversation to the most recent one
          const activeConv = conversationsResponse.data.conversations.find(c => c.isActive) ||
            conversationsResponse.data.conversations[0];
          setActiveConversationId(activeConv._id);

          // Fetch messages for the active conversation
          await fetchConversationMessages(activeConv._id);
        } else {
          // No conversations found, use initial messages if available
          if (initialMessages && initialMessages.length > 0) {
            setMessages(initialMessages);
          } else {
            // Otherwise fetch from the default history endpoint
            const response = await customFetch.get("/chatbot/history");
            if (response.data.messages) {
              setMessages(response.data.messages);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);

        // Fallback to initial messages or history endpoint
        if (initialMessages && initialMessages.length > 0) {
          setMessages(initialMessages);
        } else {
          try {
            const response = await customFetch.get("/chatbot/history");
            if (response.data.messages) {
              setMessages(response.data.messages);
            }
          } catch (historyError) {
            console.error("Error fetching history:", historyError);
            toast.error("Failed to load chat history");
          }
        }
      }
    } catch (error) {
      console.error("Error in fetchChatHistory:", error);
      toast.error("Failed to load chat data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchConversationMessages = async (conversationId) => {
    try {
      setIsLoading(true);
      const response = await customFetch.get(`/chatbot/conversations/${conversationId}`);
      if (response.data.messages) {
        setMessages(response.data.messages);
        setActiveConversationId(conversationId);

        // Update conversations list to mark this one as active
        setConversations(prev => prev.map(conv => ({
          ...conv,
          isActive: conv._id === conversationId
        })));
      }
    } catch (error) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, error);
      toast.error("Failed to load conversation messages");
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new conversation
  const startNewConversation = async () => {
    try {
      setIsLoading(true);
      if (currentUser) {
        const response = await customFetch.post('/chatbot/new-conversation');

        // Clear messages for the new conversation
        setMessages([]);
        toast.success('Started a new conversation');

        // Refresh the conversations list to include the new conversation
        const conversationsResponse = await customFetch.get("/chatbot/conversations");
        if (conversationsResponse.data.conversations) {
          setConversations(conversationsResponse.data.conversations);

          // Find the newly created conversation (should be the active one)
          const newConversation = conversationsResponse.data.conversations.find(c => c.isActive);
          if (newConversation) {
            setActiveConversationId(newConversation._id);
          } else if (response.data.conversationId) {
            // If we have the ID from the response, use that
            setActiveConversationId(response.data.conversationId);
          }
        }
      } else {
        // For non-authenticated users, just clear messages
        setMessages([]);
        toast.success('Started a new conversation');
      }
    } catch (error) {
      console.error('Error starting new conversation:', error);
      toast.error('Failed to start new conversation');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle speech recognition
  const toggleListening = () => {
    if (!isSpeechRecognitionSupported.current) {
      toast.error('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setInput('');
    }
  };

  // Toggle voice gender for text-to-speech
  const toggleVoiceGender = () => {
    const newGender = localVoiceGender === "female" ? "male" : "female";
    setLocalVoiceGender(newGender);
    // If onVoiceGenderChange is provided, call it to sync with parent component
    if (onVoiceGenderChange) {
      onVoiceGenderChange(newGender);
    }
  };

  // Extract plain text from markdown for speech
  const extractTextFromMarkdown = (markdown) => {
    // Simple markdown to text conversion
    return markdown
      .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
      .replace(/\*(.+?)\*/g, '$1') // Italic
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Links
      .replace(/#{1,6}\s(.+?)\n/g, '$1. ') // Headers
      .replace(/```[\s\S]*?```/g, 'Code block omitted. ') // Code blocks
      .replace(/`(.+?)`/g, '$1') // Inline code
      .replace(/\n\s*[\*\-\+]\s(.+)/g, '. $1') // Unordered lists
      .replace(/\n\s*\d+\.\s(.+)/g, '. $1') // Ordered lists
      .replace(/\n\s*>\s(.+)/g, '. $1') // Blockquotes
      .replace(/\n\n/g, '. ') // Double line breaks
      .replace(/\n/g, ' ') // Single line breaks
      .replace(/\s+/g, ' ') // Multiple spaces
      .trim();
  };

  // Speak text using text-to-speech
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      if (isSpeaking) {
        stopSpeaking();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Get available voices
      const voices = window.speechSynthesis.getVoices();

      // Find a suitable voice based on gender preference
      let selectedVoice;
      if (localVoiceGender === "female") {
        selectedVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('female'));
      } else {
        selectedVoice = voices.find(voice => voice.name.includes('Male') || voice.name.includes('male'));
      }

      // Fallback to any available voice if no gender-specific voice is found
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentUtterance(null);
      };

      utterance.onerror = (event) => {
        console.error('SpeechSynthesis error:', event);
        setIsSpeaking(false);
        setCurrentUtterance(null);
      };

      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech is not supported in your browser.');
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentUtterance(null);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Store if we were in speech mode
    const wasSpeechMode = isListening;

    // Stop listening if active
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      wasListeningRef.current = true;
    }

    // Add user message to chat
    const userMessage = { sender: "user", text: message };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await customFetch.post("/chatbot/message", {
        message: message,
        chatHistory: messages,
      });

      const botResponse = response.data.response;
      const botMessage = { sender: "bot", text: botResponse };
      setMessages(prev => [...prev, botMessage]);

      // Update conversation list with latest message
      if (activeConversationId) {
        setConversations(prev => {
          return prev.map(conv => {
            if (conv._id === activeConversationId) {
              return {
                ...conv,
                lastMessage: message.length > 30 ? message.substring(0, 30) + '...' : message,
                updatedAt: new Date().toISOString()
              };
            }
            return conv;
          });
        });
      }

      // Automatically read the response aloud if we were in speech mode
      if (wasSpeechMode) {
        setTimeout(() => {
          speakText(botResponse);
        }, 100);
      }
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      let errorMessage = "Failed to get a response. Please try again later.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast.error(errorMessage);

      // Add error message to chat
      const botErrorMessage = {
        sender: "bot",
        text: "I'm having trouble connecting right now. Please try again later."
      };
      setMessages(prev => [...prev, botErrorMessage]);
    } finally {
      setIsLoading(false);
      wasListeningRef.current = false;
    }
  };

  // Handle sending a message with the send button
  const handleSend = () => {
    handleSendMessage(input);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('chatbotDarkMode', newMode.toString());
  };

  // Save a message
  const saveMessage = (message) => {
    const updatedSavedMessages = [...savedMessages, message];
    setSavedMessages(updatedSavedMessages);
    localStorage.setItem('savedChatbotMessages', JSON.stringify(updatedSavedMessages));
    toast.success('Message saved');
    setShowMessageActions(null);
  };

  // Remove a saved message
  const removeSavedMessage = (index) => {
    const updatedSavedMessages = [...savedMessages];
    updatedSavedMessages.splice(index, 1);
    setSavedMessages(updatedSavedMessages);
    localStorage.setItem('savedChatbotMessages', JSON.stringify(updatedSavedMessages));
    toast.success('Message removed from saved');
  };

  // Copy message to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Copied to clipboard');
        setShowMessageActions(null);
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
        toast.error('Failed to copy text');
      });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get conversation title
  const getConversationTitle = (conversation) => {
    // If the conversation has a title, use it
    if (conversation.title && conversation.title !== 'New Conversation') {
      return conversation.title;
    }

    // Otherwise, use the first user message as the title
    if (conversation._id === activeConversationId && messages.length > 0) {
      const firstUserMessage = messages.find(msg => msg.sender === 'user');
      if (firstUserMessage) {
        return firstUserMessage.text.length > 25
          ? firstUserMessage.text.substring(0, 25) + '...'
          : firstUserMessage.text;
      }
    }

    // Fallback to default title
    return conversation.title || 'New Conversation';
  };

  return (
    <div className={`fullscreen-chatbot ${darkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            className="chatbot-sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="sidebar-header">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
                <button className="bg-transparent border-none p-0 cursor-pointer" onClick={() => setShowSidebar(false)}>
                  <IoMdClose className="text-black text-2xl" />
                </button>
              </div>
              <button
                className="new-chat-button"
                onClick={startNewConversation}
                title="Start a new conversation"
              >
                <FaPlus />
                <span>New Chat</span>
              </button>
            </div>

            <div className="conversations-list">
              <h3 className="sidebar-section-title">Chat History</h3>
              <p className="sidebar-section-description">
                Your previous conversations are saved here. Click on any conversation to continue where you left off.
              </p>

              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner">
                    <FaSpinner className="animate-spin" />
                  </div>
                  <p className="loading-text">Loading conversations...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="empty-state">
                  <p>No conversation history yet</p>
                  <p className="empty-state-hint">Start chatting to create your first conversation</p>
                </div>
              ) : (
                conversations.map(conversation => (
                  <div
                    key={conversation._id}
                    className={`conversation-item ${conversation._id === activeConversationId ? 'active' : ''}`}
                    onClick={() => fetchConversationMessages(conversation._id)}
                  >
                    <div className="conversation-icon">
                      <FaRegCommentDots />
                    </div>
                    <div className="conversation-details">
                      <div className="conversation-title">
                        {getConversationTitle(conversation)}
                      </div>
                      <div className="conversation-meta">
                        <div className="conversation-preview">
                          {conversation.lastMessage || 'No messages yet'}
                        </div>
                        <div className="conversation-date">
                          {formatDate(conversation.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {isLoading && (
              <div className="sidebar-loading-overlay">
                <FaSpinner className="animate-spin" />
              </div>
            )}

            <div className="sidebar-section">
              <h3>Saved Messages</h3>
              <div className="saved-messages-list">
                {savedMessages.length === 0 ? (
                  <div className="empty-state">
                    <p>No saved messages yet</p>
                    <p className="empty-state-hint">Click the bookmark icon on any message to save it</p>
                  </div>
                ) : (
                  savedMessages.map((message, index) => (
                    <div key={index} className="saved-message-item">
                      <div className="saved-message-text">{message.text}</div>
                      <div className="saved-message-actions">
                        <button
                          onClick={() => copyToClipboard(message.text)}
                          title="Copy to clipboard"
                        >
                          <FaCopy />
                        </button>
                        <button
                          onClick={() => removeSavedMessage(index)}
                          title="Remove from saved"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="sidebar-footer">
              <button
                className="theme-toggle"
                onClick={toggleDarkMode}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="chatbot-main">
        <div className="chatbot-header">
          <button
            className="sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
            title={showSidebar ? "Hide sidebar" : "Show sidebar"}
          >
            {showSidebar ? <FaChevronLeft /> : <FaChevronRight />}
          </button>

          <div className="header-title">
            <h2>SukoonSphere AI Assistant</h2>
            <div className="header-subtitle">
              {currentUser ? `Logged in as ${currentUser.name}` : 'Guest Mode'}
            </div>
          </div>

          <div className="header-controls">
            <div className="voice-controls">
              <button
                className="read-aloud-toggle"
                onClick={() => {
                  // If we have messages and the last one is from the bot, read it aloud
                  if (messages.length > 0) {
                    const lastBotMessage = [...messages].reverse().find(msg => msg.sender === 'bot');
                    if (lastBotMessage) {
                      if (isSpeaking) {
                        stopSpeaking();
                      } else {
                        speakText(extractTextFromMarkdown(lastBotMessage.text));
                      }
                    } else {
                      toast.info('No bot messages to read');
                    }
                  } else {
                    toast.info('No messages to read');
                  }
                }}
                title={isSpeaking ? "Stop reading" : "Read last response aloud"}
              >
                {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
                <span className="control-label">{isSpeaking ? "Stop" : "Read Aloud"}</span>
              </button>

              <button
                className="voice-toggle"
                onClick={toggleVoiceGender}
                title={`Switch to ${localVoiceGender === "female" ? "male" : "female"} voice`}
              >
                {localVoiceGender === "female" ? '👩' : '👨'}
                <span className="control-label">{localVoiceGender === "female" ? "Female" : "Male"} Voice</span>
              </button>
            </div>

            <button
              className="minimize-button"
              onClick={onClose}
              title="Minimize chatbot"
            >
              <FaCompressAlt />
              <span className="control-label">Minimize</span>
            </button>
          </div>
        </div>

        <div className="chat-history" ref={chatHistoryRef}>
          {messages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-icon">🤖</div>
              <h3>Hello{currentUser ? `, ${currentUser.name}` : ''}!</h3>
              <p>I'm SukoonSphere's AI assistant. How can I help you today?</p>
              <p>You can ask me about mental health, wellness tips, or how to use this website.</p>

              <div className="welcome-features">
                <div className="feature-item">
                  <div className="feature-icon">🎤</div>
                  <div className="feature-text">Click the microphone to speak to me</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔊</div>
                  <div className="feature-text">I can read my responses aloud</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💾</div>
                  <div className="feature-text">Save important messages for later</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🌙</div>
                  <div className="feature-text">Toggle dark mode for comfortable viewing</div>
                </div>
              </div>

              <div className="welcome-suggestions">
                <h4>Try asking me:</h4>
                <div className="suggestion-buttons">
                  <button onClick={() => handleSendMessage("What are some techniques to manage anxiety?")}>
                    Anxiety management techniques
                  </button>
                  <button onClick={() => handleSendMessage("How can I improve my sleep quality?")}>
                    Sleep improvement tips
                  </button>
                  <button onClick={() => handleSendMessage("What features does this website offer?")}>
                    Website features
                  </button>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === "user" ? (
                    <FaUserCircle className="user-avatar" />
                  ) : (
                    <FaRobot className="bot-avatar" />
                  )}
                </div>

                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">
                      {msg.sender === "user" ? (currentUser?.name || "You") : "SukoonSphere AI"}
                    </span>
                    {msg.timestamp && (
                      <span className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  <div className="message-bubble">
                    {msg.sender === "bot" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={atomDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>

                  <div className="message-actions">
                    {msg.sender === "bot" && (
                      <button
                        className={`action-button speak-button ${isSpeaking && currentUtterance && index === messages.length - 1 ? 'active' : ''}`}
                        onClick={() => {
                          if (isSpeaking && currentUtterance && index === messages.length - 1) {
                            stopSpeaking();
                          } else {
                            // For bot messages, extract plain text from markdown before speaking
                            if (msg.sender === "bot") {
                              speakText(extractTextFromMarkdown(msg.text));
                            } else {
                              speakText(msg.text);
                            }
                          }
                        }}
                        title={isSpeaking && currentUtterance && index === messages.length - 1 ? "Stop speaking" : "Listen to this message"}
                      >
                        {isSpeaking && currentUtterance && index === messages.length - 1 ? <FaVolumeMute /> : <FaVolumeUp />}
                      </button>
                    )}

                    <button
                      className="action-button copy-button"
                      onClick={() => copyToClipboard(msg.text)}
                      title="Copy to clipboard"
                    >
                      <FaCopy />
                    </button>

                    <button
                      className={`action-button save-button ${savedMessages.some(saved => saved.text === msg.text) ? 'active' : ''}`}
                      onClick={() => {
                        if (savedMessages.some(saved => saved.text === msg.text)) {
                          const index = savedMessages.findIndex(saved => saved.text === msg.text);
                          removeSavedMessage(index);
                        } else {
                          saveMessage(msg);
                        }
                      }}
                      title={savedMessages.some(saved => saved.text === msg.text) ? "Remove from saved" : "Save message"}
                    >
                      {savedMessages.some(saved => saved.text === msg.text) ? <FaBookmark /> : <FaRegBookmark />}
                    </button>

                    <div className="action-dropdown">
                      <button
                        className="action-button more-button"
                        onClick={() => setShowMessageActions(showMessageActions === index ? null : index)}
                        title="More options"
                      >
                        <FaEllipsisV />
                      </button>

                      {showMessageActions === index && (
                        <div className="dropdown-menu">
                          <button onClick={() => copyToClipboard(msg.text)}>
                            <FaCopy /> Copy text
                          </button>
                          <button onClick={() => saveMessage(msg)}>
                            <FaRegBookmark /> Save message
                          </button>
                          <button onClick={() => {/* Implement share functionality */ }}>
                            <FaShare /> Share
                          </button>
                          {msg.sender === "bot" && (
                            <button onClick={() => {/* Implement download functionality */ }}>
                              <FaDownload /> Download
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="message bot">
              <div className="message-avatar">
                <FaRobot className="bot-avatar" />
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">SukoonSphere AI</span>
                </div>
                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
              placeholder={isListening ? "Listening... (speak now)" : "Type your message..."}
              disabled={isLoading || isListening}
              className={isListening ? 'listening' : ''}
            />

            <button
              className={`mic-button ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              disabled={isLoading}
              title={isListening ? "Stop listening" : "Speak your message"}
            >
              {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !isListening)}
            className={`btn-2 ${isLoading ? 'loading' : ''}`}
            title="Send message"
          >
            {isLoading ? <FaSpinner className="spin" /> : <FaPaperPlane />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullScreenChatbot;
