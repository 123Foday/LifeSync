# LifeSync Patient Portal

The web-based patient application for LifeSync, providing a seamless interface for booking and managing healthcare appointments.

## 💻 Features
- **User Authentication**: Secure login and registration.
- **Doctor Search**: Interactive listing of available doctors.
- **Appointment Booking**: Real-time slot selection and booking.
- **Profile Management**: Update medical records and personal info.

## 🛠️ Tech Stack
- **React** (v18.3.1)
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **React Router** (Routing)

## 🚀 Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env` file with:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   VITE_GOOGLE_CLIENT_ID=your_google_id
   VITE_APPLE_CLIENT_ID=your_apple_id
   ```
   *For production setup, refer to the root [GOOGLE_SSO_SETUP.md](../GOOGLE_SSO_SETUP.md) and [APPLE_SSO_SETUP.md](../APPLE_SSO_SETUP.md).*

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.
