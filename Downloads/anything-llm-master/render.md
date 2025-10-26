# Render.com deployment configuration
# This file defines how to deploy AnythingLLM on Render

# Build command for Render
yarn install && yarn build

# Start command for Render  
yarn start

# Environment variables needed:
# - NODE_ENV=production
# - PORT=3001 (Render auto-assigns)
# - DATABASE_URL (PostgreSQL provided by Render)
# - JWT_SECRET (generate random string)
# - OPENAI_API_KEY (your OpenAI key)
# - ANTHROPIC_API_KEY (your Anthropic key)

# Health check endpoint
# GET /api/system/health

# Render will automatically:
# - Install Node.js 18+
# - Run yarn install
# - Run yarn build
# - Start the application
# - Provide PostgreSQL database
# - Handle HTTPS/SSL
# - Scale automatically
