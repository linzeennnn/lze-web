import { useState } from 'react'
import TopBar from '../../../components/topBar'
import {useGlobal,list,loadPage, GetText} from '../global'
import { notify } from '../../../components/notify'
export default function BokTopBar(){
    const protocolList=[
        {type: 'none', showName: GetText("no_protocol")},
        {type: 'http', showName: 'http://'},
        {type: 'https', showName: 'https://'},
        {type: 'file', showName: 'file://'}
    ]
    const KeyDown = (e)=>{
        if (e.key === 'Enter'){
            addBok(name,url)
        }
    }
    const [index, setIndex] = useState(0)
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    return(
        <TopBar>
            <div id='title-box'>
                <input placeholder={GetText("bok_name")} 
                onKeyDown={KeyDown}
                id='tit-input' type='text'
                value={name} onChange={(e) => setName(e.target.value)}/>
                <button id='save-add' title={GetText("save")} className='btn'
                onClick={()=>addBok(name,url)}
                ></button>
            </div>
            <div id='link-box'>
                <button
                    id='switch-protocol'
                    title={GetText("switch_protocol")}
                    className='btn'
                    onClick={() => {
                        setIndex((prev) => (prev + 1) % protocolList.length)
                    }}
                ></button>
                <span id='show-protocol'>{protocolList[index].showName}</span>
                <input placeholder={GetText("bok_url")} id='link-input'
                onKeyDown={KeyDown}
                type='text'
                value={url} onChange={(e) => setUrl(e.target.value)}
                />
            </div>
        </TopBar>
    )
}
function addBok(name,text){
    if(name=="")
        name="new_bookmark"
    if (
  !text.startsWith('http://') &&
  !text.startsWith('https://') &
  !text.startsWith('file://')
) {
    text='https://'+text
    if(!isUrl(text)){
        notify(GetText("bok_url")+" "+GetText("error")+" "+text)
        return
    }
}
    loadPage(true)
    const user=useGlobal.getState().userName
    const token=useGlobal.getState().token
    const url =useGlobal.getState().bokUrl+"add"
    const data={name,text}
    fetch(url,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'authorization':"Bearer " +token,
            'x-user':user
        },
        body:JSON.stringify(data)   })
        .then((res) => {
    if(!res.ok){
        if(res.status===401){
            notify(GetText("no_per"))
        }
        else{
            notify(GetText("error")+":"+res.status)
        }
        loadPage(false)
        return
    }
    notify(GetText("op_com"))
    list()
})
}
function isUrl(str){
  try {
     const url = new URL(str);
    return url.hostname.includes('.');
  } catch (e) {
    return false;
  }
}