#!/bin/bash

# ==========================================
# 中信戴卡人型导览项目 Web 部署脚本
# ==========================================
# 使用方法: sudo bash deploy.sh
# 
# 系统要求: Ubuntu 18.04 及以上
# 端口要求: 5173 (Web服务), 8000 (后端API)
# ==========================================

set -e  # 遇到错误立即退出

echo ""
echo "=========================================="
echo "  中信戴卡人型导览项目 Web 部署脚本"
echo "=========================================="
echo ""

# 检查是否以 root 权限运行
if [ "$EUID" -ne 0 ]; then 
    echo "❌ 错误: 请使用 sudo 运行此脚本"
    echo ""
    echo "正确用法:"
    echo "  sudo bash deploy.sh"
    echo ""
    exit 1
fi

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "当前工作目录: $SCRIPT_DIR"
echo ""

# 检查 dist 目录是否存在
if [ ! -d "dist" ]; then
    echo "❌ 错误: 找不到 dist 目录"
    echo ""
    echo "请确保 dist 文件夹与部署脚本在同一目录下"
    echo "目录结构应该是:"
    echo "  g1_web_deploy/"
    echo "    ├── dist/"
    echo "    └── deploy.sh"
    echo ""
    exit 1
fi

echo "✓ 找到 dist 目录"

# 1. 检查并安装 Nginx
echo ""
echo "=========================================="
echo "[步骤 1/5] 检查并安装 Nginx"
echo "=========================================="
if ! command -v nginx &> /dev/null; then
    echo "检测到 Nginx 未安装，正在安装..."
    echo "正在更新软件源..."
    apt update
    echo "正在安装 Nginx..."
    apt install nginx -y
    echo "✓ Nginx 安装完成"
else
    echo "✓ Nginx 已安装"
fi

# 2. 创建目标目录
echo ""
echo "=========================================="
echo "[步骤 2/5] 创建部署目录"
echo "=========================================="
# 获取实际用户（即使使用 sudo 也能获取真实用户）
ACTUAL_USER="${SUDO_USER:-$USER}"
ACTUAL_HOME=$(eval echo ~$ACTUAL_USER)
TARGET_DIR="$ACTUAL_HOME/g1_web"
mkdir -p "$TARGET_DIR"
# 确保目录所有者是实际用户
chown -R $ACTUAL_USER:$ACTUAL_USER "$TARGET_DIR"
echo "✓ 部署目录: $TARGET_DIR"
echo "✓ 目录所有者: $ACTUAL_USER"

# 3. 复制 dist 文件夹
echo ""
echo "=========================================="
echo "[步骤 3/5] 部署项目文件"
echo "=========================================="
# 删除旧的 dist 目录（如果存在）
if [ -d "$TARGET_DIR/dist" ]; then
    echo "检测到旧版本文件，正在清理..."
    rm -rf "$TARGET_DIR/dist"
fi
# 复制新的 dist 目录
echo "正在复制项目文件..."
cp -r dist "$TARGET_DIR/"
echo "✓ 项目文件部署完成"

# 4. 配置 Nginx
echo ""
echo "=========================================="
echo "[步骤 4/5] 配置 Nginx"
echo "=========================================="
NGINX_CONFIG="/etc/nginx/sites-available/g1_web"
echo "正在写入 Nginx 配置文件..."

cat > "$NGINX_CONFIG" << EOF
server {
    listen 5173;
    server_name _;

    root $TARGET_DIR/dist;
    index index.html;

    # 前端路由
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API代理（添加WebSocket支持）
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;  # 支持WebSocket
        proxy_set_header Upgrade \$http_upgrade;  # WebSocket升级
        proxy_set_header Connection "upgrade";   # WebSocket连接
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket超时配置（可选，防止长连接断开）
        proxy_read_timeout 86400s;  # 24小时
        proxy_send_timeout 86400s;
    }

    # 如果WebSocket有独立路径，也需要代理（根据你的后端实际情况）
    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo "✓ Nginx 配置文件创建完成"

# 5. 启用站点并重启 Nginx
echo ""
echo "=========================================="
echo "[步骤 5/5] 启用站点并启动服务"
echo "=========================================="

# 创建符号链接（如果不存在）
NGINX_ENABLED="/etc/nginx/sites-enabled/g1_web"
if [ ! -L "$NGINX_ENABLED" ]; then
    echo "正在启用站点配置..."
    ln -s "$NGINX_CONFIG" "$NGINX_ENABLED"
    echo "✓ 站点配置已启用"
else
    echo "✓ 站点配置已启用（已存在）"
fi

# 测试 Nginx 配置
echo ""
echo "正在测试 Nginx 配置..."
if nginx -t 2>&1 | grep -q "successful"; then
    echo "✓ Nginx 配置测试通过"
else
    echo "❌ 错误: Nginx 配置测试失败"
    nginx -t
    exit 1
fi

# 重启 Nginx
echo ""
echo "正在重启 Nginx 服务..."
systemctl restart nginx
sleep 2

# 检查 Nginx 状态
if systemctl is-active --quiet nginx; then
    IP_ADDR=$(hostname -I | awk '{print $1}')
    echo ""
    echo "=========================================="
    echo "✓ 部署成功！"
    echo "=========================================="
    echo ""
    echo "  Web 服务已启动，可通过以下地址访问:"
    echo ""
    echo "  本机访问: http://localhost:5173"
    echo "  局域网访问: http://$IP_ADDR:5173"
    echo ""
    echo "=========================================="
    echo "  重要提示"
    echo "=========================================="
    echo ""
    echo "  1. 请确保后端 API 服务运行在 8000 端口"
    echo "  2. 如无法访问，请检查防火墙设置:"
    echo "     sudo ufw allow 5173"
    echo "  3. 查看服务状态:"
    echo "     sudo systemctl status nginx"
    echo "  4. 查看错误日志:"
    echo "     sudo tail -f /var/log/nginx/error.log"
    echo ""
else
    echo ""
    echo "=========================================="
    echo "❌ 部署失败"
    echo "=========================================="
    echo ""
    echo "Nginx 服务未正常运行，请检查错误日志:"
    echo "  sudo journalctl -u nginx -n 50"
    echo "  sudo tail -f /var/log/nginx/error.log"
    echo ""
    exit 1
fi

