# K&co FinOps Platform

A full-stack FinOps analytics application for processing cloud billing data and providing cost intelligence insights.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the uploads directory (if it doesn't exist):
   ```bash
   # On Windows PowerShell:
   New-Item -ItemType Directory -Path uploads -Force
   
   # On Linux/Mac:
   mkdir -p uploads
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Running the Application

**IMPORTANT:** You need to run BOTH the backend and frontend servers:

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port shown in terminal)

## Troubleshooting

### Upload Error: "Cannot connect to backend server"
- Make sure the backend server is running on port 5000
- Check that no other application is using port 5000
- Verify the backend started successfully (you should see "Analytics Engine running on port 5000")

### Upload Error: "Failed to process file"
- Ensure you're uploading a valid CSV file
- Check the backend terminal for detailed error messages
- Verify the CSV has the required columns (BilledCost/Cost, ServiceName, etc.)

### Port Already in Use
- If port 5000 is busy, change it in `backend/server.js` (line 162)
- If port 5173 is busy, Vite will automatically use the next available port

## Project Structure

```
FinOps_MVP/
├── backend/
│   ├── server.js          # Express server with CSV processing
│   ├── package.json       # Backend dependencies
│   └── uploads/           # Temporary file uploads (created automatically)
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   └── ...
│   ├── package.json       # Frontend dependencies
│   └── .env              # Environment variables (create this)
└── README.md
```
