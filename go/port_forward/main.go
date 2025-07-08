package main

import (
	"io"
	"log"
	"net"
)

func handleConnection(src net.Conn) {
	dst, err := net.Dial("tcp", "127.0.0.1:8888") // 转发目标是本地 8080
	if err != nil {
		log.Println("连接本地8888失败:", err)
		src.Close()
		return
	}

	// 双向拷贝
	go io.Copy(dst, src)
	go io.Copy(src, dst)
}

func main() {
	ln, err := net.Listen("tcp", ":80") // 监听本地 80 端口
	if err != nil {
		log.Fatal("监听 80 失败（可能权限不足）:", err)
	}
	log.Println("端口转发器启动：80 → 8080")

	for {
		conn, err := ln.Accept()
		if err != nil {
			log.Println("接受连接失败:", err)
			continue
		}
		go handleConnection(conn)
	}
}
