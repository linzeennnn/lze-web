import { useEffect, useState } from "react"
import { WinBg } from "../../../../components/winBg"
import { GetText, useGlobal } from "../../global"
export default function Listwin(){
    const listWin=useGlobal(state=>state.listWin)
    const theme=useGlobal(state=>state.theme)
    return(
        <WinBg showBg={listWin.status}>
            <div id="close-back"
            onClick={()=>{
                useGlobal.setState({
                    listWin:{
                        type:"",
                        name:"",
                        status:false,
                        color:""
                    }
                })
            }}
            ></div>
            <div className="list-win" 
            color={theme.color[listWin.type]}
            mode={theme.mode}
            id={listWin.type+"-list"}>
            {creatList(listWin.type,listWin.name)}
            </div>
        </WinBg>
    )
}
function creatList(type, name) {
  switch(type) {
    case "doc":
      return <ListDoc name={name} />;
    case "pic":
      return <ListPic name={name} />;
    case "not":
      return <ListNot name={name} />;
    case "bok":
      return <ListBok name={name} />;
    default:
      return null;
  }
}
function ListDoc({ name }) {
  const [loaded,setLoaded]=useState(false)
  const [fileMes,setFileMes]=useState(null)
  useEffect(() => {
    GetData(window.location.origin+"/server/doc/list",
      {file:name},
      setFileMes,
      setLoaded,
      true
    )
  }, []);
  return (<>
  {
    loaded?(
    fileMes.type=="dir"?
    (fileMes.filelist.map((file,index)=>{
      return <div key={index+file[0]} className="dir-view" title={file[0]}>
          <div className={((file[1]=="dir"||file[1]=="dir_link")?
            "dir-view-dir":"dir-view-file")}></div>
          <span>{file[0]}</span>
        </div>
    })):
    (fileMes.view?<iframe className="file-view" src={window.location.origin+"/"+fileMes.url}></iframe>
      :<span>{GetText("not_support_type")}</span>
    )
  ):<div className="loading"></div>
  }
  
  </>)
}

function ListPic({name}){
  const url =window.location.origin+"/file/Pictures/"+name.name;
  if(name.media=="vid")
    return <video src={url} controls="controls" className="list-media"/>
  if(name.media="img")
    return(<img src={url} alt={name.name} className="list-media"/>)
}
function ListNot({name}){
  const [loaded,setLoaded]=useState(false)
  const [text,setText]=useState("")
  useEffect(() => {
    GetData(window.location.origin+"/server/not/get_text",
      {name},
      setText,
      setLoaded ,
      false
    )
  }, []);
return(
  loaded?
  <code>{text}</code>:
  <div className="loading"></div>
)
}
function ListBok({name}){
  const [loaded,setLoaded]=useState(false)
  const [text,setText]=useState("")
  useEffect(() => {
    GetData(window.location.origin+"/server/bok/get_url",
      {name},
      setText,
      setLoaded ,
      false
    )
  }, []);
return(
  loaded?
  ( window.location.href=text ):
  <div className="loading"></div>
)
}
function GetData(url,body,setData,setLoaded,json){
  fetch(url,{
    method:"POST",
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(body)
  })
  .then(res=>json? res.json(): res.text())
  .then(data=>{
    setData(data)
    setLoaded(true)
  })
  
}