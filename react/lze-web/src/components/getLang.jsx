export  function GetLangList(setGlobal,lang){
    fetch(window.location.origin+"/server/lang",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(lang)
    })
    .then(res=>res.json())
    .then(data=>{
        setGlobal({
          langList:data,
        })
    })
}
export function GetLangType(){

}