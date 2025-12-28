
#!/bin/bash

echo "🚀 UzTrain Platform Production Setup"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install --legacy-peer-deps

echo -e "${BLUE}🏗️ Building application...${NC}"
npm run build

echo -e "${GREEN}✅ Build completed successfully!${NC}"

echo -e "${BLUE}🔧 Setting up PM2...${NC}"
npm install -g pm2 2>/dev/null || echo -e "${YELLOW}⚠️ PM2 not installed globally${NC}"

echo -e "${BLUE}🌐 Starting production server...${NC}"
if command -v pm2 >/dev/null 2>&1; then
    pm2 stop uztrain-platform 2>/dev/null || true
    pm2 delete uztrain-platform 2>/dev/null || true
    pm2 start server.js --name uztrain-platform
    pm2 save
    echo -e "${GREEN}✅ Production server started with PM2${NC}"
else
    echo -e "${YELLOW}⚠️ PM2 not available, starting with node${NC}"
    npm run start:prod
fi

echo -e "${GREEN}🎉 UzTrain Platform production setup completed!${NC}"
echo -e "${BLUE}📱 Server running on: http://0.0.0.0:5000${NC}"
