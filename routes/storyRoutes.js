const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Create a new story
router.post('/', protect, upload.single('media'), storyController.createStory);

// Get all active stories
router.get('/', protect, storyController.getStories);

// Get stories of a specific user
router.get('/user/:userId', protect, storyController.getUserStories);

// Mark story as viewed
router.post('/:storyId/view', protect, storyController.viewStory);

// Delete a story
router.delete('/:storyId', protect, storyController.deleteStory);

module.exports = router;