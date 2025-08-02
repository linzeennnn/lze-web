#!/bin/bash

# 1. 列出当前目录文件
echo "当前目录文件列表:"
ls

SERVICE_NAME="lze-web.service"
INSTALL_DIR="/opt/lze-web"
SYSTEMD_DIR="/etc/systemd/system"

# 2. 停止服务（如果正在运行）
if systemctl is-active --quiet "$SERVICE_NAME"; then
    echo "正在停止服务 $SERVICE_NAME ..."
    sudo systemctl stop "$SERVICE_NAME"
else
    echo "服务 $SERVICE_NAME 没有在运行或不存在"
fi

# 3. 删除 /opt/lze-web 目录下的lze-web 和 web（忽略不存在）
echo "清理 $INSTALL_DIR 下的 lze-web 和 web ..."
sudo rm -rf "$INSTALL_DIR/lze-web" "$INSTALL_DIR/web"

# 4. 创建安装目录（如果不存在）
if [ ! -d "$INSTALL_DIR" ]; then
    echo "创建目录 $INSTALL_DIR ..."
    sudo mkdir -p "$INSTALL_DIR"
fi

# 5. 复制 lze-web 和 web 到安装目录
echo "复制 lze-web 和 web 到 $INSTALL_DIR ..."
sudo cp -r ./lze-web "$INSTALL_DIR/"
sudo cp -r ./web "$INSTALL_DIR/"

# 6. 复制 service 文件到 systemd 目录
echo "复制 $SERVICE_NAME 到 $SYSTEMD_DIR ..."
sudo cp ./lze-web.service "$SYSTEMD_DIR/"

# 7. 重新加载 systemd，启用并启动服务
echo "重新加载 systemd 守护进程 ..."
sudo systemctl daemon-reload

echo "启用并启动服务 $SERVICE_NAME ..."
sudo systemctl enable --now "$SERVICE_NAME"

echo "完成。"

