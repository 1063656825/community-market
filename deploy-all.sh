#!/bin/bash

# 确保脚本在发生错误时停止执行
set -e

echo "开始全量部署..."

# 部署管理后台
cd admin-h5
bash deploy-admin.sh
cd ..

# 部署客户端
cd client-h5
bash deploy-client.sh
cd ..

# 部署后端服务
cd server
bash deploy-server.sh
cd ..

# 重新加载 Nginx 配置
sudo nginx -t && sudo systemctl reload nginx

echo "所有服务部署完成！" 