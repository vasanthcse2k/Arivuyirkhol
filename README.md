# Arivuyirkhol MERN application — Windows setup

This is a JavaScript React frontend and Express/Node backend with MongoDB enquiry storage. It includes all seven services and eight client sectors from the supplied PDF, the communication problem, content quality commitments, four-stage workflow, six audience profiles, and the supplied contact email. The contact form saves records; it does not send emails automatically. Plagiarism Detection is a listed service, not an automated plagiarism checker.

## 1. Open this exact project folder

Open PowerShell and paste:

```powershell
Set-Location -LiteralPath 'C:\Users\Vasanth\Documents\Codex\2026-10-10\hi\outputs\arivuyirkhol'
code.cmd .
```

In VS Code, select Terminal > New Terminal. Check the prompt ends in `outputs\arivuyirkhol`. If you move the project, replace this path everywhere below with its new location.

## 2. Prerequisites

Install Node.js LTS from https://nodejs.org/en/download and VS Code from https://code.visualstudio.com/download if needed. Use Node 22.12+ or a newer supported LTS for this Vite project. Restart the terminal after installing.

```powershell
node --version
npm.cmd --version
```

Use `npm.cmd` in PowerShell to avoid script execution policy problems. There is no need to change the execution policy.

## 3. Install and start MongoDB (local option)

Follow the official Windows installer instructions: https://www.mongodb.com/docs/manual/administration/install-community-windows/

Select MongoDB Community Server and install it as a Windows service. Install MongoDB Compass as well; Compass is a database viewer, not the database server. The server installation folder normally resembles `C:\Program Files\MongoDB\Server\<version>\bin`; `<version>` depends on what you install. Do not paste that placeholder literally.

Check the Windows service:

```powershell
Get-Service -Name MongoDB
```

If it exists but is stopped, open an Administrator PowerShell and run:

```powershell
Start-Service -Name MongoDB
```

If the service does not exist, complete the server installation or use the Atlas alternative below. The installer service configuration controls its data directory; the app does not need that disk path.

Optional manual server, only if you did NOT install/run the Windows service: find the installed executable and use a separate data folder. Keep this terminal running.

```powershell
$mongoExecutable = Get-ChildItem -LiteralPath 'C:\Program Files\MongoDB\Server' -Filter mongod.exe -Recurse | Select-Object -First 1 -ExpandProperty FullName
if (-not $mongoExecutable) { throw 'MongoDB Server is not installed in the standard location.' }
New-Item -ItemType Directory -Force 'C:\Users\Vasanth\Documents\Codex\mongodb-data\arivuyirkhol' | Out-Null
& $mongoExecutable --dbpath 'C:\Users\Vasanth\Documents\Codex\mongodb-data\arivuyirkhol' --bind_ip 127.0.0.1 --port 27017
```

Do not run a service and a manual server on port 27017 at the same time. Local unauthenticated MongoDB is for development on your own computer; keep it bound to localhost.

## 4. Configure the backend connection

Return to your project terminal:

```powershell
Set-Location -LiteralPath 'C:\Users\Vasanth\Documents\Codex\2026-10-10\hi\outputs\arivuyirkhol'
Copy-Item -LiteralPath '.\server\.env.example' -Destination '.\server\.env'
code.cmd '.\server\.env'
```

Copy the example only on first setup; rerunning it overwrites your configuration. The contents for local MongoDB are:

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/arivuyirkhol
CLIENT_ORIGIN=http://localhost:5173
```

The connection lives in `C:\Users\Vasanth\Documents\Codex\2026-10-10\hi\outputs\arivuyirkhol\server\.env`. `server\src\index.js` reads it and calls `mongoose.connect`. A MongoDB URI is a network address, not a Windows file path. React never receives this URI.

### Atlas alternative (no local server)

Create a MongoDB Atlas deployment, create a database user, allow your application's connecting IP in Network Access, then choose Connect > Drivers > Node.js and copy the provided URI. Set `MONGODB_URI` in `server\.env` to that URI, with the actual cluster hostname, encoded password, and database name `arivuyirkhol`. Keep your credentials out of the frontend and Git. No local data folder or Windows MongoDB service is needed for Atlas. Official instructions: https://www.mongodb.com/docs/atlas/driver-connection/

## 5. Install dependencies and start both applications

From the project root:

```powershell
npm.cmd install
npm.cmd run setup
npm.cmd run dev
```

Leave that terminal running. Open http://localhost:5173 in your browser. The backend is http://localhost:5000. Verify http://localhost:5000/api/health returns `status: ok` and `database: connected`.

Alternatively use two terminals, both starting in the project root:

```powershell
# Terminal 1: backend
npm.cmd run dev --prefix server
```

```powershell
# Terminal 2: frontend
npm.cmd run dev --prefix client
```

React sends `/api/enquiries` to Vite, which proxies it to Express on port 5000. Express validates the data and Mongoose saves it to MongoDB. Stop with Ctrl+C.

## 6. Connect MongoDB Compass or VS Code

In Compass, choose Add New Connection, paste `mongodb://127.0.0.1:27017/arivuyirkhol`, and connect. Submit one valid enquiry from the website, then refresh Compass and open database `arivuyirkhol`, collection `enquiries`. The collection/data become visible when the first record is saved. Verify the name, email, service, audience and message.

In VS Code, optionally install the official **MongoDB for VS Code** extension by MongoDB. Open its sidebar, choose Add Connection, and paste the same URI. The extension is optional; the application's backend connects through `server\.env` independently. Official Compass instructions: https://www.mongodb.com/docs/compass/connect/

There is no public endpoint for reading enquiries. Use a trusted Compass/VS Code connection to review them. This avoids exposing client contact details through the website.

## 7. Files you will edit

All paths below are relative to the project folder from step 1:

| File | Purpose |
| --- | --- |
| `client/src/main.jsx` | React sections, services, audiences and enquiry form |
| `client/src/styles.css` | Layout, colours, responsive styles |
| `client/vite.config.js` | Local frontend-to-backend proxy |
| `client/.env.example` | Optional deployed backend URL example |
| `server/.env` | Private MongoDB connection and port configuration |
| `server/src/index.js` | Express API, database schema and connection |
| `server/src/validation.js` | Backend field validation and service list |
| `server/src/validation.test.js` | Validation tests |
| `package.json` | Commands that run both applications |

If adding a new service, update the frontend list and backend validation list together.

## 8. Check your project

```powershell
npm.cmd test
npm.cmd run build
```

The build creates `client\dist`. It does not deploy the app. Manually confirm mobile layout, audience buttons, invalid form validation, success after saving, and the saved record in Compass. Stop the API and verify the form shows an error rather than a false success.

## 9. Deployment outline

For hosting the frontend and backend together on Netlify, follow `NETLIFY-DEPLOY.md`. The Netlify Functions adapter is now included. The separate-host option below remains available.


Host React separately (for example Netlify) and Express on a Node-capable host, with MongoDB Atlas. Netlify static hosting alone does not run this Express process. Frontend build: `npm run build`; publish directory: `client/dist`. Set frontend `VITE_API_URL` to the HTTPS backend origin and rebuild. Backend install: `npm install && npm run setup`; start: `npm run start --prefix server`. Set backend `MONGODB_URI`, host-provided `PORT`, and `CLIENT_ORIGIN` to the exact HTTPS frontend origin. Configure Atlas access for the backend host. The current artifact is local source, not a deployed site.

Before a public launch, confirm enquiry retention/deletion practices and your privacy wording, use database authentication and HTTPS, configure trusted proxy handling for rate limiting according to your host, and complete a real database end-to-end test. Automatic email notifications and an authenticated admin panel are future additions; neither is currently implemented.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Cannot connect to MongoDB | Check the service/Atlas access and `server/.env`; Compass alone is not a server |
| `ENOENT package.json` | Run `Set-Location` using the full project root path in step 1 |
| PowerShell blocks npm.ps1 | Use `npm.cmd` |
| Port 5000 already in use | Stop the previous backend or change PORT and the Vite proxy together |
| Vite selects 5174 | Stop the existing frontend and use 5173, or update CLIENT_ORIGIN and restart backend |
| Form fails on deployed site | Verify VITE_API_URL, HTTPS, CLIENT_ORIGIN and database connectivity |
| No collection in Compass | Submit a successful enquiry and refresh; verify the database in the URI |


