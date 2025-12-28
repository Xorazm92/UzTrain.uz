
#!/bin/bash

# UzTrain Platform - Complete Test Suite
# Professional Railway Education Platform Testing

echo "🚂 UzTrain Platform - Complete Testing Suite"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
NC='\033[0m'

# Brand colors
BRAND_ORANGE='\033[38;2;230;114;71m'
BRAND_GREEN='\033[38;2;64;150;75m'
BRAND_DARK='\033[38;2;60;60;60m'

# Test configuration
BASE_URL="http://localhost:5000"
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

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

test_endpoint() {
    local path="$1"
    local test_name="$2"
    
    echo -e "${BLUE}Testing:${NC} $test_name"
    
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$path" --max-time 10)
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ]; then
        print_test_result "$test_name" "PASS" "HTTP 200"
    else
        print_test_result "$test_name" "FAIL" "HTTP $http_code"
    fi
}

echo -e "${BRAND_ORANGE}🔧 BUILD VERIFICATION${NC}"
echo "====================="

# Check if build exists
if [ -d "dist" ]; then
    print_test_result "Build Directory" "PASS" "dist/ exists"
else
    print_test_result "Build Directory" "FAIL" "dist/ not found"
fi

# Check if server.js exists
if [ -f "server.js" ]; then
    print_test_result "Server File" "PASS" "server.js exists"
else
    print_test_result "Server File" "FAIL" "server.js not found"
fi

echo ""
echo -e "${BRAND_GREEN}🌐 API ENDPOINTS${NC}"
echo "================="

# Test API endpoints
test_endpoint "/health" "Health Check"
test_endpoint "/api/status" "API Status"

echo ""
echo -e "${BRAND_ORANGE}📱 APPLICATION PAGES${NC}"
echo "===================="

# Test main pages
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

for page_info in "${pages[@]}"; do
    IFS=':' read -r path name <<< "$page_info"
    test_endpoint "$path" "$name"
done

echo ""
echo -e "${BRAND_GREEN}🎨 BRAND ELEMENTS${NC}"
echo "=================="

# Test brand implementation
homepage_content=$(curl -s "$BASE_URL" --max-time 10)
if echo "$homepage_content" | grep -q "UzTrain"; then
    print_test_result "UzTrain Branding" "PASS" "Brand name found"
else
    print_test_result "UzTrain Branding" "FAIL" "Brand name not found"
fi

brand_colors=$(echo "$homepage_content" | grep -c "E67247\|40964B\|3C3C3C")
if [ "$brand_colors" -gt 0 ]; then
    print_test_result "Brand Colors" "PASS" "Brand colors found ($brand_colors instances)"
else
    print_test_result "Brand Colors" "FAIL" "Brand colors not found"
fi

echo ""
echo -e "${BRAND_ORANGE}⚡ PERFORMANCE${NC}"
echo "=============="

# Test performance
start_time=$(date +%s%N)
curl -s "$BASE_URL" --max-time 10 > /dev/null
end_time=$(date +%s%N)
load_time=$(( (end_time - start_time) / 1000000 ))

if [ "$load_time" -lt 1000 ]; then
    print_test_result "Page Load Speed" "PASS" "${load_time}ms"
else
    print_test_result "Page Load Speed" "FAIL" "${load_time}ms (too slow)"
fi

echo ""
echo "=============================================="
echo -e "${BRAND_ORANGE}📊 TEST SUMMARY${NC}"
echo "=============================================="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${BRAND_GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ "$FAILED_TESTS" -eq 0 ]; then
    success_rate=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    echo -e "Success Rate: ${BRAND_GREEN}${success_rate}%${NC}"
    echo ""
    echo -e "${BRAND_GREEN}🎉 PLATFORM FULLY FUNCTIONAL! 🚀${NC}"
    echo -e "${BRAND_ORANGE}UzTrain Professional Railway Education Platform${NC}"
    echo -e "${BRAND_GREEN}Ready for production deployment!${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️ Some tests failed. Please check the errors above.${NC}"
fi

echo ""
echo -e "${BRAND_DARK}Platform URL: ${BASE_URL}${NC}"
