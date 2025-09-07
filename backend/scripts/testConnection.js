const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📡 Connection string:', process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@'));
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Check database name
    console.log('🗄️  Database name:', mongoose.connection.db.databaseName);
    
    // Test a simple operation
    const stats = await mongoose.connection.db.stats();
    console.log('📈 Database stats:');
    console.log(`   - Collections: ${stats.collections}`);
    console.log(`   - Data size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - Storage size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error message:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication issue - please check username and password');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Network issue - please check your internet connection');
    } else if (error.message.includes('timeout')) {
      console.error('⏰ Connection timeout - please check your network or MongoDB Atlas settings');
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
    process.exit(0);
  }
}

testConnection();