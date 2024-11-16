#!/bin/bash

# 确保脚本在发生错误时停止执行
set -e

echo "开始部署客户端..."

# 创建部署目录
sudo mkdir -p /var/www/community-market/client

# 复制构建文件到部署目录（假设当前目录下已有dist文件夹）
sudo cp -r dist/* /var/www/community-market/client/

# 设置权限
sudo chown -R nginx:nginx /var/www/community-market/client
sudo chmod -R 755 /var/www/community-market/client

echo "客户端部署完成！" 