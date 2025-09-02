import { GetText, useGlobal } from "../global"

export default function Cmd(){
    const showCmd=useGlobal(state=>state.showCmd)
    return(
        <button className="btn side-btn" id="cmd-btn" 
        onClick={()=>{
            useGlobal.setState({showCmd:true})
        }}
        ></button>
    )
}