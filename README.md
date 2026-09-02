# LeadMS — CRM Frontend

LeadMS is a modern, role-based CRM frontend built as part of a full-stack development internship assignment. It provides workflows for Traders, Vendors, Team Members, and Admins, with live integration against the provided LeadMS backend API.

## 🚀 Live Demo

https://leadms-one.vercel.app/

## 📦 GitHub Repository

https://github.com/Prateekrwt2005/LeadMS

## 🎯 Selected Track

**Track B — Full Frontend Integration with Live Backend APIs**

The frontend integrates with the provided hosted backend for authentication, products, product locking, leads, quotations, vendor profile management, and admin workflows.

### Hosted Backend API

https://leadcrmintern-ss-v1.vercel.app/api

> The backend was provided as part of the assignment and is used as supplied for the hosted application.

---

## ✨ Features

### Authentication
- User registration and login
- Trader / Vendor role selection
- Forgot password and reset password flow
- Persistent authentication session
- Access-token handling
- Refresh-token handling with rotation
- Logout
- Backend-managed email verification

### Trader
- View trader products
- Create products
- Edit products
- Delete products
- Manage product pricing and details

### Vendor
- Browse available products
- Lock / unlock products for sale
- Manage vendor profile
- Configure margins and additional charges
- Create and manage leads
- Quotation workflow UI

### Team Members
- Role-aware dashboard structure
- Access to vendor CRM workflows according to backend authorization

### Admin
- Analytics dashboard
- Users management view
- Leads management view
- Role-based data presentation

### Application UI
- Responsive application shell
- Protected routes
- Light / Dark theme
- Loading and empty states
- API error handling
- Modern CRM-style interface

---

## 🛠️ Tech Stack

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Zustand
- JavaScript

## 📚 Key Packages & Architecture

### React Router
Used for client-side routing, protected dashboard routes, and role-aware navigation.

### Axios
Used for communication with the LeadMS backend API. A centralized Axios service adds authentication headers and handles expired access tokens.

### Zustand
Used for centralized authentication/session state with persistence.

---

## 🔐 State Management

Authentication state is managed with **Zustand** and persisted across browser refreshes.

The store maintains:

- Current user
- Access token
- Refresh token
- Authentication status

The Axios interceptor automatically attaches the access token to authenticated requests. When an access token expires, the frontend requests a new access token using the refresh token, stores the rotated tokens, and retries the original request.

---

## ⚙️ Local Setup

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

Create a `.env.local` file inside the `frontend` directory:

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

---

## 🎁 Bonus Features

- Zustand-based global state management
- Persistent authentication state
- Automatic access-token refresh
- Refresh-token rotation support
- Responsive UI
- Light / Dark theme
- Protected and role-aware routes
- Live Vercel deployment

---

## 🔌 API Integration

The frontend is wired to the provided backend endpoints for:

- Authentication and token refresh
- Trader products
- Available and locked products
- Leads and lead assignment
- Quotations
- Vendor profile
- Admin analytics
- Admin users
- Admin leads

The frontend includes loading, empty, and error states so API responses are presented safely in the UI.

---

## 📝 Testing Notes

The project was tested against the provided hosted backend for the main authentication, product, lead, and vendor-profile workflows.

The product-lock endpoint accepted lock requests successfully during testing, while the provided locked-products endpoint returned an empty list for the tested vendor account. The frontend handles this response with an appropriate empty state.

Admin pages are implemented and connected to the provided Admin endpoints. Live Admin login testing requires Admin credentials, which are not available through the normal registration flow.

---

## 👨‍💻 Author

**Prateek Rawat**

GitHub: https://github.com/Prateekrwt2005

---

## 📤 Submission

- **Public GitHub Repository:** https://github.com/Prateekrwt2005/LeadMS
- **Live Demo:** https://leadms-one.vercel.app/
