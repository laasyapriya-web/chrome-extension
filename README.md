# Chrome Extension Project
COMPANY: CODTECH IT SOLUTIONS

NAME :GURAJALA LAASYAPRIYA

INTERN ID: CT06DF2182

DOMAIN: FULL STACK WEB DEVELOPMENT

DURATION: 6 WEEKS

MENTOR: NEELA SANTOSH
## Overview
This project is a Chrome extension with a backend and frontend, designed to track and analyze productivity through time logs. It features a dashboard, analytics, and settings, and uses a Node.js/Express backend with a React frontend.

## Features
- Track time logs and productivity
- View analytics and charts
- Dashboard for quick insights
- Settings for customization
- Backend API with Express and MongoDB

## Project Structure
```
chrome extension/
  backend/           # Node.js/Express backend
  frontend/          # React frontend
  background.js      # Chrome extension background script
  content.js         # Chrome extension content script
  manifest.json      # Chrome extension manifest
  popup.html/js      # Popup UI
  dashboard.html     # Dashboard UI
  settings.html/js   # Settings UI
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for backend)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file and configure it:
   ```bash
   cp env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Loading the Extension
1. Build the frontend if needed and copy static files to the root directory.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable Developer Mode.
4. Click "Load unpacked" and select the project root directory.

## Usage
- Use the popup to start/stop time logs.
- View analytics and productivity charts in the dashboard.
- Adjust settings as needed.

##**OUTPUT**
