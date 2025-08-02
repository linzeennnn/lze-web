#!/bin/bash

set -e  # 遇到错误直接退出
set -u  # 使用未定义变量时报错

# 1. 删除 /opt/lze-web 下除 file 和 config 以外的内容
if [ -d "/opt/lze-web" ]; then
    echo "清理 /opt/lze-web 除 file 和 config 以外的内容..."
    shopt -s dotglob  # 允许匹配隐藏文件
    for item in /opt/lze-web/*; do
        base_item=$(basename "$item")
        if [[ "$base_item" != "file" && "$base_item" != "config" ]]; then
            sudo rm -rf "$item"
        fi
    done
    shopt -u dotglob
else
    echo "创建 /opt/lze-web ..."
    sudo mkdir -p /opt/lze-web
    sudo chown "$(whoami):$(whoami)" /opt/lze-web
fi

# 2. 在 ~/Documents 下创建 lze-web 目录
mkdir -p ~/Documents/lze-web

# 3. 软链接 ~/Documents 和 ~/Pictures 到 ~/Documents/lze-web 下
for dir in Documents Pictures; do
    target="$HOME/Documents/lze-web/$dir"
    if [ ! -L "$target" ]; then
        ln -s "$HOME/$dir" "$target"
    fi
done

# 4. 在 ~/Documents/lze-web 目录下创建 Bookmark、Note、temp、trash 目录
mkdir -p ~/Documents/lze-web/{Bookmark,Note,temp,trash}

# 检查是否存在 /opt/lze-web/file 和 /opt/lze-web/config
file_exists=false
config_exists=false
[ -d "/opt/lze-web/file" ] && file_exists=true
[ -d "/opt/lze-web/config" ] && config_exists=true

# 5. 如果 file 不存在，创建软链接
if [ "$file_exists" = false ]; then
    mkdir -p /opt/lze-web/file
    ln -s ~/Documents/lze-web /opt/lze-web/file
fi

# 6. 复制 ./lze-web 到 /opt/lze-web 并添加执行权限
cp ./lze-web /opt/lze-web/
chmod +x /opt/lze-web/lze-web

# 7. 如果 config 不存在，创建并复制配置
if [ "$config_exists" = false ]; then
    mkdir -p /opt/lze-web/config
    cp ./work_config.json /opt/lze-web/config/
fi

# 8. 复制 ./web 到 /opt/lze-web
cp -r ./web /opt/lze-web/

# 9. 创建全局命令链接
sudo ln -sf /opt/lze-web/lze-web /usr/local/bin/lze-web

# 10. 复制 lze-web.service 到用户 systemd 目录
mkdir -p ~/.config/systemd/user/
cp ./lze-web.service ~/.config/systemd/user/

# 11. 复制 lze-port 到 /usr/bin 并添加执行权限
sudo cp ./lze-port /usr/bin/
sudo chmod +x /usr/bin/lze-port

# 12. 复制 lze-port.service 到系统 systemd 目录
sudo cp ./lze-port.service /etc/systemd/system/

# 13. 启用并重启两个服务
systemctl --user enable lze-web.service
systemctl --user restart lze-web.service
systemctl --user status lze-web.service

sudo systemctl enable lze-port.service
sudo systemctl restart lze-port.service
sudo systemctl status lze-port.service

