import mongoose from 'mongoose';

const userSuggestionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'implemented'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UserSuggestion = mongoose.model('UserSuggestion', userSuggestionSchema);

export default UserSuggestion;
