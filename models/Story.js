const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mediaUrl: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  caption: {
    type: String,
    maxLength: 200
  },
  viewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 24*60*60*1000) // 24 hours from creation
  }
}, {
  timestamps: true
});

// Index for automatic deletion of expired stories
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Story', storySchema); 