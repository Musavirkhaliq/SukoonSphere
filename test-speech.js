// This is a simple test script to check browser compatibility with speech APIs
// Run this in a browser console to test compatibility

function testSpeechAPIs() {
  console.log("Testing Speech APIs compatibility...");
  
  // Test SpeechRecognition API
  const speechRecognitionSupported = 
    'SpeechRecognition' in window || 
    'webkitSpeechRecognition' in window;
  
  console.log("Speech Recognition API supported:", speechRecognitionSupported);
  
  if (speechRecognitionSupported) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    console.log("SpeechRecognition implementation:", SpeechRecognition.name);
  }
  
  // Test SpeechSynthesis API
  const speechSynthesisSupported = 'speechSynthesis' in window;
  console.log("Speech Synthesis API supported:", speechSynthesisSupported);
  
  if (speechSynthesisSupported) {
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    console.log("Available voices:", voices.length);
    
    // List first 5 voices (if available)
    if (voices.length > 0) {
      console.log("Sample voices:");
      voices.slice(0, 5).forEach(voice => {
        console.log(`- ${voice.name} (${voice.lang}) ${voice.default ? '(default)' : ''}`);
      });
    }
    
    // Test simple utterance
    try {
      const utterance = new SpeechSynthesisUtterance("Testing speech synthesis");
      console.log("SpeechSynthesisUtterance created successfully");
    } catch (error) {
      console.error("Error creating SpeechSynthesisUtterance:", error);
    }
  }
  
  console.log("Speech APIs test completed");
}

// Execute the test
testSpeechAPIs();

// Instructions for manual testing in browser console:
/*
1. Open your browser's developer console
2. Copy and paste this entire script
3. Press Enter to run the test
4. Check the console output for compatibility results
*/
