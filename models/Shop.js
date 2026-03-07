const mongoose = require('mongoose');

// Function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
};

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  type: {
    type: String,
    enum: ['restaurant', 'cafe'],
    default: 'restaurant'
  },
  description: String,
  logo: String,
  banner: String,
  address: String,
  phone: String,
  email: String,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  qrScans: {
    type: Number,
    default: 0
  },
  menuViews: {
    type: Number,
    default: 0
  },
  menuTheme: {
    type: String,
    enum: ['coral', 'ocean', 'forest', 'sunset', 'midnight', 'lavender'],
    default: 'coral'
  },
  qrColor: {
    type: String,
    default: '#000000'
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate slug
shopSchema.pre('save', async function(next) {
  if (this.isModified('name') || !this.slug) {
    let baseSlug = generateSlug(this.name);
    let slug = baseSlug;
    let counter = 1;
    
    // Check for existing slugs and append number if needed
    while (await mongoose.model('Shop').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Shop', shopSchema);
