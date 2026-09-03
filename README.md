# LeadMS — Lead Management System

LeadMS is a full-stack Lead Management System (CRM) developed as part of a full-stack development internship assignment. It provides role-based workflows for Traders, Vendors, Team Members, and Admins, with the frontend integrated with live backend APIs and MongoDB-backed persistence.

## 🚀 Live Demo

**Frontend:**  
https://leadms-one.vercel.app/

**Backend API:**  
https://leadms-backend-gamma.vercel.app/

## 📦 GitHub Repositories

**Frontend:**  
https://github.com/Prateekrwt2005/LeadMS

**Backend:**  
https://github.com/Prateekrwt2005/leadms-backend

## 🎯 Selected Track

**Track B — Full Frontend Integration with Live Backend APIs**

The frontend communicates with the LeadMS backend through REST APIs for authentication, products, product locking, leads, quotations, vendor profile management, invitations, and admin workflows.

## ✨ Key Features

### Authentication

- User registration and login
- Trader and Vendor role selection during registration
- Forgot password and reset password flow
- Persistent authentication session
- JWT access-token handling
- Refresh-token handling with rotation
- Automatic access-token refresh
- Logout
- Backend-managed email confirmation
- Vendor invitation and invitation acceptance

### Trader

- Create products
- View trader products
- Edit product details
- Delete products
- Manage product pricing and active status

### Vendor

- Browse available products
- Lock and unlock products
- View locked products
- Manage vendor profile
- Configure margin percentage, installation price, and miscellaneous charges
- Create and manage leads
- Assign leads
- Quotation workflow

### Team Member

- Role-aware access to the CRM
- Access to products locked by the associated vendor
- Lead workflows according to backend authorization

### Admin

- Analytics dashboard
- Users management view
- Leads management view
- Role-based data presentation

### Application UI

- Responsive application shell
- Protected routes
- Role-aware navigation
- Light and Dark theme
- Loading and empty states
- API error handling
- Client-side routing with React Router

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Zustand
- React Hook Form
- Zod

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Nodemailer

### Database

- MongoDB Atlas

### Email

- Nodemailer
- Gmail SMTP
- Gmail App Password authentication

### Deployment

- Vercel

## 📚 Key Packages & Architecture

### React Router DOM

Used for client-side routing, protected dashboard routes, and role-aware navigation.

### Axios

Used for communication with the backend API. A centralized Axios instance attaches authentication headers and handles expired access tokens through the refresh-token flow.

### Zustand

Used for centralized authentication and session state. The store persists authentication state so the session can survive a browser refresh.

### React Hook Form + Zod

Used for form handling and client-side validation where applicable.

## 🧠 State Management Strategy

Authentication state is managed with **Zustand** and persisted in the browser.

The authentication store maintains:

- Current user
- Access token
- Refresh token
- Authentication status

The centralized Axios service:

1. Adds the access token to authenticated API requests.
2. Detects `401` responses for protected requests.
3. Requests a new access token using the refresh token.
4. Stores the rotated tokens.
5. Retries the original request after successful refresh.
6. Logs the user out when token refresh fails.

## 📁 Project Structure

The project is maintained as two public repositories.

### Frontend

```text
LeadMS/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── store/
    │   └── ...
    ├── public/
    ├── package.json
    └── vercel.json
```

### Backend

```text
leadms-backend/
└── src/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    └── server.js
```

## ⚙️ Local Setup

### Prerequisites

- Node.js installed
- npm installed
- MongoDB Atlas account or another MongoDB instance

### 1. Frontend

Clone the frontend repository:

```bash
git clone https://github.com/Prateekrwt2005/LeadMS.git
cd LeadMS/frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

### 2. Backend

In a separate terminal, clone the backend repository:

```bash
git clone https://github.com/Prateekrwt2005/leadms-backend.git
cd leadms-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file with your own credentials and configuration:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BACKEND_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_gmail_address
SMTP_PASS=your_gmail_app_password
FROM_EMAIL=your_gmail_address
PORT=5000
```

Start the backend:

```bash
npm run dev
```

The backend normally runs at:

```text
http://localhost:5000
```

## 🔐 Environment Variables & Secrets

Do not commit `.env`, `.env.local`, `.env.admin`, or any other file containing credentials, passwords, API keys, JWT secrets, MongoDB connection strings, or Gmail App Passwords.

The frontend uses:

```env
VITE_API_URL=your_backend_api_url
```

For example, when running the complete application locally:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📧 Email Flow

The backend uses **Nodemailer with Gmail SMTP** for application emails.

Email functionality includes:

- Account confirmation emails
- Vendor/team-member invitation emails
- Password reset emails

Gmail App Password authentication is used for SMTP. No OAuth flow is required for this email service.

Email confirmation is handled by the backend; the frontend provides the user with the appropriate confirmation status/message.

## 🗄️ Database

LeadMS uses **MongoDB Atlas** with Mongoose for persistent application data.

Main models/collections include:

- Users
- Products
- Leads
- Vendor Profiles
- Tokens

## 🔌 API Integration

The frontend is integrated with backend REST endpoints for:

- Registration and login
- Email confirmation
- Password reset
- Refresh token
- Invitations
- Trader products
- Available products
- Product locking and unlocking
- Vendor locked products
- Leads
- Lead assignment
- Quotations
- Vendor profile
- Admin analytics
- Admin users
- Admin leads

## 🎁 Bonus / Additional Features Implemented

- Persistent authentication with Zustand
- Automatic JWT access-token refresh
- Refresh-token rotation support
- Centralized Axios API instance
- Protected and role-aware routes
- Responsive UI
- Light / Dark theme
- MongoDB Atlas persistence
- Gmail SMTP email integration
- Vendor invitation workflow
- Product locking workflow
- Vendor quote configuration
- Vercel deployment for frontend and backend

## 🌐 Deployment Architecture

The deployed application uses the following architecture:

```text
React + Vite Frontend
        │
        ▼
      Vercel
        │
        ▼
  Express REST API
        │
        ▼
   MongoDB Atlas
```

The frontend is deployed at:

https://leadms-one.vercel.app/

The backend is deployed at:

https://leadms-backend-gamma.vercel.app/

## 🧪 Testing Notes

The main authentication, product, vendor-profile, lead, quotation, and API integration workflows were tested during development against the deployed backend environment.

Admin pages and endpoints are implemented. Admin access requires an admin account created through the backend rather than public self-registration.

## 📤 Submission

- **Public GitHub Repository:** https://github.com/Prateekrwt2005/LeadMS
- **Live Demo:** https://leadms-one.vercel.app/
- **Selected Track:** Track B — Full Frontend Integration with Live Backend APIs

## 👨‍💻 Author

**Prateek Rawat**  
GitHub: https://github.com/Prateekrwt2005
