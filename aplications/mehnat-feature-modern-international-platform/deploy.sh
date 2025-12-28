#!/bin/bash

# UzTrain Platform - Deployment Script
# Bu skript loyihani production uchun tayyorlash va deploy qilish uchun

echo "🚀 UzTrain Platform - Deployment Script"
echo "========================================"

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

print_step() {
    echo -e "${PURPLE}🔄 $1${NC}"
}

# Environment o'zgaruvchilarini tekshirish
check_env() {
    print_step "Environment o'zgaruvchilarini tekshirish..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env fayli topilmadi. .env.example dan nusxa oling."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_info ".env fayli yaratildi. Iltimos, kerakli qiymatlarni kiriting."
        fi
    else
        print_success ".env fayli mavjud"
    fi
}

# Dependencies ni tekshirish
check_dependencies() {
    print_step "Dependencies ni tekshirish..."
    
    if [ ! -d "node_modules" ]; then
        print_info "node_modules topilmadi. Dependencies o'rnatilmoqda..."
        npm install --legacy-peer-deps
    else
        print_success "Dependencies mavjud"
    fi
}

# Loyihani build qilish
build_project() {
    print_step "Loyihani build qilish..."
    
    # Eski build ni tozalash
    if [ -d "dist" ]; then
        rm -rf dist
        print_info "Eski build tozalandi"
    fi
    
    # Yangi build
    if npm run build; then
        print_success "Build muvaffaqiyatli tugadi"
        
        # Build hajmini ko'rsatish
        if [ -d "dist" ]; then
            BUILD_SIZE=$(du -sh dist | cut -f1)
            print_info "Build hajmi: $BUILD_SIZE"
        fi
    else
        print_error "Build qilishda xatolik yuz berdi"
        exit 1
    fi
}

# Testlarni o'tkazish
run_tests() {
    read -p "Testlarni o'tkazishni xohlaysizmi? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_step "Testlarni o'tkazish..."
        if npm run test:run; then
            print_success "Barcha testlar muvaffaqiyatli o'tdi"
        else
            print_warning "Ba'zi testlar muvaffaqiyatsiz tugadi"
            read -p "Davom etishni xohlaysizmi? (y/n): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
    fi
}

# Production preview
preview_build() {
    read -p "Build ni preview qilishni xohlaysizmi? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_step "Production preview ishga tushirilmoqda..."
        print_info "Preview manzili: http://localhost:4173"
        print_info "Preview ni to'xtatish uchun Ctrl+C bosing"
        npm run preview
    fi
}

# Deployment opsiyalari
deploy_options() {
    echo
    print_info "Deployment opsiyalari:"
    echo "1. Netlify"
    echo "2. Vercel" 
    echo "3. GitHub Pages"
    echo "4. Manual (dist papkasini server ga ko'chirish)"
    echo "5. Docker"
    echo "0. Chiqish"
    
    read -p "Tanlang (0-5): " choice
    
    case $choice in
        1)
            deploy_netlify
            ;;
        2)
            deploy_vercel
            ;;
        3)
            deploy_github_pages
            ;;
        4)
            deploy_manual
            ;;
        5)
            deploy_docker
            ;;
        0)
            print_info "Deployment bekor qilindi"
            ;;
        *)
            print_error "Noto'g'ri tanlov"
            deploy_options
            ;;
    esac
}

# Netlify deployment
deploy_netlify() {
    print_step "Netlify deployment..."
    
    if command -v netlify &> /dev/null; then
        netlify deploy --prod --dir=dist
        print_success "Netlify ga deploy qilindi"
    else
        print_warning "Netlify CLI o'rnatilmagan"
        print_info "O'rnatish: npm install -g netlify-cli"
        print_info "Manual: dist papkasini netlify.com ga upload qiling"
    fi
}

# Vercel deployment
deploy_vercel() {
    print_step "Vercel deployment..."
    
    if command -v vercel &> /dev/null; then
        vercel --prod
        print_success "Vercel ga deploy qilindi"
    else
        print_warning "Vercel CLI o'rnatilmagan"
        print_info "O'rnatish: npm install -g vercel"
        print_info "Manual: dist papkasini vercel.com ga upload qiling"
    fi
}

# GitHub Pages deployment
deploy_github_pages() {
    print_step "GitHub Pages deployment..."
    
    if command -v gh &> /dev/null; then
        # GitHub Pages uchun maxsus build
        npm run build
        
        # gh-pages branch yaratish
        git checkout -b gh-pages 2>/dev/null || git checkout gh-pages
        
        # Dist fayllarini root ga ko'chirish
        cp -r dist/* .
        
        # Commit va push
        git add .
        git commit -m "Deploy to GitHub Pages"
        git push origin gh-pages
        
        print_success "GitHub Pages ga deploy qilindi"
        print_info "Sahifa: https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')"
    else
        print_warning "GitHub CLI o'rnatilmagan"
        print_info "Manual: dist papkasini GitHub Pages ga upload qiling"
    fi
}

# Manual deployment
deploy_manual() {
    print_step "Manual deployment ma'lumotlari..."
    
    print_info "Deployment uchun qadamlar:"
    echo "1. dist/ papkasidagi barcha fayllarni server ga ko'chiring"
    echo "2. Web server (Apache/Nginx) ni sozlang"
    echo "3. HTTPS sertifikatini o'rnating"
    echo "4. Domain ni ulang"
    
    print_info "Dist papkasi joylashuvi: $(pwd)/dist"
    
    if command -v zip &> /dev/null; then
        read -p "Dist papkasini zip qilishni xohlaysizmi? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            zip -r uztrain-build-$(date +%Y%m%d-%H%M%S).zip dist/
            print_success "Zip fayl yaratildi"
        fi
    fi
}

# Docker deployment
deploy_docker() {
    print_step "Docker deployment..."
    
    # Dockerfile yaratish
    cat > Dockerfile << EOF
FROM nginx:alpine

# Build fayllarini nginx ga ko'chirish
COPY dist/ /usr/share/nginx/html/

# Nginx konfiguratsiyasi
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

    # Nginx konfiguratsiyasi
    cat > nginx.conf << EOF
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA uchun
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Static fayllar uchun cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

    if command -v docker &> /dev/null; then
        # Docker image yaratish
        docker build -t uztrain-platform .
        
        print_success "Docker image yaratildi"
        print_info "Ishga tushirish: docker run -p 80:80 uztrain-platform"
    else
        print_warning "Docker o'rnatilmagan"
        print_info "Dockerfile va nginx.conf yaratildi"
    fi
}

# Asosiy funksiya
main() {
    echo
    print_info "Deployment jarayonini boshlash..."
    
    check_env
    check_dependencies
    run_tests
    build_project
    preview_build
    deploy_options
    
    echo
    print_success "Deployment jarayoni tugadi!"
    print_info "Loyiha xususiyatlari:"
    echo "  📱 PWA qo'llab-quvvatlash"
    echo "  🌙 Dark/Light tema"
    echo "  📊 Analytics"
    echo "  🔧 Admin panel"
    echo "  📄 Fayl ko'ruvchi"
    echo "  🎨 Brand dizayn"
}

# Skriptni ishga tushirish
main "$@"
