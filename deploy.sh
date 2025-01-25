#!/bin/bash

# Navigate to the project directory
cd /root/Working_Directory/SukoonSphere

# Pull the latest changes from GitHub
git pull origin main

# Install dependencies
npm install

# Restart the application using PM2
pm2 restart server.js