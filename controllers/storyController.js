const Story = require('../models/Story');
const User = require('../models/User');
const upload = require('../middleware/uploadMiddleware');

// Create a new story
exports.createStory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No media file provided' });
    }

    const mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
    const mediaUrl = `${req.protocol}://${req.get('host')}/uploads/stories/${req.file.filename}`;

    const story = new Story({
      user: req.user._id,
      mediaUrl,
      mediaType,
      caption: req.body.caption
    });

    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all active stories
exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find({
      expiresAt: { $gt: new Date() }
    })
    .sort('-createdAt');

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get stories of a specific user
exports.getUserStories = async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      expiresAt: { $gt: new Date() }
    })
    .populate('user', 'username profilePicture')
    .sort('-createdAt');

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark story as viewed
exports.viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (!story.viewers.includes(req.user._id)) {
      story.viewers.push(req.user._id);
      await story.save();
    }

    res.json({ message: 'Story marked as viewed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a story
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this story' });
    }

    await story.remove();
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 