const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-menu', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');
const Shop = require('./models/Shop');

async function debugShopProfiles() {
  try {
    console.log('=== Shop Profile Debug Script ===\n');
    
    // Get all users with shopkeeper role
    const shopkeepers = await User.find({ role: 'shopkeeper' }).select('-password');
    console.log(`Found ${shopkeepers.length} shopkeepers:`);
    
    for (const user of shopkeepers) {
      console.log(`\nUser: ${user.name} (${user.email})`);
      console.log(`User ID: ${user._id}`);
      console.log(`Role: ${user.role}`);
      
      // Check if shop exists for this user
      const shop = await Shop.findOne({ ownerId: user._id });
      
      if (shop) {
        console.log(`✅ Shop found: ${shop.name} (ID: ${shop._id})`);
        console.log(`   Shop Type: ${shop.type}`);
        console.log(`   Shop Active: ${shop.isActive}`);
      } else {
        console.log(`❌ No shop found for this user`);
        
        // Create a basic shop for this user
        const newShop = await Shop.create({
          name: user.name + "'s Shop",
          ownerId: user._id,
          email: user.email,
          type: 'restaurant',
          isActive: true
        });
        console.log(`✅ Created new shop: ${newShop.name} (ID: ${newShop._id})`);
      }
    }
    
    // Summary
    const totalShops = await Shop.countDocuments();
    const totalUsers = await User.countDocuments();
    
    console.log(`\n=== Summary ===`);
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Total Shopkeepers: ${shopkeepers.length}`);
    console.log(`Total Shops: ${totalShops}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the debug script
debugShopProfiles();
