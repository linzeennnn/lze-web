#!/bin/bash
set -e

SERVICE_NAME="lze-web.service"
INSTALL_DIR="/opt/lze-web"
BIN_LINK="/usr/bin/lze-web"
SYSTEMD_DIR="/etc/systemd/system"

echo "=== 停止并禁用服务（如果存在） ==="
if systemctl list-unit-files | grep -q "$SERVICE_NAME"; then
    systemctl stop "$SERVICE_NAME" || true
    systemctl disable "$SERVICE_NAME" || true
else
    echo "服务 $SERVICE_NAME 不存在，跳过停止步骤。"
fi

echo "=== 删除旧的文件（如果存在） ==="
rm -rf "$INSTALL_DIR/lze-web" "$INSTALL_DIR/web"

echo "=== 创建安装目录 ==="
mkdir -p "$INSTALL_DIR"

echo "=== 复制新的文件到 $INSTALL_DIR ==="
cp -r ./lze-web ./web "$INSTALL_DIR/"

echo "=== 创建可执行文件符号链接 ==="
if [ -L "$BIN_LINK" ] || [ -f "$BIN_LINK" ]; then
    rm -f "$BIN_LINK"
fi
ln -s "$INSTALL_DIR/lze-web" "$BIN_LINK"

echo "=== 安装 systemd 服务 ==="
cp ./lze-web.service "$SYSTEMD_DIR/"

echo "=== 重新加载 systemd 并启动服务 ==="
systemctl daemon-reload
systemctl enable --now "$SERVICE_NAME"

echo "✅ 部署完成！"

