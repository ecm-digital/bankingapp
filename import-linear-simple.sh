#!/bin/bash

# Simple script to import tasks to Linear
# Requires Linear API key

echo "🚀 Linear Task Importer"
echo "========================"
echo ""

# Check for API key
if [ -z "$LINEAR_API_KEY" ]; then
  echo "❌ LINEAR_API_KEY environment variable is not set"
  echo ""
  echo "📝 To get your Linear API key:"
  echo "   1. Go to https://linear.app/settings/api"
  echo "   2. Create a new Personal API Key"
  echo "   3. Run: export LINEAR_API_KEY=your_key"
  echo "   4. Then run this script again"
  echo ""
  exit 1
fi

# Check Node version (need 18+ for fetch)
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Error: Node.js 18+ required (you have $(node -v))"
  exit 1
fi

echo "✅ API Key found"
echo "✅ Node.js version: $(node -v)"
echo ""
echo "📋 Starting import..."
echo ""

# Run the import script
node import-to-linear.js


