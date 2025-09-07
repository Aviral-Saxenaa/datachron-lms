#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Library Management System...\n');

// Function to run commands
function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error.message);
    process.exit(1);
  }
}

// Function to check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

async function setup() {
  try {
    // Check if Node.js and npm are installed
    console.log('🔍 Checking prerequisites...');
    
    // Install root dependencies
    if (fileExists('package.json')) {
      runCommand('npm install', 'Installing root dependencies');
    }

    // Install backend dependencies
    if (fileExists('backend/package.json')) {
      runCommand('cd backend && npm install', 'Installing backend dependencies');
    } else {
      console.error('❌ Backend package.json not found!');
      process.exit(1);
    }

    // Install frontend dependencies
    if (fileExists('frontend/package.json')) {
      runCommand('cd frontend && npm install', 'Installing frontend dependencies');
    } else {
      console.error('❌ Frontend package.json not found!');
      process.exit(1);
    }

    // Check environment files
    console.log('🔧 Checking environment configuration...');
    
    if (!fileExists('backend/.env')) {
      console.log('⚠️  Backend .env file not found. Please create it from .env.example');
    } else {
      console.log('✅ Backend .env file found');
    }

    if (!fileExists('frontend/.env')) {
      console.log('⚠️  Frontend .env file not found. Please create it from .env.example');
    } else {
      console.log('✅ Frontend .env file found');
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure MongoDB is running or update the MONGODB_URI in backend/.env');
    console.log('2. Seed the database: npm run seed');
    console.log('3. Start the application: npm run dev');
    console.log('\n📚 Default login credentials after seeding:');
    console.log('   Admin: admin@library.com / admin123');
    console.log('   User: user@library.com / user123');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();