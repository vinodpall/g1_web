#!/bin/bash

# ==========================================
# G1 Web 项目打包脚本
# ==========================================
# 用途: 构建项目并生成交付包
# 运行环境: Windows Git Bash / Linux / macOS
# ==========================================

set -e

echo ""
echo "=========================================="
echo "  G1 Web 项目打包脚本"
echo "=========================================="
echo ""

# 检查是否安装了 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js 版本: $(node -v)"
echo "✓ npm 版本: $(npm -v)"
echo ""

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "=========================================="
    echo "安装项目依赖"
    echo "=========================================="
    npm install
    echo ""
fi

# 构建项目
echo "=========================================="
echo "构建项目"
echo "=========================================="
echo "正在执行: npm run build"
echo ""
npm run build
echo ""
echo "✓ 项目构建完成"

# 检查 dist 目录
if [ ! -d "dist" ]; then
    echo "❌ 错误: 构建失败，未找到 dist 目录"
    exit 1
fi

# 创建交付包目录
PACKAGE_DIR="g1_web_deploy"
PACKAGE_NAME="g1_web_deploy.tar.gz"

echo ""
echo "=========================================="
echo "创建交付包"
echo "=========================================="

# 清理旧的交付包
if [ -d "$PACKAGE_DIR" ]; then
    echo "清理旧的交付包目录..."
    rm -rf "$PACKAGE_DIR"
fi

if [ -f "$PACKAGE_NAME" ]; then
    echo "清理旧的压缩包..."
    rm -f "$PACKAGE_NAME"
fi

# 创建交付包目录
mkdir -p "$PACKAGE_DIR"

# 复制必要文件
echo "正在复制文件到交付包..."
cp -r dist "$PACKAGE_DIR/"
cp deploy.sh "$PACKAGE_DIR/"
cp 安装说明.txt "$PACKAGE_DIR/" 2>/dev/null || echo "提示: 未找到安装说明.txt"

# 设置部署脚本为可执行
chmod +x "$PACKAGE_DIR/deploy.sh"

# 创建压缩包
echo "正在打包..."
tar -czf "$PACKAGE_NAME" "$PACKAGE_DIR"

# 获取文件大小
if [[ "$OSTYPE" == "darwin"* ]]; then
    FILE_SIZE=$(du -h "$PACKAGE_NAME" | cut -f1)
else
    FILE_SIZE=$(du -h "$PACKAGE_NAME" | cut -f1)
fi

echo ""
echo "=========================================="
echo "✓ 打包完成！"
echo "=========================================="
echo ""
echo "  交付包: $PACKAGE_NAME"
echo "  大小: $FILE_SIZE"
echo ""
echo "=========================================="
echo "  下一步操作"
echo "=========================================="
echo ""
echo "  1. 将 $PACKAGE_NAME 复制到 Ubuntu 机器"
echo "  2. 在 Ubuntu 上解压:"
echo "     tar -xzf $PACKAGE_NAME"
echo "  3. 进入目录并运行部署脚本:"
echo "     cd $PACKAGE_DIR"
echo "     sudo bash deploy.sh"
echo ""
echo "  详细步骤请参考 安装说明.txt"
echo ""
