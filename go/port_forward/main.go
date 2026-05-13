package main

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"io"
	"log"
	"math/big"
	"net"
	"os"
	"time"
)

const (
	sslDir   = "/opt/lze-web/ssl"
	certPath = sslDir + "/cert.pem"
	keyPath  = sslDir + "/key.pem"
)

func ensureCert() error {
	if err := os.MkdirAll(sslDir, 0755); err != nil {
		return err
	}

	if _, err := os.Stat(certPath); err == nil {
		return nil
	}

	log.Println("生成自签名证书...")

	priv, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return err
	}

	template := x509.Certificate{
		SerialNumber: big.NewInt(time.Now().UnixNano()),
		Subject: pkix.Name{
			Organization: []string{"lze-web"},
		},
		NotBefore: time.Now(),
		NotAfter:  time.Now().Add(365 * 24 * time.Hour),

		KeyUsage:              x509.KeyUsageDigitalSignature | x509.KeyUsageKeyEncipherment,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		BasicConstraintsValid: true,
	}

	template.IPAddresses = append(template.IPAddresses, net.ParseIP("127.0.0.1"))

	derBytes, err := x509.CreateCertificate(rand.Reader, &template, &template, &priv.PublicKey, priv)
	if err != nil {
		return err
	}

	certOut, err := os.Create(certPath)
	if err != nil {
		return err
	}
	defer certOut.Close()
	pem.Encode(certOut, &pem.Block{Type: "CERTIFICATE", Bytes: derBytes})

	keyOut, err := os.Create(keyPath)
	if err != nil {
		return err
	}
	defer keyOut.Close()
	pem.Encode(keyOut, &pem.Block{Type: "RSA PRIVATE KEY", Bytes: x509.MarshalPKCS1PrivateKey(priv)})

	return nil
}

func handleConnection(src net.Conn) {
	defer src.Close()

	dst, err := net.Dial("tcp", "127.0.0.1:8888")
	if err != nil {
		log.Println("连接8888失败:", err)
		return
	}
	defer dst.Close()

	src.SetDeadline(time.Now().Add(5 * time.Minute))
	dst.SetDeadline(time.Now().Add(5 * time.Minute))

	go func() {
		io.Copy(dst, src)
	}()

	io.Copy(src, dst)
}

func startHTTP() {
	ln, err := net.Listen("tcp", ":80")
	if err != nil {
		log.Fatal("80监听失败:", err)
	}

	log.Println("HTTP转发启动：80 → 8888")

	for {
		conn, err := ln.Accept()
		if err != nil {
			log.Println(err)
			continue
		}
		go handleConnection(conn)
	}
}

func startHTTPS() {
	cert, err := tls.LoadX509KeyPair(certPath, keyPath)
	if err != nil {
		log.Fatal("加载证书失败:", err)
	}

	config := &tls.Config{
		Certificates: []tls.Certificate{cert},
	}

	ln, err := tls.Listen("tcp", ":443", config)
	if err != nil {
		log.Fatal("443监听失败:", err)
	}

	log.Println("HTTPS转发启动：443 → 8888")

	for {
		conn, err := ln.Accept()
		if err != nil {
			log.Println(err)
			continue
		}
		go handleConnection(conn)
	}
}

func main() {
	if err := ensureCert(); err != nil {
		log.Fatal("证书初始化失败:", err)
	}

	go startHTTP()
	go startHTTPS()

	select {}
}
