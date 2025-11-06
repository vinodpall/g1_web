@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ==========================================
echo   G1 Web 项目打包脚本 (Windows)
echo ==========================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✓ Node.js 版本: %NODE_VERSION%
echo ✓ npm 版本: %NPM_VERSION%
echo.

REM 检查依赖
if not exist "node_modules\" (
    echo ==========================================
    echo 安装项目依赖
    echo ==========================================
    call npm install
    echo.
)

REM 构建项目
echo ==========================================
echo 构建项目
echo ==========================================
echo 正在执行: npm run build
echo.
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    exit /b 1
)
echo.
echo ✓ 项目构建完成

REM 检查 dist 目录
if not exist "dist\" (
    echo ❌ 错误: 构建失败，未找到 dist 目录
    pause
    exit /b 1
)

REM 创建交付包
set PACKAGE_DIR=g1_web_deploy
set PACKAGE_NAME=g1_web_deploy.zip

echo.
echo ==========================================
echo 创建交付包
echo ==========================================

REM 清理旧的交付包
if exist "%PACKAGE_DIR%" (
    echo 清理旧的交付包目录...
    rmdir /s /q "%PACKAGE_DIR%"
)

if exist "%PACKAGE_NAME%" (
    echo 清理旧的压缩包...
    del /f /q "%PACKAGE_NAME%"
)

REM 创建交付包目录
mkdir "%PACKAGE_DIR%"

REM 复制必要文件
echo 正在复制文件到交付包...
xcopy /e /i /q "dist" "%PACKAGE_DIR%\dist\" >nul
copy /y "deploy.sh" "%PACKAGE_DIR%\" >nul
if exist "安装说明.txt" copy /y "安装说明.txt" "%PACKAGE_DIR%\" >nul

REM 检查是否有 PowerShell
where powershell >nul 2>nul
if %errorlevel% equ 0 (
    echo 正在打包 (使用 PowerShell)...
    powershell -command "Compress-Archive -Path '%PACKAGE_DIR%' -DestinationPath '%PACKAGE_NAME%' -Force"
    
    REM 获取文件大小
    for %%A in (%PACKAGE_NAME%) do set FILE_SIZE=%%~zA
    set /a FILE_SIZE_MB=!FILE_SIZE! / 1024 / 1024
    
    echo.
    echo ==========================================
    echo ✓ 打包完成！
    echo ==========================================
    echo.
    echo   交付包: %PACKAGE_NAME%
    echo   大小: !FILE_SIZE_MB! MB
    echo.
) else (
    echo.
    echo ==========================================
    echo ✓ 文件准备完成！
    echo ==========================================
    echo.
    echo   交付目录: %PACKAGE_DIR%
    echo   提示: 未检测到 PowerShell，请手动压缩 %PACKAGE_DIR% 文件夹
    echo.
)

echo ==========================================
echo   下一步操作
echo ==========================================
echo.
echo   1. 将 %PACKAGE_NAME% (或 %PACKAGE_DIR% 文件夹) 复制到 Ubuntu 机器
echo.
echo   2. 在 Ubuntu 上解压 (如果是 .zip 文件):
echo      unzip %PACKAGE_NAME%
echo      或 (如果是文件夹，直接使用)
echo.
echo   3. 进入目录并运行部署脚本:
echo      cd %PACKAGE_DIR%
echo      sudo bash deploy.sh
echo.
echo   详细步骤请参考 安装说明.txt
echo.

pause

