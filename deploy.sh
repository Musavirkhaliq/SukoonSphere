#!/bin/bash

# Navigate to the project directory
cd /root/Working_Directory/SukoonSphere


#stash
git stash

# Pull the latest changes from GitHub
git pull origin main

# pop stash
git stash pop

# Install dependencies
npm install

cd /root/Working_Directory/SukoonSphere/client

npm run build

rsync -a /root/Working_Directory/SukoonSphere/client/dist/ /root/Working_Directory/SukoonSphere/public/

cd /root/Working_Directory/SukoonSphere
# Restart the application using PM2
pm2 restart server.js

# node server.js


