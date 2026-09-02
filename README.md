# LeadMS

A modern CRM frontend for managing products, leads, sales workflows, quotations, vendor profiles, and admin analytics.

## Live Demo

**Frontend:** https://leadms-one.vercel.app/

**Hosted API:** https://leadcrmintern-ss-v1.vercel.app/api

## Selected Track

**Track B — Full Frontend Integration (Live Backend APIs)**

The application integrates with the provided hosted backend for authentication, products, leads, quotations, vendor profile management, and admin workflows.

## Features

### Phase 1 — Essential Base Pages
- Conversion-focused landing page
- Trader / Vendor registration
- Login and session handling
- Forgot password and reset password flow
- Responsive application shell with sidebar and navigation
- Email verification handled by the backend

### Track B — Live Backend Integration
- Access token and refresh token authentication
- Session persistence
- Trader product management
- Vendor product discovery
- Product locking / unlocking
- Lead creation and management
- Lead assignment to team members
- Quotation generation
- Vendor pricing, margins, installation charges, and miscellaneous charges
- Admin analytics
- Admin users management
- Admin lead overview

## Tech Stack

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Zustand for centralized authentication state

## State Management

Authentication/session state is managed with **Zustand**, including the current user, access token, refresh token, login, logout, and token updates.

API communication is centralized through an Axios service with authentication handling and token refresh support.

## Bonus Features

- Live deployment on Vercel
- Dark / light theme support
- Responsive UI for desktop, tablet, and mobile
- Smooth scroll-reveal and micro-interaction animations
- Role-based navigation and protected routes

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Prateekrwt2005/LeadMS.git
cd LeadMS/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API

Create a `.env.local` file in the `frontend` directory:

```env
VITE_API_URL=https://leadcrmintern-ss-v1.vercel.app/api
```

For a locally running provided backend, use:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the development server

```bash
npm run dev
```

The app will normally be available at:

```text
http://localhost:5173
```

### 5. Create a production build

```bash
npm run build
```

## Project Structure

```text
LeadMS/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── layouts/
    │   ├── pages/
    │   ├── routes/
    │   ├── services/
    │   └── store/
    └── package.json
```

## Repository

https://github.com/Prateekrwt2005/LeadMS

## Submission

- **GitHub:** https://github.com/Prateekrwt2005/LeadMS
- **Live Demo:** https://leadms-one.vercel.app/
