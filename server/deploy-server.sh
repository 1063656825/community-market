#!/bin/bash

# 确保脚本在发生错误时停止执行
set -e

echo "开始部署后端服务..."

# 创建部署目录（如果不存在）
sudo mkdir -p /var/www/community-market/server
cd /var/www/community-market/server

# 备份当前版本（如果存在）
if [ -d "dist" ]; then
    echo "备份当前版本..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    sudo tar -czf "backup_$timestamp.tar.gz" dist/ node_modules/ package.json
fi

# 解压新版本
echo "解压新版本..."
sudo tar -xzf server.tar.gz

# 设置权限
sudo chown -R $(whoami):$(whoami) .

# 使用 PM2 管理进程
# 如果没有安装 PM2，先全局安装
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

# 定义服务名称
APP_NAME="community-market-api"

# 检查服务是否存在并重启或新建
if pm2 list | grep -q "$APP_NAME"; then
    echo "重启已存在的服务..."
    pm2 restart "$APP_NAME"
else
    echo "启动新服务..."
    pm2 start dist/main.js --name "$APP_NAME"
fi

# 保存 PM2 进程列表
pm2 save

echo "后端服务部署完成！"

# 删除部署包
sudo rm -f server.tar.gz

# 显示服务状态
pm2 list
pm2 logs "$APP_NAME" --lines 20 