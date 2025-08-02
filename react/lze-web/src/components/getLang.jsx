export async function GetLangList(){
    let lang= GetLangType()
    const response =  await  fetch(window.location.origin+"/server/lang",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({lang:lang.type})
    })
     lang.list = await response.json();
     localStorage.setItem('langList',JSON.stringify(lang.list))
    return lang;
}
export function GetLangType(){
    let type
   const langList=['en','zh']
   let sysLang=(navigator.language || navigator.userLanguage).split('-')[0];
   if(!langList.includes(sysLang))
       sysLang='en'
let lang=localStorage.getItem('lang')
    if(lang==null||lang=="system"){
        lang="system"
        type=sysLang
    }
    else{
        type=lang
    }
    return {userSelect:lang,type:type,list:[]}
}