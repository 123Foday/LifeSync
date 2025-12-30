# LifeSync - Healthcare Management System

LifeSync is a comprehensive healthcare management platform that streamlines the process of booking doctor appointments and managing healthcare needs. The application provides separate interfaces for patients, doctors, and administrators, making healthcare more accessible and efficient.

## 🏥 About LifeSync

LifeSync is your trusted partner in managing healthcare needs conveniently and efficiently. We understand the challenges individuals face when scheduling doctor appointments and managing health records. Our platform bridges the gap between patients and healthcare providers, making it easier to access care when you need it.

### Our Vision
To create a seamless healthcare experience for every user by bridging the gap between patients and healthcare providers, making it easier to access the care you need, when you need it.

## ✨ Features

### For Patients
- **User Registration & Authentication** - Secure account creation and login
- **Doctor Discovery** - Browse doctors by specialty and location
- **Appointment Booking** - Easy scheduling with real-time availability
- **Profile Management** - Update personal information and medical details
- **Appointment History** - View and manage past and upcoming appointments

### For Doctors
- **Doctor Dashboard** - Overview of appointments and statistics
- **Appointment Management** - View and manage patient appointments
- **Profile Management** - Update professional information and availability
- **Slot Management** - Control appointment availability and timing

### For Hospitals
- **Hospital Dashboard** - Overview of appointments and statistics
- **Appointment Management** - View and manage patient appointments
- **Profile Management** - Update professional information and availability
- **Slot Management** - Control appointment availability and timing

### For Administrators
- **Admin Dashboard** - System overview and analytics
- **Doctor Management** - Add, edit, and manage doctor profiles
- **Hospital Management** - Add, edit, and manage doctor profiles
- **Appointment Oversight** - Monitor all system appointments
- **User Management** - Manage patient and doctor accounts

### Mobile Application
- **Cross-platform** - Available for iOS and Android via Expo
- **Dark Mode Support** - Dynamic theme switching
- **Push Notifications** - Real-time updates for appointments
- **Seamless Sync** - Shared backend with Web and Admin panels

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI library
- **React Router DOM 7.9.4** - Client-side routing
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **Axios 1.12.2** - HTTP client for API requests
- **React Toastify 11.0.5** - Toast notifications
- **Vite 5.4.0** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8.19.1** - MongoDB object modeling
- **JWT (jsonwebtoken 9.0.2)** - Authentication tokens
- **bcrypt 6.0.0** - Password hashing
- **Cloudinary 2.7.0** - Image upload and management
- **Multer 2.0.2** - File upload middleware
- **CORS 2.8.5** - Cross-origin resource sharing

### Mobile
- **React Native** - Cross-platform framework
- **Expo** - Development platform
- **Expo Router** - File-based routing
- **NativeWind** - Styling engine

## 📁 Project Structure

LifeSync/
├── frontend/                 # Patient-facing React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── context/        # React context for state management
│   │   └── assets/         # Images and static assets
│   └── package.json
├── admin/                   # Admin and Doctor panel React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Admin/Doctor pages
│   │   ├── context/       # Context state
│   │   └── assets/        # Admin panel assets
│   └── package.json
├── mobile/                  # Expo/React Native application
│   ├── app/                # Main application screens (Expo Router)
│   ├── components/         # Mobile-specific UI components
│   └── package.json
├── backend/                 # Node.js/Express API server
│   ├── controllers/        # Request handlers
│   ├── models/            # Database schemas
│   ├── routes/            # API routes
│   └── package.json
├── README.md                # Project overview
└── setup.md                 # Detailed setup and dev logs
```

## 🚀 Getting Started

For a comprehensive guide on setting up each module and viewing the development history, please refer to the **[setup.md](./setup.md)** file.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)
- Expo Dev App

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LifeSync
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Install admin panel dependencies**
   ```bash
   cd ../admin
   npm install
   ```
5. **Install mobile dependencies**
   ```bash
   cd ../mobile && 
   npm install
   ```
6. **Environment Configuration**
   
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=4000
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run server  # Development mode with nodemon
   # or
   npm start       # Production mode
   ```

2. **Start the frontend application**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Start the admin panel**
   ```bash
   cd admin
   npm run dev
   ```

4. **Start the mobile app**
   ```bash
   cd mobile
   npx expo start
   ```

The applications will be available at:
- Frontend: `http://localhost:5173`
- Admin Panel: `http://localhost:5174` (or next available port)
- Backend API: `http://localhost:4000`
- Expo Dev Menu

## 🔧 API Endpoints

### User Routes (`/api/user`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /get-profile` - Get user profile
- `POST /update-profile` - Update user profile
- `POST /book-appointment` - Book an appointment
- `GET /appointments` - Get user appointments

### Doctor Routes (`/api/doctor`)
- `POST /register` - Doctor registration
- `POST /login` - Doctor login
- `GET /get-profile` - Get doctor profile
- `POST /update-profile` - Update doctor profile
- `GET /appointments` - Get doctor appointments

### Hospital Routes (`/api/doctor`)
- `POST /register` - Hospital registration
- `POST /login` - Hospital login
- `GET /get-profile` - Get Hospital profile
- `GET /get-doctors` - Get institutional doctors
- `POST /add-doctor` - Add new doctor to your hospital
- `POST /update-profile` - Update Hospital profile
- `GET /appointments` - Get Hospital and their doctors appointments

### Admin Routes (`/api/admin`)
- `POST /login` - Admin login
- `GET /get-doctors` - Get all doctors
- `POST /add-doctor` - Add new doctor
- `GET /get-appointments` - Get all appointments
- `GET /get-users` - Get all users

## 🎯 Key Features Explained

### Appointment Booking System
- Real-time slot availability checking
- 30-minute time slots from 10 AM to 9 PM
- Automatic slot blocking after booking
- Date-based slot management

### User Authentication
- JWT-based authentication
- Role-based access control (Patient, Doctor, Hospital, Admin)
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Automatic session expiry handling: the frontend detects expired/invalid JWTs (401 responses or messages like "jwt expired"), automatically clears the session and redirects users to the login page. Backend auth middleware now returns standardized 401 responses with the underlying error message (e.g., "jwt expired") so the frontend can reliably detect this condition.

### Image Management
- Cloudinary integration for profile pictures
- Automatic image optimization and resizing
- Secure file upload with validation


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Phone**: +232-74-841-741, +232-88-915-854
- **Email**: ctso.cbc.sl@gmail.com, dtso.cbc.sl@gmail.com
- **Project Link**: [LifeSync Repository](https://github.com/ADBangs-CBC/LifeSync)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped improve this project
- Special thanks to the healthcare community for inspiration
- Built with ❤️ for better healthcare accessibility

---

**Copyright © 2025 LifeSync. All rights reserved.**
