# 📄 Resume Lens 📷✨ 
**AI-Powered Resume Analysis & Optimization Tool**

Resume Lens is a modern **full-stack web application** that helps job seekers analyze and optimize their resumes for **ATS (Applicant Tracking Systems)**.  
It leverages **Google Gemini AI** along with a **robust heuristic fallback system** to generate role-specific insights, scores, and improvement suggestions — delivered instantly via email.

---

## 🚀 Live Demo
👉 https://resumelens-nine.vercel.app/

---

## 🧠 What Resume Lens Does
- Accepts **valid resume documents only** (PDF / text-based resumes)
- Analyzes resumes using **AI + rule-based heuristics**
- Generates **role-specific scores and insights**
- Identifies strengths, missing keywords, and improvement areas
- Sends a **detailed analysis report to the user’s email**
- Gracefully handles invalid or non-resume documents via validation

---

## ✨ Key Features

- 🤖 **AI-Powered Resume Analysis**  
  Uses **Google Gemini 1.5 Flash** for deep, context-aware resume evaluation.

- 🎯 **Role-Specific Scoring**  
  Tailored analysis for roles such as Frontend, Backend, DevOps, Data Science, etc.

- 🛡️ **Heuristic Fallback System**  
  Ensures resume analysis continues even if the AI service is unavailable.

- 📧 **Automated Email Reports**  
  Sends structured, HTML-based reports with scores, strengths, and missing skills.

- 🔒 **Input Validation & Security**  
  Resume-only validation, email domain verification (MX records), and file integrity checks.

- ✨ **Modern UI/UX**  
  Smooth animations and responsive design for a premium user experience.

---

## 🛠️ Tech Stack

### Frontend
- **React 19 (Vite)**
- **Framer Motion** – Animations & transitions
- **Lucide React** – Icons
- **Axios** – API communication
- **Canvas Confetti** – Interactive feedback
- **Vanilla CSS** – Custom responsive styling

### Backend
- **Node.js & Express**
- **Google Gemini AI**
- **Nodemailer** – Email delivery
- **Multer** – File uploads
- **PDF-Parse** – Resume text extraction
- **DNS & Regex** – Advanced email validation

---

## ⚠️ Input Scope & Validation

Resume Lens is **not a general document analyzer**.

✔️ Supported:
- Professional resumes (PDF or text-based)

❌ Not supported:
- Random documents
- Notes, books, or syllabi
- Image-only PDFs
- Non-resume content

This design choice ensures **accurate AI feedback and consistent results**.

---

## 🏁 Getting Started (Local Setup)

### Prerequisites
- **Node.js** (v18+)
- **npm** or **yarn**
- **Google Gemini API Key**
- **Gmail account** with App Password enabled

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Gaurav-creater317/Resume-Lens.git
cd Resume-Lens
```
### 2️⃣ Backend Setup
```bash
cd backend
npm install
Create a .env file in backend:
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password
GEMINI_API_KEY=your_gemini_api_key
⚠️ Use a Google App Password, not your regular email password.
```
### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
```
### ▶️ Running the Application
```bash
Terminal 1 (Backend):

cd backend
npm run dev
Server runs on http://localhost:5000

Terminal 2 (Frontend):

cd frontend
npm run dev
App runs on http://localhost:5173
```
## 📂 Project Structure
```
Resume-Lens/
├── backend/                # Express Server Code
│   ├── controllers/        # Logic for resume analysis
│   ├── routes/             # API Endpoints
│   ├── server.js           # Entry point
│   └── .env                # Secrets (Not committed)
│
└── frontend/               # React Application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Home and Result pages
    │   ├── App.jsx         # Routing Logic
    │   └── index.css       # Global Styles
    └── vite.config.js      # Vite Configuration
```
## 📈 Future Enhancements
- User authentication (Login / Signup)
- Resume history dashboard
- ATS keyword matching
- Downloadable PDF reports
- Job description vs resume comparison
## 👨‍💻 Author
Designed with ❤️ by **Gaurav Mehra**
B.Tech CSE Student | Full-Stack Developer
GitHub: https://github.com/Gaurav-creater317
## 🤝 Contributing
Contributions are welcome!  
Feel free to fork the repository and submit a pull request.

