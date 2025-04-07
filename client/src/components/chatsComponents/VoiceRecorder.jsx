import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop, FaTrash, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const VoiceRecorder = ({ onSendVoice, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isSending, setIsSending] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  
  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Handle recording stop
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setIsRecording(false);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check your permissions.');
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
    }
  };
  
  // Cancel recording
  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
    }
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioBlob(null);
    setAudioUrl(null);
    setIsRecording(false);
    setRecordingTime(0);
    
    if (onCancel) {
      onCancel();
    }
  };
  
  // Send voice message
  const sendVoiceMessage = async () => {
    if (!audioBlob) return;
    
    try {
      setIsSending(true);
      
      // Create a file from the blob
      const audioFile = new File([audioBlob], `voice-message-${Date.now()}.webm`, {
        type: 'audio/webm'
      });
      
      // Send the voice message
      await onSendVoice(audioFile);
      
      // Clean up
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);
      
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast.error('Failed to send voice message');
    } finally {
      setIsSending(false);
    }
  };
  
  // Format recording time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioUrl, isRecording]);
  
  return (
    <div className="voice-recorder">
      {!audioBlob ? (
        // Recording interface
        <div className="recording-controls">
          {isRecording ? (
            <div className="flex items-center gap-3">
              <div className="recording-indicator">
                <div className="recording-dot"></div>
                <span className="recording-time">{formatTime(recordingTime)}</span>
              </div>
              
              <button 
                className="stop-button"
                onClick={stopRecording}
                title="Stop recording"
              >
                <FaStop />
              </button>
              
              <button 
                className="cancel-button"
                onClick={cancelRecording}
                title="Cancel recording"
              >
                <FaTrash />
              </button>
            </div>
          ) : (
            <button 
              className="record-button"
              onClick={startRecording}
              title="Record voice message"
            >
              <FaMicrophone />
            </button>
          )}
        </div>
      ) : (
        // Playback and send interface
        <div className="playback-controls">
          <audio src={audioUrl} controls className="audio-preview" />
          
          <div className="action-buttons">
            <button 
              className="cancel-button"
              onClick={cancelRecording}
              disabled={isSending}
              title="Cancel"
            >
              <FaTrash />
            </button>
            
            <button 
              className="send-button"
              onClick={sendVoiceMessage}
              disabled={isSending}
              title="Send voice message"
            >
              {isSending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
