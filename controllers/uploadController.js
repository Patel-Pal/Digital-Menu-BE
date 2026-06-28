const { upload, uploadToCloudinary } = require('../config/cloudinary');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload/image
// @access  Private
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided. Make sure the field name is "image".' });
    }

    console.log('Upload request received:', {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

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
      console.error('Cloudinary error:', cloudinaryError.message || cloudinaryError);
      
      // Return a placeholder URL so the menu item can still be created
      res.json({
        success: true,
        data: {
          url: `https://placehold.co/400x300/f97316/white?text=${encodeURIComponent(req.file.originalname.split('.')[0] || 'Menu Item')}`,
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
