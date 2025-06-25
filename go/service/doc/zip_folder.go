package doc

import (
	"archive/zip"
	"io"
	zipfolder "lze-web/model/doc/zip_folder"
	"lze-web/pkg/global"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

func ZipFolder(c *gin.Context) {
	var rec zipfolder.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.String(400, err.Error())
		return
	}
	if global.CheckPermit(rec.User, rec.Token, "doc", "downdir") {
		FolderPath := filepath.FromSlash(rec.FolderPath)
		source := filepath.Join(global.DocPath, FolderPath)
		zipName := filepath.Base(FolderPath) + ".zip"
		downLoadToken := global.GenToken()
		tempPath := filepath.Join(global.TempPath, downLoadToken)
		os.Mkdir(tempPath, 0755)
		compress(source, filepath.Join(tempPath, zipName))
		c.String(200, downLoadToken)
	} else {
		c.Status(401)
	}
}
func compress(src_dir string, zip_file_name string) {
	os.RemoveAll(zip_file_name)
	zipfile, _ := os.Create(zip_file_name)
	defer zipfile.Close()
	archive := zip.NewWriter(zipfile)
	defer archive.Close()
	filepath.Walk(src_dir, func(path string, info os.FileInfo, _ error) error {
		if path == src_dir {
			return nil
		}
		header, _ := zip.FileInfoHeader(info)
		header.Name = strings.TrimPrefix(path, src_dir+`/`)
		if info.IsDir() {
			header.Name += `/`
		} else {
			header.Method = zip.Deflate
		}
		writer, _ := archive.CreateHeader(header)
		if !info.IsDir() {
			file, _ := os.Open(path)
			defer file.Close()
			io.Copy(writer, file)
		}
		return nil
	})
}
