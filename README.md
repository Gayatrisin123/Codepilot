# 🚀 Codepilot - AI-Powered Collaborative Code Workspace


<div align="center">
	<span>
		<a href="https://react.dev/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" /></a>&nbsp;
		<a href="https://expressjs.com/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" /></a>&nbsp;
		<a href="https://www.mongodb.com/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>&nbsp;
		<a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" /></a>&nbsp;
	</span>
	<br/>
	<span>
		<a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>&nbsp;
		<a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>&nbsp;
		<a href="https://socket.io/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO" /></a>&nbsp;
		<a href="https://redis.io/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Redis-7.x-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" /></a>&nbsp;
	</span>
	<br/>
	<span>
		<a href="https://groq.com/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=for-the-badge&logo=meta&logoColor=white" alt="Groq AI" /></a>&nbsp;
		<a href="https://webcontainers.io/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/WebContainer-In_Browser-1389FD?style=for-the-badge&logo=stackblitz&logoColor=white" alt="WebContainer" /></a>&nbsp;
		<a href="https://pyodide.org/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Pyodide-Python_WASM-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Pyodide" /></a>&nbsp;
		<img src="https://img.shields.io/badge/Piston_API-Multi_Language-10B981?style=for-the-badge&logo=codeforces&logoColor=white" alt="Piston API" />&nbsp;
	</span>
</div>

<br/>

<div align="center">
	<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=4000&pause=1000&color=38BDF8&center=true&vCenter=true&repeat=true&width=900&lines=AI-Powered+Collaborative+Code+Workspace;Real-Time+Multi-User+Development;Run+20%2B+Languages+in+the+Browser;Powered+by+Groq+LLaMA+3.3+70B;WebContainer+%2B+Pyodide+%2B+Piston+API;MERN+Stack+%2B+Socket.IO+%2B+Redis" alt="SOEN Banner" />
</div>

> A real-time collaborative coding platform powered by AI, built with the MERN stack and WebContainer technology. Write code together, run multiple languages and their frameworks in the browser, and get instant AI assistance.

A real-time collaborative coding platform powered by AI, built with the MERN stack and WebContainer technology.

[Features](#-features) • [Tech Stack](#️-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Troubleshooting](#-troubleshooting)

---

## 🎯 What is Codepilot?

SOEN is a cutting-edge web-based collaborative coding environment that combines the power of **AI code generation** with **real-time collaboration**. Write code together, get instant AI assistance, and execute your projects directly in the browser - no local setup required!

Think of it as Google Docs meets VS Code meets ChatGPT, all running in your browser. 🧙‍♂️

### 🌟 Features

- **🤖 AI-Powered Code Generation**: Mention `@ai` in chat and get instant code generation using Groq's LLaMA model
- **👥 Real-Time Collaboration**: Multiple developers can work on the same project simultaneously via WebSocket
- **📁 Multi-Language Code Execution**: Run code directly in the browser:
  - **Node.js** — WebContainer API (Express, Next.js, Vite, etc.)
  - **Python** — Pyodide (WebAssembly Python runtime, including Flask via test client)
  - **Java, C, C++, Go, Rust, Ruby, Kotlin, Swift, PHP, and 10+ more** — Piston API (free remote compiler)
- **💬 Project Chat**: Built-in chat system for seamless team communication
- **📝 Live Code Editor**: Multi-tab code editor with syntax highlighting
- **🎨 Modern Dark UI**: Beautiful glassmorphism design with smooth animations
- **🔐 Secure Authentication**: JWT-based auth with bcrypt password hashing
- **🗄️ Persistent Projects**: MongoDB storage for projects and file trees
- **⚡ Redis Caching**: Fast session management and caching
- **🧠 Smart Run Detection**: Automatically picks the right runner — `npm run dev` for Next.js/Vite, `npm start` for Express, Pyodide for Python, Piston API for compiled languages

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite 6** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Socket.IO Client** - Real-time WebSocket communication
- **WebContainer API** - In-browser Node.js runtime
- **Pyodide** - Python (WebAssembly) runtime for browser
- **Piston API** - Remote execution for Java, C, C++, Go, Rust, and more
- **Axios** - HTTP client
- **Highlight.js** - Code syntax highlighting
- **Markdown-to-JSX** - Rich message formatting
- **RemixIcon** - Beautiful icon library

### Backend
- **Node.js 20** - JavaScript runtime
- **Express 4** - Web framework
- **MongoDB 8** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - WebSocket server
- **Redis** - In-memory data store
- **Groq SDK** - AI code generation (LLaMA 3.3 70B)
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

---

## 📋 Prerequisites

Before you start, make sure you have these installed:

- **Node.js** >= 20.x ([Download](https://nodejs.org/))
- **npm** >= 10.x (comes with Node.js)
- **MongoDB** >= 8.x
- **Redis** >= 7.x
- **Groq API Key** ([Get one free](https://console.groq.com/))

### Installing MongoDB & Redis on macOS

```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community@8.0
brew install redis

# Start services
brew services start mongodb-community@8.0
brew services start redis
```

### Installing MongoDB & Redis on Linux

```bash
# MongoDB (Ubuntu/Debian)
wget -qO - https://www.mongodb.org/static/pgp/server-8.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Redis (Ubuntu/Debian)
sudo apt-get install redis-server

# Start services
sudo systemctl start mongod
sudo systemctl start redis-server
```

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd soen-main
```

### 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

### 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4️⃣ Set Up Environment Variables

#### Backend (.env)

Create `backend/.env` with the following:

```env
# Server Configuration
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/soen

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AI Configuration
GROQ_API_KEY=your-groq-api-key-here
```

**🔑 Get your Groq API Key:**
1. Visit [console.groq.com](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key and copy it

#### Frontend (.env.local)

Create `frontend/.env.local` with:

```env
VITE_API_URL=http://localhost:3000
```

---

## 🎮 Usage

### Starting the Backend Server

```bash
cd backend
node server.js
```

You should see:
```
Server is running on port 3000
Connected to MongoDB
```

### Starting the Frontend Development Server

In a **new terminal**:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v6.0.3  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🎯 How to Use SOEN

### 1. Register an Account
- Click "Register" on the homepage
- Enter your email and password
- You'll be automatically logged in

### 2. Create a Project
- Click "New Project" button
- Enter a project name
- Your project workspace will open

### 3. Generate Code with AI
- In the chat panel, type: `@ai create an express server`
- The AI will generate complete code with file structure
- Files will appear in the Explorer panel on the right

### 4. Run Your Code
- Click the green "▶ Run" button
- The platform **auto-detects the language** and picks the right runner:
  - **Node.js** (`package.json` detected): Installs deps via `npm install`, then runs `npm run dev` (for Next.js/Vite) or `npm start` (for Express)
  - **Python** (`.py` files detected): Runs in-browser via Pyodide. Flask apps are automatically tested via Flask's test client
  - **Java, C, C++, Go, Rust, etc.**: Compiles & runs remotely via Piston API
- View output in the preview panel on the right

### 5. Collaborate
- Click "Add collaborator" button
- Select users to invite (requires multiple registered accounts)
- All changes sync in real-time!

---

## 🔧 Troubleshooting

### 🚨 "jwt malformed" Error

**Problem**: Getting `jwt malformed` or authentication errors

**Solution**: This happens if you logged in with an older version. Clear your browser's localStorage:
```javascript
// Open browser console (F12) and run:
localStorage.clear()
// Then refresh and login again
```

### 🚨 MongoDB Connection Failed

**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**: 
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# If not running, start it
brew services start mongodb-community@8.0

# Verify connection
mongosh --eval "db.version()"
```

### 🚨 Redis Connection Error

**Problem**: `Error: Redis connection to 127.0.0.1:6379 failed`

**Solution**:
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# If not running
brew services start redis
```

### 🚨 WebContainer npm Errors (ENOENT, path errors)

**Problem**: Run button fails with `npm error code ENOENT` or can't find `package.json`

**Solution**: 
1. Make sure you've asked the AI to generate code first (`@ai create...`)
2. Wait for files to appear in the Explorer panel
3. **Then** click the Run button
4. If the AI generates nested paths like `pages/index.js`, these are automatically normalized to proper WebContainer directory structure

### 🚨 Next.js "Could not find production build" Error

**Problem**: `Could not find a production build in '.next' directory`

**Solution**: This is automatically handled — the Run button detects if `package.json` has a `dev` script and uses `npm run dev` instead of `npm start`. If you still see this, make sure the AI-generated `package.json` includes:
```json
"scripts": {
  "dev": "next dev"
}
```

### 🚨 Port Already in Use (EADDRINUSE)

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**: The Run button now kills any previous process before starting a new one. If you still see this, hard-refresh the page (`Cmd+Shift+R`) to reset the WebContainer.
```bash
# For the backend server port:
lsof -ti:3000 | xargs kill -9
```

### 🚨 Groq API Rate Limits

**Problem**: `429 Too Many Requests` from Groq API

**Solution**: 
- Free tier has rate limits (30 requests/minute)
- Wait a minute and try again
- Or upgrade to Groq's paid tier for higher limits

### 🚨 Frontend Shows Old/Stale Code

**Problem**: AI generates new code but old code still appears

**Solution**: 
- This was a stale closure bug (now fixed in Project.jsx)
- Hard refresh the browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- If issue persists, clear browser cache

### 🚨 Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000` (for the SOEN backend itself)

**Solution**:
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port in backend/.env
PORT=3001
```

### 🚨 Python Flask "OSError: Not supported" / Socket Error

**Problem**: Flask's `app.run()` crashes with `OSError: [Errno 138] Not supported`

**Solution**: This is automatically handled. The runner detects Flask apps, strips `app.run()`, and uses Flask's built-in test client to test all routes. The output shows:
```
=== Flask App Routes ===

[GET] /  Status: 200
Hello, World!
```

### 🚨 Java/C/C++ Code Won't Run

**Problem**: Compiled language code doesn't execute

**Solution**: These languages run via the [Piston API](https://emkc.org/api/v2/piston) which requires internet access. Make sure:
1. You have an active internet connection
2. The API isn't rate-limited (it's free but has fair-use limits)
3. The code has a proper entry point (e.g., `public static void main` for Java)

### 🚨 Duplicate Messages in Chat

**Problem**: Same message appears multiple times

**Solution**: 
- Hard refresh (`Cmd+Shift+R`) to clear stale socket connections
- Make sure only **one** Vite dev server is running:
```bash
# Kill all Vite processes
pkill -f vite
# Restart one instance
cd frontend && npm run dev
```

---

## 📁 Project Structure

```
soen-main/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── db/               # Database connection
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── .env              # Environment variables
│   ├── app.js            # Express app setup
│   ├── server.js         # Entry point (HTTP + Socket.IO)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/       # Static assets
│   │   ├── auth/         # Auth components
│   │   ├── config/       # Configuration files
│   │   ├── context/      # React Context
│   │   ├── routes/       # React Router setup
│   │   ├── screens/      # Page components
│   │   ├── App.jsx       # Root component
│   │   ├── index.css     # Global styles
│   │   └── main.jsx      # Entry point
│   ├── .env.local        # Frontend env variables
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md             # You are here! 📍
```

---

## 🎨 Key Features Explained

### WebContainer Magic ✨

The app uses [WebContainer API](https://webcontainers.io/) from StackBlitz to run Node.js **entirely in your browser**. No backend server needed for code execution! Supports Express, Next.js, Vite, and any npm-based project. Nested directory structures (e.g., `pages/index.js`) are automatically normalized for WebContainer compatibility.

### Multi-Language Execution 🌍

SOEN isn't limited to Node.js! The Run button auto-detects the language:

| Language | Runtime | How It Works |
|---|---|---|
| **Node.js** | WebContainer | In-browser `npm install` + `npm start`/`npm run dev` |
| **Python** | Pyodide (WASM) | Python 3.11 compiled to WebAssembly, runs in browser |
| **Flask** | Pyodide + Test Client | Auto-strips `app.run()`, tests all routes via Flask test client |
| **Java** | Piston API | Remote compile & execute (free, no API key) |
| **C / C++** | Piston API | Remote compile & execute |
| **Go, Rust, Ruby, Kotlin, Swift, PHP, Perl, Lua, R, Scala, Bash, TypeScript, C#** | Piston API | Remote compile & execute |

### Real-Time Collaboration 🔄

When multiple users join the same project:
- All code changes sync instantly via Socket.IO
- Chat messages appear in real-time
- File tree updates are broadcast to all collaborators
- No polling, no delays - pure WebSocket efficiency

### AI Code Generation 🤖

Simply type `@ai` followed by your request in the chat:
- `@ai create a todo app with express and react`
- `@ai add authentication to my server`
- `@ai create a REST API for a blog`

The AI (Groq's LLaMA 3.3 70B) understands context and generates:
- Complete file structures (flat paths like `pages/index.js` are auto-normalized)
- Production-ready code in **any language**
- Proper package.json with dependencies (for Node.js projects)
- Start/dev commands

---

## 🔐 Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire and should be rotated
- Socket.IO connections are authenticated
- **Never commit `.env` files to version control!**
- Change the default `JWT_SECRET` in production
- Use HTTPS in production environments

---

## 🐛 Known Issues

1. **WebContainer Browser Compatibility**: WebContainer requires Chrome 89+ or Edge 89+. Safari and Firefox may have limited support.

2. **Large Projects**: Very large file trees may slow down the WebContainer. Optimize by keeping projects modular.

3. **AI Response Time**: First request to Groq may be slower (~3-5 seconds). Subsequent requests are faster due to warm servers.

4. **Collaborator List**: Currently shows all registered users. In production, implement proper user search/filtering.

5. **Flask Limitations**: Flask apps run via test client — they can't serve real HTTP. Web framework features like sessions, cookies, and redirects work through the test client, but websockets and streaming won't.

6. **Piston API Fair Use**: The Piston API is free but has rate limits. For heavy usage, consider self-hosting Piston.

7. **Python Package Availability**: Not all PyPI packages are available in Pyodide. Pure-Python packages generally work; packages with C extensions may not.

---

## 🚢 Deployment

### Backend Deployment (Railway, Render, etc.)

1. Set environment variables in your hosting platform
2. Ensure MongoDB Atlas connection string is used instead of localhost
3. Configure Redis Cloud (or use Upstash)
4. Update CORS settings in `backend/app.js` for your frontend domain

### Frontend Deployment (Vercel, Netlify)

1. Build the production bundle: `npm run build`
2. Set `VITE_API_URL` to your backend URL
3. Deploy the `dist/` folder

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---


## 🙏 Acknowledgments

- **WebContainer** by StackBlitz for browser-based Node.js
- **Groq** for blazing-fast AI inference
- **MongoDB** for flexible data storage
- **Socket.IO** for real-time magic
- The entire open-source community! ❤️

---


<div align="center">

**Built with ❤️ and ☕**

Made by developers, for developers.

⭐ Star this repo if you found it helpful!

</div>
