 ---

<h1 align="center">🎯 Vibe Check Quiz App</h1>
<p align="center">A full-stack app to test how well your friends vibe with your personality and music taste 🎧✨</p>

---

## 🚀 Project Overview

The **Vibe Check Quiz** lets you create a personality-based quiz and optionally include your **Spotify playlist**. Friends can join via a unique link, take the same quiz, and get a **Vibe Score** comparing their answers and music taste to yours.

---

## 🌟 Features & Approach

### 📝 1. Quiz Creation

* 10 engaging multiple-choice questions.
* One-question-at-a-time UI with smooth transitions.
* Question progress indicator to guide the user.

### 🎵 2. Optional Spotify Playlist

* Users can optionally submit a **Spotify playlist URL**.
* Playlist data is fetched using the Spotify API.
* If not provided, scoring is based solely on quiz answers (max score: **80**).

### 🧠 3. Backend Intelligence

* On quiz creation, a **unique session ID** is generated.
* Friends use the link to join and take the same quiz.
* The backend compares answers (and playlists if available) to calculate Vibe Score.

### 📊 4. Real-Time Results

* Live polling to display vibe matches.
* Each match shows:

  * Friend’s name
  * Vibe Score (percentage)
  * Up to 3 common Spotify songs (if applicable)

---

## 🛠 Tech Stack

### 🖥 Frontend

* **React** + **Tailwind CSS** for a stylish, responsive UI.
* **React Router** for navigation.
* **Vite** for fast build and HMR.

### 🔙 Backend

* **Node.js** + **Express** for APIs and logic.
* **MongoDB** for storing sessions and responses.
* **Spotify Web API** to fetch playlist tracks.

---

## 📁 Folder Structure

```plaintext
/vibe-check-app
├── /client         → React frontend
├── /server         → Express backend
└── README.md       → This file
```

---

## 🧪 How to Run the Project

### 🔧 Prerequisites

* Node.js (v18+)
* MongoDB (Atlas or Local)
* Spotify Developer credentials

### 🚨 Setup `.env`

Create a `.env` file in `/server` with the following:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
MONGODB_URI=your_mongodb_uri
```

### ▶️ Start the App

#### Frontend

```bash
cd client
npm install
npm run dev
```

#### Backend

```bash
cd server
npm install
node index.js
```

---

## 🔗 Example Flow

1. User A creates a quiz ➕ (with or without Spotify)
2. A link is generated 🔗 and shared
3. Friends take the quiz 🧠🎶
4. Vibe Scores appear live on User A’s screen 📈

---

## 📬 Contact

📧 Reach me at: [prayashkumarb@gmail.com](mailto:prayashkumarb@gmail.com)
💡 Feel free to share feedback or suggestions!

---
