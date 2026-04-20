# 🚍 DTC Tracker
A real-time bus tracking web application that helps users search routes, view stops, calculate fares, and track buses using map integration.
---
## 📌 Features
- 🔍 Search bus stops and routes  
- 🗺️ Google Maps integration for directions  
- ⏱️ Live arrival tracking (if API connected)  
- 💰 Fare calculation  
- 🔐 User Login & Register system  
- 📊 Dashboard with useful data  
---
## 🛠️ Tech Stack
**Frontend**
- React.js
- Bootstrap
- Axios

**Backend**
- FastAPI (Python)

**Database**
- MySQL

**Other**
- Google Maps API
---

## ⚙️ Setup Instructions
### 🔹 1. Clone Repository
```bash
git clone https://github.com/2403Karan/dtc-tracker.git
cd dtc-tracker

🔹 2. Backend Setup (FastAPI)
cd backend
python -m venv env
env\Scripts\activate   # Windows
# source env/bin/activate  # Mac/Linux
pip install -r requirements.txt

▶️ Run backend:
uvicorn main:app --reload
Backend will run at:
http://127.0.0.1:8000
pip install -r requirements.txt

🔹 3. Frontend Setup (React)
cd frontend
npm install
npm start

Frontend will run at:
http://localhost:3000

🔐 Environment Variables
Create .env file in backend folder:
SECRET_KEY=your_secret_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=dtc_tracker
GOOGLE_MAPS_API_KEY=your_api_key
