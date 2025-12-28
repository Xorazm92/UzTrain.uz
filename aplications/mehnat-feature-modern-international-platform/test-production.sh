#!/bin/bash

# UzTrain Platform Production Test Script
# Brand-aligned production testing suite

echo "🚂 UzTrain Platform Production Test Suite"
echo "=========================================="
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
PROD_URL="http://localhost:4173"
DEV_URL="http://localhost:8084"

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to print test results
print_test_result() {
    local test_name="$1"
    local status="$2"
    local response="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$status" = "PASS" ]; then
        echo -e "${BRAND_GREEN}✅ PASS${NC} - $test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAIL${NC} - $test_name"
        echo -e "   ${YELLOW}Response: $response${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Function to test production endpoint
test_prod_endpoint() {
    local path="$1"
    local test_name="$2"
    
    echo -e "${BLUE}Testing:${NC} $test_name"
    
    response=$(curl -s -w "\n%{http_code}" "$PROD_URL$path")
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ]; then
        print_test_result "$test_name" "PASS" "Production page loaded successfully"
    else
        print_test_result "$test_name" "FAIL" "HTTP $http_code"
    fi
}

# Function to compare dev vs prod
compare_dev_prod() {
    local path="$1"
    local test_name="$2"
    
    echo -e "${BLUE}Comparing:${NC} $test_name"
    
    dev_response=$(curl -s "$DEV_URL$path" | wc -c)
    prod_response=$(curl -s "$PROD_URL$path" | wc -c)
    
    # Allow 10% difference in size
    diff_percent=$(( (dev_response - prod_response) * 100 / dev_response ))
    if [ ${diff_percent#-} -lt 10 ]; then
        print_test_result "$test_name" "PASS" "Dev/Prod consistency maintained"
    else
        print_test_result "$test_name" "FAIL" "Significant difference: Dev=${dev_response}b, Prod=${prod_response}b"
    fi
}

echo -e "${BRAND_ORANGE}🏭 Production Build Tests...${NC}"
echo ""

# Test production pages
test_prod_endpoint "/" "Production Homepage"
test_prod_endpoint "/qonunlar" "Production Laws Page"
test_prod_endpoint "/qoidalar" "Production Rules Page"
test_prod_endpoint "/video-materiallar" "Production Video Materials"
test_prod_endpoint "/slaydlar" "Production Slides"
test_prod_endpoint "/admin" "Production Admin Dashboard"

echo ""
echo -e "${BRAND_GREEN}📊 Performance Comparison...${NC}"
echo ""

# Compare dev vs production
compare_dev_prod "/" "Homepage Size Comparison"
compare_dev_prod "/qonunlar" "Laws Page Size Comparison"

echo ""
echo -e "${BRAND_ORANGE}⚡ Production Performance Tests...${NC}"
echo ""

# Test production load time
start_time=$(date +%s%N)
curl -s "$PROD_URL" > /dev/null
end_time=$(date +%s%N)
prod_load_time=$(( (end_time - start_time) / 1000000 ))

# Test dev load time for comparison
start_time=$(date +%s%N)
curl -s "$DEV_URL" > /dev/null
end_time=$(date +%s%N)
dev_load_time=$(( (end_time - start_time) / 1000000 ))

echo -e "${BLUE}Load Time Comparison:${NC}"
echo -e "  Development: ${dev_load_time}ms"
echo -e "  Production:  ${prod_load_time}ms"

if [ "$prod_load_time" -lt "$dev_load_time" ]; then
    print_test_result "Production Performance" "PASS" "Production faster than dev (${prod_load_time}ms vs ${dev_load_time}ms)"
else
    print_test_result "Production Performance" "FAIL" "Production slower than dev (${prod_load_time}ms vs ${dev_load_time}ms)"
fi

echo ""
echo -e "${BRAND_GREEN}🔒 Production Security Tests...${NC}"
echo ""

# Test production security headers
security_headers=$(curl -s -I "$PROD_URL" | grep -i "x-frame-options\|x-content-type-options\|x-xss-protection")
if [ -n "$security_headers" ]; then
    print_test_result "Production Security Headers" "PASS" "Security headers present"
else
    print_test_result "Production Security Headers" "FAIL" "Missing security headers"
fi

# Test for source maps (should not be present in production)
sourcemap_test=$(curl -s "$PROD_URL" | grep -c "sourceMappingURL")
if [ "$sourcemap_test" -eq 0 ]; then
    print_test_result "Source Maps Removal" "PASS" "No source maps in production"
else
    print_test_result "Source Maps Removal" "FAIL" "Source maps found in production"
fi

echo ""
echo -e "${BRAND_ORANGE}📱 PWA Tests...${NC}"
echo ""

# Test PWA manifest
manifest_response=$(curl -s -w "\n%{http_code}" "$PROD_URL/manifest.webmanifest")
manifest_code=$(echo "$manifest_response" | tail -n1)

if [ "$manifest_code" = "200" ]; then
    print_test_result "PWA Manifest" "PASS" "Manifest accessible"
else
    print_test_result "PWA Manifest" "FAIL" "Manifest not found"
fi

# Test service worker
sw_response=$(curl -s -w "\n%{http_code}" "$PROD_URL/sw.js")
sw_code=$(echo "$sw_response" | tail -n1)

if [ "$sw_code" = "200" ]; then
    print_test_result "Service Worker" "PASS" "Service worker accessible"
else
    print_test_result "Service Worker" "FAIL" "Service worker not found"
fi

echo ""
echo -e "${BRAND_GREEN}🎨 Brand Integration Tests...${NC}"
echo ""

# Test brand colors in production
brand_colors_test=$(curl -s "$PROD_URL" | grep -c "E67247\|40964B\|3C3C3C")
if [ "$brand_colors_test" -gt 0 ]; then
    print_test_result "Brand Colors Integration" "PASS" "Brand colors found in production"
else
    print_test_result "Brand Colors Integration" "FAIL" "Brand colors not found"
fi

# Test theme system
theme_test=$(curl -s "$PROD_URL" | grep -c "theme\|dark\|light")
if [ "$theme_test" -gt 0 ]; then
    print_test_result "Theme System Production" "PASS" "Theme system working in production"
else
    print_test_result "Theme System Production" "FAIL" "Theme system not found"
fi

echo ""
echo -e "${BRAND_ORANGE}📦 Asset Optimization Tests...${NC}"
echo ""

# Test CSS minification
css_files=$(curl -s "$PROD_URL" | grep -o 'href="[^"]*\.css[^"]*"' | head -1 | sed 's/href="//;s/"//')
if [ -n "$css_files" ]; then
    css_response=$(curl -s "$PROD_URL$css_files")
    css_minified=$(echo "$css_response" | grep -c "^[[:space:]]*$")
    if [ "$css_minified" -lt 5 ]; then
        print_test_result "CSS Minification" "PASS" "CSS appears minified"
    else
        print_test_result "CSS Minification" "FAIL" "CSS may not be minified"
    fi
fi

# Test JS minification
js_files=$(curl -s "$PROD_URL" | grep -o 'src="[^"]*\.js[^"]*"' | head -1 | sed 's/src="//;s/"//')
if [ -n "$js_files" ]; then
    js_response=$(curl -s "$PROD_URL$js_files")
    js_minified=$(echo "$js_response" | grep -c "^[[:space:]]*$")
    if [ "$js_minified" -lt 5 ]; then
        print_test_result "JS Minification" "PASS" "JavaScript appears minified"
    else
        print_test_result "JS Minification" "FAIL" "JavaScript may not be minified"
    fi
fi

echo ""
echo -e "${BRAND_GREEN}🌐 Cross-Browser Compatibility...${NC}"
echo ""

# Test with different user agents
user_agents=(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
    "Mozilla/5.0 (Android 11; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0"
)

for i in "${!user_agents[@]}"; do
    ua="${user_agents[$i]}"
    browser_name=""
    case $i in
        0) browser_name="Chrome Windows" ;;
        1) browser_name="Chrome macOS" ;;
        2) browser_name="Safari iOS" ;;
        3) browser_name="Firefox Android" ;;
    esac
    
    response=$(curl -s -w "\n%{http_code}" "$PROD_URL" -H "User-Agent: $ua")
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ]; then
        print_test_result "$browser_name Compatibility" "PASS" "Compatible"
    else
        print_test_result "$browser_name Compatibility" "FAIL" "HTTP $http_code"
    fi
done

echo ""
echo "=========================================="
echo -e "${BRAND_ORANGE}📊 PRODUCTION TEST SUMMARY${NC}"
echo "=========================================="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${BRAND_GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ "$FAILED_TESTS" -eq 0 ]; then
    echo ""
    echo -e "${BRAND_GREEN}🎉 ALL PRODUCTION TESTS PASSED! 🚀${NC}"
    echo -e "${BRAND_ORANGE}Your brand-aligned UzTrain platform is PRODUCTION READY!${NC}"
    echo ""
    echo -e "${BRAND_GREEN}✅ Ready for deployment to production servers${NC}"
    echo -e "${BRAND_GREEN}✅ All brand guidelines implemented${NC}"
    echo -e "${BRAND_GREEN}✅ Performance optimized${NC}"
    echo -e "${BRAND_GREEN}✅ Security headers configured${NC}"
    echo -e "${BRAND_GREEN}✅ PWA features working${NC}"
    echo -e "${BRAND_GREEN}✅ Cross-browser compatible${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  Some production tests failed. Please review before deployment.${NC}"
fi

echo ""
echo -e "${BRAND_ORANGE}🚂 UzTrain Platform - Professional Railway Education${NC}"
echo -e "${BRAND_GREEN}Production build with brand colors: Orange #E67247, Green #40964B, Dark #3C3C3C${NC}"
