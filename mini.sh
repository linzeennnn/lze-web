#!/bin/bash

SRC_DIR="web"
DEST_DIR="web_mini"

# 创建目标目录
mkdir -p "$DEST_DIR"

# 遍历 web 目录下所有文件
find "$SRC_DIR" -type f | while read -r file; do
    # 获取相对路径
    rel_path="${file#$SRC_DIR/}"
    dest_path="$DEST_DIR/$rel_path"
    
    # 创建目标目录
    mkdir -p "$(dirname "$dest_path")"

    # 判断文件类型并处理
    case "$file" in
        *.html|*.css|*.js)
            # 压缩并保存
            minify "$file" > "$dest_path"
            ;;
        *)
            # 原样复制
            cp "$file" "$dest_path"
            ;;
    esac
done
