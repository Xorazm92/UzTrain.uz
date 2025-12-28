#!/bin/bash

# UzTrain Platform - Status Checker
# Bu skript loyihaning hozirgi holatini tekshiradi

echo "🔍 UzTrain Platform - Status Checker"
echo "===================================="

# Ranglar
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Funksiyalar
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo -e "${PURPLE}📋 $1${NC}"
    echo "----------------------------------------"
}

# Loyiha ma'lumotlari
check_project_info() {
    print_header "LOYIHA MA'LUMOTLARI"
    
    if [ -f "package.json" ]; then
        PROJECT_NAME=$(grep '"name"' package.json | cut -d'"' -f4)
        PROJECT_VERSION=$(grep '"version"' package.json | cut -d'"' -f4)
        print_success "Loyiha nomi: $PROJECT_NAME"
        print_success "Versiya: $PROJECT_VERSION"
    else
        print_error "package.json topilmadi"
    fi
    
    echo
}

# Node.js va NPM versiyalari
check_node_npm() {
    print_header "NODE.JS VA NPM"
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js: $NODE_VERSION"
    else
        print_error "Node.js o'rnatilmagan"
    fi
    
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "NPM: $NPM_VERSION"
    else
        print_error "NPM o'rnatilmagan"
    fi
    
    echo
}

# Dependencies holati
check_dependencies() {
    print_header "DEPENDENCIES"
    
    if [ -d "node_modules" ]; then
        MODULES_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
        MODULES_SIZE=$(du -sh node_modules 2>/dev/null | cut -f1)
        print_success "node_modules mavjud ($MODULES_COUNT paket, $MODULES_SIZE)"
        
        # Package-lock.json tekshirish
        if [ -f "package-lock.json" ]; then
            print_success "package-lock.json mavjud"
        else
            print_warning "package-lock.json topilmadi"
        fi
    else
        print_error "node_modules topilmadi. 'npm install' ishga tushiring"
    fi
    
    echo
}

# Build holati
check_build() {
    print_header "BUILD HOLATI"
    
    if [ -d "dist" ]; then
        BUILD_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
        BUILD_FILES=$(find dist -type f | wc -l)
        print_success "Build mavjud ($BUILD_FILES fayl, $BUILD_SIZE)"
        
        # Build vaqtini tekshirish
        if [ -f "dist/index.html" ]; then
            BUILD_TIME=$(stat -c %y dist/index.html 2>/dev/null | cut -d'.' -f1)
            print_info "Oxirgi build: $BUILD_TIME"
        fi
    else
        print_warning "Build topilmadi. 'npm run build' ishga tushiring"
    fi
    
    echo
}

# Environment fayllar
check_env_files() {
    print_header "ENVIRONMENT FAYLLAR"
    
    if [ -f ".env" ]; then
        print_success ".env mavjud"
        ENV_LINES=$(wc -l < .env)
        print_info "Sozlamalar soni: $ENV_LINES"
    else
        print_warning ".env topilmadi"
    fi
    
    if [ -f ".env.example" ]; then
        print_success ".env.example mavjud"
    else
        print_warning ".env.example topilmadi"
    fi
    
    echo
}

# Git holati
check_git() {
    print_header "GIT HOLATI"
    
    if [ -d ".git" ]; then
        print_success "Git repository mavjud"
        
        # Current branch
        CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
        if [ ! -z "$CURRENT_BRANCH" ]; then
            print_info "Hozirgi branch: $CURRENT_BRANCH"
        fi
        
        # Uncommitted changes
        if git diff-index --quiet HEAD -- 2>/dev/null; then
            print_success "Barcha o'zgarishlar commit qilingan"
        else
            print_warning "Commit qilinmagan o'zgarishlar mavjud"
        fi
        
        # Remote URL
        REMOTE_URL=$(git config --get remote.origin.url 2>/dev/null)
        if [ ! -z "$REMOTE_URL" ]; then
            print_info "Remote: $REMOTE_URL"
        fi
    else
        print_warning "Git repository emas"
    fi
    
    echo
}

# Server holati
check_server() {
    print_header "SERVER HOLATI"
    
    # Development server tekshirish
    if curl -s http://localhost:8084 > /dev/null 2>&1; then
        print_success "Development server ishlamoqda (http://localhost:8084)"
    else
        print_info "Development server ishlamayapti"
    fi
    
    # Production server tekshirish
    if curl -s http://localhost:4173 > /dev/null 2>&1; then
        print_success "Production preview ishlamoqda (http://localhost:4173)"
    else
        print_info "Production preview ishlamayapti"
    fi
    
    echo
}

# Fayl tuzilishi
check_file_structure() {
    print_header "FAYL TUZILISHI"
    
    # Asosiy papkalar
    REQUIRED_DIRS=("src" "public" "src/components" "src/pages" "src/assets")
    
    for dir in "${REQUIRED_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            FILES_COUNT=$(find "$dir" -type f | wc -l)
            print_success "$dir ($FILES_COUNT fayl)"
        else
            print_error "$dir topilmadi"
        fi
    done
    
    # Asosiy fayllar
    REQUIRED_FILES=("src/main.tsx" "src/App.tsx" "index.html" "vite.config.ts" "tailwind.config.ts")
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ -f "$file" ]; then
            print_success "$file"
        else
            print_error "$file topilmadi"
        fi
    done
    
    echo
}

# Xavfsizlik tekshiruvi
check_security() {
    print_header "XAVFSIZLIK"
    
    # .env faylini git ignore tekshirish
    if [ -f ".gitignore" ] && grep -q ".env" .gitignore; then
        print_success ".env fayli git ignore da"
    else
        print_warning ".env fayli git ignore da emas"
    fi
    
    # node_modules git ignore tekshirish
    if [ -f ".gitignore" ] && grep -q "node_modules" .gitignore; then
        print_success "node_modules git ignore da"
    else
        print_warning "node_modules git ignore da emas"
    fi
    
    # Dist git ignore tekshirish
    if [ -f ".gitignore" ] && grep -q "dist" .gitignore; then
        print_success "dist papkasi git ignore da"
    else
        print_warning "dist papkasi git ignore da emas"
    fi
    
    echo
}

# Performance ma'lumotlari
check_performance() {
    print_header "PERFORMANCE"
    
    if [ -d "dist" ]; then
        # CSS fayl hajmi
        CSS_FILES=$(find dist -name "*.css" -type f)
        if [ ! -z "$CSS_FILES" ]; then
            CSS_SIZE=$(du -ch $CSS_FILES 2>/dev/null | tail -1 | cut -f1)
            print_info "CSS hajmi: $CSS_SIZE"
        fi
        
        # JS fayl hajmi
        JS_FILES=$(find dist -name "*.js" -type f)
        if [ ! -z "$JS_FILES" ]; then
            JS_SIZE=$(du -ch $JS_FILES 2>/dev/null | tail -1 | cut -f1)
            print_info "JavaScript hajmi: $JS_SIZE"
        fi
        
        # Asset fayllar
        ASSET_FILES=$(find dist/assets -type f 2>/dev/null | wc -l)
        if [ $ASSET_FILES -gt 0 ]; then
            print_info "Asset fayllar: $ASSET_FILES"
        fi
    fi
    
    echo
}

# Tavsiyalar
show_recommendations() {
    print_header "TAVSIYALAR"
    
    # Development server
    if ! curl -s http://localhost:8084 > /dev/null 2>&1; then
        print_info "Development serverini ishga tushirish: ./quick-start.sh"
    fi
    
    # Build
    if [ ! -d "dist" ]; then
        print_info "Loyihani build qilish: npm run build"
    fi
    
    # Tests
    print_info "Testlarni o'tkazish: npm test"
    
    # Deployment
    print_info "Deployment uchun: ./deploy.sh"
    
    echo
}

# Asosiy funksiya
main() {
    echo
    check_project_info
    check_node_npm
    check_dependencies
    check_build
    check_env_files
    check_git
    check_server
    check_file_structure
    check_security
    check_performance
    show_recommendations
    
    print_header "XULOSA"
    print_success "UzTrain Platform holati tekshirildi!"
    print_info "Batafsil ma'lumot uchun yuqoridagi bo'limlarni ko'ring."
    echo
}

# Skriptni ishga tushirish
main "$@"
