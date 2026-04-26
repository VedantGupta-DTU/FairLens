# FairLens Frontend — AI Bias Auditor

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Motion-11-FF0055?style=for-the-badge&logo=framer&logoColor=white)

**Premium dark-theme interface for AI bias detection**

[Backend Repo](https://github.com/NAME-ASHWANIYADAV/fairlens_backend) · [Live Demo](#) · [Setup Guide](#quick-start)

</div>

---

## 🔍 What is FairLens?

FairLens is an AI-powered bias auditor that detects discrimination in datasets and AI systems — built for the Indian context. This repo contains the **frontend** — a premium React application with motion design, glassmorphism, and Grok AI integration.

### ✨ Features

- 🌐 **6 Pages** — Landing, Upload, Analysis, Report Card, Chat Explorer, Dashboard
- 🎨 **Premium Design** — Dark-first theme, glassmorphism, animated 3D orb, aurora backgrounds
- ⚡ **Motion Design** — Framer Motion animations, parallax scroll, character-by-character text reveal
- 📊 **Animated Report** — SVG radial gauge with tick marks, gradient accent finding cards
- 💬 **AI Chat** — Conversational bias explorer with gradient animated input bar
- 📱 **Responsive** — Mobile-first with floating dock navigation
- ♿ **Accessible** — `prefers-reduced-motion`, `:focus-visible`, semantic HTML

---

## 🖼️ Pages

| Page | Description |
|------|-------------|
| **Landing** | Hero with animated 3D orb, floating metric badges, converging beam lines |
| **Upload** | 3D tilt drop zone, tab switcher (CSV/Screenshot/API), feature pills |
| **Analysis** | Real-time progress steps, connects to backend `/api/analyze` |
| **Report** | Animated radial chart (0-100 score), finding cards with comparison bars |
| **Chat** | Hindi/English chat with Grok AI, gradient animated input |
| **Dashboard** | Overview of past audits |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| TypeScript 5 | Type Safety |
| Vite 5 | Build Tool |
| Tailwind CSS v4 | Styling |
| Framer Motion 11 | Animations |
| React Router 6 | Navigation |
| Recharts | Charts |
| Lucide React | Icons |
| Clash Display + Space Grotesk | Typography |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- [Backend server](https://github.com/NAME-ASHWANIYADAV/fairlens_backend) running on port 8000

### Setup

```bash
# Clone
git clone https://github.com/NAME-ASHWANIYADAV/fairlens_frontend.git
cd fairlens_frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# Opens at http://localhost:5173
```

### Production Build

```bash
npm run build
# Output in dist/
```

---

## 📂 Project Structure

```
src/
├── index.css            # Design system tokens + animations
├── main.tsx             # App entry point
├── App.tsx              # Router configuration
├── layouts/
│   └── MainLayout.tsx   # Navbar + mobile dock + page transitions
├── pages/
│   ├── Landing.tsx      # Hero with 3D orb + features + terminal
│   ├── Upload.tsx       # File upload with 3D tilt zone
│   ├── Analysis.tsx     # Analysis progress (connected to backend)
│   ├── Report.tsx       # Animated report card
│   ├── Chat.tsx         # Grok AI chat explorer
│   └── Dashboard.tsx    # Audit history
├── lib/
│   ├── api.ts           # Backend API client (typed)
│   └── utils.ts         # Utilities (cn, etc.)
└── components/          # Shared components
```

---

## 🔗 Backend

The Python FastAPI backend is in a separate repo:
👉 [fairlens_backend](https://github.com/NAME-ASHWANIYADAV/fairlens_backend)

The frontend connects to `http://localhost:8000/api` by default. Update `src/lib/api.ts` to change the API base URL.

### Dual Mode
- **With backend** — Real file upload, Grok-powered analysis, AI chat
- **Without backend** — Demo mode with hardcoded data (all pages still work)

---

## 📄 License

MIT License — Built for the [Google Solution Challenge 2026](https://developers.google.com/community/gdsc-solution-challenge)
