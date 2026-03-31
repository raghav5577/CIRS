# CIRS - Campus Issue Reporting System 📢

CIRS is a modern, full-stack web application designed for university students to report campus issues (infrastructure, IT, safety, etc.) and track their resolution in real-time.

## 🚀 Features

- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens).
- **Dynamic Dashboard**: Personalized view for students showing their reported issues and status counts.
- **Issue Reporting**: Easy-to-use form for reporting campus complaints.
- **Auto-Categorization**: Backend logic that automatically maps issue categories to specific university departments.
- **Real-time Status Tracking**: Monitor the lifecycle of an issue from "Pending" to "Resolved".
- **Responsive Design**: Modern, premium UI built with React and custom CSS.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Axios, React Router, Context API.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas.
- **Security**: Bcrypt.js (Password hashing), JWT (Authentication), CORS.

## 📦 Installation & Setup

### 1. Prerequisites
- Node.js installed.
- MongoDB Atlas account.

### 2. Backend Setup
1. Navigate to the `Backend` folder.
2. Create a `.env` file and add:
   ```env
   PORT= your port number 
   MONGO_DBNAME = your db name
   MONGO_USERNAME = you db username
   MONGO_PASSWORD = your db password
   JWT_SECRET=your_super_secret_key
   ```
3. Install dependencies: `npm install`
4. Start the server: `npm run dev`

### 3. Frontend Setup
1. Navigate to the `Frontend` folder.
2. Create a `.env` file and add:
   ```env
   VITE_API_BASE_URL= yourhosturl/api
   ```
3. Install dependencies: `npm install`
4. Start the app: `npm run dev`


Developed by Raghav for a better campus environment.
