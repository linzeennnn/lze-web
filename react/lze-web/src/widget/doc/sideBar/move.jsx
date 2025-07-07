export default function Move({setPaste}){
    return(
        <button id="move" className="btn side-btn"
        title="剪切" onClick={()=>{
            setPaste({status:true,type:"move"})
        }}>
        </button>
    )
}