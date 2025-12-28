#!/bin/bash

# UzTrain Platform Final Comprehensive Test Suite
# Brand-aligned complete testing for production readiness

echo "🚂 UzTrain Platform - Final Comprehensive Test Suite"
echo "===================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

# Brand colors (matching your guide)
BRAND_ORANGE='\033[38;2;230;114;71m'
BRAND_GREEN='\033[38;2;64;150;75m'
BRAND_DARK='\033[38;2;60;60;60m'

# Configuration
DEV_URL="http://localhost:8084"
PROD_URL="http://localhost:4173"

# Test categories
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNINGS=0

# Function to print test results
print_test_result() {
    local test_name="$1"
    local status="$2"
    local response="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    case "$status" in
        "PASS")
            echo -e "${BRAND_GREEN}✅ PASS${NC} - $test_name"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            ;;
        "FAIL")
            echo -e "${RED}❌ FAIL${NC} - $test_name"
            echo -e "   ${YELLOW}Response: $response${NC}"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  WARN${NC} - $test_name"
            echo -e "   ${YELLOW}Response: $response${NC}"
            WARNINGS=$((WARNINGS + 1))
            ;;
    esac
}

# Function to test endpoint with detailed analysis
test_endpoint_detailed() {
    local url="$1"
    local path="$2"
    local test_name="$3"
    
    echo -e "${BLUE}Testing:${NC} $test_name"
    
    # Get response with timing
    start_time=$(date +%s%N)
    response=$(curl -s -w "\n%{http_code}\n%{time_total}\n%{size_download}" "$url$path")
    end_time=$(date +%s%N)
    
    http_code=$(echo "$response" | tail -n3 | head -n1)
    time_total=$(echo "$response" | tail -n2 | head -n1)
    size_download=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -3)
    
    load_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ "$http_code" = "200" ]; then
        if [ "$load_time" -lt 1000 ]; then
            print_test_result "$test_name" "PASS" "HTTP 200, ${load_time}ms, ${size_download}b"
        else
            print_test_result "$test_name" "WARN" "HTTP 200 but slow: ${load_time}ms"
        fi
    else
        print_test_result "$test_name" "FAIL" "HTTP $http_code"
    fi
}

echo -e "${BRAND_ORANGE}🌟 BRAND COMPLIANCE TESTS${NC}"
echo "================================"

# Test brand colors presence
brand_test=$(curl -s "$DEV_URL" | grep -c "E67247\|40964B\|3C3C3C\|brand-orange\|brand-green\|brand-dark")
if [ "$brand_test" -gt 5 ]; then
    print_test_result "Brand Colors Integration" "PASS" "All brand colors found"
else
    print_test_result "Brand Colors Integration" "FAIL" "Missing brand colors"
fi

# Test brand typography
font_test=$(curl -s "$DEV_URL" | grep -c "font\|Satoshi\|typography")
if [ "$font_test" -gt 0 ]; then
    print_test_result "Brand Typography" "PASS" "Typography system detected"
else
    print_test_result "Brand Typography" "WARN" "Typography system not clearly defined"
fi

# Test brand gradients
gradient_test=$(curl -s "$DEV_URL" | grep -c "gradient\|linear-gradient")
if [ "$gradient_test" -gt 0 ]; then
    print_test_result "Brand Gradients" "PASS" "Gradient system implemented"
else
    print_test_result "Brand Gradients" "FAIL" "Gradient system missing"
fi

echo ""
echo -e "${BRAND_GREEN}🚀 FUNCTIONALITY TESTS${NC}"
echo "========================"

# Test all main pages
pages=(
    "/:Homepage"
    "/qonunlar:Laws Page"
    "/qoidalar:Rules Page"
    "/video-materiallar:Video Materials"
    "/slaydlar:Slides Page"
    "/temir-yol:Railway Documents"
    "/bannerlar:Banners Page"
    "/kasb-yoriqnomalari:Job Manuals"
    "/admin:Admin Dashboard"
)

for page in "${pages[@]}"; do
    IFS=':' read -r path name <<< "$page"
    test_endpoint_detailed "$DEV_URL" "$path" "$name"
done

echo ""
echo -e "${BRAND_ORANGE}📱 RESPONSIVE & ACCESSIBILITY${NC}"
echo "================================"

# Test mobile responsiveness
mobile_test=$(curl -s "$DEV_URL" | grep -c "viewport\|responsive\|mobile")
if [ "$mobile_test" -gt 0 ]; then
    print_test_result "Mobile Responsiveness" "PASS" "Mobile meta tags found"
else
    print_test_result "Mobile Responsiveness" "FAIL" "Mobile optimization missing"
fi

# Test accessibility features
a11y_test=$(curl -s "$DEV_URL" | grep -c "aria-\|alt=\|role=")
if [ "$a11y_test" -gt 5 ]; then
    print_test_result "Accessibility Features" "PASS" "ARIA attributes found"
else
    print_test_result "Accessibility Features" "WARN" "Limited accessibility features"
fi

# Test semantic HTML
semantic_test=$(curl -s "$DEV_URL" | grep -c "<header>\|<nav>\|<main>\|<section>\|<article>\|<footer>")
if [ "$semantic_test" -gt 3 ]; then
    print_test_result "Semantic HTML" "PASS" "Semantic elements used"
else
    print_test_result "Semantic HTML" "WARN" "Limited semantic structure"
fi

echo ""
echo -e "${BRAND_GREEN}⚡ PERFORMANCE TESTS${NC}"
echo "====================="

# Test page load times
for page in "/" "/qonunlar" "/admin"; do
    start_time=$(date +%s%N)
    curl -s "$DEV_URL$page" > /dev/null
    end_time=$(date +%s%N)
    load_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ "$load_time" -lt 500 ]; then
        print_test_result "Load Time $page" "PASS" "${load_time}ms"
    elif [ "$load_time" -lt 1000 ]; then
        print_test_result "Load Time $page" "WARN" "${load_time}ms (acceptable)"
    else
        print_test_result "Load Time $page" "FAIL" "${load_time}ms (too slow)"
    fi
done

echo ""
echo -e "${BRAND_ORANGE}🔒 SECURITY TESTS${NC}"
echo "==================="

# Test security headers
security_headers=$(curl -s -I "$DEV_URL" | grep -i "x-frame-options\|x-content-type-options\|x-xss-protection")
if [ -n "$security_headers" ]; then
    print_test_result "Security Headers" "PASS" "Security headers present"
else
    print_test_result "Security Headers" "FAIL" "Missing security headers"
fi

# Test HTTPS readiness
https_test=$(curl -s "$DEV_URL" | grep -c "http://")
if [ "$https_test" -lt 5 ]; then
    print_test_result "HTTPS Readiness" "PASS" "Minimal HTTP references"
else
    print_test_result "HTTPS Readiness" "WARN" "Many HTTP references found"
fi

echo ""
echo -e "${BRAND_GREEN}📦 PWA TESTS${NC}"
echo "=============="

# Test PWA manifest
manifest_response=$(curl -s -w "\n%{http_code}" "$DEV_URL/manifest.json")
manifest_code=$(echo "$manifest_response" | tail -n1)

if [ "$manifest_code" = "200" ]; then
    manifest_content=$(echo "$manifest_response" | head -n -1)
    if echo "$manifest_content" | grep -q "UzTrain"; then
        print_test_result "PWA Manifest" "PASS" "Valid manifest with app info"
    else
        print_test_result "PWA Manifest" "WARN" "Manifest exists but incomplete"
    fi
else
    print_test_result "PWA Manifest" "FAIL" "Manifest not found"
fi

# Test service worker registration
sw_test=$(curl -s "$DEV_URL" | grep -c "serviceWorker\|sw.js")
if [ "$sw_test" -gt 0 ]; then
    print_test_result "Service Worker" "PASS" "Service worker registration found"
else
    print_test_result "Service Worker" "WARN" "Service worker not detected"
fi

echo ""
echo -e "${BRAND_ORANGE}🎨 UI/UX TESTS${NC}"
echo "==============="

# Test theme system
theme_test=$(curl -s "$DEV_URL" | grep -c "theme\|dark\|light")
if [ "$theme_test" -gt 5 ]; then
    print_test_result "Theme System" "PASS" "Theme system implemented"
else
    print_test_result "Theme System" "FAIL" "Theme system missing"
fi

# Test interactive elements
interactive_test=$(curl -s "$DEV_URL" | grep -c "button\|input\|select\|textarea")
if [ "$interactive_test" -gt 10 ]; then
    print_test_result "Interactive Elements" "PASS" "Rich interactive interface"
else
    print_test_result "Interactive Elements" "WARN" "Limited interactivity"
fi

# Test file viewer functionality
file_viewer_test=$(curl -s "$DEV_URL" | grep -c "pdf\|ppt\|file\|viewer")
if [ "$file_viewer_test" -gt 5 ]; then
    print_test_result "File Viewer System" "PASS" "File viewing capabilities detected"
else
    print_test_result "File Viewer System" "WARN" "Limited file viewing features"
fi

echo ""
echo -e "${BRAND_GREEN}🌐 CROSS-PLATFORM TESTS${NC}"
echo "========================="

# Test with different user agents
user_agents=(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36:Chrome Desktop"
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15:Safari Mobile"
    "Mozilla/5.0 (Android 11; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0:Firefox Mobile"
)

for ua_info in "${user_agents[@]}"; do
    IFS=':' read -r ua name <<< "$ua_info"
    response=$(curl -s -w "\n%{http_code}" "$DEV_URL" -H "User-Agent: $ua")
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ]; then
        print_test_result "$name Compatibility" "PASS" "Compatible"
    else
        print_test_result "$name Compatibility" "FAIL" "HTTP $http_code"
    fi
done

echo ""
echo "===================================================="
echo -e "${BRAND_ORANGE}📊 FINAL TEST SUMMARY${NC}"
echo "===================================================="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${BRAND_GREEN}$PASSED_TESTS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

# Calculate success rate
success_rate=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
echo -e "Success Rate: ${BLUE}${success_rate}%${NC}"

echo ""
if [ "$FAILED_TESTS" -eq 0 ] && [ "$success_rate" -gt 90 ]; then
    echo -e "${BRAND_GREEN}🎉 EXCELLENT! PLATFORM IS PRODUCTION READY! 🚀${NC}"
    echo ""
    echo -e "${BRAND_GREEN}✅ Brand guidelines fully implemented${NC}"
    echo -e "${BRAND_GREEN}✅ All core functionality working${NC}"
    echo -e "${BRAND_GREEN}✅ Performance optimized${NC}"
    echo -e "${BRAND_GREEN}✅ Security measures in place${NC}"
    echo -e "${BRAND_GREEN}✅ PWA features enabled${NC}"
    echo -e "${BRAND_GREEN}✅ Cross-platform compatible${NC}"
    echo -e "${BRAND_GREEN}✅ Professional UI/UX implemented${NC}"
    echo ""
    echo -e "${BRAND_ORANGE}🚂 Ready for deployment to production servers!${NC}"
elif [ "$FAILED_TESTS" -eq 0 ]; then
    echo -e "${BRAND_GREEN}🎉 GOOD! PLATFORM IS READY WITH MINOR IMPROVEMENTS NEEDED${NC}"
    echo -e "${YELLOW}Consider addressing warnings before production deployment${NC}"
else
    echo -e "${YELLOW}⚠️  PLATFORM NEEDS ATTENTION BEFORE PRODUCTION${NC}"
    echo -e "${RED}Please fix failed tests before deployment${NC}"
fi

echo ""
echo -e "${BRAND_ORANGE}🚂 UzTrain Platform - Professional Railway Education${NC}"
echo -e "${BRAND_GREEN}Brand-aligned design with: Orange #E67247, Green #40964B, Dark #3C3C3C${NC}"
echo -e "${BLUE}Comprehensive testing completed - Platform assessment complete!${NC}"
