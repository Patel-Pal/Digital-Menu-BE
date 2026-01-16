const mongoose = require('mongoose');
require('dotenv').config();

async function fixSlugIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-menu');
    
    const db = mongoose.connection.db;
    const collection = db.collection('shops');
    
    console.log('Dropping existing slug index...');
    try {
      await collection.dropIndex('slug_1');
      console.log('✅ Dropped slug index');
    } catch (error) {
      console.log('ℹ️ Slug index not found or already dropped');
    }
    
    console.log('Updating shops with null slugs...');
    const result = await collection.updateMany(
      { slug: null },
      { $unset: { slug: "" } }
    );
    console.log(`✅ Updated ${result.modifiedCount} shops`);
    
    console.log('✅ Database cleanup complete');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

fixSlugIndex();
