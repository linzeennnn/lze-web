export function InitPageSession() {
    const exist = sessionStorage.getItem("pageSession");
    if (!exist) {
    const pageSession = {
        doc: {
            list: {
                path: ""
            },
        },
        pic: {
            list:{
                path: ""
            },
            inner:{
                enable:false,
                source:"",  
                media:"",
                url:"",
                name:""
            }
        },
        tra: {},
        mon: {},
        not: {
            list: {
                path: ""
            },
            inner:{
                enable:false,
                source:"",
                path:"",
                name:""
            }
        },
        bok: {},
        home: {}
    };
        sessionStorage.setItem("pageSession", JSON.stringify(pageSession));
    }
}
export function GetPageSession() {
    return JSON.parse(sessionStorage.getItem("pageSession"));
}
export function SetPageSession(obj){
    sessionStorage.setItem("pageSession", JSON.stringify(obj));
}