package loginModel

type UserMes struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}
type Send struct {
	Token string `json:"token"`
}
type Rec struct {
	UserMes string `json:"userMes"`
}
