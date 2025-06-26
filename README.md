# Productivity Time Tracker Chrome Extension

A comprehensive Chrome Extension that tracks your time spent on websites and provides detailed productivity analytics with a beautiful React dashboard.

## 🚀 Features

### Chrome Extension
- **Real-time Time Tracking**: Automatically tracks time spent on each website
- **Productivity Classification**: Classifies websites as productive or unproductive
- **Live Badge Counter**: Shows current tab's time on the extension icon
- **Smart Popup**: Quick overview with current tab info and daily stats
- **Background Sync**: Automatically syncs data with backend server

### Backend API (Node.js + MongoDB)
- **RESTful API**: Complete CRUD operations for time logs
- **Analytics Endpoints**: Productivity reports, domain analytics, insights
- **Data Aggregation**: Daily/weekly summaries and trends
- **Security**: Rate limiting, CORS, input validation
- **MongoDB Integration**: Efficient data storage with indexing

### React Dashboard
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Interactive Charts**: Line charts, bar charts, and doughnut charts using Chart.js
- **Real-time Updates**: Live data synchronization
- **Date Range Selection**: Flexible time period analysis
- **Detailed Analytics**: Productivity insights and recommendations

## 🛠️ Tech Stack

- **Chrome Extension**: Manifest V3, Service Workers
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React 18, Chart.js, Tailwind CSS
- **API**: RESTful with JWT authentication
- **Charts**: React-Chartjs-2 with custom styling

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Chrome browser

### 1. Clone the Repository
```bash
git clone <repository-url>
cd productivity-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your MongoDB connection string
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Chrome Extension Setup
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the root directory
4. The extension should now appear in your toolbar

## 🔧 Configuration

### Environment Variables (Backend)
Create a `.env` file in the backend directory:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/productivity-tracker
JWT_SECRET=your-super-secret-jwt-key-here
```

### Extension Configuration
The extension automatically classifies websites as productive/unproductive based on a predefined list. You can modify the `productiveDomains` array in `background.js` to customize this behavior.

## 📊 Usage

### Chrome Extension
1. **Install**: Load the extension in Chrome
2. **Browse**: Start browsing normally - the extension tracks automatically
3. **Monitor**: Click the extension icon to see current tab info
4. **Dashboard**: Click "Dashboard" to open the full analytics view

### Dashboard Features
- **Overview**: Daily productivity summary and current activity
- **Analytics**: Detailed charts and insights
- **Time Logs**: Complete history with sorting and filtering
- **Settings**: Configuration and data management

### API Endpoints

#### Time Logs
- `GET /api/time-logs` - Get all time logs with pagination
- `POST /api/time-logs` - Create new time log
- `GET /api/time-logs/:id` - Get specific time log
- `PUT /api/time-logs/:id` - Update time log
- `DELETE /api/time-logs/:id` - Delete time log

#### Analytics
- `GET /api/analytics/productivity` - Productivity analytics
- `GET /api/analytics/domains` - Domain analytics
- `GET /api/analytics/hourly-pattern` - Hourly activity pattern
- `GET /api/analytics/insights` - Productivity insights

## 🏗️ Project Structure

```
productivity-tracker/
├── manifest.json              # Chrome extension manifest
├── background.js              # Extension background script
├── content.js                 # Content script for web pages
├── popup.html                 # Extension popup interface
├── popup.js                   # Popup functionality
├── backend/                   # Node.js backend
│   ├── server.js             # Express server
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   └── package.json          # Backend dependencies
└── frontend/                 # React dashboard
    ├── src/
    │   ├── components/       # React components
    │   ├── pages/           # Page components
    │   ├── context/         # React context
    │   └── App.js           # Main app component
    └── package.json         # Frontend dependencies
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs
- **CORS Configuration**: Secure cross-origin requests
- **Helmet**: Security headers
- **Data Validation**: MongoDB schema validation

## 📈 Analytics Features

### Productivity Metrics
- **Productivity Score**: Percentage of time spent on productive sites
- **Time Distribution**: Breakdown of productive vs unproductive time
- **Domain Analysis**: Top visited domains and their productivity
- **Hourly Patterns**: Activity patterns throughout the day
- **Weekly Trends**: Long-term productivity trends

### Insights & Recommendations
- **Smart Recommendations**: AI-powered productivity suggestions
- **Goal Tracking**: Monitor productivity improvements
- **Distraction Analysis**: Identify time-wasting patterns
- **Focus Sessions**: Track deep work periods

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB (MongoDB Atlas recommended)
2. Deploy to Heroku, Vercel, or your preferred platform
3. Update environment variables
4. Set up automatic data cleanup

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or your preferred platform
3. Update API endpoint in production

### Extension Distribution
1. Build the extension for production
2. Submit to Chrome Web Store (optional)
3. Or distribute as a developer extension

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify MongoDB connection
3. Ensure all services are running
4. Check the API endpoints are accessible

## 🔮 Future Enhancements

- **Goal Setting**: Set daily/weekly productivity goals
- **Team Analytics**: Multi-user productivity tracking
- **Mobile App**: React Native companion app
- **AI Insights**: Machine learning-powered recommendations
- **Integrations**: Connect with other productivity tools
- **Offline Support**: Work without internet connection

## 📊 Data Privacy

- All data is stored locally in Chrome storage
- Backend sync is optional and configurable
- No personal data is collected or shared
- Users have full control over their data

## 🌓 Theme Support & Modern UI

- The extension and dashboard now feature a **modern, minimal UI** with a focus on clarity and productivity.
- **Dark mode** uses a true black background (`#18181b`), with all badges and buttons in neutral grays—no blue, purple, or color accents.
- **Light mode** uses a clean, pastel-inspired SaaS palette.
- Users can toggle between light and dark themes from the popup or dashboard settings.
- All UI elements (badges, buttons, cards) are styled for a minimal, colorless look in dark mode.

### ⚠️ Chrome Extension Style Caching
If you update popup.html or styles and don't see changes:
1. Go to `chrome://extensions/`
2. Click the **Reload** (⟳) button on your extension
3. Close and reopen the popup

This forces Chrome to use the latest styles and fixes most caching issues.

---

**Happy Productivity Tracking! 🎯** 