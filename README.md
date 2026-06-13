# NayePankh Foundation Volunteer Registration Portal

A full-stack web application designed for **NayePankh Foundation** to manage volunteer applications, coordinator registrations, and community campaigns/drives. It enables volunteers to apply, view status, explore ongoing drives, and sign up for them. Admins can review applications, manage ongoing campaigns, view signed-up volunteers, and export records.

---

## ⚡ Key Features

### 1. Volunteer Space 🤝
* **Application Process**: A simple registration page for new applicants to enter details, select availability, and specify skills.
* **Personalized Dashboard**: Once approved, volunteers can access their dashboard to:
  * View their current application status (Pending, Approved, Rejected).
  * Browse active campaigns/drives.
  * Filter and sort drives based on matching skills.
  * Register (volunteer) for drives directly. Already registered drives show a green **✓ Registered** status badge.

### 2. Admin Space 👑
* **Volunteer Registry**: View all submitted volunteer registrations and their details.
* **Approve/Reject Workflows**: Process applications with action confirmation popups (`window.confirm`) to prevent accidental updates.
* **Campaign & Drive Manager**: Create, read, update, and delete (CRUD) active drives.
* **Drive Rosters**: View which volunteers have registered for each drive, including their contact details (email/phone) and availability.
* **Data Exports**: Download the volunteer database registry as a CSV file for offline use.

### 3. Smart Authentication & Security 🔒
* **Session Lifetime**: JWT token session authentication. Security rules require that a page refresh/reload automatically logs the user out for enhanced session protection.
* **Mock Credentials Panel**: Built-in test credential guides display directly inside the dark-themed log-in modal, allowing quick access for testers:
  * **Admin Account**: `admin@np.com` (password: `admin123`)
  * **Volunteer Account**: `volunteer@g.com` (password: `volunteer123`)

---

## 🛠️ Tech Stack

### Frontend
* **Framework**: [Next.js](https://nextjs.org/) (Pages router, React 18)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) & custom CSS for rich dark themes and glassmorphism.
* **State Management**: React Context API (`ModalContext`)

### Backend
* **Runtime**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
* **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database) via [Mongoose](https://mongoosejs.com/)
* **Auth**: JSON Web Tokens (`jsonwebtoken`) & password hashing via `bcryptjs`.

---

## 📁 Project Structure

```text
NPF Volunteer Website/
├── backend/                  # Node/Express API Server
│   ├── config/               # Database configurations (MongoDB Mongoose connection)
│   ├── middleware/           # JWT authentication middleware
│   ├── models/               # Mongoose Schemas (Admin, Volunteer, Drive)
│   ├── routes/               # API endpoints (auth, volunteers, drives)
│   ├── .env                  # Port, Mongo URI, JWT Secret configurations
│   ├── server.js             # API entrypoint
│   └── package.json          # Node dependencies
│
└── frontend/                 # Next.js Frontend App
    ├── public/               # Static logo images & icons
    ├── src/
    │   ├── components/       # Reusable components (Navbar, LoginModal)
    │   ├── context/          # Global context managers (ModalContext)
    │   ├── pages/            # Next.js page routes (admin/dashboard, volunteer/dashboard, drives, index)
    │   └── styles/           # Global Tailwind integrations
    ├── .env.local            # Local frontend env variables (API Base URL)
    └── package.json          # Frontend dependencies
```

---

## 🚀 Getting Started

### 📋 Prerequisites
* Node.js (v18+)
* npm (v9+)
* MongoDB Atlas cluster or local database instance.

### 🔌 Backend Setup
1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/NayePankhDB
   JWT_SECRET=yoursecretjwtkey
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   npm start
   ```

### 💻 Frontend Setup
1. Navigate to the `frontend/` folder:
   ```bash
   cd ../frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend/` root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Run the Next.js dev server:
   ```bash
   npm run dev
   ```
##### 5. Open your browser and navigate to `http://localhost:3000`.

### 🌐 Vercel Multi-Service Deployment
This repository is pre-configured for multi-service hosting on Vercel (orchestrated via `vercel.json`):
* **Frontend**: Next.js service running on `/`.
* **Backend**: Express API service running on `/_/backend`.

To deploy on Vercel:
1. Import the repository in Vercel.
2. In the Vercel Project settings, configure the following **Environment Variables**:
   * `NEXT_PUBLIC_API_URL` = `/_/backend/api` (this routes API traffic dynamically through Vercel's service proxy).
   * `MONGO_URI` = *Your MongoDB Connection String*
   * `JWT_SECRET` = *Your backend JWT authentication key*
3. Deploy! Vercel will build both folders in isolated runtime containers.

---

## 📝 Seed Accounts
To reset or add the mock users manually, you can run a database seeding script with:
```javascript
// Example MongoDB manual document insertion:
// Collection: admins
{
  "name": "Mock Admin",
  "email": "admin@np.com",
  "password": "admin123" // (Hashed via bcrypt)
}

// Collection: volunteers
{
  "name": "Mock Volunteer",
  "email": "volunteer@g.com",
  "password": "volunteer123", // (Hashed via bcrypt)
  "phone": "1234567890",
  "skills": ["Teaching", "Event Management"],
  "availability": "Both",
  "status": "Approved"
}
```
*(The schema contains pre-save hooks to automatically hash the passwords when using Mongoose models).*
