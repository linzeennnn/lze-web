package loginModel

type Rec struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}
type Send struct {
	Token string `json:"token"`
}
