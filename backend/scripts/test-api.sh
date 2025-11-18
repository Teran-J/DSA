#!/bin/bash

# Script para probar todos los endpoints de la API
# Uso: ./test-api.sh

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api"

echo "================================================"
echo "  🧪 Testing Design Platform API"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to print test result
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC} - $2"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} - $2"
        ((FAILED++))
    fi
}

# 1. Health Check
echo -e "${YELLOW}[1] Testing Health Check${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
[ "$response" -eq 200 ]
test_result $? "GET /health"
echo ""

# 2. Register User
echo -e "${YELLOW}[2] Testing User Registration${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "password": "password123",
    "name": "Test User"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
[ ! -z "$TOKEN" ]
test_result $? "POST /auth/register"
echo ""

# 3. Login
echo -e "${YELLOW}[3] Testing Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "password123"
  }')

CLIENT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
[ ! -z "$CLIENT_TOKEN" ]
test_result $? "POST /auth/login"
echo ""

# 4. Get Products
echo -e "${YELLOW}[4] Testing Get Products${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/products")
[ "$response" -eq 200 ]
test_result $? "GET /products"
echo ""

# 5. Get Products by Category
echo -e "${YELLOW}[5] Testing Get Products by Category${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/products?category=camisetas")
[ "$response" -eq 200 ]
test_result $? "GET /products?category=camisetas"
echo ""

# 6. Get Product by ID
echo -e "${YELLOW}[6] Testing Get Product by ID${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/products/1")
[ "$response" -eq 200 ]
test_result $? "GET /products/1"
echo ""

# 7. Get My Designs (authenticated)
echo -e "${YELLOW}[7] Testing Get My Designs${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  "$API_URL/designs/user/me")
[ "$response" -eq 200 ]
test_result $? "GET /designs/user/me (authenticated)"
echo ""

# 8. Unauthorized request (without token)
echo -e "${YELLOW}[8] Testing Unauthorized Access${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/designs/user/me")
[ "$response" -eq 401 ]
test_result $? "GET /designs/user/me (unauthorized)"
echo ""

# 9. Designer Login
echo -e "${YELLOW}[9] Testing Designer Login${NC}"
DESIGNER_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "designer@example.com",
    "password": "password123"
  }')

DESIGNER_TOKEN=$(echo $DESIGNER_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
[ ! -z "$DESIGNER_TOKEN" ]
test_result $? "POST /auth/login (designer)"
echo ""

# 10. Get Pending Designs (designer)
echo -e "${YELLOW}[10] Testing Get Pending Designs (Designer)${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $DESIGNER_TOKEN" \
  "$API_URL/designs/pending/all")
[ "$response" -eq 200 ]
test_result $? "GET /designs/pending/all (designer)"
echo ""

# 11. Forbidden access (client trying designer endpoint)
echo -e "${YELLOW}[11] Testing Forbidden Access${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  "$API_URL/designs/pending/all")
[ "$response" -eq 403 ]
test_result $? "GET /designs/pending/all (forbidden for client)"
echo ""

# Summary
echo ""
echo "================================================"
echo "  📊 Test Summary"
echo "================================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "Total: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
