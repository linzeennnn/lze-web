package newfolder

type Rec struct {
	FolderName string `json:"folderName"`
	NowPath    string `json:"nowpath"`
}
type Send struct {
	FileItem [2]string `json:"fileItem"`
}
