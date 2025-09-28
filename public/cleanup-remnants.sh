#!/bin/bash

# Find line numbers
CLOSE_BRACE_LINE=$(grep -n "^        }$" public/index.html | grep "4266" | cut -d: -f1)
NEXT_FUNCTION_LINE=$(grep -n "Generate AI analysis for individual property" public/index.html | tail -1 | cut -d: -f1)

echo "Closing brace at line: $CLOSE_BRACE_LINE"
echo "Next function comment at line: $NEXT_FUNCTION_LINE"

# Show what's between
echo -e "\nContent between lines $CLOSE_BRACE_LINE and $NEXT_FUNCTION_LINE:"
awk "NR>$CLOSE_BRACE_LINE && NR<$NEXT_FUNCTION_LINE" public/index.html | head -20

echo -e "\n\nThis content needs to be removed."