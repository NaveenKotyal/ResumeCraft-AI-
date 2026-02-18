# Quick Deployment Commands - ResumeCraft AI

## One-Time Setup (Run Once)

```bash
# 1. Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# 2. Install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-venv git nginx -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install redis-server -y
sudo npm install -g pm2 serve

# 3. Clone repo
cd /home/ubuntu
git clone https://github.com/yourusername/resumecraft-ai.git
cd resumecraft-ai

# 4. Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt
nano .env  # Add HUGGINGFACE_API_KEY and SECRET_KEY

# 5. Setup frontend
cd ../web
npm install
# Edit .env.production or set VITE_API_URL=http://your-ec2-ip:8000
npm run build

# 6. Create logs directory
cd ..
mkdir -p logs

# 7. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow instructions

# 8. Setup Nginx
sudo nano /etc/nginx/sites-available/resumecraft-ai
# Paste nginx config (see DEPLOYMENT.md)
sudo ln -s /etc/nginx/sites-available/resumecraft-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 9. Firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## Daily Commands (After Deployment)

### Check Status
```bash
pm2 status
pm2 logs resumecraft-ai-backend --lines 50
pm2 logs resumecraft-ai-frontend --lines 50
redis-cli ping
sudo systemctl status nginx
```

### Restart Services
```bash
pm2 restart all
# Or individually:
pm2 restart resumecraft-ai-backend
pm2 restart resumecraft-ai-frontend
```

### Update Code (After Git Pull)
```bash
cd /home/ubuntu/resumecraft-ai
git pull

# Backend update
cd backend
source venv/bin/activate
pip install -r ../requirements.txt
pm2 restart resume-genie-backend

# Frontend update
cd ../web
npm install
npm run build
pm2 restart resume-genie-frontend
```

### View Logs
```bash
pm2 logs resumecraft-ai-backend
pm2 logs resumecraft-ai-frontend
# Or tail specific log files:
tail -f /home/ubuntu/resumecraft-ai/logs/backend-error.log
```

### Stop Services
```bash
pm2 stop all
```

### Start Services
```bash
pm2 start all
```

---

## Troubleshooting Commands

### Backend not working?
```bash
cd /home/ubuntu/resumecraft-ai/backend
source venv/bin/activate
python -m uvicorn main:app --host 0.0.0.0 --port 8000
# Check terminal for errors
```

### Frontend not building?
```bash
cd /home/ubuntu/resumecraft-ai/web
rm -rf node_modules dist
npm install
npm run build
```

### Port already in use?
```bash
sudo lsof -i :8000
sudo kill -9 <PID>
# Or
pm2 delete resumecraft-ai-backend
pm2 start ecosystem.config.js
```

### Redis not running?
```bash
sudo systemctl start redis-server
sudo systemctl status redis-server
redis-cli ping  # Should return PONG
```

### Nginx not working?
```bash
sudo nginx -t  # Test config
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

---

## Environment Variables

### Backend (.env in backend/)
```
HUGGINGFACE_API_KEY=your_key_here
SECRET_KEY=your_secret_key_here
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend (.env.production in web/)
```
VITE_API_URL=http://your-ec2-ip:8000
# Or if using domain:
VITE_API_URL=https://your-domain.com/api
```

---

## Important Notes

1. **Replace placeholders:**
   - `your-ec2-ip` → Your EC2 public IP
   - `your-domain.com` → Your domain (if using)
   - `yourusername/resumecraft-ai` → Your GitHub repo

2. **Update CORS** in `backend/main.py` with your domain/IP

3. **Update API URL** in `web/src/api/client.ts` or use `.env.production`

4. **PM2 auto-start:** Run `pm2 startup` and follow instructions to enable auto-start on reboot

5. **SSL:** Use Let's Encrypt (certbot) for HTTPS in production
