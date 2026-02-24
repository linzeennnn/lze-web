import { useState } from 'react'
import TopBar from '../../../components/topBar'
import {addBok} from '../global'
import { GetText } from '../../../utils/common'
import { Icon } from '../../../utils/icon'
export default function BokTopBar(){
    const protocolList=[
        {type: 'none', showName: GetText("no_protocol")},
        {type: 'http', showName: 'http://'},
        {type: 'https', showName: 'https://'},
        {type: 'file', showName: 'file://'}
    ]
    const KeyDown = (e)=>{
        if (e.key === 'Enter'){
            addBok(name,checkProtocol(url))
        }
    }
    const checkProtocol=(text)=>{
        if (haveProtocol(text)){
            return text
        }
        else{
            return index==0?"https://"+text:protocolList[index].showName+text
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
                onClick={()=>addBok(name,checkProtocol(url))}
                >{Icon("save")}</button>
            </div>
            <div id='link-box'>
                <button
                    id='switch-protocol'
                    title={GetText("switch_protocol")}
                    className='btn'
                    onClick={() => {
                        setIndex((prev) => (prev + 1) % protocolList.length)
                    }}
                >{Icon("switch")}</button>
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

function haveProtocol(url){
if (
  url.startsWith('http://') ||
  url.startsWith('https://') ||
  url.startsWith('file://')
) {
    return true
}
return false
}