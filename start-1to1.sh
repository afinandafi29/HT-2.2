#!/bin/bash

echo "🚀 Starting 1-to-1 Chat Services..."
echo ""

# Start signaling server in background
echo "📡 Starting signaling server on port 3001..."
cd signaling-server
node server.js &
SIGNALING_PID=$!

echo "✅ Signaling server started (PID: $SIGNALING_PID)"
echo ""
echo "📱 Now start your React app with: npm run dev"
echo ""
echo "🌐 Then open http://localhost:5173/1to1 in TWO different browsers"
echo ""
echo "To stop the signaling server, run: kill $SIGNALING_PID"
echo ""
