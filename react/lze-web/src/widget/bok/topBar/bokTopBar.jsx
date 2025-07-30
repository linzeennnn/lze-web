import { useState } from 'react'
import TopBar from '../../../components/topBar'
import {useGlobal,list,loadPage} from '../global'
import { notify } from '../../../components/notify'
export default function BokTopBar(){
    const protocolList=[
        {type: 'none', showName: '无协议'},
        {type: 'http', showName: 'http://'},
        {type: 'https', showName: 'https://'},
        {type: 'file', showName: 'file://'}
    ]
    
    const [index, setIndex] = useState(0)
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    return(
        <TopBar>
            <div id='title-box'>
                <input placeholder='书签名' id='tit-input' type='text'
                value={name} onChange={(e) => setName(e.target.value)}/>
                <button id='save-add' title='保存' className='btn'
                onClick={()=>addBok(name,url)}
                ></button>
            </div>
            <div id='link-box'>
                <button
                    id='switch-protocol'
                    title='切换协议'
                    className='btn'
                    onClick={() => {
                        setIndex((prev) => (prev + 1) % protocolList.length)
                    }}
                ></button>
                <span id='show-protocol'>{protocolList[index].showName}</span>
                <input placeholder='网址链接' id='link-input' type='text'
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
        notify("网址不正确"+text)
        return
    }
}
    loadPage(true)
    const user=useGlobal.getState().userName
    const token=useGlobal.getState().token
    const url =useGlobal.getState().bokUrl+"add"
    const data={
        name:name,
        text:text,
        user:user,
        token:token
    }
    fetch(url,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)   })
        .then((res) => {
    if(!res.ok){
        if(res.status===401){
            notify("无权限")
        }
        else{
            notify("添加失败"+res.status+"错误")
        }
        loadPage(false)
        return
    }
    notify("添加成功")
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