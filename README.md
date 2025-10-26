# HomeFinder – Chrome Extension 🏠  
A browser extension + backend service that monitors real-estate listings on Yad2 and triggers alerts when new apartments match user-specified parameters.

## Features  
- Automatic polling of Yad2 listings at scheduled intervals.  
- Compares new listings against stored records in MongoDB to avoid duplicates.  
- Alerts the user (via browser extension notification or badge) when relevant new listings are found.  
- Lightweight Chrome Extension for front-end interaction + Node.js/Express backend for logic and data persistence.

## Tech Stack  
- **Frontend (Chrome Extension):** JavaScript, Chrome Extension API, manifest.json, content/background scripts.  
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Cron jobs (node-cron or equivalent), Axios/Fetch for API calls.  
- **Data & Automation:** Scheduled tasks compare listing snapshots and trigger notifications when new entries appear.

## Architecture & Workflow  
1. The Chrome extension loads in the background (service worker + content scripts) and triggers listing refresh events or user-initiated checks.  
2. The backend runs a cron job (e.g., every 15-30 minutes) to fetch the latest Yad2 listings via public API endpoint.  
3. The backend compares fetched listings against the stored listings collection in MongoDB. New listings = not matched in DB.  
4. When new matches are detected, the backend saves them and sends a notification signal to the extension (via Telegram).  
5. The extension displays an alert notification with info and link about the apartment.

## Project Structure  
```
homefinder/
├── extension/             # Chrome extension source code
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html/js (optional UI)
│   └── assets/
├── backend/               # Node.js / Express backend service
│   ├── server.js          # App entrypoint
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── services/          # Fetching and processing logic
│   ├── cron/              # Scheduled tasks definitions
│   └── config/
├── db/                    # Database schemas & migrations (if any)
└── README.md              # This file
```

## Installation & Usage  
### 1. Clone the repository  
```bash
git clone https://github.com/Danmile/HomeFinder---chrome-extension.git
cd HomeFinder---chrome-extension
```

### 2. Setup backend  
```bash
cd backend
npm install
# configure .env (MONGODB_URI, YAD2_API_ENDPOINT, etc)
npm start
```

### 3. Load extension in Chrome  
- Go to `chrome://extensions/`  
- Enable *Developer mode*  
- Click **Load unpacked** → select `extension/` folder  
- The extension icon should appear in your toolbar  
- Configure any preferences (if applicable) and allow notification permissions

## Configuration  
- Define environment variables in `.env`:  
  ```text
  MONGODB_URI=your_mongo_connection_string
  YAD2_API_ENDPOINT=https://api.yad2.co.il/… (or scraping endpoint)
  CRON_SCHEDULE=*/15 * * * *   # every 15 minutes
  ALERT_THRESHOLD_PRICE=…
  ```
- In `backend/config/`, adjust fetch parameters (locations, filters) as needed.  
- The extension’s popup (if present) may allow user settings such as notification filters, keywords, price limits.


## Author  
**Dan Milevski**

---

*Made with ❤️ for smart home seekers.*
