import { useGlobal } from "../global"
export default function Add(){
    const edit=useGlobal((state)=>state.edit)
    return(
        <button className="btn side-btn" 
        id="add-btn"
        title="添加新便签"
        onClick={()=>{
            useGlobal.setState({
                edit:{
                    type:"add",
                    mode:true
                }
            })
        }}
        ></button>
    )
}