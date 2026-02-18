# ResumeCraft AI - EC2 Deployment Guide

## Prerequisites
- AWS EC2 instance (Ubuntu 22.04 LTS recommended)
- GitHub repository with your code
- Domain name (optional, can use EC2 public IP)
- SSH access to EC2

---

## Step 1: Initial EC2 Setup

### 1.1 Connect to EC2
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 1.2 Update system
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Install required tools
```bash
# Python 3.11+
sudo apt install python3-pip python3-venv git nginx -y

# Node.js 18+ (for React build)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Redis
sudo apt install redis-server -y
sudo systemctl enable redis-server
sudo systemctl start redis-server

# PM2 for process management
sudo npm install -g pm2
```

---

## Step 2: Clone Repository

```bash
cd /home/ubuntu
git clone https://github.com/yourusername/resumecraft-ai.git
cd resumecraft-ai
```

---

## Step 3: Backend Setup

### 3.1 Create virtual environment
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
```

### 3.2 Install dependencies
Create `requirements.txt` first (see below), then:
```bash
pip install -r requirements.txt
```

### 3.3 Setup environment variables
```bash
nano .env
```

Add:
```
HUGGINGFACE_API_KEY=your_key_here
SECRET_KEY=your_secret_key_here
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3.4 Test backend
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Press `Ctrl+C` to stop.

---

## Step 4: Frontend Build

### 4.1 Install dependencies
```bash
cd ../web
npm install
```

### 4.2 Build for production
```bash
# Set API URL (replace with your EC2 public IP or domain)
export VITE_API_URL=http://your-ec2-ip:8000
npm run build
```

Or create `.env.production`:
```
VITE_API_URL=http://your-ec2-ip:8000
```

Then:
```bash
npm run build
```

---

## Step 5: Process Management (PM2)

### 5.1 Create PM2 ecosystem file
```bash
cd /home/ubuntu/resumecraft-ai
nano ecosystem.config.js
```

Add:
```javascript
module.exports = {
  apps: [
    {
      name: 'resumecraft-ai-backend',
      cwd: '/home/ubuntu/resumecraft-ai/backend',
      script: 'venv/bin/uvicorn',
      args: 'main:app --host 0.0.0.0 --port 8000',
      interpreter: 'none',
      env: {
        PYTHONUNBUFFERED: '1',
      },
    },
    {
      name: 'resumecraft-ai-frontend',
      cwd: '/home/ubuntu/resumecraft-ai/web',
      script: 'npx',
      args: 'serve -s dist -l 3000',
      interpreter: 'none',
    },
  ],
};
```

### 5.2 Start services
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow instructions to enable auto-start on reboot
```

---

## Step 6: Nginx Reverse Proxy

### 6.1 Create Nginx config
```bash
sudo nano /etc/nginx/sites-available/resumecraft-ai
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # or your EC2 public IP (e.g., resumecraft.ai)

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6.2 Enable site
```bash
sudo ln -s /etc/nginx/sites-available/resumecraft-ai /etc/nginx/sites-enabled/
sudo nginx -t  # Test config
sudo systemctl restart nginx
```

---

## Step 7: Security (Important!)

### 7.1 Update CORS in backend
Edit `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://your-domain.com",
        "http://your-ec2-ip",
        "https://your-domain.com",  # if using SSL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 7.2 Update frontend API URL
In `web/src/api/client.ts`, ensure it uses production URL:
```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://your-domain.com/api';
```

### 7.3 Firewall (UFW)
```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS (if using SSL)
sudo ufw enable
```

---

## Step 8: SSL Certificate (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## Post-Deployment Commands

### Check services
```bash
pm2 status
pm2 logs resumecraft-ai-backend
pm2 logs resumecraft-ai-frontend
```

### Restart services
```bash
pm2 restart all
```

### Update code (after git pull)
```bash
cd /home/ubuntu/resumecraft-ai
git pull

# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
pm2 restart resumecraft-ai-backend

# Frontend
cd ../web
npm install
npm run build
pm2 restart resumecraft-ai-frontend
```

### Check Redis
```bash
redis-cli ping  # Should return PONG
```

### Check Nginx
```bash
sudo systemctl status nginx
sudo nginx -t
```

---

## Troubleshooting

### Backend not starting
```bash
cd /home/ubuntu/resumecraft-ai/backend
source venv/bin/activate
python -m uvicorn main:app --host 0.0.0.0 --port 8000
# Check for errors
```

### Frontend not loading
```bash
cd /home/ubuntu/resumecraft-ai/web
npm run build
pm2 restart resumecraft-ai-frontend
```

### Port already in use
```bash
sudo lsof -i :8000
sudo kill -9 <PID>
```

---

## GitHub Actions CI/CD (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/resumecraft-ai
            git pull
            cd backend
            source venv/bin/activate
            pip install -r requirements.txt
            pm2 restart resumecraft-ai-backend
            cd ../web
            npm install
            npm run build
            pm2 restart resumecraft-ai-frontend
```

Add secrets in GitHub repo settings:
- `EC2_HOST`: Your EC2 public IP
- `EC2_SSH_KEY`: Your private key content
