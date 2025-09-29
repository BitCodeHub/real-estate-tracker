#!/usr/bin/env python3

with open('/Users/jimmylam/Documents/re/public/index.html', 'r') as f:
    lines = f.readlines()
    
    print("Searching for key functions and their line numbers...\n")
    
    for i, line in enumerate(lines, 1):
        if 'async function loadProperties' in line:
            print(f'loadProperties function defined at line {i}')
            # Print next few lines to see the function start
            for j in range(min(10, len(lines) - i)):
                print(f'  {i+j}: {lines[i+j-1].rstrip()}')
            print()
            
        if 'loadProperties()' in line and 'await' in line:
            print(f'loadProperties() called at line {i}: {line.strip()}')
            
        if 'DOMContentLoaded' in line:
            print(f'DOMContentLoaded listener at line {i}: {line.strip()}')
            
        if 'updateMobilePropertyCards' in line:
            print(f'updateMobilePropertyCards at line {i}: {line.strip()}')