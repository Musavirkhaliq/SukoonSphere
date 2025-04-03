// This is a browser-based test script for speech recognition and synthesis
// Copy and paste this into your browser console to test

(function testSpeechFeatures() {
  console.log('Testing speech recognition and synthesis features...');
  
  // Test speech recognition
  function testSpeechRecognition() {
    console.log('Testing Speech Recognition API...');
    
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      console.error('❌ Speech Recognition API is not supported in this browser');
      return false;
    }
    
    console.log('✅ Speech Recognition API is supported');
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Test properties
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      console.log('✅ Successfully created SpeechRecognition instance with properties:');
      console.log('   - continuous:', recognition.continuous);
      console.log('   - interimResults:', recognition.interimResults);
      console.log('   - lang:', recognition.lang);
      
      // Test event handlers
      recognition.onresult = () => {};
      recognition.onend = () => {};
      recognition.onerror = () => {};
      
      console.log('✅ Successfully set event handlers');
      
      return true;
    } catch (error) {
      console.error('❌ Error creating SpeechRecognition instance:', error);
      return false;
    }
  }
  
  // Test speech synthesis
  function testSpeechSynthesis() {
    console.log('Testing Speech Synthesis API...');
    
    if (!('speechSynthesis' in window)) {
      console.error('❌ Speech Synthesis API is not supported in this browser');
      return false;
    }
    
    console.log('✅ Speech Synthesis API is supported');
    
    try {
      const synth = window.speechSynthesis;
      
      // Get available voices
      const voices = synth.getVoices();
      console.log(`✅ Found ${voices.length} voices`);
      
      if (voices.length > 0) {
        console.log('Sample voices:');
        voices.slice(0, 3).forEach(voice => {
          console.log(`   - ${voice.name} (${voice.lang})`);
        });
      }
      
      // Test creating an utterance
      const utterance = new SpeechSynthesisUtterance('This is a test of speech synthesis');
      console.log('✅ Successfully created SpeechSynthesisUtterance');
      
      // Test properties
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      console.log('✅ Successfully set utterance properties');
      
      // Test event handlers
      utterance.onstart = () => {};
      utterance.onend = () => {};
      utterance.onerror = () => {};
      
      console.log('✅ Successfully set utterance event handlers');
      
      return true;
    } catch (error) {
      console.error('❌ Error testing speech synthesis:', error);
      return false;
    }
  }
  
  // Test speech recognition
  const recognitionSupported = testSpeechRecognition();
  
  // Test speech synthesis
  const synthesisSupported = testSpeechSynthesis();
  
  // Summary
  console.log('\nTest Summary:');
  console.log('Speech Recognition:', recognitionSupported ? '✅ Supported' : '❌ Not supported');
  console.log('Speech Synthesis:', synthesisSupported ? '✅ Supported' : '❌ Not supported');
  
  if (recognitionSupported && synthesisSupported) {
    console.log('\n✅ All speech features are supported in this browser');
  } else {
    console.log('\n❌ Some speech features are not supported in this browser');
  }
})();
