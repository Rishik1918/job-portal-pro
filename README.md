# JobPortalPro - Career Console & Job Portal Platform

A complete full-stack web application designed for job seekers (Candidates) and hiring managers (Recruiters).

## 🛠️ Mandatory Tech Stack
- **Frontend**: React.js (Hooks, `useState`, `useEffect`), Custom CSS, Fetch API
- **Backend**: Node.js, Express.js (RESTful API Architecture, JSON payloads)
- **Database**: MongoDB, Mongoose ORM
- **Dev Tools**: Git Version Control, Modular directory layout

---

## 🚀 Primary Features

### 1. Job Management Features
- **Create Job**: Recruiters can launch new opportunities specifying Title, Company, Geographic Location, Job Type, Salary (INR), and Full Description.
- **View Jobs**: Custom landing page listing jobs with detailed cards (Title, Company, Type, Location, and Salary).
- **Edit Job**: Recruiters can click **Edit** on their console to dynamically update any field of an existing job using a modern modal popup.
- **Delete Job**: Recruiters can permanently remove a job listing and all its candidate submissions.

### 2. Search, Filter & Form Validation
- **Dynamic Search**: Instantly query listings by Job Title or Company keywords.
- **Filter Mappings**: Filter listings by deployment types: `Full-time`, `Part-time`, or `Contract`.
- **Form Validation Rules**:
  - Empty input values are rejected.
  - Valid Email string format required.
  - Salary values must be positive integers.
  - Mobile numbers must be exactly a valid 10-digit Indian phone format (`[6-9][0-9]{9}`).

### 3. Job Application System
- **Quick Apply**: Candidates submit applications with Name, Email, and verified 10-digit Phone coordinates.
- **Bookmark Listings**: Candidates can toggle bookmark saves, tracking jobs in their personal saved feed.
- **Review Hub**: Recruiters can inspect real-time application trackers listing applicant names, phone contacts, email directories, and the precise submission date.

### 4. Custom Dark Theme & Indian Context
- Sleek dark space gradient theme featuring electric indigo/cyan glow parameters and high-blur glassmorphism headers.
- Full formatting support for **Indian Rupees (INR - ₹)** currency with proper Indian numbering layout formatting (e.g. `₹15,00,000`).

---

## 🏁 Quick Startup Guide

### Backend Setup
1. Open a terminal pointing to `server/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development API:
   ```bash
   npm start
   ```
   *The server runs on port `5000` and automatically connects to the local MongoDB database instance.*

### Frontend Client Setup
1. Open a terminal pointing to `client/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Spin up the Vite server:
   ```bash
   npm run dev
   ```
   *The client is ready at [http://localhost:5173/](http://localhost:5173/).*
