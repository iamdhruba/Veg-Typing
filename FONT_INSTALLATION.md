# Preeti Font Installation Guide

## Issue
The Preeti font file is missing from the project, causing text to display in English instead of Nepali characters.

## Solution

### Step 1: Download Preeti Font
Download the Preeti.ttf font file from one of these sources:
- Official Nepali font repositories
- https://www.fontspace.com/preeti-font-f3384
- Or search for "Preeti font download" online

### Step 2: Add Font to Project
1. Place the `Preeti.ttf` file in: `frontend/public/fonts/`
2. The file path should be: `frontend/public/fonts/Preeti.ttf`

### Step 3: Verify Installation
1. Restart your development server
2. Open the application in your browser
3. Select "Preeti" mode
4. The text should now display in Nepali characters

## Alternative: Use CDN or System Font
If you cannot find the Preeti.ttf file, you can modify the CSS to use a system-installed Preeti font:

In `frontend/src/index.css`, change:
```css
@font-face {
  font-family: 'Preeti';
  src: url('/fonts/Preeti.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
```

To:
```css
@font-face {
  font-family: 'Preeti';
  src: local('Preeti');
  font-weight: normal;
  font-style: normal;
}
```

This will use the Preeti font if it's installed on the user's system.
