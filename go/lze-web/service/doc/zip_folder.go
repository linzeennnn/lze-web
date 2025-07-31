package doc

import (
	"archive/zip"
	"io"
	zipfolder "lze-web/model/doc/zip_folder"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func ZipFolder(c *gin.Context) {
	var rec zipfolder.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.String(400, err.Error())
		return
	}
	user, token := global.GetAuthMes(c)
	if global.CheckPermit(user, token, "doc", "downdir") {
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
	zipfile, err := os.Create(zip_file_name)
	if err != nil {
		return
	}
	defer zipfile.Close()
	archive := zip.NewWriter(zipfile)
	defer archive.Close()
	filepath.Walk(src_dir, func(path string, info os.FileInfo, _ error) error {
		if path == src_dir {
			return nil
		}
		header, _ := zip.FileInfoHeader(info)
		relPath, err := filepath.Rel(src_dir, path)
		if err != nil {
			return err
		}
		header.Name = filepath.ToSlash(relPath)

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
