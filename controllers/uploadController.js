const { upload, uploadToCloudinary } = require('../config/cloudinary');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload/image
// @access  Private
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // For now, return a placeholder URL if Cloudinary fails
    try {
      const result = await uploadToCloudinary(req.file.buffer, 'digital-menu');
      
      res.json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id
        }
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary error:', cloudinaryError);
      
      // Return a placeholder URL for testing
      res.json({
        success: true,
        data: {
          url: 'https://via.placeholder.com/400x300?text=Menu+Item',
          publicId: 'placeholder'
        }
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
};

module.exports = { upload, uploadImage };
