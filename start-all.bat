@echo off
echo ========================================
echo   AI 电商 SaaS 平台 - 启动脚本
echo ========================================
echo.

echo [1/2] 正在启动后端服务...
start "后端服务" cmd /k "cd /d %~dp0backend && node dist/main.js"

echo 等待后端启动...
timeout /t 3 /nobreak > nul

echo [2/2] 正在启动前端服务...
start "前端服务" cmd /k "cd /d %~dp0frontend && npx vite --host 0.0.0.0 --port 5173"

echo.
echo ========================================
echo   启动完成！
echo   前端地址: http://localhost:5173
echo   后端地址: http://localhost:3000
echo ========================================
echo.
echo 注意：请保持两个命令行窗口打开，不要关闭。
pause
