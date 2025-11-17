# Excellence Coaching Hub - Employee Contract Portal

A comprehensive web-based platform for managing employee contracts and digital onboarding. Built with modern technologies for security, scalability, and user experience.

## 🎯 Features

### Employee Features
- **User Registration & Authentication**
  - Email-based registration with optional verification
  - Secure login with JWT tokens
  - Email verification links (optional)
  - Password security with bcrypt hashing

- **Contract Management**
  - Fill out employment contract forms
  - Submit contracts for HR review
  - Upload supporting documents (PDF, images, docs)
  - Track contract status in real-time
  - Download approved contracts as PDF
  - View contract approval history
  - Receive email notifications on status changes

### Admin Features
- **Dashboard Analytics**
  - Real-time metrics and statistics
  - Employee count tracking
  - Contract status overview
  - Quick action buttons

- **Employee Management**
  - View all employees with pagination
  - Filter employees by status (active, inactive, terminated)
  - Update employee account status
  - Monitor employee verification status
  - Track employee join dates

- **Contract Review**
  - Review pending contracts
  - View contract details and employee information
  - Approve contracts with optional notes
  - Reject contracts with detailed reasons
  - Filter contracts by status
  - Track all contract modifications

## 🏗️ Technology Stack

### Frontend
- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **CSS3** - Styling

### Backend
- **Express.js** - Web framework
- **Node.js** - Runtime environment
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **SendGrid** - Email service
- **Cloudinary** - File storage
- **pdf-lib** - PDF generation
- **qrcode** - QR code generation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)
- SendGrid account
- Cloudinary account

## 🚀 Quick Start

### Backend Setup

1. **Clone and navigate to backend:**
```bash
cd backend
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Configure environment variables:**
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/excellence-hr
JWT_SECRET=your-secret-key-here
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@excellencecoaching.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000
```

4. **Start the backend:**
```bash
npm run dev
```

The backend will be available at `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend:**
```bash
cd frontend
npm install
```

2. **Create `.env` file (optional):**
```bash
cp .env.example .env
```

3. **Start the development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "position": "Software Engineer"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "employee": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "position": "Software Engineer"
  }
}
```

#### Verify Email
```http
GET /api/auth/verify/:token
```

### Contract Endpoints

#### Get My Contract
```http
GET /api/contracts/me
Authorization: Bearer {token}
```

#### Submit Contract
```http
POST /api/contracts
Authorization: Bearer {token}
Content-Type: application/json

{
  "formData": {
    "employeeName": "John Doe",
    "position": "Software Engineer",
    "startDate": "2024-01-01",
    "salary": "100000",
    "contractDuration": "Permanent",
    "workLocation": "Office",
    "probationPeriod": "3 months",
    "workingHours": "40 hours/week"
  }
}
```

#### Upload Documents
```http
POST /api/contracts/documents
Authorization: Bearer {token}
Content-Type: multipart/form-data

files: [file1, file2, ...]
```

#### Download Contract PDF
```http
GET /api/contracts/:contractId/pdf
Authorization: Bearer {token}
```

### Admin Endpoints

#### Get Dashboard Metrics
```http
GET /api/admin/dashboard/metrics
Authorization: Bearer {admin-token}
```

#### List Employees
```http
GET /api/admin/employees?status=active&page=1&limit=20
Authorization: Bearer {admin-token}
```

#### List Contracts
```http
GET /api/admin/contracts?status=Under Review&page=1&limit=20
Authorization: Bearer {admin-token}
```

#### Approve Contract
```http
POST /api/admin/contracts/:contractId/approve
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "notes": "Contract approved. Welcome aboard!"
}
```

#### Reject Contract
```http
POST /api/admin/contracts/:contractId/reject
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "reason": "Please update salary information and resubmit."
}
```

#### Update Employee Status
```http
PATCH /api/admin/employees/:employeeId/status
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "status": "inactive"
}
```

## 🔐 Security Features

- **Password Security**: Bcryptjs with salt rounds for password hashing
- **JWT Authentication**: Secure token-based authentication
- **CORS**: Cross-Origin Resource Sharing configured
- **Input Validation**: Express-validator for all inputs
- **Role-Based Access**: Admin and employee role protection
- **Email Verification**: Email confirmation before account activation
- **Secure File Upload**: Cloudinary integration for safe file storage

## 📊 Database Schema

### Employee
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  position: String,
  role: String (enum: ['employee', 'admin']),
  documents: Array of { label, url },
  verified: Boolean,
  verificationToken: String,
  verificationExpiresAt: Date,
  status: String (enum: ['active', 'inactive', 'terminated']),
  createdAt: Date
}
```

### Contract
```javascript
{
  employee: ObjectId (ref: Employee),
  formData: Object (contract fields),
  status: String (enum: ['Draft', 'Under Review', 'Approved', 'Rejected']),
  pdfUrl: String,
  approvedBy: ObjectId (ref: Employee),
  approvedAt: Date,
  comments: String,
  history: Array of {
    status: String,
    changedBy: String,
    changedAt: Date,
    note: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Frontend Pages

### Authentication Pages
- **Login** (`/login`) - Employee/Admin login
- **Register** (`/register`) - New employee registration
- **Verify Email** (`/verify/:token`) - Email verification

### Employee Pages
- **Dashboard** (`/employee`) - Contract overview and status
- **Contract Form** (`/employee/contract`) - Fill and submit contracts

### Admin Pages
- **Admin Dashboard** (`/admin`) - Overview and metrics
- **Manage Employees** (`/admin/employees`) - Employee management
- **Review Contracts** (`/admin/contracts`) - Contract review workflow

## 🧪 Testing the Application

### Manual Testing Flow

1. **Registration Flow**
   - Register new employee account
   - Verify email via sent link
   - Login with credentials

2. **Employee Contract Flow**
   - Fill employment contract form
   - Upload supporting documents
   - Submit contract for review
   - View contract status
   - Download approved contract (after admin approval)

3. **Admin Management Flow**
   - Login with admin credentials
   - View dashboard metrics
   - Review pending contracts
   - Approve or reject contracts
   - Manage employee accounts

## 🐛 Troubleshooting

### Backend Connection Issues
- **MongoDB Error**: Verify MongoDB is running and connection string is correct
- **SendGrid Errors**: Check API key and from email are set
- **Cloudinary Errors**: Verify cloud name and API credentials

### Frontend Issues
- **API Connection Failed**: Ensure backend is running on port 4000
- **Routes Not Found**: Verify all pages are imported in App.jsx
- **Styling Issues**: Clear browser cache and rebuild

### Email Not Sending
- Verify SendGrid API key is valid
- Check SENDGRID_FROM_EMAIL environment variable
- Check spam folder for test emails

## 📈 Performance Optimization

- **Lazy Loading**: Routes are lazy-loaded in React
- **Database Indexing**: Employee email is indexed for faster queries
- **Pagination**: Employee and contract lists use pagination
- **Caching**: JWT tokens cached in localStorage
- **Code Splitting**: Separate CSS files per page

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables in platform
2. Deploy from git repository
3. Run database migrations

### Frontend Deployment (Vercel/Netlify)
1. Set VITE_API_URL environment variable
2. Build: `npm run build`
3. Deploy dist folder

## 📝 License

This project is proprietary software for Excellence Coaching Hub.

## 👥 Support

For issues or questions, contact the development team.

## 🗺️ Project Roadmap

- [ ] Two-factor authentication
- [ ] Document versioning
- [ ] Advanced analytics dashboard
- [ ] Bulk employee import
- [ ] Email templates customization
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Audit logs
- [ ] Digital signature integration

## ✨ Best Practices Followed

- ✅ RESTful API design
- ✅ Error handling and validation
- ✅ Code organization and structure
- ✅ Security best practices
- ✅ Responsive UI design
- ✅ Accessibility considerations
- ✅ Performance optimization
- ✅ Comprehensive error messages
