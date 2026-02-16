package rename

type Rec struct {
	OldPath string `json:"oldpath"`
	NewPath string `json:"newpath"`
}
type Send struct {
	FileItem [2]string `json:"fileItem"`
}
