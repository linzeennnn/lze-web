export function Page(type){
window.location.href=type;
}
export function PageUrl(url){
    return window.location.origin+"/"+url
}