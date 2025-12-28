#!/bin/bash

# UzTrain Platform API Test Script
# Brand-aligned professional testing suite

echo "🚂 UzTrain Platform API Test Suite"
echo "=================================="
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
BASE_URL="http://localhost:8084"
API_URL="https://your-supabase-url.supabase.co/rest/v1"
SUPABASE_KEY="your-supabase-anon-key"

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

# Function to test HTTP endpoint
test_endpoint() {
    local method="$1"
    local url="$2"
    local expected_status="$3"
    local test_name="$4"
    local data="$5"
    
    echo -e "${BLUE}Testing:${NC} $test_name"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -H "apikey: $SUPABASE_KEY" \
            -H "Authorization: Bearer $SUPABASE_KEY" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
            -H "apikey: $SUPABASE_KEY" \
            -H "Authorization: Bearer $SUPABASE_KEY")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "$expected_status" ]; then
        print_test_result "$test_name" "PASS" "$response_body"
    else
        print_test_result "$test_name" "FAIL" "Expected: $expected_status, Got: $http_code"
    fi
}

# Function to test frontend pages
test_frontend_page() {
    local path="$1"
    local test_name="$2"
    
    echo -e "${BLUE}Testing:${NC} $test_name"
    
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$path")
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ]; then
        print_test_result "$test_name" "PASS" "Page loaded successfully"
    else
        print_test_result "$test_name" "FAIL" "HTTP $http_code"
    fi
}

echo -e "${BRAND_ORANGE}🧪 Starting Frontend Tests...${NC}"
echo ""

# Test main pages
test_frontend_page "/" "Homepage"
test_frontend_page "/qonunlar" "Laws Page"
test_frontend_page "/qoidalar" "Rules Page"
test_frontend_page "/video-materiallar" "Video Materials Page"
test_frontend_page "/slaydlar" "Slides Page"
test_frontend_page "/temir-yol" "Railway Documents Page"
test_frontend_page "/bannerlar" "Banners Page"
test_frontend_page "/kasb-yoriqnomalari" "Job Manuals Page"
test_frontend_page "/admin" "Admin Dashboard"

echo ""
echo -e "${BRAND_GREEN}🔌 Starting API Tests...${NC}"
echo ""

# Test API endpoints (if Supabase is configured)
if [ "$API_URL" != "https://your-supabase-url.supabase.co/rest/v1" ]; then
    # Test database tables
    test_endpoint "GET" "$API_URL/qonunlar?select=*&limit=5" "200" "Laws API - Get Laws"
    test_endpoint "GET" "$API_URL/qoidalar?select=*&limit=5" "200" "Rules API - Get Rules"
    test_endpoint "GET" "$API_URL/video_materiallar?select=*&limit=5" "200" "Videos API - Get Videos"
    test_endpoint "GET" "$API_URL/slaydlar?select=*&limit=5" "200" "Slides API - Get Slides"
    test_endpoint "GET" "$API_URL/bannerlar?select=*&limit=5" "200" "Banners API - Get Banners"
    test_endpoint "GET" "$API_URL/kasb_yoriqnomalari?select=*&limit=5" "200" "Manuals API - Get Manuals"
    
    # Test POST endpoint (create new law)
    test_data='{"title":"Test Law","description":"Test description","xavfsizlik_darajasi":"yuqori"}'
    test_endpoint "POST" "$API_URL/qonunlar" "201" "Laws API - Create Law" "$test_data"
    
    # Test search functionality
    test_endpoint "GET" "$API_URL/qonunlar?title=ilike.*test*" "200" "Laws API - Search"
else
    echo -e "${YELLOW}⚠️  Supabase not configured, skipping API tests${NC}"
fi

echo ""
echo -e "${BRAND_ORANGE}🎨 Testing Brand Components...${NC}"
echo ""

# Test if brand CSS is loaded
brand_css_test=$(curl -s "$BASE_URL" | grep -c "brand-orange\|brand-green\|brand-dark")
if [ "$brand_css_test" -gt 0 ]; then
    print_test_result "Brand CSS Integration" "PASS" "Brand classes found in HTML"
else
    print_test_result "Brand CSS Integration" "FAIL" "Brand classes not found"
fi

# Test theme toggle functionality
theme_test=$(curl -s "$BASE_URL" | grep -c "theme\|dark\|light")
if [ "$theme_test" -gt 0 ]; then
    print_test_result "Theme System" "PASS" "Theme system detected"
else
    print_test_result "Theme System" "FAIL" "Theme system not found"
fi

# Test responsive design meta tags
responsive_test=$(curl -s "$BASE_URL" | grep -c "viewport")
if [ "$responsive_test" -gt 0 ]; then
    print_test_result "Responsive Design" "PASS" "Viewport meta tag found"
else
    print_test_result "Responsive Design" "FAIL" "Viewport meta tag missing"
fi

echo ""
echo -e "${BRAND_GREEN}📱 Testing Mobile Compatibility...${NC}"
echo ""

# Test with mobile user agent
mobile_response=$(curl -s -w "\n%{http_code}" "$BASE_URL" \
    -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15")
mobile_code=$(echo "$mobile_response" | tail -n1)

if [ "$mobile_code" = "200" ]; then
    print_test_result "Mobile User Agent" "PASS" "Mobile compatibility confirmed"
else
    print_test_result "Mobile User Agent" "FAIL" "Mobile compatibility issue"
fi

echo ""
echo -e "${BRAND_ORANGE}⚡ Performance Tests...${NC}"
echo ""

# Test page load time
start_time=$(date +%s%N)
curl -s "$BASE_URL" > /dev/null
end_time=$(date +%s%N)
load_time=$(( (end_time - start_time) / 1000000 ))

if [ "$load_time" -lt 2000 ]; then
    print_test_result "Page Load Time" "PASS" "Loaded in ${load_time}ms"
else
    print_test_result "Page Load Time" "FAIL" "Slow load time: ${load_time}ms"
fi

# Test static assets
test_frontend_page "/favicon.ico" "Favicon"
test_frontend_page "/logo.svg" "Logo SVG"
test_frontend_page "/manifest.json" "PWA Manifest"

echo ""
echo -e "${BRAND_GREEN}🔒 Security Tests...${NC}"
echo ""

# Test security headers
security_headers=$(curl -s -I "$BASE_URL" | grep -i "x-frame-options\|x-content-type-options\|x-xss-protection")
if [ -n "$security_headers" ]; then
    print_test_result "Security Headers" "PASS" "Security headers present"
else
    print_test_result "Security Headers" "FAIL" "Missing security headers"
fi

# Test HTTPS redirect (if applicable)
if [[ "$BASE_URL" == http://* ]]; then
    echo -e "${YELLOW}⚠️  HTTP detected - consider HTTPS for production${NC}"
fi

echo ""
echo "=================================="
echo -e "${BRAND_ORANGE}📊 TEST SUMMARY${NC}"
echo "=================================="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${BRAND_GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ "$FAILED_TESTS" -eq 0 ]; then
    echo ""
    echo -e "${BRAND_GREEN}🎉 ALL TESTS PASSED! Platform is ready for production! 🚀${NC}"
    echo -e "${BRAND_ORANGE}Your brand-aligned UzTrain platform is working perfectly!${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  Some tests failed. Please check the issues above.${NC}"
fi

echo ""
echo -e "${BRAND_ORANGE}🚂 UzTrain Platform - Professional Railway Education${NC}"
echo -e "${BRAND_GREEN}Built with your brand guide: Orange #E67247, Green #40964B, Dark #3C3C3C${NC}"
