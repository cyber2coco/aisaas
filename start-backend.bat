@echo off
echo 正在启动后端服务...
cd /d "%~dp0backend"
node dist/main.js
pause
