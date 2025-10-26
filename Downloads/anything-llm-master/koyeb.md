# Koyeb Deployment Configuration
# This file defines how to deploy AnythingLLM on Koyeb

# Koyeb Configuration:
# - Runtime: Docker
# - Dockerfile: docker/Dockerfile.koyeb
# - Port: 3001
# - Regions: fra, iad, sin (Europe, US East, Asia)

# Build Process:
# 1. Koyeb builds Docker image automatically
# 2. Runs yarn build inside container
# 3. Starts application with yarn start
# 4. Health check on /api/system/health

# Environment Variables Required:
# - NODE_ENV=production
# - PORT=3001
# - DATABASE_URL=postgresql://...
# - JWT_SECRET=your-secret-key
# - OPENAI_API_KEY=your-openai-key
# - ANTHROPIC_API_KEY=your-anthropic-key

# Koyeb Features:
# - Global edge deployment
# - Auto-scaling
# - HTTPS automatically enabled
# - Custom domains
# - Environment variables management
# - Logs and monitoring
# - Free tier available

# Deployment Steps:
# 1. Connect GitHub repository to Koyeb
# 2. Create new service
# 3. Select Docker runtime
# 4. Configure environment variables
# 5. Deploy automatically

# Advantages of Koyeb:
# - Simple deployment process
# - Global edge network
# - Auto-scaling
# - Free tier with good limits
# - Excellent performance
# - Easy environment management
