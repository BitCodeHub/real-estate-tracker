#!/bin/bash

# Navigate to the project directory
cd /Users/jimmylam/Documents/re

# Stage the specific files
git add public/index.html
git add debug-mobile-display.js
git add MOBILE_DISPLAY_FIX.md

# Create the commit
git commit -m "fix: resolve mobile display issue where properties weren't showing

- Added DOMContentLoaded event listener to initialize app on page load
- Ensures loadProperties() is called when page loads
- Updates mobile property cards on mobile devices
- Handles responsive switching between mobile/desktop views
- Created debug script for troubleshooting mobile display issues
- Documented fix in MOBILE_DISPLAY_FIX.md

Resolves issue where mobile view showed 'No Properties Yet' despite data existing

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
git push

echo "✅ Changes committed and pushed successfully!"