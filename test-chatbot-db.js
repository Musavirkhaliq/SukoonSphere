import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ChatbotConversation from './models/chatbot/chatbotConversationModel.js';

dotenv.config();

// Test script to verify the ChatbotConversation model and its methods
async function testChatbotConversationModel() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB successfully');

    // Create a test user ID (this would normally be a real user ID)
    const testUserId = new mongoose.Types.ObjectId();
    console.log(`Using test user ID: ${testUserId}`);

    // Clean up any existing test conversations
    console.log('Cleaning up existing test conversations...');
    await ChatbotConversation.deleteMany({ userId: testUserId });

    // Test findOrCreateConversation
    console.log('\nTesting findOrCreateConversation...');
    const conversation = await ChatbotConversation.findOrCreateConversation(testUserId);
    console.log('Conversation created:', {
      id: conversation._id,
      userId: conversation.userId,
      messagesCount: conversation.messages.length,
      isActive: conversation.isActive
    });

    // Test adding messages
    console.log('\nTesting addMessage...');
    await conversation.addMessage('user', 'Hello, this is a test message');
    await conversation.addMessage('bot', 'This is a test response');
    
    // Retrieve the updated conversation
    const updatedConversation = await ChatbotConversation.findById(conversation._id);
    console.log('Messages added:', updatedConversation.messages);

    // Test getRecentMessages
    console.log('\nTesting getRecentMessages...');
    const recentMessages = updatedConversation.getRecentMessages(5);
    console.log('Recent messages:', recentMessages);

    // Test starting a new conversation
    console.log('\nTesting startNewConversation...');
    const newConversation = await ChatbotConversation.startNewConversation(testUserId);
    console.log('New conversation created:', {
      id: newConversation._id,
      userId: newConversation.userId,
      messagesCount: newConversation.messages.length,
      isActive: newConversation.isActive
    });

    // Check if the old conversation is now inactive
    const oldConversation = await ChatbotConversation.findById(conversation._id);
    console.log('Old conversation active status:', oldConversation.isActive);

    // Clean up test data
    console.log('\nCleaning up test data...');
    await ChatbotConversation.deleteMany({ userId: testUserId });
    console.log('Test data cleaned up');

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the test
testChatbotConversationModel();
