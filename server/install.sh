#!/bin/bash

set -e  # 遇到错误直接退出
set -u  # 使用未定义变量时报错

# 1. 删除 /opt/lze-web 目录（如果存在）
if [ -d "/opt/lze-web" ]; then
    echo "正在删除 /opt/lze-web ..."
    sudo rm -rf /opt/lze-web
fi

# 2. 创建 /opt/lze-web 并修改所有者为当前用户
echo "正在创建 /opt/lze-web ..."
sudo mkdir -p /opt/lze-web
sudo chown "$(whoami):$(whoami)" /opt/lze-web


# 4. 在 ~/Documents 下创建 lze-web 目录
mkdir -p ~/Documents/lze-web

# 5. 软链接 ~/Documents 和 ~/Pictures 到 ~/Documents/lze-web 下
for dir in Documents Pictures; do
    target="$HOME/Documents/lze-web/$dir"
    if [ ! -L "$target" ]; then
        ln -s "$HOME/$dir" "$target"
    fi
done

# 6. 在 ~/Documents/lze-web 目录下创建 Bookmark、Note、temp、trash 目录
mkdir -p ~/Documents/lze-web/{Bookmark,Note,temp,trash}

# 7. 软链接 ~/Documents/lze-web 到 /opt/lze-web/file
if [ ! -L "/opt/lze-web/file/lze-web" ]; then
    ln -s ~/Documents/lze-web /opt/lze-web/file
fi

# 8. 复制 ./lze-web 到 /opt/lze-web 并添加执行权限
cp ./lze-web /opt/lze-web/
chmod +x /opt/lze-web/lze-web

# 9. 创建 /opt/lze-web/config
mkdir -p /opt/lze-web/config

# 10. 复制 work_config.json 到 /opt/lze-web/config
cp ./work_config.json /opt/lze-web/config/

# 11. 复制 ./web 到 /opt/lze-web
cp -r ./web /opt/lze-web/

# 12. 创建全局命令链接
sudo ln -sf /opt/lze-web/lze-web /usr/local/bin/lze-web

# 13. 复制 lze-web.service 到用户 systemd 目录
mkdir -p ~/.config/systemd/user/
cp ./lze-web.service ~/.config/systemd/user/

# 14. 复制 lze-port 到 /usr/bin 并添加执行权限
sudo cp ./lze-port /usr/bin/
sudo chmod +x /usr/bin/lze-port

# 15. 复制 lze-port.service 到系统 systemd 目录
sudo cp ./lze-port.service /etc/systemd/system/

# 16. 启用并重启两个服务
systemctl --user enable lze-web.service
systemctl --user restart lze-web.service
systemctl --user status lze-web.service

sudo systemctl enable lze-port.service
sudo systemctl restart lze-port.service
sudo systemctl status lze-port.service

