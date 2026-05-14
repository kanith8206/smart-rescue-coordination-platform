# 🚨 Smart Rescue Coordination Platform

<div align="center">

![Smart Rescue](https://img.shields.io/badge/Smart%20Rescue-Emergency%20Platform-red?style=for-the-badge&logo=shield)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)

**A full-stack emergency response platform connecting citizens, rescue teams, and administrators in real-time.**

</div>

---

## 📌 Overview

The **Smart Rescue Coordination Platform** is a real-time emergency response web application designed to bridge the gap between citizens in distress and rescue teams. It features a one-tap SOS system, live GPS tracking, multi-language support, silent distress modes, family notification alerts via Email & SMS, and a dedicated admin dashboard with heatmap analytics.

---

## ✨ Features

### 🆘 Citizen Dashboard
- **One-Tap SOS Button** — Instantly sends an emergency signal with GPS coordinates
- **Silent Rescue Mode** — Discreet distress trigger for sensitive situations (long-press or tap)
- **Shake-to-SOS** — Shake device to trigger an emergency without touching the screen
- **Quick Situation Updates** — Pre-defined emergency types: Injured, Trapped, Medical, Flood, Fire
- **Voice Message** — Record audio to send with your SOS alert
- **Live GPS Tracking** — Real-time location sharing via Mapbox
- **Family Safety Beacon** — Alerts trusted contacts via Email (EmailJS) and SMS (Twilio)
- **Rescue Team Chat** — Receive real-time status updates from the assigned team

### 🚒 Rescue Dashboard
- View incoming SOS alerts in real-time via WebSockets
- Assign rescue units to active emergencies
- Update citizens on rescue status

### 🛠️ Admin Dashboard
- Full overview of all platform activity
- Manage rescue teams and assignments
- **Heatmap Page** — Visualize emergency incident density by location

### 🌐 Multi-Language Support
Fully internationalized with `i18next` — supports:
- 🇬🇧 English
- 🇮🇳 Hindi (`hi`)
- 🇮🇳 Tamil (`ta`)
- 🇮🇳 Telugu (`te`)
- 🇮🇳 Malayalam (`ml`)

### ♿ Rescue Lite Mode
- Simplified, high-contrast interface designed for elderly users and the visually impaired

### 📡 Backend Capabilities
- REST API for SOS submissions
- MongoDB persistence for all emergency records
- **Twilio SMS** alerts to family emergency phone numbers
- **Nodemailer** email alerts
- Socket.IO for real-time bidirectional communication

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 6 |
| **Styling** | Tailwind CSS v4, Framer Motion |
| **State Management** | Zustand |
| **Routing** | React Router v7 |
| **Maps** | Mapbox GL / react-map-gl |
| **Charts** | Recharts |
| **Real-time** | Socket.IO (client + server) |
| **i18n** | i18next + react-i18next |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **SMS Alerts** | Twilio |
| **Email Alerts** | Nodemailer + EmailJS |
| **AI Integration** | Google Generative AI (`@google/genai`) |

---

## 📁 Project Structure

```
smart-rescue-coordination-platform/
├── backend/                        # Node.js + Express backend
│   ├── config/                     # Database & app config
│   ├── controllers/
│   │   └── sosController.js        # SOS request handler (email + SMS dispatch)
│   ├── models/                     # Mongoose schemas
│   ├── routes/
│   │   └── sosRoutes.js            # POST /api/sos
│   ├── services/
│   │   ├── emailService.js         # Nodemailer email alerts
│   │   └── smsService.js           # Twilio SMS alerts
│   ├── .env                        # Backend environment variables
│   ├── package.json
│   └── server.js                   # Express server entry point
│
├── src/                            # React + TypeScript frontend
│   ├── components/
│   │   ├── dashboard/              # Dashboard-specific components
│   │   ├── navigation/             # NavigationBar
│   │   └── ui/                     # Reusable UI (Button, GlobalAlerts)
│   ├── hooks/
│   │   └── useShakeDetection.ts    # Device motion shake detector
│   ├── locales/                    # i18n translation files
│   │   ├── en.json
│   │   ├── hi.json
│   │   ├── ta.json
│   │   ├── te.json
│   │   └── ml.json
│   ├── models/                     # Frontend data models/types
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── CitizenDashboard.tsx    # Main citizen emergency interface
│   │   ├── RescueDashboard.tsx     # Rescue team view
│   │   ├── AdminDashboard.tsx      # Admin control panel
│   │   ├── HeatmapPage.tsx         # Incident heatmap
│   │   ├── SilentRescueMode.tsx    # Silent distress mode
│   │   └── RescueLiteMode.tsx      # Accessibility-first lite mode
│   ├── services/
│   │   ├── api.ts                  # Axios API client
│   │   ├── socket.ts               # Socket.IO client
│   │   └── OfflineQueueService.ts  # Offline SOS queuing
│   ├── store/
│   │   └── useAppStore.ts          # Zustand global state
│   ├── utils/
│   │   ├── cn.ts                   # Tailwind className utility
│   │   └── voice.ts                # Text-to-speech voice alerts
│   ├── i18n.ts                     # i18next configuration
│   ├── types.ts                    # Shared TypeScript types
│   └── App.tsx                     # Root component with routing
│
├── .env.example                    # Frontend environment variable template
├── index.html                      # Vite HTML entry point
├── package.json                    # Frontend dependencies & scripts
├── server.ts                       # Vite dev server wrapper (tsx)
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Twilio Account](https://www.twilio.com/) (for SMS alerts)
- [Mapbox Account](https://www.mapbox.com/) (for map features)
- [EmailJS Account](https://www.emailjs.com/) (for email alerts from frontend)

---

### 1. Clone the Repository

```bash
git clone https://github.com/kanith8206/smart-rescue-coordination-platform.git
cd smart-rescue-coordination-platform
```

---

### 2. Frontend Setup

Install dependencies:
```bash
npm install
```

Create a `.env` file in the root directory based on `.env.example`:
```env
# EmailJS Configuration (frontend)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Mapbox (for GPS map)
VITE_MAPBOX_TOKEN=your_mapbox_token
```

Start the frontend dev server:
```bash
npm run dev
```

---

### 3. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install backend dependencies:
```bash
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-rescue

# Twilio SMS
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the backend server:
```bash
# Development (with nodemon auto-reload)
npm run dev

# Production
npm start
```

The backend API will run at: `http://localhost:5000`

---

## 🔌 API Reference

### `POST /api/sos`
Submit an emergency SOS request.

**Request Body:**
```json
{
  "name": "John Doe",
  "location": { "lat": 12.9716, "lng": 77.5946 },
  "emergencyType": "Critical UI Alert",
  "message": "Immediate assistance needed!",
  "familyEmails": ["family@example.com"],
  "familyPhoneNumbers": ["+919876543210"]
}
```

**Response:** `200 OK` with SOS record.

---

### `GET /`
Health check — returns: `Smart Rescue API Server is running.`

---

## 🗺️ Application Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Home / hero page |
| `/login` | Login | User authentication |
| `/register` | Register | New user signup |
| `/citizen` | Citizen Dashboard | Emergency SOS interface |
| `/rescue` | Rescue Dashboard | Rescue team management |
| `/admin` | Admin Dashboard | Admin control panel |
| `/heatmap` | Heatmap | Incident density map |
| `/silent-rescue` | Silent Rescue Mode | Discreet distress mode |
| `/lite` | Rescue Lite Mode | Accessibility mode |

---

## 🌍 Internationalization

The app supports dynamic language switching. Translation files are located in `src/locales/`. To add a new language:

1. Create `src/locales/[lang-code].json`
2. Add translations following the existing key structure
3. Register the language in `src/i18n.ts`

---

## 🔐 Environment Variables Summary

| Variable | Location | Description |
|---|---|---|
| `VITE_EMAILJS_SERVICE_ID` | `.env` (root) | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | `.env` (root) | EmailJS email template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | `.env` (root) | EmailJS public key |
| `VITE_MAPBOX_TOKEN` | `.env` (root) | Mapbox access token |
| `PORT` | `backend/.env` | Backend server port |
| `MONGODB_URI` | `backend/.env` | MongoDB connection string |
| `TWILIO_ACCOUNT_SID` | `backend/.env` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | `backend/.env` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | `backend/.env` | Twilio outgoing phone number |

---

## 🚀 Scripts

### Frontend (root)
| Command | Description |
|---|---|
| `npm run dev` | Start Vite frontend dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type check |

### Backend (`/backend`)
| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start in production mode |

---

## 📱 Key UX Features

- **Offline SOS Queue** — SOS alerts are queued locally and retried when connectivity is restored
- **Voice Alerts** — Text-to-speech confirms SOS activation out loud
- **Emergency Theme** — The entire UI switches to a red emergency theme when SOS is active
- **Toast Notifications** — Non-blocking animated feedback for all key actions
- **Responsive Design** — Mobile-first, optimized for one-handed use in emergencies

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

Built with ❤️ for emergency response and public safety.

> **Note:** For production deployment, ensure all API keys and credentials are stored securely and never committed to version control. The `.gitignore` already excludes `.env` files.
