package main

import (
	"io"
	"log"
	"net"
	"time"
)

func handleConnection(src net.Conn) {
	defer src.Close()

	dst, err := net.Dial("tcp", "127.0.0.1:8888")
	if err != nil {
		log.Println("连接本地8888失败:", err)
		return
	}
	defer dst.Close()

	// 设置超时，防止空闲连接挂死
	deadline := 5 * time.Minute
	src.SetDeadline(time.Now().Add(deadline))
	dst.SetDeadline(time.Now().Add(deadline))

	// 双向拷贝并在结束后关闭写入
	go func() {
		defer dst.(*net.TCPConn).CloseWrite()
		io.Copy(dst, src)
	}()
	io.Copy(src, dst)
	src.(*net.TCPConn).CloseWrite()
}

func main() {
	ln, err := net.Listen("tcp", ":80")
	if err != nil {
		log.Fatal("监听 80 失败:", err)
	}
	log.Println("端口转发器启动：80 → 8888")

	for {
		conn, err := ln.Accept()
		if err != nil {
			log.Println("接受连接失败:", err)
			continue
		}
		go handleConnection(conn)
	}
}
