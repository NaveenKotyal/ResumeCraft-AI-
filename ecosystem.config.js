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
      error_file: '/home/ubuntu/resumecraft-ai/logs/backend-error.log',
      out_file: '/home/ubuntu/resumecraft-ai/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'resumecraft-ai-frontend',
      cwd: '/home/ubuntu/resumecraft-ai/web',
      script: 'npx',
      args: 'serve -s dist -l 3000',
      interpreter: 'none',
      error_file: '/home/ubuntu/resumecraft-ai/logs/frontend-error.log',
      out_file: '/home/ubuntu/resumecraft-ai/logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
