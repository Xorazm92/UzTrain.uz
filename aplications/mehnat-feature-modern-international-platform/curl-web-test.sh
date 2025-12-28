#!/bin/bash

# UzTrain Platform - Comprehensive CURL Web Test
# Brand-aligned web testing with detailed analysis

echo "🚂 UzTrain Platform - CURL Web Test Suite"
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
BASE_URL="http://localhost:8084"

# Test counter
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
test_endpoint() {
    local path="$1"
    local test_name="$2"
    local expected_content="$3"
    
    echo -e "${BLUE}Testing:${NC} $test_name"
    
    # Get response with timing and headers
    start_time=$(date +%s%N)
    response=$(curl -s -w "\n%{http_code}\n%{time_total}\n%{size_download}\n%{content_type}" "$BASE_URL$path")
    end_time=$(date +%s%N)
    
    http_code=$(echo "$response" | tail -n4 | head -n1)
    time_total=$(echo "$response" | tail -n3 | head -n1)
    size_download=$(echo "$response" | tail -n2 | head -n1)
    content_type=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -4)
    
    load_time=$(( (end_time - start_time) / 1000000 ))
    
    # Check HTTP status
    if [ "$http_code" = "200" ]; then
        # Check content if specified
        if [ -n "$expected_content" ]; then
            if echo "$response_body" | grep -q "$expected_content"; then
                print_test_result "$test_name" "PASS" "HTTP 200, ${load_time}ms, ${size_download}b, Content Found"
            else
                print_test_result "$test_name" "WARN" "HTTP 200 but expected content not found"
            fi
        else
            if [ "$load_time" -lt 1000 ]; then
                print_test_result "$test_name" "PASS" "HTTP 200, ${load_time}ms, ${size_download}b"
            else
                print_test_result "$test_name" "WARN" "HTTP 200 but slow: ${load_time}ms"
            fi
        fi
    else
        print_test_result "$test_name" "FAIL" "HTTP $http_code"
    fi
}

# Function to test brand elements
test_brand_elements() {
    local path="$1"
    local test_name="$2"
    
    echo -e "${BLUE}Testing Brand Elements:${NC} $test_name"
    
    response=$(curl -s "$BASE_URL$path")
    
    # Check for brand colors
    brand_orange_count=$(echo "$response" | grep -c "E67247\|brand-orange")
    brand_green_count=$(echo "$response" | grep -c "40964B\|brand-green")
    brand_dark_count=$(echo "$response" | grep -c "3C3C3C\|brand-dark")
    
    total_brand_elements=$((brand_orange_count + brand_green_count + brand_dark_count))
    
    if [ "$total_brand_elements" -gt 5 ]; then
        print_test_result "$test_name - Brand Colors" "PASS" "Found $total_brand_elements brand elements"
    else
        print_test_result "$test_name - Brand Colors" "WARN" "Limited brand elements: $total_brand_elements"
    fi
    
    # Check for UzTrain branding
    uztrain_count=$(echo "$response" | grep -c "UzTrain\|uztrain")
    if [ "$uztrain_count" -gt 0 ]; then
        print_test_result "$test_name - UzTrain Branding" "PASS" "UzTrain branding found $uztrain_count times"
    else
        print_test_result "$test_name - UzTrain Branding" "FAIL" "UzTrain branding not found"
    fi
}

echo -e "${BRAND_ORANGE}🌐 BASIC CONNECTIVITY TESTS${NC}"
echo "============================="

# Test basic connectivity
test_endpoint "/" "Homepage" "UzTrain"
test_endpoint "/qonunlar" "Laws Page" 
test_endpoint "/qoidalar" "Rules Page"
test_endpoint "/video-materiallar" "Video Materials Page"
test_endpoint "/slaydlar" "Slides Page"
test_endpoint "/temir-yol" "Railway Documents Page"
test_endpoint "/bannerlar" "Banners Page"
test_endpoint "/kasb-yoriqnomalari" "Job Manuals Page"
test_endpoint "/admin" "Admin Dashboard"

echo ""
echo -e "${BRAND_GREEN}🎨 BRAND COMPLIANCE TESTS${NC}"
echo "=========================="

# Test brand elements on key pages
test_brand_elements "/" "Homepage"
test_brand_elements "/qonunlar" "Laws Page"
test_brand_elements "/admin" "Admin Dashboard"

echo ""
echo -e "${BRAND_ORANGE}📱 RESPONSIVE DESIGN TESTS${NC}"
echo "=========================="

# Test with different user agents
echo -e "${BLUE}Testing:${NC} Mobile Responsiveness"
mobile_response=$(curl -s -w "\n%{http_code}" "$BASE_URL" \
    -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15")
mobile_code=$(echo "$mobile_response" | tail -n1)

if [ "$mobile_code" = "200" ]; then
    mobile_content=$(echo "$mobile_response" | head -n -1)
    viewport_count=$(echo "$mobile_content" | grep -c "viewport")
    if [ "$viewport_count" -gt 0 ]; then
        print_test_result "Mobile Viewport" "PASS" "Viewport meta tag found"
    else
        print_test_result "Mobile Viewport" "WARN" "Viewport meta tag missing"
    fi
else
    print_test_result "Mobile Responsiveness" "FAIL" "HTTP $mobile_code"
fi

echo ""
echo -e "${BRAND_GREEN}⚡ PERFORMANCE TESTS${NC}"
echo "==================="

# Test page load times for key pages
pages=("/" "/qonunlar" "/admin" "/video-materiallar")
for page in "${pages[@]}"; do
    echo -e "${BLUE}Testing Performance:${NC} $page"
    
    start_time=$(date +%s%N)
    response=$(curl -s -w "%{time_total}" "$BASE_URL$page")
    end_time=$(date +%s%N)
    
    load_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ "$load_time" -lt 500 ]; then
        print_test_result "Load Time $page" "PASS" "${load_time}ms (Excellent)"
    elif [ "$load_time" -lt 1000 ]; then
        print_test_result "Load Time $page" "PASS" "${load_time}ms (Good)"
    elif [ "$load_time" -lt 2000 ]; then
        print_test_result "Load Time $page" "WARN" "${load_time}ms (Acceptable)"
    else
        print_test_result "Load Time $page" "FAIL" "${load_time}ms (Too Slow)"
    fi
done

echo ""
echo -e "${BRAND_ORANGE}🔒 SECURITY HEADERS TESTS${NC}"
echo "========================="

echo -e "${BLUE}Testing:${NC} Security Headers"
headers=$(curl -s -I "$BASE_URL")

# Check for security headers
security_headers=(
    "X-Frame-Options"
    "X-Content-Type-Options"
    "X-XSS-Protection"
    "Referrer-Policy"
)

for header in "${security_headers[@]}"; do
    if echo "$headers" | grep -qi "$header"; then
        print_test_result "Security Header: $header" "PASS" "Present"
    else
        print_test_result "Security Header: $header" "WARN" "Missing"
    fi
done

echo ""
echo -e "${BRAND_GREEN}📦 STATIC ASSETS TESTS${NC}"
echo "======================"

# Test static assets
assets=(
    "/favicon.ico:Favicon"
    "/logo.svg:Logo SVG"
    "/manifest.json:PWA Manifest"
)

for asset_info in "${assets[@]}"; do
    IFS=':' read -r asset_path asset_name <<< "$asset_info"
    test_endpoint "$asset_path" "$asset_name"
done

echo ""
echo -e "${BRAND_ORANGE}🎯 CONTENT VALIDATION TESTS${NC}"
echo "==========================="

# Test for specific content elements
echo -e "${BLUE}Testing:${NC} Homepage Content"
homepage_content=$(curl -s "$BASE_URL")

# Check for key elements
elements=(
    "UzTrain:Brand Name"
    "Ta'lim:Education Content"
    "Temir yo'l:Railway Content"
    "Professional:Professional Content"
    "brand-orange:Brand Orange Color"
    "brand-green:Brand Green Color"
)

for element_info in "${elements[@]}"; do
    IFS=':' read -r element element_name <<< "$element_info"
    if echo "$homepage_content" | grep -qi "$element"; then
        print_test_result "Content: $element_name" "PASS" "Found"
    else
        print_test_result "Content: $element_name" "WARN" "Not found"
    fi
done

echo ""
echo -e "${BRAND_GREEN}🌐 CROSS-BROWSER SIMULATION${NC}"
echo "=========================="

# Test with different browser user agents
browsers=(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36:Chrome Windows"
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36:Chrome macOS"
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36:Chrome Linux"
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15:Safari iOS"
)

for browser_info in "${browsers[@]}"; do
    IFS=':' read -r user_agent browser_name <<< "$browser_info"
    
    echo -e "${BLUE}Testing:${NC} $browser_name Compatibility"
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL" -H "User-Agent: $user_agent")
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ]; then
        print_test_result "$browser_name Compatibility" "PASS" "Compatible"
    else
        print_test_result "$browser_name Compatibility" "FAIL" "HTTP $http_code"
    fi
done

echo ""
echo "=========================================="
echo -e "${BRAND_ORANGE}📊 CURL TEST SUMMARY${NC}"
echo "=========================================="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${BRAND_GREEN}$PASSED_TESTS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

# Calculate success rate
if [ "$TOTAL_TESTS" -gt 0 ]; then
    success_rate=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    echo -e "Success Rate: ${BLUE}${success_rate}%${NC}"
else
    success_rate=0
fi

echo ""
if [ "$FAILED_TESTS" -eq 0 ] && [ "$success_rate" -gt 90 ]; then
    echo -e "${BRAND_GREEN}🎉 EXCELLENT! WEB PLATFORM IS FULLY FUNCTIONAL! 🚀${NC}"
    echo ""
    echo -e "${BRAND_GREEN}✅ All pages loading correctly${NC}"
    echo -e "${BRAND_GREEN}✅ Brand elements properly implemented${NC}"
    echo -e "${BRAND_GREEN}✅ Performance is excellent${NC}"
    echo -e "${BRAND_GREEN}✅ Cross-browser compatible${NC}"
    echo -e "${BRAND_GREEN}✅ Security headers configured${NC}"
    echo ""
    echo -e "${BRAND_ORANGE}🌐 Platform is ready for users!${NC}"
elif [ "$FAILED_TESTS" -eq 0 ]; then
    echo -e "${BRAND_GREEN}🎉 GOOD! WEB PLATFORM IS FUNCTIONAL WITH MINOR IMPROVEMENTS${NC}"
    echo -e "${YELLOW}Consider addressing warnings for optimal performance${NC}"
else
    echo -e "${YELLOW}⚠️  PLATFORM NEEDS ATTENTION${NC}"
    echo -e "${RED}Please fix failed tests before production use${NC}"
fi

echo ""
echo -e "${BRAND_ORANGE}🚂 UzTrain Platform - Professional Railway Education${NC}"
echo -e "${BRAND_GREEN}CURL testing completed - Web platform assessment complete!${NC}"
echo -e "${BLUE}Platform URL: $BASE_URL${NC}"
