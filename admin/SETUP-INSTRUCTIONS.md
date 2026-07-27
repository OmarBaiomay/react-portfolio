# B-CODE Dashboard Setup Instructions

## 📦 Installation Steps

1. **Extract the ZIP file**
2. **Navigate to the project folder:**
   ```bash
   cd b-code-dashboard
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure environment:**
   - Edit `.env` file
   - Set your backend API URL (default: http://localhost:5001/api)

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Access dashboard:**
   - Open browser: http://localhost:3000
   - Login with your admin credentials

## 🔑 First Time Setup

1. Make sure your backend server is running on port 5001
2. Create an admin user via backend API:
   ```bash
   POST http://localhost:5001/api/auth/signup
   {
     "fullName": "Admin",
     "email": "admin@bcode.com",
     "password": "admin123"
   }
   ```
3. Use these credentials to login to the dashboard

## 📝 Note

Some component files need to be completed. Check the src/components and src/pages folders.
The basic structure and main components are ready!

