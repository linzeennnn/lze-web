package authstatus

type Rec struct {
	Name  string `json:"name"`
	Token string `json:"token"`
}
type Send struct {
	Token string `json:"token"`
}
