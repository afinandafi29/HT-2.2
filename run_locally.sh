#!/bin/bash
# Start Mirotalk (Backend + Frontend) in the background
echo "Starting Mirotalk on port 3000..."
cd Meet.happytalk
# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    npm install
fi
npm start &
MIROTALK_PID=$!

# Wait for Mirotalk to start (simple sleep)
sleep 5

# Start Social Network (Frontend)
echo "Starting Social Network on port 5173..."
cd ../social-network
# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev

# Cleanup function to kill background process on exit
cleanup() {
    echo "Stopping Mirotalk..."
    kill $MIROTALK_PID
}
trap cleanup EXIT
