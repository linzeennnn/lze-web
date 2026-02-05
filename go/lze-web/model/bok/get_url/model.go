package geturl

type Rec struct {
	Name string `json:"name"`
}
type Send struct {
	Url      string `json:"url"`
	Protocol string `json:"protocol"`
	Path     string `json:"path"`
}
