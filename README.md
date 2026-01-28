# CI/CD Backend - Express TypeScript Server

A production-ready Express server built with TypeScript, featuring health checks, environment configuration, and automated CI/CD deployment.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict mode
- **Express Server**: RESTful API with Express.js
- **Health Check**: Built-in `/health` endpoint for monitoring
- **Environment Variables**: Secure configuration with dotenv
- **CI/CD Pipeline**: Automated build and deployment with GitHub Actions
- **Hot Reload**: Development mode with nodemon

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ci-cd-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development
APP_NAME=Express TypeScript Server
API_VERSION=v1
```

## 🏃 Running Locally

### Development Mode (with hot reload)
```bash
npm run dev
```

### Build TypeScript
```bash
npm run build
```

### Production Mode
```bash
npm run build
npm start
```

### Clean Build Files
```bash
npm run clean
```

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server status, uptime, and environment information.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2026-01-28T08:00:00.000Z",
  "environment": "development",
  "appName": "Express TypeScript Server",
  "apiVersion": "v1",
  "uptime": 123.456
}
```

### Root Endpoint
```
GET /
```
Returns welcome message and available endpoints.

### API Version
```
GET /v1
```
Returns API version information.

## 🔄 CI/CD Pipeline with Self-Hosted Runner

The project uses a **self-hosted GitHub Actions runner** with **Docker** for secure, automated deployment.

### Architecture

```
GitHub Repository → Self-Hosted Runner (on your server) → Docker Container
```

**Benefits:**
- ✅ No SSH keys in GitHub
- ✅ Runner runs directly on your server
- ✅ Docker containerization for isolation
- ✅ Environment variables stay on server
- ✅ Automatic health checks

### Workflow Overview

**File:** `.github/workflows/deploy.yml`

When you push to `main` branch:

1. **Build** - Compiles TypeScript to JavaScript
2. **Copy** - Moves files to `/home/ubuntu/ci-cd-backend`
3. **Docker Build** - Creates Docker image
4. **Deploy** - Stops old container, starts new one
5. **Health Check** - Verifies container is running

### Required Setup

#### 1. Install Self-Hosted Runner

Follow the detailed guide: **[RUNNER_SETUP.md](file:///home/dixit/Documents/ci-cd-backend/RUNNER_SETUP.md)**

Quick steps:
```bash
# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Install GitHub Runner
mkdir -p ~/actions-runner && cd ~/actions-runner
# Download and configure (see RUNNER_SETUP.md for details)

# Install as service
sudo ./svc.sh install
sudo ./svc.sh start
```

#### 2. Create .env File on Server

```bash
cd /home/ubuntu/ci-cd-backend
nano .env
```

Add your production environment variables:
```env
PORT=3000
NODE_ENV=production
APP_NAME=Express TypeScript Server
API_VERSION=v1
```

#### 3. Push to Trigger Deployment

```bash
git push origin main
```

Watch the deployment in **GitHub Actions** tab!

### Docker Configuration

**Dockerfile** - Multi-stage build with Node.js Alpine
- Production dependencies only
- Health check included
- Runs on port 3000 (configurable via .env)

**docker-compose.yml** - Container orchestration
- Auto-restart policy
- Environment file integration
- Health monitoring
- Network isolation

### Managing the Deployment

```bash
# View running containers
docker ps

# Check logs
docker logs ci-cd-backend

# Restart container
cd /home/ubuntu/ci-cd-backend
docker-compose restart

# Stop container
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View container stats
docker stats ci-cd-backend
```

## 🖥️ Server Requirements

- Ubuntu 20.04+ or similar Linux distribution
- Docker and Docker Compose installed
- GitHub Actions runner installed and running
- Directory: `/home/ubuntu/ci-cd-backend`
- .env file with production variables

## 📁 Project Structure

```
ci-cd-backend/
├── .github/
│   └── workflows/
│       └── deploy.yml         # Self-hosted runner workflow
├── src/
│   └── index.ts              # TypeScript source
├── dist/                     # Compiled JavaScript (generated)
├── .env                      # Environment variables (not in git)
├── .env.example             # Environment template
├── .dockerignore            # Docker build exclusions
├── .gitignore               # Git ignore rules
├── Dockerfile               # Docker image definition
├── docker-compose.yml       # Container orchestration
├── nodemon.json             # Development auto-reload
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── RUNNER_SETUP.md          # Runner installation guide
└── README.md                # This file
```

## 🧪 Testing

### Local Development
```bash
npm run dev
curl http://localhost:3000/health
```

### Docker Build (Local)
```bash
npm run build
docker-compose build
docker-compose up -d
curl http://localhost:3000/health
```

### Production (After Deployment)
```bash
# SSH to your server
ssh ubuntu@your-server-ip

# Check container
docker ps
docker logs ci-cd-backend

# Test health endpoint
curl http://localhost:3000/health
```

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build (without Docker) |
| `npm run clean` | Remove dist folder |

## 🔒 Security Notes

- ✅ No SSH keys stored in GitHub
- ✅ Self-hosted runner runs on your server with your permissions
- ✅ Environment variables never leave your server
- ✅ Docker provides application isolation
- ✅ .env file excluded from git and Docker builds
- ✅ Health checks ensure container reliability

## 🚀 Deployment Checklist

- [ ] Install Docker on server
- [ ] Install and configure GitHub Actions runner
- [ ] Create `/home/ubuntu/ci-cd-backend/.env` file
- [ ] Verify runner shows as "Idle" in GitHub
- [ ] Push to main branch
- [ ] Check GitHub Actions for successful deployment
- [ ] Verify container is running: `docker ps`
- [ ] Test health endpoint: `curl http://localhost:3000/health`

## 📄 License

ISC

## 👤 Author

Your Name

---

**Happy Coding! 🎉**


## 📄 License

ISC

## 👤 Author

Your Name

---

**Happy Coding! 🎉**
