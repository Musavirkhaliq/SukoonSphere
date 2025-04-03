import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import ChatbotAttention from "./ChatbotAttention";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const { user } = useUser();
  const chatHistoryRef = useRef(null);
  const recognitionRef = useRef(null);

  // Check if browser supports speech recognition
  const isSpeechRecognitionSupported = useRef(
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, []);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    const synth = window.speechSynthesis;
    return () => {
      if (currentUtterance) {
        synth.cancel();
      }
    };
  }, [currentUtterance]);

  // Load chat history for authenticated users
  useEffect(() => {
    const loadChatHistory = async () => {
      // Only load history if user is logged in and history hasn't been loaded yet
      if (user && !isHistoryLoaded) {
        try {
          setIsLoading(true);
          const response = await customFetch.get('/chatbot/history');
          if (response.data.messages && response.data.messages.length > 0) {
            setMessages(response.data.messages);
          }
          setIsHistoryLoaded(true);
        } catch (error) {
          console.error('Error loading chat history:', error);
          // Don't show error toast to user as this is a background operation
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadChatHistory();
  }, [user, isHistoryLoaded]);

  // Scroll to bottom of chat history when messages change
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // Separate function to handle sending a specific message
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Clear any existing timers to prevent duplicate sends
    if (recognitionRef.current && recognitionRef.current.silenceTimer) {
      clearTimeout(recognitionRef.current.silenceTimer);
      recognitionRef.current.silenceTimer = null;
    }

    // Save whether we were in speech mode before sending
    const wasSpeechMode = isListening || wasListeningRef.current;
    console.log('Was in speech mode:', wasSpeechMode);

    const userMessage = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Stop listening if still active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    try {
      console.log('Sending message to chatbot:', message);
      const response = await customFetch.post("/chatbot/message", {
        message: message,
        chatHistory: messages,
      });

      const botResponse = response.data.response;
      console.log('Received response from chatbot:', botResponse);

      const botMessage = { sender: "bot", text: botResponse };
      setMessages((prev) => [...prev, botMessage]);

      // Automatically read the response aloud if we were in speech mode
      if (wasSpeechMode) {
        console.log('Auto-reading response aloud');
        // Small delay to ensure UI updates first
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
      setMessages((prev) => [...prev, botErrorMessage]);
    } finally {
      setIsLoading(false);
      // Reset the speech mode flag after handling the message
      wasListeningRef.current = false;
    }
  };

  // Handler for the send button
  const handleSend = () => {
    handleSendMessage(input);
  };

  const toggleChatbot = () => {
    const newState = !isChatbotOpen;
    setIsChatbotOpen(newState);

    // Stop speaking when closing the chatbot
    if (isChatbotOpen && isSpeaking) {
      stopSpeaking();
    }

    // If opening the chatbot and user is logged in but history not loaded yet
    if (newState && user && !isHistoryLoaded) {
      // This will trigger the useEffect to load chat history
      setIsHistoryLoaded(false);
    }
  };

  // Reference to track if we were in listening mode
  const wasListeningRef = useRef(false);

  const toggleListening = () => {
    if (!isSpeechRecognitionSupported.current) {
      toast.error('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      // Manually stopping - force recognition to end
      recognitionRef.current.stop();
      // If there's input, send it immediately
      if (input.trim().length > 0) {
        handleSendMessage(input);
      }
    } else {
      // Starting new recognition
      setInput('');
      wasListeningRef.current = true;

      try {
        // Create a new recognition instance to avoid issues with restarting
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        // Re-attach event handlers
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

          setInput(transcript);
          console.log('Transcript updated:', transcript);

          // Check if this is a final result and there's a pause
          if (event.results[event.results.length - 1].isFinal) {
            // Use a debounced approach - if speech pauses for 1.5 seconds, send the message
            clearTimeout(recognitionRef.current.silenceTimer);
            recognitionRef.current.silenceTimer = setTimeout(() => {
              if (isListening && transcript.trim()) {
                console.log('Sending message after pause in speech');
                handleSendMessage(transcript);
              }
            }, 1500);
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Recognition ended');
          // If we still have text and we're still in listening mode, send it
          if (input.trim() && isListening) {
            handleSendMessage(input);
          }
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast.error('Speech recognition failed. Please try again.');
        };

        // Start recognition
        recognitionRef.current.start();
        setIsListening(true);

        // Show a toast to guide the user
        toast.info('Speak now. Your message will send automatically when you pause.', {
          autoClose: 3000,
          position: 'bottom-center'
        });
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error('Failed to start speech recognition. Please try again.');
      }
    }
  };

  const speakText = (text) => {
    // Stop any current speech
    stopSpeaking();

    const synth = window.speechSynthesis;

    // Force voices to load if they haven't already
    if (synth.getVoices().length === 0) {
      // Some browsers need a small delay to load voices
      setTimeout(() => speakTextWithVoices(text, synth), 100);
      return;
    }

    speakTextWithVoices(text, synth);
  };

  const speakTextWithVoices = (text, synth) => {
    const voices = synth.getVoices();
    console.log('Available voices:', voices.length);

    // Select voice based on gender preference
    const maleVoicePreferences = [
      "Microsoft David", "Google UK English Male", "en-GB-Standard-B", "en-US-Standard-B"
    ];

    const femaleVoicePreferences = [
      "Microsoft Zira", "Google UK English Female", "en-GB-Standard-A", "en-US-Standard-C"
    ];

    const preferredVoices = voiceGender === "male" ? maleVoicePreferences : femaleVoicePreferences;

    let selectedVoice = null;
    for (const preference of preferredVoices) {
      const voice = voices.find(v => v.name.includes(preference));
      if (voice) {
        selectedVoice = voice;
        console.log('Selected voice:', voice.name);
        break;
      }
    }

    // If no preferred voice found, use any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.includes('en'));
      if (selectedVoice) {
        console.log('Fallback to English voice:', selectedVoice.name);
      }
    }

    // If still no voice, use the first available voice
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
      console.log('Using default voice:', selectedVoice.name);
    }

    // Create a single utterance for the entire text
    const utterance = new SpeechSynthesisUtterance(text);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Voice settings
    if (voiceGender === "male") {
      utterance.pitch = 0.95;
      utterance.rate = 0.98;
    } else {
      utterance.pitch = 1.1;
      utterance.rate = 0.95;
    }

    utterance.volume = 1;

    utterance.onend = () => {
      console.log('Speech synthesis completed');
      setIsSpeaking(false);
      setCurrentUtterance(null);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      setCurrentUtterance(null);
    };

    setCurrentUtterance(utterance);
    setIsSpeaking(true);

    console.log('Speaking text:', text);
    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsSpeaking(false);
    setCurrentUtterance(null);
  };

  const toggleVoiceGender = () => {
    setVoiceGender(prev => prev === "female" ? "male" : "female");
  };

  // Function to open the chatbot (used by ChatbotAttention)
  const openChatbot = () => {
    if (!isChatbotOpen) {
      setIsChatbotOpen(true);

      // If user is logged in but history not loaded yet
      if (user && !isHistoryLoaded) {
        setIsHistoryLoaded(false);
      }
    }
  };

  return (
    <>
      {/* Chatbot Attention component */}
      <ChatbotAttention onOpenChatbot={openChatbot} />

      {/* Chatbot toggle button */}
      <button
        className="chatbot-toggle"
        onClick={toggleChatbot}
        aria-label="Toggle chatbot"
      >
        {isChatbotOpen ? '✕' : '💬'}
      </button>

      {/* Chatbot window */}
      <div className={`chatbot ${isChatbotOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <span>Chat with SukoonSphere AI 🤖</span>
          <div className="header-controls">
            {user && (
              <button
                className="new-chat-button"
                onClick={async () => {
                  try {
                    await customFetch.post('/chatbot/new-conversation');
                    setMessages([]);
                    toast.success('Started a new conversation');
                  } catch (error) {
                    console.error('Error starting new conversation:', error);
                    toast.error('Failed to start new conversation');
                  }
                }}
                title="Start a new conversation"
              >
                ➕
              </button>
            )}
            <button
              className="voice-toggle"
              onClick={toggleVoiceGender}
              title={`Switch to ${voiceGender === "female" ? "male" : "female"} voice`}
            >
              {voiceGender === "female" ? '👩' : '👨'}
            </button>
            <button className="close-button" onClick={toggleChatbot}>✕</button>
          </div>
        </div>
        <div className="chat-history" ref={chatHistoryRef}>
          {messages.length === 0 ? (
            <div className="welcome-message">
              <p>Hello{user ? `, ${user.name}` : ''}! I'm SukoonSphere's AI assistant. How can I help you today?</p>
              <p>You can ask me about mental health, wellness tips, or how to use this website.</p>
              <div className="welcome-features">
                <p><span className="feature-icon">🎤</span> Click the microphone to speak to me</p>
                <p><span className="feature-icon">🔊</span> Click the speaker on my messages to hear them</p>
                {user ? (
                  <p><span className="feature-icon">💾</span> Your conversations are saved automatically</p>
                ) : (
                  <p><span className="feature-icon">🔒</span> <a href="/auth/sign-in" className="login-link">Sign in</a> to save your conversations</p>
                )}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-bubble">
                  {msg.text}
                  {msg.sender === "bot" && (
                    <button
                      className={`speak-button ${isSpeaking && currentUtterance && index === messages.length - 1 ? 'speaking' : ''}`}
                      onClick={() => {
                        if (isSpeaking && currentUtterance && index === messages.length - 1) {
                          stopSpeaking();
                        } else {
                          speakText(msg.text);
                        }
                      }}
                      title={isSpeaking && currentUtterance && index === messages.length - 1 ? "Stop speaking" : "Listen to this message"}
                    >
                      {isSpeaking && currentUtterance && index === messages.length - 1 ? '🔇' : '🔊'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message bot">
              <div className="message-bubble loading">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
        </div>
        <div className="chat-input">
          <div className="input-container">
            <input
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
              {isListening ? '🔴' : '🎤'}
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !isListening)}
            className={`send-button ${isLoading ? 'loading' : ''}`}
            title="Send message"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
