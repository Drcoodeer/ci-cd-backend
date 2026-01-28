# Self-Hosted GitHub Runner Installation Guide

This guide will help you install and configure a self-hosted GitHub Actions runner on your Ubuntu server.

## Prerequisites

- Ubuntu server with sudo access
- Docker and Docker Compose installed
- GitHub repository access

## Step 1: Install Docker (if not already installed)

```bash
# Update package index
sudo apt-get update

# Install required packages
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Apply group changes (or logout and login again)
newgrp docker

# Verify installation
docker --version
docker compose version
```

## Step 2: Get GitHub Runner Token

1. Go to your GitHub repository
2. Click **Settings** → **Actions** → **Runners**
3. Click **New self-hosted runner**
4. Select **Linux** as the operating system
5. Copy the commands shown (we'll use them in the next step)

## Step 3: Install GitHub Actions Runner

```bash
# Create a directory for the runner
mkdir -p ~/actions-runner && cd ~/actions-runner

# Download the latest runner package
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure the runner
# Replace <YOUR_REPO_URL> with your repository URL (e.g., https://github.com/username/ci-cd-backend)
# Replace <YOUR_TOKEN> with the token from GitHub (from Step 2)
./config.sh --url <YOUR_REPO_URL> --token <YOUR_TOKEN>

# When prompted:
# - Enter runner name: (press Enter for default or type a custom name like "ubuntu-server")
# - Enter runner group: (press Enter for default)
# - Enter labels: (press Enter for default or add custom labels)
# - Enter work folder: (press Enter for default)
```

## Step 4: Install Runner as a Service

```bash
# Install the service
sudo ./svc.sh install

# Start the service
sudo ./svc.sh start

# Check service status
sudo ./svc.sh status

# The runner should now show as "Idle" in your GitHub repository settings
```

## Step 5: Create Deployment Directory and .env File

```bash
# Create deployment directory
sudo mkdir -p /home/ubuntu/ci-cd-backend

# Change ownership to your user
sudo chown -R $USER:$USER /home/ubuntu/ci-cd-backend

# Create .env file
cd /home/ubuntu/ci-cd-backend
nano .env
```

Add your environment variables:

```env
PORT=3000
NODE_ENV=production
APP_NAME=Express TypeScript Server
API_VERSION=v1
```

Save and exit (Ctrl+X, Y, Enter)

```bash
# Set proper permissions
chmod 600 .env
```

## Step 6: Verify Runner Installation

1. Go to your GitHub repository
2. Navigate to **Settings** → **Actions** → **Runners**
3. You should see your runner listed with status **Idle** (green)

## Step 7: Test Deployment

```bash
# Push to main branch to trigger the workflow
git add .
git commit -m "Test self-hosted runner deployment"
git push origin main

# Watch the workflow run in GitHub Actions tab
# The runner will:
# 1. Build TypeScript
# 2. Copy files to /home/ubuntu/ci-cd-backend
# 3. Build Docker image
# 4. Run container
```

## Verify Deployment

```bash
# Check if container is running
docker ps

# Check container logs
docker logs ci-cd-backend

# Test health endpoint
curl http://localhost:3000/health

# View container details
cd /home/ubuntu/ci-cd-backend
docker-compose ps
```

## Managing the Runner Service

```bash
# Check status
sudo ~/actions-runner/svc.sh status

# Stop the runner
sudo ~/actions-runner/svc.sh stop

# Start the runner
sudo ~/actions-runner/svc.sh start

# Restart the runner
sudo ~/actions-runner/svc.sh stop
sudo ~/actions-runner/svc.sh start

# Uninstall the runner service
sudo ~/actions-runner/svc.sh uninstall
```

## Troubleshooting

### Runner not showing in GitHub

```bash
# Check runner service status
sudo ~/actions-runner/svc.sh status

# Check runner logs
journalctl -u actions.runner.* -f
```

### Docker permission denied

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again, or run:
newgrp docker
```

### Container not starting

```bash
# Check Docker logs
cd /home/ubuntu/ci-cd-backend
docker-compose logs

# Check if .env file exists
ls -la /home/ubuntu/ci-cd-backend/.env

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Port already in use

```bash
# Find what's using port 3000
sudo lsof -i :3000

# Stop the process or change PORT in .env file
```

## Security Notes

- ✅ No SSH keys needed in GitHub
- ✅ Runner runs on your server with your permissions
- ✅ .env file stays on server, never exposed
- ✅ Docker isolates the application
- ✅ Runner only has access to your server, not GitHub secrets

## Updating the Runner

```bash
cd ~/actions-runner

# Stop the service
sudo ./svc.sh stop

# Download new version
curl -o actions-runner-linux-x64-NEW_VERSION.tar.gz -L https://github.com/actions/runner/releases/download/vNEW_VERSION/actions-runner-linux-x64-NEW_VERSION.tar.gz

# Extract
tar xzf ./actions-runner-linux-x64-NEW_VERSION.tar.gz

# Start the service
sudo ./svc.sh start
```

---

**You're all set! 🚀** Push to main branch and watch your self-hosted runner deploy your app with Docker!
