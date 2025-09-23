#!/bin/bash

# Test script for production deployment
echo "Testing Real Estate Tracker Production Deployment..."
echo "================================================"

# Check if URL is provided
if [ -z "$1" ]; then
    echo "Usage: ./test-production.sh <your-app-url>"
    echo "Example: ./test-production.sh https://real-estate-tracker.onrender.com"
    exit 1
fi

APP_URL=$1
echo "Testing URL: $APP_URL"
echo ""

# Test 1: Basic connectivity
echo "1. Testing basic connectivity..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $APP_URL)
if [ $HTTP_CODE -eq 200 ]; then
    echo "✅ App is accessible (HTTP $HTTP_CODE)"
else
    echo "❌ App returned HTTP $HTTP_CODE"
fi
echo ""

# Test 2: Health check endpoint
echo "2. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$APP_URL/health")
if [ "$HEALTH_RESPONSE" = "OK" ]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed: $HEALTH_RESPONSE"
fi
echo ""

# Test 3: API status
echo "3. Testing API configuration..."
API_STATUS=$(curl -s "$APP_URL/api/status")
echo "API Status Response: $API_STATUS"

# Check if API key is configured
if echo "$API_STATUS" | grep -q '"apiKeyConfigured":true'; then
    echo "✅ RentCast API key is configured"
else
    echo "⚠️  RentCast API key is NOT configured"
    echo "   Set RENTCAST_API_KEY in Render environment variables"
fi
echo ""

# Test 4: Static assets
echo "4. Testing static file serving..."
ASSETS_OK=true

# Check if main page has content
PAGE_SIZE=$(curl -s $APP_URL | wc -c)
if [ $PAGE_SIZE -gt 1000 ]; then
    echo "✅ Main page loaded ($PAGE_SIZE bytes)"
else
    echo "❌ Main page seems empty ($PAGE_SIZE bytes)"
    ASSETS_OK=false
fi
echo ""

# Summary
echo "================================================"
echo "DEPLOYMENT TEST SUMMARY"
echo "================================================"
echo ""
echo "Your app URL: $APP_URL"
echo ""
echo "Next steps:"
echo "1. Visit $APP_URL in your browser"
echo "2. Open browser console (F12) and check for errors"
echo "3. Click on a property and test the refresh button"
echo "4. If API key is not configured, add it in Render dashboard"
echo ""
echo "For logs and monitoring, visit:"
echo "https://dashboard.render.com"