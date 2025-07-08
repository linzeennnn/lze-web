package fileSystem

type Files struct {
	Name     string `json:"name"`
	FileType string `json:"type"`
	ModTime  int64  `json:"time"`
}
