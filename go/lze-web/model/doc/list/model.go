package list

type Rec struct {
	File string `json:"file"`
}
type SendDir struct {
	Meta          [2]string   `json:"meta"`
	FileList      [][2]string `json:"filelist"`
	CurrentFolder string      `json:"currentFolder"`
	ParentFolder  string      `json:"parentFolder"`
}
type SendFile struct {
	FileLink string `json:"filelink"`
	View     bool   `json:"view"`
}
