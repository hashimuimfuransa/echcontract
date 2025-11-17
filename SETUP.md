# Excellence Coaching Hub - Employee Contract Portal

## Project Structure

```
excellence hr/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── sendgrid.js
│   │   │   └── cloudinary.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── contractController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── upload.js
│   │   ├── models/
│   │   │   ├── employee.js
│   │   │   └── contract.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── contractRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   ├── contractTemplate.js
│   │   │   ├── pdfGenerator.js
│   │   │   └── sendEmail.js
│   │   └── index.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── VerifyEmail.jsx
    │   │   ├── EmployeeDashboard.jsx
    │   │   ├── ContractForm.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminEmployees.jsx
    │   │   └── AdminContracts.jsx
    │   ├── styles/
    │   │   ├── App.css
    │   │   ├── auth.css
    │   │   ├── employee.css
    │   │   └── admin.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env.example
    └── .gitignore
```

## Backend Setup

### Prerequisites
- Node.js (v16+)
- MongoDB
- SendGrid account
- Cloudinary account

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `SENDGRID_API_KEY`: SendGrid API key
- `SENDGRID_FROM_EMAIL`: Email sender address
- `CLOUDINARY_*`: Cloudinary credentials
- `FRONTEND_URL`: Frontend URL (http://localhost:5173)
- `BACKEND_URL`: Backend URL (http://localhost:4000)

### Running the Backend

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on port 4000 by default.

## Frontend Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example` (optional):
```bash
cp .env.example .env
```

### Running the Frontend

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

The frontend will run on port 5173 by default and proxies API requests to http://localhost:4000.

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new employee
- `POST /login` - Login employee
- `GET /verify/:token` - Verify email address

### Contract Routes (`/api/contracts`)
- `GET /me` - Get current user's contract
- `POST /` - Submit/update contract
- `POST /documents` - Upload supporting documents
- `GET /:contractId/pdf` - Download contract PDF

### Admin Routes (`/api/admin`)
- `GET /dashboard/metrics` - Get dashboard metrics
- `GET /employees` - List all employees (paginated)
- `GET /contracts/:contractId` - Get contract details
- `POST /contracts/:contractId/review` - Review contract
- `POST /contracts/:contractId/approve` - Approve contract
- `POST /contracts/:contractId/reject` - Reject contract
- `PATCH /employees/:employeeId/status` - Update employee status

## Database Models

### Employee
- name: String
- email: String (unique)
- password: String (hashed)
- position: String
- role: 'employee' | 'admin'
- documents: Array of { label, url }
- verified: Boolean
- status: 'active' | 'inactive' | 'terminated'
- createdAt: Date

### Contract
- employee: Reference to Employee
- formData: Mixed object with contract fields
- status: 'Draft' | 'Under Review' | 'Approved' | 'Rejected'
- approvedBy: Reference to approving admin
- approvedAt: Date
- history: Array of status change records
- timestamps: createdAt, updatedAt

## Testing

### Employee Flow
1. Register new account
2. (Optional) Verify email via link sent to inbox
3. Login
4. Fill and submit employment contract
5. Upload supporting documents
6. Wait for admin approval
7. Download approved contract PDF

### Admin Flow
1. Login with admin account
2. View dashboard metrics
3. Manage employees (change status)
4. Review pending contracts
5. Approve or reject with comments
6. Employees receive email notifications

## Troubleshooting

### Backend won't start
- Check MongoDB connection string in .env
- Ensure all required environment variables are set
- Check port 4000 is not in use

### Email verification not working
- Verify SendGrid API key is correct
- Check SENDGRID_FROM_EMAIL is set
- Verify FRONTEND_URL points to correct location

### File uploads failing
- Check Cloudinary credentials
- Ensure folder 'excellence-contracts' exists or is created automatically
- Verify API keys have proper permissions

### PDF generation issues
- Check CONTRACT_LOGO_URL and HR_SIGNATURE_URL are valid
- Ensure images are accessible from Node environment
- Verify pdf-lib and qrcode packages are installed

## Security Notes

- Never commit .env files
- Change JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Validate and sanitize all user inputs
- Keep dependencies updated
- Email verification is optional for user convenience, but recommended for production use

## Next Steps

1. Setup MongoDB database
2. Configure SendGrid account
3. Setup Cloudinary cloud storage
4. Run backend and frontend
5. Test complete user flows
6. Deploy to production environment
