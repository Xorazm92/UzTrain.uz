#!/bin/bash

# UzTrain Platform - Tezkor Ishga Tushirish Skripti
# Bu skript loyihani tez va oson ishga tushirish uchun yaratilgan

echo "🚀 UzTrain Platform - Tezkor Ishga Tushirish"
echo "============================================="

# Ranglar
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Node.js versiyasini tekshirish
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js topildi: $NODE_VERSION"
        
        # Node.js versiyasi 18+ ekanligini tekshirish
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -ge 18 ]; then
            print_success "Node.js versiyasi mos keladi (18+)"
        else
            print_error "Node.js versiyasi 18+ bo'lishi kerak. Hozirgi versiya: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js topilmadi. Iltimos, Node.js 18+ o'rnating."
        exit 1
    fi
}

# NPM paketlarini o'rnatish
install_dependencies() {
    print_info "NPM paketlarini o'rnatish..."
    
    if npm install --legacy-peer-deps; then
        print_success "Barcha paketlar muvaffaqiyatli o'rnatildi"
    else
        print_error "Paketlarni o'rnatishda xatolik yuz berdi"
        exit 1
    fi
}

# Development serverini ishga tushirish
start_dev_server() {
    print_info "Development serverini ishga tushirish..."
    print_info "Server manzili: http://localhost:8084"
    print_info "Serverni to'xtatish uchun Ctrl+C bosing"
    
    npm run dev
}

# Build qilish (ixtiyoriy)
build_project() {
    read -p "Loyihani build qilishni xohlaysizmi? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Loyihani build qilish..."
        if npm run build; then
            print_success "Build muvaffaqiyatli tugadi"
            print_info "Build fayllari 'dist' papkasida joylashgan"
        else
            print_error "Build qilishda xatolik yuz berdi"
        fi
    fi
}

# Asosiy funksiya
main() {
    echo
    print_info "Tizimni tekshirish..."
    check_node
    
    echo
    print_info "Loyiha papkasini tekshirish..."
    if [ ! -f "package.json" ]; then
        print_error "package.json fayli topilmadi. Loyiha papkasida ekanligingizni tekshiring."
        exit 1
    fi
    print_success "Loyiha fayllari topildi"
    
    echo
    install_dependencies
    
    echo
    build_project
    
    echo
    print_success "Barcha tayyorgarlik tugadi!"
    print_info "Loyiha xususiyatlari:"
    echo "  📱 Responsive dizayn"
    echo "  🌙 Dark/Light tema"
    echo "  🔧 Accessibility yordamchisi"
    echo "  📊 Responsive dizayn yordamchisi"
    echo "  📄 PDF va PowerPoint ko'ruvchi"
    echo "  🎨 Brand ranglari bilan integratsiya"
    echo "  🧪 Test qamrovi"
    
    echo
    start_dev_server
}

# Skriptni ishga tushirish
main "$@"
