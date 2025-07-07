export default function Copy({setPaste}){
    return(
        <button id="copy" className="btn side-btn"
        title="复制" onClick={()=>{
            setPaste({status:true,type:"copy"})
        }}
        ></button>
    )
}