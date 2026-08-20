@echo off
echo 正在启动前端服务...
cd /d "%~dp0frontend"
npx vite --host 0.0.0.0 --port 5173
pause
