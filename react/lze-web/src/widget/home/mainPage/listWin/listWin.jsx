import { useEffect, useState } from "react"
import { WinBg } from "../../../public"
import { useGlobal } from "../../global"
import { list } from "../../../bok/global"
export default function Listwin(){
    const listWin=useGlobal(state=>state.listWin)
    return(
        <WinBg showBg={listWin.status}>
            <div id="close-back"
            onClick={()=>{
                useGlobal.setState({
                    listWin:{
                        type:"",
                        name:"",
                        status:false,
                    }
                })
            }}
            ></div>
            <div className="list-win" id={listWin.type+"-list"}>
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
      :<span>不支持类型</span>
    )
  ):<div className="loading"></div>
  }
  
  </>)
}

function ListPic(name){

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
function ListBok(name){
  const [loaded,setLoaded]=useState(false)
  const [text,setText]=useState("")
  useEffect(() => {
    GetData(window.location.origin+"/server/not/get_url",
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
function GetData(url,body,setData,setLoaded,json){
  console.log(JSON.stringify(body));
  
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